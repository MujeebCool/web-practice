-- ═══════════════════════════════════════════════════════════════════════════
-- ILM ACADEMY  ·  Migration 0001 – Initial Schema
-- Run in: Supabase Dashboard → SQL Editor  (or: supabase db push)
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Profiles ───────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id              uuid references auth.users(id) on delete cascade primary key,
  full_name       text,
  email           text,
  avatar_url      text,
  plan            text        default 'Annual Plan',
  member_since    date        default current_date,
  renews_at       date,
  cancel_at_period_end boolean default false,
  created_at      timestamptz default now()
);

-- ─── Programmes (static catalogue, admin-managed) ───────────────────────────
create table if not exists public.programmes (
  id              uuid        primary key default gen_random_uuid(),
  slug            text        unique not null,
  title           text        not null,
  description     text,
  icon            text,
  colour          text        default '#C9A84C',
  total_lessons   int         default 0,
  created_at      timestamptz default now()
);

-- ─── Lessons ────────────────────────────────────────────────────────────────
create table if not exists public.lessons (
  id              uuid        primary key default gen_random_uuid(),
  programme_id    uuid        references public.programmes(id) on delete cascade,
  title           text        not null,
  duration_seconds int,
  order_index     int,
  video_url       text,
  created_at      timestamptz default now()
);

-- ─── Per-user lesson progress ────────────────────────────────────────────────
create table if not exists public.user_progress (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        references auth.users(id) on delete cascade,
  lesson_id       uuid        references public.lessons(id) on delete cascade,
  completed       boolean     default false,
  watched_seconds int         default 0,
  last_watched_at timestamptz default now(),
  completed_at    timestamptz,
  unique(user_id, lesson_id)
);

-- ─── Quran bookmarks ────────────────────────────────────────────────────────
create table if not exists public.quran_bookmarks (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        references auth.users(id) on delete cascade,
  surah_number    int         not null,
  ayah_number     int         not null,
  note            text,
  created_at      timestamptz default now(),
  unique(user_id, surah_number, ayah_number)
);

-- ─── Quran last-read position (one row per user) ─────────────────────────────
create table if not exists public.quran_last_read (
  user_id         uuid        references auth.users(id) on delete cascade primary key,
  surah_number    int         not null,
  ayah_number     int         not null,
  updated_at      timestamptz default now()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════════════

alter table public.profiles          enable row level security;
alter table public.user_progress     enable row level security;
alter table public.quran_bookmarks   enable row level security;
alter table public.quran_last_read   enable row level security;
alter table public.programmes        enable row level security;
alter table public.lessons           enable row level security;

-- Profiles: users manage only their own row
drop policy if exists "Users manage own profile" on public.profiles;
create policy "Users manage own profile" on public.profiles
  for all using (auth.uid() = id);

-- User progress: users manage only their own rows
drop policy if exists "Users manage own progress" on public.user_progress;
create policy "Users manage own progress" on public.user_progress
  for all using (auth.uid() = user_id);

-- Quran bookmarks
drop policy if exists "Users manage own bookmarks" on public.quran_bookmarks;
create policy "Users manage own bookmarks" on public.quran_bookmarks
  for all using (auth.uid() = user_id);

-- Quran last-read
drop policy if exists "Users manage own last-read" on public.quran_last_read;
create policy "Users manage own last-read" on public.quran_last_read
  for all using (auth.uid() = user_id);

-- Programmes: public read-only catalogue
drop policy if exists "Anyone can read programmes" on public.programmes;
create policy "Anyone can read programmes" on public.programmes
  for select using (true);

-- Lessons: public read-only
drop policy if exists "Anyone can read lessons" on public.lessons;
create policy "Anyone can read lessons" on public.lessons
  for select using (true);

-- ═══════════════════════════════════════════════════════════════════════════
-- TRIGGER: auto-create profile on sign-up
-- ═══════════════════════════════════════════════════════════════════════════

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED: programmes catalogue (matches lib/mock-data.js MOCK_PROGRESS)
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.programmes (slug, title, description, icon, colour, total_lessons) values
  ('ilm',    'Ilm with Ilm Academy',    'A structured journey through core Islamic knowledge.', 'BookOpen', '#C9A84C', 320),
  ('arabic', 'Arabic with Ilm Academy', 'Master the Arabic language from foundations to fluency.', 'Languages', '#D4BA6A', 180),
  ('grow',   'Grow with Ilm Academy',   'Personal development rooted in Islamic values.', 'Sprout', '#C9A84C', 95),
  ('hifdh',  'Hifdh with Ilm Academy',  'A guided path to memorising the Quran.', 'Star', '#C9A84C', 210)
on conflict (slug) do nothing;

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED: sample lessons for each programme (6 per programme = 24 total)
-- These match the titles in MOCK_RECENT_LESSONS so the UI looks populated.
-- ═══════════════════════════════════════════════════════════════════════════

-- Ilm programme lessons
insert into public.lessons (programme_id, title, duration_seconds, order_index) 
select p.id, l.title, l.dur, l.ord
from public.programmes p
cross join (values
  ('Introduction to Islamic Knowledge', 900, 1),
  ('The Six Pillars of Iman', 1200, 2),
  ('The Pillars of Iman — Part 3', 1440, 3),
  ('Introduction to Usul al-Fiqh', 1920, 4),
  ('The Five Pillars of Islam', 1080, 5),
  ('Seerah: The Life of the Prophet ﷺ', 1560, 6)
) as l(title, dur, ord)
where p.slug = 'ilm'
on conflict do nothing;

-- Arabic programme lessons
insert into public.lessons (programme_id, title, duration_seconds, order_index)
select p.id, l.title, l.dur, l.ord
from public.programmes p
cross join (values
  ('The Arabic Alphabet', 720, 1),
  ('Nouns and Gender in Arabic', 900, 2),
  ('The Definite Article in Arabic', 720, 3),
  ('Introduction to Arabic Verb Roots', 1080, 4),
  ('Arabic Morphology: Verb Patterns', 1080, 5),
  ('Sentence Structure in Arabic', 960, 6)
) as l(title, dur, ord)
where p.slug = 'arabic'
on conflict do nothing;

-- Grow programme lessons
insert into public.lessons (programme_id, title, duration_seconds, order_index)
select p.id, l.title, l.dur, l.ord
from public.programmes p
cross join (values
  ('Introduction to Islamic Self-Development', 660, 1),
  ('Building a Morning Routine', 900, 2),
  ('The Power of Tawbah', 780, 3),
  ('Purification of the Heart — Session 1', 1020, 4),
  ('Purification of the Heart — Session 2', 1200, 5),
  ('Gratitude and Shukr in Daily Life', 840, 6)
) as l(title, dur, ord)
where p.slug = 'grow'
on conflict do nothing;

-- Hifdh programme lessons
insert into public.lessons (programme_id, title, duration_seconds, order_index)
select p.id, l.title, l.dur, l.ord
from public.programmes p
cross join (values
  ('Introduction to Hifdh', 600, 1),
  ('Surah Al-Fatihah — Memorisation', 1200, 2),
  ('Surah Al-Baqarah: Ayah 1–5', 1800, 3),
  ('Review and Revision Techniques', 900, 4),
  ('Surah Al-Baqarah: Ayah 6–10', 1800, 5),
  ('Makharij: Correct Pronunciation', 1080, 6)
) as l(title, dur, ord)
where p.slug = 'hifdh'
on conflict do nothing;
