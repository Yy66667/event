"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  Loader2,
  MapPin,
  Plus,
  Search,
  X,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CapabilityKey =
  | "event_types"
  | "venue_expertise"
  | "guest_capacity"
  | "budget_ranges"
  | "core_services"
  | "entertainment"
  | "cuisine_support"
  | "travel_scope"
  | "photography_services"
  | "videography_services"
  | "specialty_shoots"
  | "deliverables"
  | "equipment"
  | "team_size";

type Values = {
  partner_type: string;
  business_name: string;
  owner_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  city: string;
  years_in_business: string;
  events_per_year: string;
  team_size: string;
  availability: string;
  premium_experience: string;
  max_guest_count: string;
  minimum_notice_days: string;
  service_cities: string[];
  portfolio_url: string;
  portfolio_highlights: string;
  client_references: string;
  business_description: string;
  differentiator: string;
  consent: boolean;
  capabilities: Partial<Record<CapabilityKey, string[]>>;
};

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const cities = [
  "Hyderabad", "Warangal", "Karimnagar", "Nizamabad", "Khammam", "Ramagundam",
  "Mahbubnagar", "Adilabad", "Vijayawada", "Visakhapatnam", "Tirupati", "Guntur",
  "Bengaluru", "Mysuru", "Chennai", "Coimbatore", "Mumbai", "Pune", "Delhi",
  "Gurugram", "Jaipur", "Kolkata", "Kochi", "Goa", "Ahmedabad", "Surat",
];

const sharedEvents = [
  "Wedding", "Engagement", "Birthday", "Corporate Event",
  "Housewarming", "Baby Shower", "Private Party",
];

const budgetRanges = [
  "Under ₹3 Lakhs", "₹3–8 Lakhs", "₹8–20 Lakhs",
  "₹20–50 Lakhs", "₹50 Lakhs–₹1 Crore", "₹1 Crore+",
];

const capabilities: Record<
  string,
  { title: string; fields: { key: CapabilityKey; label: string; options: string[] }[] }
