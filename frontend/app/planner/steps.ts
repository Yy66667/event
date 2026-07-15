export type PlannerAnswers = {
  event_type?: string;
  event_date?: string;
  city?: string;
  venue_type?: string;
  indoor_outdoor?: string;
  guest_count?: string;
  budget?: string;
  theme?: string;
  decoration_style?: string;
  catering?: string;
  photography?: string;
  videography?: string;
  entertainment?: string;
  makeup?: string;
  accommodation?: string;
  transportation?: string;
  additional_services?: string[];
  special_requests?: string;
};

export type StepDef = {
  id: keyof PlannerAnswers;
  title: string;
  subtitle: string;
  eyebrow: string;
  type: "choice" | "date" | "text" | "number" | "textarea" | "multi";
  options?: string[];
  placeholder?: string;
  aiTopic?: "theme" | "budget" | "timeline" | "decor" | "services" | "summary";
  aiLabel?: string;
  optional?: boolean;
};

export const STEPS: StepDef[] = [
  {
    id: "event_type",
    eyebrow: "Occasion",
    title: "What are we celebrating?",
    subtitle: "Choose the type of event you're planning.",
    type: "choice",
    options: [
      "Wedding",
      "Birthday",
      "Engagement",
      "Corporate Event",
      "Housewarming",
      "Baby Shower",
      "Private Party",
    ],
  },
  {
    id: "event_date",
    eyebrow: "The Day",
    title: "When is the event?",
    subtitle: "An approximate date works too — we can refine later.",
    type: "date",
  },
  {
    id: "city",
    eyebrow: "Location",
    title: "Which city?",
    subtitle: "Or the region you're planning to host in.",
    type: "text",
    placeholder: "e.g. Warangal, Hyderabad, Bengaluru, Goa…",
  },
  {
    id: "venue_type",
    eyebrow: "Venue",
    title: "Venue preference?",
    subtitle: "The kind of place you have in mind.",
    type: "choice",
    options: [
      "Hotel / Banquet",
      "Farmhouse",
      "Palace / Heritage",
      "Beach / Destination",
      "Private Residence",
      "Convention Centre",
      "Undecided — we'll help",
    ],
  },
  {
    id: "indoor_outdoor",
    eyebrow: "Setting",
    title: "Indoor or outdoor?",
    subtitle: "This shapes lighting, décor and contingency planning.",
    type: "choice",
    options: ["Indoor", "Outdoor", "Both / Mixed"],
  },
  {
    id: "guest_count",
    eyebrow: "Headcount",
    title: "How many guests?",
    subtitle: "A rough number is perfectly fine.",
    type: "choice",
    options: [
      "Under 50",
      "50–150",
      "150–300",
      "300–500",
      "500–1000",
      "1000+",
    ],
  },
  {
    id: "budget",
    eyebrow: "Investment",
    title: "What's your budget?",
    subtitle: "We'll build the best possible experience within it.",
    type: "choice",
    options: [
      "Under ₹3 Lakhs",
      "₹3–8 Lakhs",
      "₹8–20 Lakhs",
      "₹20–50 Lakhs",
      "₹50 Lakhs – ₹1 Cr",
      "₹1 Cr+",
    ],
    aiTopic: "budget",
    aiLabel: "Ask AI for a realistic breakdown",
  },
  {
    id: "theme",
    eyebrow: "Aesthetic",
    title: "Any theme in mind?",
    subtitle: "A phrase, a mood, or a full description — anything works.",
    type: "text",
    placeholder: "e.g. Royal Kakatiya · Midnight Garden · Modern Minimalist",
    aiTopic: "theme",
    aiLabel: "Suggest themes for me",
  },
  {
    id: "decoration_style",
    eyebrow: "Décor",
    title: "Decoration style?",
    subtitle: "Pick the closest match — we'll layer detail later.",
    type: "choice",
    options: [
      "Traditional South-Indian",
      "Boho / Rustic",
      "Modern Minimal",
      "Regal / Palace",
      "Floral & Whimsical",
      "Cinematic Dark",
      "Open to suggestions",
    ],
    aiTopic: "decor",
    aiLabel: "Show me signature décor ideas",
  },
  {
    id: "catering",
    eyebrow: "Cuisine",
    title: "Catering preference?",
    subtitle: "We'll match you with vetted culinary partners.",
    type: "choice",
    options: [
      "Vegetarian",
      "Veg + Non-Veg",
      "South-Indian Speciality",
      "Multi-Cuisine",
      "Live Counters & Stations",
      "Open Bar / Cocktails",
    ],
  },
  {
    id: "photography",
    eyebrow: "Memory",
    title: "Photography level?",
    subtitle: "How you want the day captured.",
    type: "choice",
    options: [
      "Essential Coverage",
      "Premium Coverage",
      "Cinematic + Editorial",
      "Not required",
    ],
  },
  {
    id: "videography",
    eyebrow: "Film",
    title: "Videography level?",
    subtitle: "The kind of film you want to remember it by.",
    type: "choice",
    options: [
      "Highlight Reel",
      "Full Wedding Film",
      "Cinematic Documentary",
      "Drone & Aerials",
      "Not required",
    ],
  },
  {
    id: "entertainment",
    eyebrow: "Vibe",
    title: "Entertainment?",
    subtitle: "Live music, DJs, performances, or something bespoke.",
    type: "choice",
    options: [
      "DJ",
      "Live Band",
      "Classical / Cultural",
      "Celebrity Performance",
      "Custom Choreography",
      "Not required",
    ],
  },
  {
    id: "makeup",
    eyebrow: "Styling",
    title: "Makeup & styling?",
    subtitle: "For the bride, groom, family or none.",
    type: "choice",
    options: [
      "Bride only",
      "Bride + Family",
      "Full Bridal Party",
      "Groom + Family",
      "Not required",
    ],
    optional: true,
  },
  {
    id: "accommodation",
    eyebrow: "Stay",
    title: "Guest accommodation?",
    subtitle: "For out-of-town guests, if any.",
    type: "choice",
    options: [
      "Not required",
      "Small (under 20 rooms)",
      "Medium (20–75 rooms)",
      "Large (75+ rooms)",
    ],
    optional: true,
  },
  {
    id: "transportation",
    eyebrow: "Travel",
    title: "Transportation?",
    subtitle: "Airport pickups, guest transfers, vintage cars.",
    type: "choice",
    options: [
      "Not required",
      "Airport transfers",
      "Guest shuttles",
      "Vintage / Themed vehicles",
      "Full coordination",
    ],
    optional: true,
  },
  {
    id: "additional_services",
    eyebrow: "Extras",
    title: "Any additional services?",
    subtitle: "Pick anything you'd like us to arrange.",
    type: "multi",
    options: [
      "Priest / Purohit",
      "Mehendi Artist",
      "Choreographer",
      "Return Gifts",
      "Custom Stationery",
      "Fireworks",
      "Live Streaming",
      "Guest Concierge",
    ],
    optional: true,
    aiTopic: "services",
    aiLabel: "What should I invest in?",
  },
  {
    id: "special_requests",
    eyebrow: "Personal",
    title: "Anything else we should know?",
    subtitle: "Family traditions, dietary needs, dreams you can't yet describe.",
    type: "textarea",
    placeholder: "Share anything on your mind…",
    optional: true,
  },
];
