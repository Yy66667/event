"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, Play } from "lucide-react";
import MorphWord from "./MorphWord";

const heroPhotos = [
  { label: "Warangal · 2024", tone: "from-[#C04A24] via-[#E67E22] to-[#D4A44E]" },
  { label: "Hyderabad · 2024", tone: "from-[#2A231E] via-[#7A5C3E] to-[#D4A44E]" },
  { label: "Goa · 2023", tone: "from-[#8B4513] via-[#C04A24] to-[#F4B6C2]" },
];

export default function Hero() {
  return (
    <section
      data-testid="hero-section"
      className="relative min-h-screen flex flex-col overflow-hidden bg-cream pt-28 sm:pt-32"
    >
      {/* Soft gradient wash */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gold/15 blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-burnt/10 blur-[140px]" />
      </div>

      {/* Ornamental SVG motif */}
      <svg
        className="pointer-events-none absolute right-8 top-24 w-48 lg:w-72 opacity-[0.09]"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <g fill="none" stroke="#C04A24" strokeWidth="1">
          <circle cx="100" cy="100" r="94" />
          <circle cx="100" cy="100" r="72" />
          <circle cx="100" cy="100" r="50" />
          <path d="M100 6 L100 194 M6 100 L194 100 M30 30 L170 170 M170 30 L30 170" />
        </g>
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 flex-1 flex flex-col justify-center py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4"
        >
          <span className="divider-line" />
          <span className="eyebrow">Est. 2014 · Studio of Celebration</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 h-display text-[44px] sm:text-[68px] lg:text-[92px] text-ink"
        >
          <span className="block">We <MorphWord /></span>
          <span className="block text-ink-soft italic">heirloom celebrations.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.7 }}
          className="mt-8 max-w-xl text-[17px] sm:text-lg text-muted leading-relaxed"
        >
          A South-Indian event planning studio designing weddings, milestones and
          cultural gatherings that feel less like production, more like poetry.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4"
        >
          <Link
            href="/planner"
            data-testid="hero-cta-start-planning"
            className="btn-primary group"
          >
            <Sparkles size={16} className="mr-2 -ml-1" /> Start Planning
            <ArrowUpRight
              size={16}
              className="ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
          <Link href="/portfolio" data-testid="hero-cta-view-work" className="btn-ghost group">
            <Play size={14} className="mr-2" /> View Our Work
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 text-[12px] tracking-wide text-muted"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-burnt" /> 320+ Events Delivered
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" /> Rated 5.0 across 180+ families
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ink" /> 7 Design Awards
          </div>
        </motion.div>
      </div>

      {/* Bottom strip: mood board tiles */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 pb-16 sm:pb-24">
        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          {heroPhotos.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={`relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br ${p.tone}`}
              data-testid={`hero-moodboard-${i}`}
            >
              <div className="absolute inset-0 grain" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-cream/90 text-[10px] tracking-[0.2em] uppercase">
                <span>{p.label}</span>
                <span>0{i + 1}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
