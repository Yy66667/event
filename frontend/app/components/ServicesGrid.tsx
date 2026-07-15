"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EVENT_CATEGORIES } from "../lib/constants";

const CATEGORY_DETAILS: Record<
  string,
  { blurb: string; motif: string; accent: string }
> = {
  Weddings: {
    blurb: "Multi-day weddings honouring family rituals with modern styling.",
    motif: "M20 100 Q100 20 180 100 T180 100",
    accent: "#C04A24",
  },
  Birthdays: {
    blurb: "Milestone birthdays with cinematic staging and intimate detail.",
    motif: "M20 100 C60 20 140 20 180 100 S60 180 20 100",
    accent: "#E67E22",
  },
  Engagements: {
    blurb: "Cinematic engagements — from beach sunsets to garden soirées.",
    motif: "M40 140 Q100 30 160 140 M40 140 L160 140",
    accent: "#D4A44E",
  },
  "Corporate Events": {
    blurb: "Founder summits, brand launches and premium corporate offsites.",
    motif: "M30 40 L170 40 L170 160 L30 160 Z M30 100 L170 100",
    accent: "#3B3228",
  },
  Housewarming: {
    blurb: "Griha pravesham & housewarming ceremonies, thoughtfully modernised.",
    motif: "M100 20 L180 90 L160 90 L160 170 L40 170 L40 90 L20 90 Z",
    accent: "#7A5C3E",
  },
  "Baby Shower": {
    blurb: "Seemantham & baby showers styled with warmth and whimsy.",
    motif: "M50 100 Q100 40 150 100 Q100 160 50 100",
    accent: "#B18AA0",
  },
  "Private Parties": {
    blurb: "Anniversaries, receptions and intimate dinners in signature settings.",
    motif: "M100 30 L120 90 L180 90 L130 125 L150 180 L100 145 L50 180 L70 125 L20 90 L80 90 Z",
    accent: "#A83C1B",
  },
};

export default function ServicesGrid() {
  return (
    <section
      id="studio"
      data-testid="services-grid"
      className="relative section bg-cream"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3">
              <span className="divider-line" />
              <span className="eyebrow">Our Studio</span>
            </div>
            <h2 className="mt-4 h-display text-4xl sm:text-5xl lg:text-6xl text-ink max-w-2xl">
              Seven occasions.
              <br />
              <span className="italic text-burnt">One studio to compose them.</span>
            </h2>
          </div>
          <p className="max-w-md text-muted leading-relaxed">
            Every event we take on is designed like a short film — a distinct mood,
            palette, and story board. Choose an occasion to see how we think.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {EVENT_CATEGORIES.map((cat, i) => {
            const meta = CATEGORY_DETAILS[cat];
            return (
              <motion.article
                key={cat}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="lux-card group relative overflow-hidden p-7 sm:p-8 min-h-[240px] flex flex-col justify-between"
                data-testid={`service-card-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <svg
                  viewBox="0 0 200 200"
                  className="absolute -right-6 -top-6 w-40 opacity-[0.08] group-hover:opacity-[0.18] transition-opacity duration-500"
                  aria-hidden
                >
                  <path d={meta.motif} stroke={meta.accent} strokeWidth="1.2" fill="none" />
                </svg>

                <div>
                  <div className="text-[10px] tracking-[0.28em] uppercase text-muted">
                    Occasion 0{i + 1}
                  </div>
                  <h3 className="mt-3 font-serif text-2xl sm:text-3xl text-ink">{cat}</h3>
                  <p className="mt-3 text-sm text-muted leading-relaxed max-w-xs">{meta.blurb}</p>
                </div>

                <Link
                  href={`/portfolio?category=${encodeURIComponent(cat)}`}
                  className="mt-6 inline-flex items-center gap-2 text-[12px] tracking-[0.22em] uppercase text-ink hover:text-burnt transition"
                >
                  View Portfolio <ArrowUpRight size={14} />
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
