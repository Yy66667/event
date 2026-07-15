"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { API_BASE } from "../lib/constants";

type Testimonial = {
  id?: string;
  name: string;
  event: string;
  rating: number;
  quote: string;
};

const FALLBACK: Testimonial[] = [
  {
    name: "Ananya & Rohit",
    event: "Wedding · Warangal",
    rating: 5,
    quote:
      "SAMBARAM didn't just plan our wedding — they translated our family's memories into a three-day story.",
  },
];

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>(FALLBACK);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE}/api/testimonials`)
      .then((r) => r.json())
      .then((d: Testimonial[]) => {
        if (Array.isArray(d) && d.length) setItems(d);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 6500);
    return () => clearInterval(t);
  }, [items.length]);

  const current = items[idx] || items[0];

  return (
    <section
      id="testimonials"
      data-testid="testimonials-section"
      className="relative section bg-cream"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-10 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-4">
          <div className="flex items-center gap-3">
            <span className="divider-line" />
            <span className="eyebrow">In their words</span>
          </div>
          <h2 className="mt-4 h-display text-4xl sm:text-5xl text-ink">
            Loved by <br />
            <span className="italic text-burnt">180+ families.</span>
          </h2>
          <p className="mt-6 text-muted leading-relaxed">
            Every review below is from a family we planned an event for. No incentives,
            no filters — just words we've kept.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <button
              data-testid="testimonial-prev"
              onClick={() => setIdx((i) => (i - 1 + items.length) % items.length)}
              className="w-11 h-11 rounded-full border border-line-strong hover:bg-ink hover:text-cream flex items-center justify-center transition"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              data-testid="testimonial-next"
              onClick={() => setIdx((i) => (i + 1) % items.length)}
              className="w-11 h-11 rounded-full border border-line-strong hover:bg-ink hover:text-cream flex items-center justify-center transition"
              aria-label="Next testimonial"
            >
              <ChevronRight size={16} />
            </button>
            <span className="ml-3 text-[12px] tracking-[0.24em] uppercase text-muted">
              {String(idx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="md:col-span-8 relative min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative lux-card p-8 sm:p-12"
              data-testid={`testimonial-card-${idx}`}
            >
              <Quote size={36} className="text-burnt/40" />
              <p className="mt-6 font-serif text-2xl sm:text-3xl leading-[1.35] text-ink">
                &ldquo;{current.quote}&rdquo;
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-burnt to-gold flex items-center justify-center text-cream font-serif text-lg">
                  {current.name[0]}
                </div>
                <div>
                  <div className="font-medium text-ink">{current.name}</div>
                  <div className="text-[12px] tracking-wide text-muted">{current.event}</div>
                </div>
                <div className="ml-auto flex text-gold-deep">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
              </div>
            </motion.blockquote>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
