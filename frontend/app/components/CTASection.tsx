"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section data-testid="cta-section" className="relative section bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[36px] bg-ink text-cream p-10 sm:p-16 overflow-hidden"
        >
          <div className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-burnt/25 blur-[130px]" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 w-[400px] h-[400px] rounded-full bg-gold/20 blur-[130px]" />

          <svg
            className="pointer-events-none absolute right-8 top-8 w-32 sm:w-56 opacity-30"
            viewBox="0 0 200 200"
            aria-hidden
          >
            <g fill="none" stroke="#D4A44E" strokeWidth="0.8">
              <circle cx="100" cy="100" r="90" />
              <circle cx="100" cy="100" r="72" />
              <circle cx="100" cy="100" r="54" />
              <path d="M100 10 L100 190 M10 100 L190 100" />
            </g>
          </svg>

          <div className="relative max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="inline-block h-px w-14 bg-gold" />
              <span className="eyebrow text-gold">Consultation is complimentary</span>
            </div>
            <h2 className="mt-5 h-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
              Let's design something
              <br />
              <span className="italic text-gold">worth remembering.</span>
            </h2>
            <p className="mt-6 text-cream/70 leading-relaxed">
              Share your vision through our AI-guided planner. Our specialist will
              review it and get back within 12 hours to walk through options — no
              pressure, no obligation.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link
                href="/planner"
                data-testid="cta-start-planning"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-gold text-ink font-medium hover:bg-cream transition"
              >
                <Sparkles size={16} /> Start Planning
                <ArrowUpRight size={16} />
              </Link>
              <Link
                href="/contact"
                data-testid="cta-book-consultation"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-cream/25 hover:border-cream text-cream transition"
              >
                Book a Consultation
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
