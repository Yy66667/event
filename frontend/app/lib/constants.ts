export const BRAND = {
  name: "SAMBARAM",
  tagline: "Heirloom Event Planning Studio",
  phone: "+919876543210",
  phoneRaw: "+919876543210",
  whatsapp: "+919876543210",
  email: "hello@sambaram.events",
  instagram: "sambaram.events",
  instagramUrl: "https://instagram.com/sambaram.events",
  cities: "Warangal · Hyderabad · Bengaluru",
  address: "Warangal, Telangana, India",
};

export const NAV_LINKS = [
  { name: "Studio", href: "/#studio" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Planner", href: "/planner" },
  { name: "Testimonials", href: "/#testimonials" },
  { name: "Contact", href: "/contact" },
];

export const EVENT_CATEGORIES = [
  "Weddings",
  "Birthdays",
  "Engagements",
  "Corporate Events",
  "Housewarming",
  "Baby Shower",
  "Private Parties",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL || process.env.REACT_APP_BACKEND_URL || "";
