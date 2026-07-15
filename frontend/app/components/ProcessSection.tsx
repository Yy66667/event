"use client";

import { motion } from "framer-motion";
import { Sparkles, Compass, PenLine, Handshake } from "lucide-react";

const STEPS = [
  {
    icon: Compass,
    label: "Share Your Vision",
    body: "Start our planner. Tell us the essentials — event, date, city, headcount, budget.",
  },
  {
    icon: Sparkles,
    label: "AI-Guided Concept",
    body: "Our concierge AI suggests themes, decor, timelines and services that fit your story.",
  },
  {
    icon: PenLine,
    label: "Curation & Proposal",
    body: "We pair you with vetted vendors and build a design proposal you edit to perfection.",
  },
  {
    icon: Handshake,
    label: "We Execute",
    body: "You are a guest at your own event. Our team runs production so you stay present.",
  },
];

export default function ProcessSection() {
  return (
    <section
      id="process"
      data-testid="process-section"
      className="relative section bg-ink text-cream overflow-hidden"
    >
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-burnt/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-gold/10 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="inline-block h-px w-14 bg-gold" />
            <span className="eyebrow text-gold">The Process</span>
          </div>
          <h2 className="mt-4 h-display text-4xl sm:text-5xl lg:text-6xl">
            From an idea in your head, to a{" "}
            <span className="italic text-gold">memory in the family album.</span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
                className="relative"
                data-testid={`process-step-${i + 1}`}
              >
                <div className="flex items-center gap-3 text-gold text-[11px] tracking-[0.28em] uppercase">
                  <span>Step 0{i + 1}</span>
                  <span className="flex-1 h-px bg-cream/15" />
                </div>
                <div className="mt-6 w-12 h-12 rounded-full bg-cream/5 border border-cream/15 flex items-center justify-center">
                  <Icon size={20} className="text-gold" />
                </div>
                <h3 className="mt-6 font-serif text-2xl">{s.label}</h3>
                <p className="mt-3 text-cream/70 leading-relaxed">{s.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
