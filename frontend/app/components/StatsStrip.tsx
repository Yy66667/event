"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { API_BASE } from "../lib/constants";

type Stats = {
  events_delivered: number;
  years_experience: number;
  happy_couples: number;
  cities_served: number;
  vendor_network: number;
  awards: number;
};

const FALLBACK: Stats = {
  events_delivered: 320,
  years_experience: 11,
  happy_couples: 180,
  cities_served: 14,
  vendor_network: 220,
  awards: 7,
};

const LABELS: [keyof Stats, string, string][] = [
  ["events_delivered", "Events Delivered", "+"],
  ["years_experience", "Years of Craft", ""],
  ["happy_couples", "Happy Families", "+"],
  ["cities_served", "Cities Served", ""],
  ["vendor_network", "Vendor Network", "+"],
  ["awards", "Design Awards", ""],
];

function AnimatedNumber({ value }: { value: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const dur = 1200;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{n}</>;
}

export default function StatsStrip() {
  const [stats, setStats] = useState<Stats>(FALLBACK);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/stats`)
      .then((r) => r.json())
      .then((d) => setStats({ ...FALLBACK, ...d }))
      .catch(() => {});
  }, []);

  return (
    <section
      data-testid="stats-strip"
      className="relative border-y border-[rgba(58,45,36,0.10)] bg-cream-warm/40"
      onMouseEnter={() => setVisible(true)}
    >
      <motion.div
        onViewportEnter={() => setVisible(true)}
        viewport={{ once: true, amount: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-14 grid grid-cols-2 md:grid-cols-6 gap-y-8">
          {LABELS.map(([key, label, suffix], i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="text-center md:text-left md:pl-8 md:border-l md:border-[rgba(58,45,36,0.12)] first:pl-0 first:border-l-0"
              data-testid={`stat-${key}`}
            >
              <div className="font-serif text-4xl sm:text-5xl text-ink">
                {visible ? <AnimatedNumber value={stats[key]} /> : 0}
                <span className="text-burnt">{suffix}</span>
              </div>
              <div className="mt-2 text-[11px] tracking-[0.24em] uppercase text-muted">
                {label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