> = {
  event_partner: {
    title: "Planning expertise",
    fields: [
      {
        key: "event_types",
        label: "Event types",
        options: [
          ...sharedEvents,
          "Reception", "Anniversary", "Haldi", "Mehendi", "Sangeet", "Naming Ceremony",
        ],
      },
      {
        key: "venue_expertise",
        label: "Venue expertise",
        options: [
          "Hotels & Banquets", "Farmhouses", "Heritage Venues", "Convention Centres",
          "Beach / Destination", "Private Residence", "Outdoor Venues",
        ],
      },
      {
        key: "guest_capacity",
        label: "Guest capacity",
        options: ["Under 50", "50–150", "150–300", "300–500", "500–1000", "1000+"],
      },
      {
        key: "budget_ranges",
        label: "What budget range do you usually manage?",
        options: budgetRanges,
      },
      {
        key: "core_services",
        label: "Core planning services",
        options: [
          "Complete Event Planning", "Partial Event Planning", "Wedding Planning",
          "Venue Booking", "Vendor Coordination", "Decoration", "Floral Design",
          "Stage Design", "Lighting", "Sound", "Catering", "Hospitality",
          "Guest Management", "Invitation Management", "RSVP Management", "Logistics",
          "Transportation", "Accommodation", "Artist Management", "DJ", "Live Music",
          "Celebrity Management", "Dance Choreography", "Entertainment",
          "Theme Planning", "Budget Planning", "Timeline Planning", "Security",
          "Photography Coordination", "Videography Coordination",
        ],
      },
      {
        key: "entertainment",
        label: "Entertainment",
        options: [
          "DJ", "Live Band", "Classical Performance",
          "Celebrity Performance", "Dance Choreography", "Anchor / MC",
        ],
      },
      {
        key: "cuisine_support",
        label: "Cuisine support",
        options: [
          "Vegetarian", "Veg + Non Veg", "South Indian", "North Indian",
          "Multi Cuisine", "Live Counters", "Cocktail Service",
        ],
      },
      {
        key: "travel_scope",
        label: "Travel scope",
        options: [
          "Local", "Within District", "Telangana",
          "South India", "Pan India", "Destination Weddings",
        ],
      },
    ],
  },
  photography_studio: {
    title: "Creative expertise",
    fields: [
      { key: "event_types", label: "Event coverage", options: sharedEvents },
      {
        key: "photography_services",
        label: "Photography services",
        options: [
          "Candid Photography", "Traditional Photography",
          "Portrait Photography", "Couple Shoot", "Family Shoot",
        ],
      },
      {
        key: "videography_services",
        label: "Videography services",
        options: [
          "Traditional Video", "Cinematic Film", "Documentary Film",
          "Wedding Trailer", "Highlight Film", "Full Event Film",
        ],
      },
      {
        key: "specialty_shoots",
        label: "Specialty shoots",
        options: [
          "Pre Wedding", "Post Wedding", "Save The Date", "Drone Shoot",
          "Maternity", "Baby Shoot", "Product Photography",
          "Fashion Photography", "Commercial Shoot", "Brand Film",
        ],
      },
      {
        key: "deliverables",
        label: "Deliverables",
        options: [
          "Edited Photos", "RAW Photos", "Wedding Album", "Premium Album",
          "Highlight Video", "Full Event Video", "Instagram Reels",
          "Short-form Videos", "Same Day Edit",
        ],
      },
      {
        key: "equipment",
        label: "Equipment",
        options: [
          "Drone", "Gimbal", "Cinema Camera",
          "4K Camera", "LED Lighting", "Multi Camera Setup",
        ],
      },
      {
        key: "team_size",
        label: "Team size",
        options: ["Solo Photographer", "2–4 Members", "5–8 Members", "8+ Members"],
      },
      { key: "budget_ranges", label: "Budget range", options: budgetRanges },
      {
        key: "travel_scope",
        label: "Travel scope",
        options: ["Local", "Telangana", "South India", "Pan India", "International"],
      },
    ],
  },
};

const blank: Values = {
  partner_type: "",
  business_name: "",
  owner_name: "",
  email: "",
  phone: "",
  whatsapp: "",
  instagram: "",
  city: "",
  years_in_business: "",
  events_per_year: "",
  team_size: "",
  availability: "",
  premium_experience: "",
  max_guest_count: "",
  minimum_notice_days: "",
  service_cities: [],
  portfolio_url: "",
  portfolio_highlights: "",
  client_references: "",
  business_description: "",
  differentiator: "",
  consent: false,
  capabilities: {},
};

const input =
  "mt-2 w-full rounded-xl border border-line-strong bg-white px-4 py-3 text-ink outline-none transition focus:border-burnt";

const insta =
  /^(?:[a-zA-Z0-9._]{1,30}|(?:https?:\/\/)?(?:www\.)?instagram\.com\/[a-zA-Z0-9._]{1,30}\/?(?:\?.*)?)$/;

const validPhone = (value: string) => /^\d{10}$/.test(value);

