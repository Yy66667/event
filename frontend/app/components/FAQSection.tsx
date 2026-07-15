"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { API_BASE } from "../lib/constants";

type FAQ = { id?: string; q: string; a: string };

const FALLBACK: FAQ[] = [
  { q: "Do I book vendors directly through you?", a: "No. You share your vision and we recommend vendors from our vetted network." },
];

export default function FAQSection() {
  const [items, setItems] = useState<FAQ[]>(FALLBACK);
  const [open, setOpen] = useState<number>(0);

  useEffect(() => {
    fetch(`${API_BASE}/api/faqs`)
      .then((r) => r.json())
      .then((d: FAQ[]) => {
        if (Array.isArray(d) && d.length) setItems(d);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="faq" data-testid="faq-section" className="relative section bg-cream-warm/50">
      <div className="max-w-4xl mx-auto px-6 sm:px-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-3">
            <span className="divider-line" />
            <span className="eyebrow">Frequently Asked</span>
            <span className="divider-line" />
          </div>
          <h2 className="mt-4 h-display text-4xl sm:text-5xl text-ink">
            Answers before <span className="italic text-burnt">you ask.</span>
          </h2>
        </div>

        <div className="mt-14 divide-y divide-[rgba(58,45,36,0.12)] border-y border-[rgba(58,45,36,0.12)]">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} data-testid={`faq-item-${i}`}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full flex items-start justify-between gap-6 py-6 text-left group"
                  data-testid={`faq-toggle-${i}`}
                >
                  <span className="font-serif text-lg sm:text-xl text-ink group-hover:text-burnt transition">
                    {item.q}
                  </span>
                  <span className="mt-1 flex-shrink-0 w-8 h-8 rounded-full border border-line-strong flex items-center justify-center text-ink group-hover:bg-ink group-hover:text-cream transition">
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-8 pr-12 text-muted leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
