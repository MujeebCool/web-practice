export const PROGRAMMES = [
  {
    id: 1,
    title: "Ilm with Ilm Academy",
    slug: "ilm",
    tagline: "Islamic sciences from the ground up",
    description:
      "A structured journey through Aqeedah, Fiqh, Hadith, and Tafseer — taught with clarity and depth.",
    icon: "BookOpen",
    lessonCount: 320,
    colour: "#005461",
  },
  {
    id: 2,
    title: "Arabic with Ilm Academy",
    slug: "arabic",
    tagline: "Master the language of the Quran",
    description:
      "From Arabic alphabet to advanced grammar — a step-by-step curriculum for all levels.",
    icon: "Languages",
    lessonCount: 180,
    colour: "#01879A",
  },
  {
    id: 3,
    title: "Grow with Ilm Academy",
    slug: "grow",
    tagline: "Character, productivity and purpose",
    description:
      "Islamic self-development rooted in the Quran and Sunnah — practical tools for everyday Muslim life.",
    icon: "Sprout",
    lessonCount: 95,
    colour: "#00B7B5",
  },
  {
    id: 4,
    title: "Hifdh with Ilm Academy",
    slug: "hifdh",
    tagline: "A guided path to memorising the Quran",
    description:
      "Structured memorisation programme with revision techniques rooted in traditional methodology.",
    icon: "Star",
    lessonCount: 210,
    colour: "#005461",
  },
];

export const TESTIMONIALS = [
  {
    name: "Yusuf A.",
    country: "United Kingdom",
    flag: "🇬🇧",
    stars: 5,
    quote:
      "The most structured Islamic learning I have found online. It feels like sitting in a proper class.",
  },
  {
    name: "Fatima R.",
    country: "United States",
    flag: "🇺🇸",
    stars: 5,
    quote:
      "Arabic with Ilm Academy changed everything for me. I can now read the Quran with understanding.",
  },
  {
    name: "Ibrahim K.",
    country: "Canada",
    flag: "🇨🇦",
    stars: 5,
    quote:
      "Finally a platform that takes Islamic education seriously. The curriculum is outstanding.",
  },
  {
    name: "Aisha M.",
    country: "Australia",
    flag: "🇦🇺",
    stars: 5,
    quote:
      "I have tried many platforms. Ilm Academy is the only one I kept coming back to. Alhamdulillah.",
  },
  {
    name: "Omar S.",
    country: "Germany",
    flag: "🇩🇪",
    stars: 5,
    quote:
      "The Grow programme helped me build consistency in my worship. Highly recommended.",
  },
  {
    name: "Khadijah T.",
    country: "South Africa",
    flag: "🇿🇦",
    stars: 5,
    quote:
      "Beautiful platform, beautiful knowledge. May Allah bless everyone behind this project.",
  },
];

export const PRICING = {
  monthly: { price: 25, label: "per month" },
  annual: {
    price: 12,
    label: "per month, billed £144/year",
    saving: "Save 52%",
  },
  features: [
    "Full access to all Ilm Academy programmes",
    "1,000+ video lessons on demand",
    "New courses added regularly at no extra cost",
    "Downloadable PDF notes and resources",
    "Progress tracking across all programmes",
    "Monthly live Q&A with scholars",
    "Access to the Ilm Academy student community",
    "iOS and Android app access",
  ],
};

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Subscribe",
    description:
      "Choose a monthly or annual plan and get instant access to everything.",
  },
  {
    step: "02",
    title: "Choose Your Path",
    description:
      "Pick from Islamic sciences, Arabic, self-development, or Quran memorisation.",
  },
  {
    step: "03",
    title: "Learn at Your Pace",
    description:
      "Study whenever suits you. No fixed schedule, no pressure — just consistent progress.",
  },
];

export const FAQ_ITEMS = [
  {
    question: "What does the membership include?",
    answer:
      "Full access to all Ilm Academy programmes — Ilm, Arabic, Grow, and Hifdh — plus all future programmes in one subscription.",
  },
  {
    question: "Do I get access immediately after subscribing?",
    answer:
      "Yes. The moment you subscribe, you have immediate access to over 1,000 on-demand lessons.",
  },
  {
    question: "Is this suitable for beginners?",
    answer:
      "Absolutely. Programmes are structured for all levels, from complete beginners to serious students of knowledge.",
  },
  {
    question: "Can I study at my own pace?",
    answer:
      "Yes. All content is on-demand and self-paced. Learn whenever it suits your schedule.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Manage or cancel your subscription anytime from your account settings.",
  },
  {
    question: "Is family sharing allowed?",
    answer:
      "Family members in the same household may benefit from the content, as long as the account is not shared outside the home.",
  },
];

export const UPCOMING_EVENTS = [
  {
    title: "Monthly Open Q&A with Sheikh",
    date: "Saturday 5 July 2026",
    day: "05",
    month: "Jul",
    time: "7:00 PM BST",
    type: "Live Q&A",
  },
  {
    title: "Arabic Revision Session",
    date: "Sunday 13 July 2026",
    day: "13",
    month: "Jul",
    time: "6:00 PM BST",
    type: "Workshop",
  },
  {
    title: "Tafseer Series — Surah Al-Kahf",
    date: "Saturday 19 July 2026",
    day: "19",
    month: "Jul",
    time: "7:00 PM BST",
    type: "Lecture",
  },
  {
    title: "Grow Programme Live Check-in",
    date: "Saturday 26 July 2026",
    day: "26",
    month: "Jul",
    time: "8:00 PM BST",
    type: "Workshop",
  },
];

export const SPONSORSHIP_OPTIONS = [
  {
    title: "Sponsor a Student",
    description:
      "Gift a full subscription to a student who cannot afford access. Your sadaqah jariyah supports lifelong learning.",
    cta: "Sponsor Now",
    href: "/sponsorship",
    available: true,
  },
  {
    title: "Request Sponsorship (Hardship)",
    description:
      "If you are facing financial hardship and wish to seek knowledge, apply for a sponsored membership.",
    cta: "Apply Now",
    href: "/sponsorship",
    available: true,
  },
  {
    title: "Request Sponsorship (Reverts)",
    description:
      "Dedicated support for new Muslims beginning their journey. Coming soon.",
    cta: "Coming Soon",
    href: "#",
    available: false,
  },
  {
    title: "Request Sponsorship (Huffadh)",
    description:
      "Special access for students of memorisation who wish to deepen their understanding alongside hifdh.",
    cta: "Apply Now",
    href: "/sponsorship",
    available: true,
  },
];

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Programmes", href: "/programmes" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Community", href: "/community" },
];

export const STATS = [
  { value: "190+", label: "Countries" },
  { value: "1,000+", label: "Lessons" },
  { value: "4.9★", label: "Student Rating" },
];
