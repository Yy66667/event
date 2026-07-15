"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, MessageCircle, Phone, Mail, ArrowUpRight, Sparkles } from "lucide-react";
import { BRAND } from "../lib/constants";

export default function ThankYouClient() {
  return (
    <section
      className="relative min-h-screen bg-cream pt-32 pb-24 overflow-hidden"
      data-testid="thank-you-page"
    >
      <div className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gold/20 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-burnt/15 blur-[140px]" />

      {/* Confetti sparkles */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: [0, 1, 0],
              y: [0, 80],
              rotate: [0, 180],
            }}
            transition={{
              duration: 4,
              delay: i * 0.25,
              repeat: Infinity,
              repeatDelay: 6,
            }}
            className="absolute"
            style={{
              left: `${(i * 53) % 100}%`,
              top: `${(i * 37) % 60}%`,
              width: 8,
              height: 8,
              background: i % 3 === 0 ? "#C04A24" : i % 3 === 1 ? "#D4A44E" : "#E67E22",
              borderRadius: i % 2 === 0 ? "50%" : "2px",
            }}
          />
        ))}
      </div>

      <div className="relative max-w-3xl mx-auto px-6 sm:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-3">
            <span className="divider-line" />
            <span className="eyebrow">Received with gratitude</span>
            <span className="divider-line" />
          </div>

          <h1 className="mt-6 h-display text-5xl sm:text-6xl lg:text-7xl text-ink leading-[1.05]">
            Thank you for planning your event with us.
          </h1>

          <p className="mt-8 text-lg text-muted leading-relaxed max-w-2xl mx-auto">
            Our event specialist will review your requirements and contact you shortly
            to discuss your vision and recommend the best vendors for your celebration.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 text-[12px] tracking-[0.22em] uppercase text-burnt">
            <Sparkles size={12} /> Typical response · within 12 hours
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          <a
            href={`tel:${BRAND.phoneRaw}`}
            data-testid="ty-contact-call"
            className="lux-card p-5 flex flex-col items-center gap-2 hover:bg-ink hover:text-cream group"
          >
            <Phone size={18} className="text-burnt group-hover:text-cream" />
            <span className="text-[11px] tracking-[0.22em] uppercase">Call</span>
          </a>
          <a
            href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="ty-contact-whatsapp"
            className="lux-card p-5 flex flex-col items-center gap-2 hover:bg-ink hover:text-cream group"
          >
            <MessageCircle size={18} className="text-burnt group-hover:text-cream" />
            <span className="text-[11px] tracking-[0.22em] uppercase">WhatsApp</span>
          </a>
          <a
            href={`mailto:${BRAND.email}`}
            data-testid="ty-contact-email"
            className="lux-card p-5 flex flex-col items-center gap-2 hover:bg-ink hover:text-cream group"
          >
            <Mail size={18} className="text-burnt group-hover:text-cream" />
            <span className="text-[11px] tracking-[0.22em] uppercase">Email</span>
          </a>
          <a
            href={BRAND.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="ty-contact-instagram"
            className="lux-card p-5 flex flex-col items-center gap-2 hover:bg-ink hover:text-cream group"
          >
            <Instagram size={18} className="text-burnt group-hover:text-cream" />
            <span className="text-[11px] tracking-[0.22em] uppercase">Instagram</span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link href="/portfolio" className="btn-ghost" data-testid="ty-view-work">
            Browse our work
          </Link>
          <Link href="/" className="btn-primary" data-testid="ty-home">
            Back to home <ArrowUpRight size={14} className="ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
