/**
 * Dashboard mock data — All mock constants for the dashboard pages
 */

export const MOCK_USER = {
  name: "Yusuf Ahmad",
  email: "test@test.com",
  plan: "Annual",
  memberSince: "12 June 2026",
  renewalDate: "12 June 2027",
  pricePerMonth: 12,
};

export const MOCK_PROGRESS = [
  {
    id: 1,
    programme: "Ilm with Ilm Academy",
    slug: "ilm",
    icon: "BookOpen",
    totalLessons: 320,
    completedLessons: 45,
    lastActivity: "22 June 2026",
    colour: "#C9A84C",
  },
  {
    id: 2,
    programme: "Arabic with Ilm Academy",
    slug: "arabic",
    icon: "Languages",
    totalLessons: 180,
    completedLessons: 28,
    lastActivity: "21 June 2026",
    colour: "#D4BA6A",
  },
  {
    id: 3,
    programme: "Grow with Ilm Academy",
    slug: "grow",
    icon: "Sprout",
    totalLessons: 95,
    completedLessons: 12,
    lastActivity: "19 June 2026",
    colour: "#C9A84C",
  },
];

export const MOCK_RECENT_LESSONS = [
  {
    id: 1,
    title: "The Pillars of Iman — Part 3",
    programme: "Ilm with Ilm Academy",
    slug: "ilm",
    duration: "24 min",
    watchedAt: "22 June 2026",
  },
  {
    id: 2,
    title: "Arabic Morphology: Verb Patterns",
    programme: "Arabic with Ilm Academy",
    slug: "arabic",
    duration: "18 min",
    watchedAt: "21 June 2026",
  },
  {
    id: 3,
    title: "Building a Morning Routine",
    programme: "Grow with Ilm Academy",
    slug: "grow",
    duration: "15 min",
    watchedAt: "19 June 2026",
  },
  {
    id: 4,
    title: "Introduction to Usul al-Fiqh",
    programme: "Ilm with Ilm Academy",
    slug: "ilm",
    duration: "32 min",
    watchedAt: "18 June 2026",
  },
  {
    id: 5,
    title: "The Definite Article in Arabic",
    programme: "Arabic with Ilm Academy",
    slug: "arabic",
    duration: "12 min",
    watchedAt: "17 June 2026",
  },
  {
    id: 6,
    title: "Purification of the Heart — Session 2",
    programme: "Grow with Ilm Academy",
    slug: "grow",
    duration: "20 min",
    watchedAt: "16 June 2026",
  },
];
