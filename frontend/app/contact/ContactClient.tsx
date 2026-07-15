"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  Instagram,
  Mail,
  MapPin,
  Send,
  Loader2,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { API_BASE, BRAND } from "../lib/constants";

const CONTACT_CARDS = [
  { icon: Phone, label: "Call us", value: BRAND.phone, href: `tel:${BRAND.phoneRaw}`, testId: "call" },
  { icon: MessageCircle, label: "WhatsApp", value: BRAND.whatsapp, href: `https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}`, testId: "whatsapp" },
  { icon: Mail, label: "Email", value: BRAND.email, href: `mailto:${BRAND.email}`, testId: "email" },
  { icon: Instagram, label: "Instagram", value: `@${BRAND.instagram}`, href: BRAND.instagramUrl, testId: "instagram" },
];

export default function ContactClient() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    email: "",
    event_type: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          whatsapp: form.whatsapp || form.phone,
          email: form.email,
          planner_answers: { event_type: form.event_type, special_requests: form.message },
          event_summary: { event_type: form.event_type },
        }),
      });
      if (!res.ok) throw new Error("Please try again in a moment.");
      setSent(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = form.name && form.phone && form.email;

  return (
    <>
      <section className="relative pt-36 sm:pt-44 pb-16 bg-cream-warm/40 overflow-hidden">
        <div className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-burnt/10 blur-[120px]" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-10">
          <div className="flex items-center gap-3">
            <span className="divider-line" />
            <span className="eyebrow">Contact</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mt-4 h-display text-5xl sm:text-6xl lg:text-7xl text-ink max-w-3xl"
          >
            Let's start a
            <br />
            <span className="italic text-burnt">quiet conversation.</span>
          </motion.h1>
          <p className="mt-6 max-w-xl text-muted leading-relaxed">
            The best events begin with a call. Reach us any way you like, or fill in
            the form and we'll respond within 12 hours.
          </p>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: contact cards */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CONTACT_CARDS.map((c) => {
                const Icon = c.icon;
                return (
                  <a
                    key={c.label}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    data-testid={`contact-card-${c.testId}`}
                    className="lux-card p-6 group flex items-start gap-4"
                  >
                    <div className="w-11 h-11 rounded-full bg-cream-warm border border-line flex items-center justify-center text-burnt group-hover:bg-ink group-hover:text-cream transition">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] tracking-[0.24em] uppercase text-muted">
                        {c.label}
                      </div>
                      <div className="mt-1 text-ink font-medium">{c.value}</div>
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="text-ink opacity-30 group-hover:opacity-100 transition"
                    />
                  </a>
                );
              })}
            </div>

            <div className="mt-6 lux-card p-6">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-cream-warm border border-line flex items-center justify-center text-burnt">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.24em] uppercase text-muted">Studio</div>
                  <div className="mt-1 text-ink">{BRAND.address}</div>
                  <div className="mt-1 text-sm text-muted">{BRAND.cities}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 lux-card p-6 bg-ink text-cream">
              <div className="text-[10px] tracking-[0.24em] uppercase text-gold">Hours</div>
              <div className="mt-3 text-cream/90 leading-relaxed text-sm">
                Mon – Sat · 10:00 AM to 8:00 PM IST
                <br />
                Sunday consultations by appointment.
              </div>
              <Link
                href="/planner"
                className="mt-5 inline-flex items-center gap-2 text-gold link-underline text-sm"
              >
                Prefer to start with our planner? <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right: callback form */}
          <div className="lg:col-span-7">
            <div className="lux-card p-6 sm:p-10">
              <div className="flex items-center gap-3">
                <span className="divider-line" />
                <span className="eyebrow">Request a callback</span>
              </div>
              <h2 className="mt-4 h-display text-3xl sm:text-4xl text-ink">
                Tell us a little, and we'll call.
              </h2>

              {sent ? (
                <div className="mt-10 flex flex-col items-center text-center py-10" data-testid="contact-success">
                  <div className="w-16 h-16 rounded-full bg-burnt text-cream flex items-center justify-center">
                    <CheckCircle2 size={26} />
                  </div>
                  <h3 className="mt-6 font-serif text-2xl text-ink">Received. Thank you.</h3>
                  <p className="mt-3 text-muted max-w-md">
                    Our specialist will reach out within 12 hours. In the meantime, feel free to explore our portfolio.
                  </p>
                  <Link href="/portfolio" className="btn-ghost mt-8">
                    Browse our work
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { key: "name", label: "Full name", type: "text" },
                      { key: "event_type", label: "Event type", type: "text" },
                      { key: "phone", label: "Phone", type: "tel" },
                      { key: "whatsapp", label: "WhatsApp (optional)", type: "tel" },
                      { key: "email", label: "Email", type: "email", full: true },
                    ].map((f) => (
                      <label
                        key={f.key}
                        className={`block ${(f as { full?: boolean }).full ? "sm:col-span-2" : ""}`}
                      >
                        <span className="text-[11px] tracking-[0.22em] uppercase text-muted">
                          {f.label}
                        </span>
                        <input
                          type={f.type}
                          data-testid={`contact-input-${f.key}`}
                          value={(form as Record<string, string>)[f.key]}
                          onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                          className="mt-2 w-full px-4 py-3 rounded-2xl border border-line-strong bg-white text-ink focus:border-burnt outline-none"
                        />
                      </label>
                    ))}
                    <label className="block sm:col-span-2">
                      <span className="text-[11px] tracking-[0.22em] uppercase text-muted">
                        A little about your event
                      </span>
                      <textarea
                        data-testid="contact-input-message"
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                        className="mt-2 w-full px-4 py-3 rounded-2xl border border-line-strong bg-white text-ink focus:border-burnt outline-none resize-none"
                        placeholder="Occasion, approximate date, city, guest count, budget…"
                      />
                    </label>
                  </div>

                  {error && (
                    <div className="mt-4 text-sm text-burnt-deep" data-testid="contact-error">
                      {error}
                    </div>
                  )}

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={submit}
                      disabled={!canSubmit || submitting}
                      className="btn-primary disabled:opacity-40"
                      data-testid="contact-submit"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={16} className="mr-2 animate-spin" /> Sending…
                        </>
                      ) : (
                        <>
                          <Send size={16} className="mr-2" /> Request Callback
                        </>
                      )}
                    </button>
                    <Link href="/planner" className="btn-ghost" data-testid="contact-goto-planner">
                      Or use the AI planner instead
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