const businessDetailsSchema = z.object({
  partner_type: z.enum(["event_partner", "photography_studio"]),
  business_name: z.string().trim().min(2, "Enter your business name."),
  owner_name: z.string().trim().min(2, "Enter the owner's name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().regex(/^\d{10}$/, "Enter exactly 10 digits for an Indian phone number."),
  whatsapp: z.string().regex(/^\d{10}$/, "Enter exactly 10 digits for an Indian WhatsApp number."),
  instagram: z.string().trim().regex(insta, "Enter an Instagram username or profile URL."),
  city: z.string().min(1, "Select your primary city."),
  years_in_business: z.string().min(1, "Enter years in business."),
  events_per_year: z.string().min(1, "Enter events per year."),
  team_size: z.string().min(1, "Enter your team size."),
});

// ---------------------------------------------------------------------------
// Small presentational helpers
// ---------------------------------------------------------------------------

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold tracking-[.18em] uppercase text-muted">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

function Choices({
  label,
  options,
  value,
  toggle,
}: {
  label: string;
  options: string[];
  value: string[];
  toggle: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-[10px] font-semibold tracking-[.18em] uppercase text-muted">
        {label}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={value.includes(option)}
            onClick={() => toggle(option)}
            className={`rounded-full border px-3 py-2 text-sm transition ${
              value.includes(option)
                ? "border-burnt bg-burnt text-cream"
                : "border-line-strong bg-white text-ink hover:border-burnt"
            }`}
          >
            {value.includes(option) && <Check className="mr-1 inline" size={13} />} {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function CityPicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const options = cities.filter(
    (c) => !value.includes(c) && c.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <span className="text-[10px] font-semibold tracking-[.18em] uppercase text-muted">
        Cities served
      </span>
      <div className="mt-2 flex flex-wrap gap-2">
        {value.map((city) => (
          <span
            key={city}
            className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-2 text-sm text-cream"
          >
            {city}
            <button
              type="button"
              aria-label={`Remove ${city}`}
              onClick={() => onChange(value.filter((x) => x !== city))}
            >
              <X size={14} />
            </button>
          </span>
        ))}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-1 rounded-full border border-dashed border-line-strong px-3 py-2 text-sm text-ink"
        >
          <Plus size={15} /> Add city
        </button>
      </div>
      {open && (
        <div className="relative mt-3 max-w-md">
          <Search className="absolute left-3 top-3.5 text-muted" size={16} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
            placeholder="Search Indian cities"
            className={`${input} mt-0 pl-10`}
          />
          <div
            role="listbox"
            className="absolute z-10 mt-2 max-h-48 w-full overflow-auto rounded-xl border border-line bg-white p-1 shadow-lg"
          >
            {options.length ? (
              options.map((city) => (
                <button
                  key={city}
                  role="option"
                  aria-selected={false}
                  type="button"
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-cream"
                  onClick={() => {
                    onChange([...value, city]);
                    setQuery("");
                  }}
                >
                  {city}
                </button>
              ))
            ) : (
              <p className="px-3 py-2 text-sm text-muted">No available city found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function PartnerApplicationV2() {
  const [form, setForm] = useState<Values>(blank);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [faq, setFaq] = useState<number | null>(null);
  const formRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => {
      window.history.scrollRestoration = "auto";
    };
  }, []);

  const set = <K extends keyof Values>(key: K, value: Values[K]) =>
    setForm((old) => ({ ...old, [key]: value }));

  const fields = capabilities[form.partner_type]?.fields ?? [];
  const instaError = form.instagram && !insta.test(form.instagram.trim());
  const phoneError = form.phone && !validPhone(form.phone);

  const toggle = (key: CapabilityKey, option: string) =>
    setForm((old) => {
      const current = old.capabilities[key] ?? [];
      return {
        ...old,
        capabilities: {
          ...old.capabilities,
          [key]: current.includes(option)
            ? current.filter((x) => x !== option)
            : [...current, option],
        },
      };
    });

  const validate = () => {
    let message = "";

    if (step === 0) {
      const result = businessDetailsSchema.safeParse(form);
      if (!result.success) {
        message = result.error.issues[0]?.message ?? "Please complete your business details.";
      }
    }

    if (
      step === 1 &&
      !(form.service_cities.length && fields.every((f) => form.capabilities[f.key]?.length))
    ) {
      message = "Select at least one option in every capability area and add a city served.";
    }

    if (
      step === 2 &&
      !(
        form.portfolio_url &&
        form.portfolio_highlights &&
        form.client_references &&
        form.business_description &&
        form.differentiator &&
        form.consent
      )
    ) {
      message = "Please complete your profile details and consent before submitting.";
    }

    setError(message);
    return !message;
  };

  const toForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!validate() || submitting) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? ""}/api/vendor-applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          phone: `+91${form.phone}`,
          whatsapp: `+91${form.whatsapp}`,
          event_types: form.capabilities.event_types ?? [],
          services: form.capabilities.core_services ?? form.capabilities.photography_services ?? [],
          travel_scope: (form.capabilities.travel_scope ?? []).join(", "),
          min_event_budget: (form.capabilities.budget_ranges ?? []).join(", "),
          max_guest_count: form.max_guest_count ? Number(form.max_guest_count) : null,
          minimum_notice_days: form.minimum_notice_days ? Number(form.minimum_notice_days) : null,
          availability: form.availability || null,
          premium_experience: form.premium_experience.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error((await response.json().catch(() => null))?.detail || "Unable to submit your application.");
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit your application.");
    } finally {
      setSubmitting(false);
    }
  }

  const faqs = [
    [
      "How are leads assigned?",
      "Sambaram matches profiles against a customer’s city, event type, budget and capabilities so enquiries are relevant from the outset.",
    ],
    [
      "Is there commission?",
      "Commercial terms are discussed transparently after verification, before you accept any opportunity.",
    ],
    [
      "Can I reject enquiries?",
      "Yes. You always control your availability and the opportunities you pursue.",
    ],
    [
      "Can I edit my portfolio?",
      "Yes. Your approved partner dashboard lets you keep your work and availability current.",
    ],
    [
      "Can I work in multiple cities?",
      "Absolutely. Add every city you serve during your application.",
    ],
    [
      "How does verification work?",
      "Our team reviews your business, work quality and submitted details before activating your profile.",
    ],
  ];

  // -------------------------------------------------------------------------
  // Success state
  // -------------------------------------------------------------------------

  if (sent) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-cream px-6 text-center">
        <div className="max-w-xl">
          <CheckCircle2 className="mx-auto text-burnt" size={58} />
          <p className="mt-8 eyebrow">SAMBARAM Partner Network</p>
          <h1 className="mt-3 h-display text-5xl text-ink">Application received</h1>
          <p className="mt-6 leading-relaxed text-muted">
            Thank you for applying. Our team will personally review your profile and contact you
            if it aligns with the Sambaram network.
          </p>
          <Link href="/" className="btn-primary mt-8">
            Back to home
          </Link>
        </div>
      </section>
    );
  }

  // -------------------------------------------------------------------------
  // Main page
  // -------------------------------------------------------------------------

  return (
    <main className="bg-cream">
      {/* Hero */}
      <section className="grain relative overflow-hidden bg-ink px-6 pb-24 pt-32 text-cream sm:px-10">
        <div className="relative mx-auto max-w-6xl">
          <p className="eyebrow text-gold">The SAMBARAM Partner Network</p>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.3fr_.7fr] lg:items-end">
            <div>
              <h1 className="h-display max-w-3xl text-5xl sm:text-7xl">
                Grow your event business <em className="text-gold">with Sambaram.</em>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/70">
                Join our trusted vendor network and receive verified event enquiries from
                customers actively planning weddings, birthdays, corporate events and
                celebrations.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <button onClick={toForm} className="btn-primary bg-burnt">
                  Apply to become a partner <ArrowRight className="ml-2" size={16} />
                </button>
                <a href="#how-it-works" className="btn-ghost border-cream/30 text-cream">
                  See how it works <ArrowDown className="ml-2" size={16} />
                </a>
              </div>
            </div>
            <div className="rounded-3xl border border-cream/15 bg-cream/5 p-6">
              <p className="font-serif text-2xl">Built for exceptional event professionals.</p>
              <p className="mt-3 text-sm leading-relaxed text-cream/65">
                A considered application. A premium profile. More meaningful conversations with
                customers ready to celebrate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-line bg-card px-6 py-8 sm:px-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 text-center sm:grid-cols-4">
          {[
            ["500+", "Events planned"],
            ["100+", "Trusted vendors"],
            ["10+", "Cities"],
            ["95%", "Vendor satisfaction"],
          ].map(([number, label]) => (
            <div key={label}>
              <p className="font-serif text-3xl text-burnt sm:text-4xl">{number}</p>
              <p className="mt-1 text-[10px] tracking-[.14em] uppercase text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why join */}
      <section className="section">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">Built for growth</p>
          <h2 className="mt-3 h-display text-4xl text-ink sm:text-5xl">Why join Sambaram</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              ["Verified leads", "Receive enquiries only from customers actively planning an event."],
              ["More bookings", "Spend less time chasing customers and more time delivering events."],
              ["AI smart matching", "Match on city, event type, guest count, budget and expertise."],
              ["Professional portfolio", "Showcase galleries, videos and reviews in a considered profile."],
              ["Business dashboard", "Manage enquiries, availability and performance in one place."],
              ["No cold calling", "Customers reach out because they are already interested."],
            ].map(([title, copy], index) => (
              <article className="lux-card p-6" key={title}>
                <span className="font-serif text-2xl text-gold">0{index + 1}</span>
                <h3 className="mt-5 font-serif text-2xl text-ink">{title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="section bg-ink text-cream">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow text-gold">A thoughtful path</p>
          <h2 className="mt-3 h-display text-4xl sm:text-5xl">How it works</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              "Apply",
              "Complete profile",
              "Verification",
              "Profile approved",
              "Customers discover you",
              "Receive qualified leads",
              "Grow your business",
            ].map((item, index) => (
              <div key={item} className="flex gap-4 border-t border-cream/20 pt-4">
                <span className="text-gold">0{index + 1}</span>
                <span className="font-serif text-xl">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Traditional vs Sambaram */}
      <section className="section">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">The difference</p>
          <h2 className="mt-3 h-display text-4xl text-ink sm:text-5xl">Better leads, better work.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <article className="rounded-3xl border border-line bg-card p-7">
              <h3 className="font-serif text-3xl text-ink">Traditional</h3>
              {["Random WhatsApp groups", "Facebook posts", "Price wars", "Fake enquiries", "Cold calling"].map(
                (i) => (
                  <p className="mt-4 text-muted" key={i}>
                    ✕ {i}
                  </p>
                )
              )}
            </article>
            <article className="rounded-3xl bg-burnt p-7 text-cream">
              <h3 className="font-serif text-3xl">Sambaram</h3>
              {["Verified customers", "AI matching", "Premium profile", "Better conversion", "Qualified enquiries"].map(
                (i) => (
                  <p className="mt-4" key={i}>
                    ✓ {i}
                  </p>
                )
              )}
            </article>
          </div>
        </div>
      </section>

      {/* Partner benefits */}
      <section className="section bg-cream-warm">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">Partner benefits</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Receive verified customers",
              "Showcase your portfolio",
              "Grow without marketing spend",
              "Business insights",
              "Professional visibility",
              "Higher quality clients",
              "AI lead matching",
              "Dedicated support",
            ].map((i) => (
              <div key={i} className="rounded-2xl border border-line bg-card p-5 font-serif text-xl text-ink">
                <CircleCheck className="mb-5 text-burnt" size={20} />
                {i}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who can apply */}
      <section className="section">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">The network</p>
          <h2 className="mt-3 h-display text-4xl text-ink sm:text-5xl">Who can apply</h2>
          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Event planners",
              "Photography studios",
              "Decorators",
              "Caterers",
              "Makeup artists",
              "Entertainment",
              "DJ",
              "Venues",
              "Florists",
              "Rental companies",
            ].map((item, index) => (
              <div className="rounded-2xl border border-line bg-card p-5 text-ink" key={item}>
                {item}
                {index > 1 && (
                  <span className="ml-2 rounded-full bg-cream-warm px-2 py-1 text-[9px] tracking-wider uppercase text-burnt">
                    Coming soon
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-card">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">From the network</p>
          <h2 className="mt-3 h-display text-4xl text-ink sm:text-5xl">
            Made for people who care about the details.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              [
                "Aanya Events",
                "Hyderabad",
                "Full-service event planner",
                "The quality of conversations feels completely different when customers have already shared their vision.",
              ],
              [
                "Frame Story Studios",
                "Warangal",
                "Photography & cinematography",
                "Sambaram understands that creative work needs a profile, not just a phone number.",
              ],
              [
                "The Celebration Co.",
                "Hyderabad",
                "Luxury event planning",
                "A polished way to be discovered by the clients we want to serve.",
              ],
            ].map(([name, city, type, quote]) => (
              <article className="lux-card p-6" key={name}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-warm font-serif text-xl text-burnt">
                    {name[0]}
                  </div>
                  <div>
                    <h3 className="font-medium text-ink">{name}</h3>
                    <p className="text-sm text-muted">
                      {city} · {type}
                    </p>
                  </div>
                </div>
                <p className="mt-6 font-serif text-xl leading-relaxed text-ink">“{quote}”</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="mx-auto max-w-3xl">
          <p className="text-center eyebrow">Questions, answered</p>
          <h2 className="mt-3 text-center h-display text-4xl text-ink sm:text-5xl">
            Frequently asked questions
          </h2>
          <div className="mt-9 divide-y divide-line border-y border-line">
            {faqs.map(([q, a], i) => (
              <div key={q}>
                <button
                  className="flex w-full items-center justify-between py-5 text-left font-medium text-ink"
                  aria-expanded={faq === i}
                  onClick={() => setFaq(faq === i ? null : i)}
                >
                  {q}
                  {faq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {faq === i && <p className="pb-5 leading-relaxed text-muted">{a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 pb-12 sm:px-10">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-burnt px-7 py-14 text-center text-cream sm:px-14">
          <h2 className="h-display text-4xl sm:text-6xl">Ready to grow your event business?</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-cream/80">
            Join Sambaram&apos;s trusted network of event professionals and connect with customers
            looking for exceptional event experiences.
          </p>
          <button onClick={toForm} className="btn-primary mt-8 bg-ink">
            Apply now <ArrowRight className="ml-2" size={16} />
          </button>
        </div>
      </section>

      {/* Application form */}
      <section id="partner-application" ref={formRef} className="scroll-mt-5 px-6 py-16 sm:px-10">
        <form
          onSubmit={submit}
          className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-line bg-card"
        >
          <header className="bg-ink px-6 py-10 text-cream sm:px-10">
            <p className="eyebrow text-gold">The SAMBARAM Partner Network</p>
            <h2 className="mt-3 h-display text-4xl sm:text-5xl">Apply to join Sambaram</h2>
            <p className="mt-4 max-w-2xl text-cream/70">
              Tell us about the work you do best. Your selections help us make better customer
              matches.
            </p>
          </header>

          {/* Step tabs */}
          <div className="grid grid-cols-3 border-b border-line">
            {["Business", "Capabilities", "Profile"].map((item, index) => (
              <button
                key={item}
                type="button"
                disabled={index > step}
                onClick={() => setStep(index)}
                className={`border-b-2 px-2 py-4 text-[10px] font-semibold tracking-[.13em] uppercase ${
                  index === step ? "border-burnt text-burnt" : "border-transparent text-muted"
                }`}
              >
                0{index + 1}
                <span className="hidden sm:inline"> · {item}</span>
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-10">
            {/* Step 0: Business details */}
            {step === 0 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Partner category">
                  <div className="relative">
                    <select
                      required
                      value={form.partner_type}
                      onChange={(e) => {
                        set("partner_type", e.target.value);
                        set("capabilities", {});
                      }}
                      className={`${input} appearance-none`}
                    >
                      <option value="">Select your category</option>
                      <option value="event_partner">Full event planner / event management</option>
                      <option value="photography_studio">Photography & cinematography</option>
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-4 top-5 text-muted"
                      size={17}
                    />
                  </div>
                </Field>

                <Field label="Business name">
                  <input
                    required
                    value={form.business_name}
                    onChange={(e) => set("business_name", e.target.value)}
                    className={input}
                  />
                </Field>

                <Field label="Owner name">
                  <input
                    required
                    value={form.owner_name}
                    onChange={(e) => set("owner_name", e.target.value)}
                    className={input}
                  />
                </Field>

                <Field label="Email address">
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={input}
                  />
                </Field>

                <Field
                  label="Phone number"
                  hint={
                    phoneError
                      ? "Enter exactly 10 digits for an Indian number."
                      : "Indian mobile number, 10 digits"
                  }
                >
                  <div className="mt-2 flex">
                    <span className="inline-flex items-center rounded-l-xl border border-r-0 border-line-strong bg-cream px-3 text-sm text-ink">
                      🇮🇳 +91
                    </span>
                    <input
                      required
                      inputMode="numeric"
                      maxLength={10}
                      aria-invalid={Boolean(phoneError)}
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
                      placeholder="9876543210"
                      className="w-full rounded-r-xl border border-line-strong bg-white px-4 py-3 text-ink outline-none focus:border-burnt"
                    />
                  </div>
                </Field>

                <Field
                  label="WhatsApp number"
                  hint={
                    form.whatsapp && !validPhone(form.whatsapp)
                      ? "Enter exactly 10 digits for an Indian number."
                      : "Indian mobile number, 10 digits"
                  }
                >
                  <div className="mt-2 flex">
                    <span className="inline-flex items-center rounded-l-xl border border-r-0 border-line-strong bg-cream px-3 text-sm text-ink">
                      🇮🇳 +91
                    </span>
                    <input
                      required
                      inputMode="numeric"
                      maxLength={10}
                      value={form.whatsapp}
                      onChange={(e) => set("whatsapp", e.target.value.replace(/\D/g, ""))}
                      placeholder="9876543210"
                      className="w-full rounded-r-xl border border-line-strong bg-white px-4 py-3 text-ink outline-none focus:border-burnt"
                    />
                  </div>
                </Field>

                <Field
                  label="Instagram profile"
                  hint={
                    instaError
                      ? "Enter an Instagram username or instagram.com profile URL."
                      : "Username or full Instagram profile URL"
                  }
                >
                  <input
                    required
                    aria-invalid={Boolean(instaError)}
                    value={form.instagram}
                    onChange={(e) => set("instagram", e.target.value)}
                    placeholder="yourstudio or instagram.com/yourstudio"
                    className={input}
                  />
                </Field>

                <Field label="Primary city">
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-4 top-5 text-muted" size={16} />
                    <select
                      required
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                      className={`${input} appearance-none pl-10`}
                    >
                      <option value="">Select city</option>
                      {cities.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-4 top-5 text-muted"
                      size={17}
                    />
                  </div>
                </Field>

                <Field label="Years in business">
                  <input
                    required
                    min="0"
                    type="number"
                    value={form.years_in_business}
                    onChange={(e) => set("years_in_business", e.target.value)}
                    className={input}
                  />
                </Field>

                <Field label="Events per year">
                  <input
                    required
                    min="0"
                    type="number"
                    value={form.events_per_year}
                    onChange={(e) => set("events_per_year", e.target.value)}
                    className={input}
                  />
                </Field>

                <Field label="Full-time team size">
                  <input
                    required
                    min="1"
                    type="number"
                    value={form.team_size}
                    onChange={(e) => set("team_size", e.target.value)}
                    className={input}
                  />
                </Field>
              </div>
            )}

            {/* Step 1: Capabilities */}
            {step === 1 && (
              <div className="space-y-9">
                <div>
                  <h3 className="font-serif text-3xl text-ink">
                    {capabilities[form.partner_type]?.title ?? "Choose a category first"}
                  </h3>
                  <p className="mt-2 text-muted">
                    Select every capability you confidently offer. These map directly to customer
                    planning needs.
                  </p>
                </div>
                {fields.map((f) => (
                  <Choices
                    key={f.key}
                    label={f.label}
                    options={f.options}
                    value={form.capabilities[f.key] ?? []}
                    toggle={(o) => toggle(f.key, o)}
                  />
                ))}
                <CityPicker value={form.service_cities} onChange={(v) => set("service_cities", v)} />
              </div>
            )}

            {/* Step 2: Profile */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Availability" hint="Optional">
                    <div className="relative">
                      <select
                        value={form.availability}
                        onChange={(e) => set("availability", e.target.value)}
                        className={`${input} appearance-none`}
                      >
                        <option value="">Select availability</option>
                        <option value="Available for new enquiries">Available for new enquiries</option>
                        <option value="Limited availability">Limited availability</option>
                        <option value="Available from next season">Available from next season</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-5 text-muted" size={17} />
                    </div>
                  </Field>

                  <Field label="Maximum guest count" hint="Optional">
                    <input
                      min="1"
                      type="number"
                      value={form.max_guest_count}
                      onChange={(e) => set("max_guest_count", e.target.value)}
                      className={input}
                    />
                  </Field>
                </div>

                <Field label="Minimum notice (days)" hint="Optional">
                  <input
                    min="0"
                    type="number"
                    value={form.minimum_notice_days}
                    onChange={(e) => set("minimum_notice_days", e.target.value)}
                    className={input}
                  />
                </Field>

                <Field label="Premium event experience" hint="Optional">
                  <textarea
                    rows={4}
                    value={form.premium_experience}
                    onChange={(e) => set("premium_experience", e.target.value)}
                    className={input}
                  />
                </Field>

                <Field label="Portfolio website / Google Drive">
                  <input
                    required
                    type="url"
                    value={form.portfolio_url}
                    onChange={(e) => set("portfolio_url", e.target.value)}
                    placeholder="https://"
                    className={input}
                  />
                </Field>

                <Field label="Three portfolio highlights">
                  <textarea
                    required
                    rows={4}
                    value={form.portfolio_highlights}
                    onChange={(e) => set("portfolio_highlights", e.target.value)}
                    className={input}
                  />
                </Field>

                <Field label="Client references or reviews">
                  <textarea
                    required
                    rows={4}
                    value={form.client_references}
                    onChange={(e) => set("client_references", e.target.value)}
                    className={input}
                  />
                </Field>

                <Field label="About your business">
                  <textarea
                    required
                    rows={4}
                    value={form.business_description}
                    onChange={(e) => set("business_description", e.target.value)}
                    className={input}
                  />
                </Field>

                <Field label="What makes your work different?">
                  <textarea
                    required
                    rows={4}
                    value={form.differentiator}
                    onChange={(e) => set("differentiator", e.target.value)}
                    className={input}
                  />
                </Field>

                <label className="flex items-start gap-3 text-sm text-muted">
                  <input
                    required
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => set("consent", e.target.checked)}
                    className="mt-1"
                  />
                  I agree to be contacted by the Sambaram team regarding my application.
                </label>
              </div>
            )}

            {error && (
              <p role="alert" className="mt-5 text-sm text-burnt">
                {error}
              </p>
            )}

            {/* Step navigation */}
            <div className="mt-9 flex justify-between gap-4">
              {step ? (
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setStep(step - 1);
                  }}
                  className="btn-ghost"
                >
                  <ArrowLeft className="mr-2" size={15} />
                  Back
                </button>
              ) : (
                <span />
              )}

              {step < 2 ? (
                <button
                  type="button"
                  disabled={Boolean(
                    step === 0 && (!validPhone(form.phone) || !validPhone(form.whatsapp) || instaError)
                  )}
                  onClick={() => validate() && setStep(step + 1)}
                  className="btn-primary disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Continue <ArrowRight className="ml-2" size={15} />
                </button>
              ) : (
                <button className="btn-primary disabled:opacity-50" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 animate-spin" size={16} />}
                  Submit application
                </button>
              )}
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}
