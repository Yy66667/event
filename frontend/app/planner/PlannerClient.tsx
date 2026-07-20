"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Pencil,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { activeSteps, PlannerAnswers } from "./steps";
import { ChevronDown } from "lucide-react";
import AISuggestButton from "./AISuggestButton";
import { API_BASE } from "../lib/constants";

type Stage = "steps" | "summary" | "contact" | "sent";

// Common country dial codes — extend as needed
const COUNTRY_CODES = [
  { code: "IN", dial: "+91", label: "🇮🇳 (+91)" },
  { code: "US", dial: "+1", label: "🇺🇸 (+1)" },
  { code: "GB", dial: "+44", label: "🇬🇧 (+44)" },
  { code: "AE", dial: "+971", label: "🇦🇪 (+971)" },
  { code: "AU", dial: "+61", label: "🇦🇺 (+61)" },
  { code: "SG", dial: "+65", label: "🇸🇬 (+65)" },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Basic sanity check: national number should be 7–12 digits (covers most countries)
function isValidNationalNumber(digits: string) {
  return /^\d{7,12}$/.test(digits);
}

export default function PlannerClient() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("steps");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<PlannerAnswers>({});
  const noticeDays: Record<string, number> = {
                                          Wedding: 30,
                                          Engagement: 21,
                                          "Baby Shower": 14,
                                          "Corporate Event": 14,
                                          Birthday: 7,
                                          Housewarming: 7,
                                          "Private Party": 7,
                                        };

  const minDate = new Date();
  minDate.setDate(
    minDate.getDate() + (noticeDays[answers.event_type ?? ""] ?? 7)
  );

  const minDateString = minDate.toISOString().split("T")[0];
  
    
  const steps = activeSteps(answers.event_type ?? "");
  const step = steps[Math.min(current, steps.length - 1)];
  const total = steps.length;
  const progress = Math.round(((current + 1) / total) * 100);

  useEffect(() => {
  if (current >= steps.length) {
    setCurrent(Math.max(steps.length - 1, 0));
  }
}, [current, steps.length]);

  const setValue = (id: keyof PlannerAnswers, value: string | string[]) => {
    setAnswers((a) => ({ ...a, [id]: value }));
  };

 const toggleMulti = (id: keyof PlannerAnswers, opt: string) => {
  setAnswers((a) => {
    const current = a[id];

    const arr = Array.isArray(current) ? [...current] : [];

    const idx = arr.indexOf(opt);

    if (idx >= 0) {
      arr.splice(idx, 1);
    } else {
      arr.push(opt);
    }

    return {
      ...a,
      [id]: arr,
    };
  });
};

  const canProceed = useMemo(() => {
    if (step.optional) return true;
    const v = answers[step.id];
    if (Array.isArray(v)) return v.length > 0;
    return typeof v === "string" && v.trim().length > 0;
  }, [answers, step]);

  const next = () => {
    if (current < total - 1) {
      setCurrent(current + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setStage("summary");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ---------- Render step ----------
  const renderInput = () => {
    const v = answers[step.id];

    if (step.type === "choice") {
      return (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3" data-testid={`step-choices-${step.id}`}>
          {step.options?.map((opt) => {
            const active = v === opt;
            return (
              <button
                key={opt}
                data-testid={`choice-${step.id}-${opt.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setValue(step.id, opt)}
                className={`text-left p-5 rounded-2xl border transition-all duration-300 group ${
                  active
                    ? "border-burnt bg-ink text-cream shadow-lg"
                    : "border-line-strong bg-card hover:border-burnt hover:-translate-y-0.5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-base ${active ? "text-cream" : "text-ink"}`}>{opt}</span>
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                      active ? "bg-cream text-ink border-cream" : "border-line-strong text-transparent"
                    }`}
                  >
                    <Check size={12} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      );
    }

    if (step.type === "multi") {
      const arr = (v as string[]) || [];
      return (
        <div className="mt-8 flex flex-wrap gap-2" data-testid={`step-multi-${step.id}`}>
          {step.options?.map((opt) => {
            const active = arr.includes(opt);
            return (
              <button
                key={opt}
                data-testid={`multi-${step.id}-${opt.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => toggleMulti(step.id, opt)}
                className={`chip ${active ? "active" : ""}`}
              >
                {active && <Check size={12} />} {opt}
              </button>
            );
          })}
        </div>
      );
    }

    if (step.type === "date") {
      return (
        <input
          type="date"
          min={minDateString}
          value={(v as string) || ""}
          onChange={(e) => setValue(step.id, e.target.value)}
          className="mt-8 w-full max-w-md px-5 py-4 rounded-2xl border border-line-strong bg-card text-ink text-lg focus:border-burnt outline-none"
        />
      );
    }

    if (step.type === "textarea") {
      return (
        <textarea
          data-testid={`input-${step.id}`}
          value={(v as string) || ""}
          onChange={(e) => setValue(step.id, e.target.value)}
          placeholder={step.placeholder}
          rows={5}
          className="mt-8 w-full max-w-2xl px-5 py-4 rounded-2xl border border-line-strong bg-card text-ink focus:border-burnt outline-none resize-none"
        />
      );
    }

    // text or number
    return (
      <input
        type={step.type === "number" ? "number" : "text"}
        data-testid={`input-${step.id}`}
        value={(v as string) || ""}
        onChange={(e) => setValue(step.id, e.target.value)}
        placeholder={step.placeholder}
        className="mt-8 w-full max-w-2xl px-5 py-4 rounded-2xl border border-line-strong bg-card text-ink text-lg focus:border-burnt outline-none"
      />
    );
  };

  // ---------- Summary ----------
  const summaryRows = steps.map((s) => {
    const v = answers[s.id];
    if (!v || (Array.isArray(v) && v.length === 0)) return null;
    return {
      id: s.id,
      title: s.title,
      eyebrow: s.eyebrow,
      value: Array.isArray(v) ? v.join(" · ") : v,
    };
  }).filter(Boolean) as { id: keyof PlannerAnswers; title: string; eyebrow: string; value: string }[];

  // ---------- Submit lead ----------
  const [lead, setLead] = useState({ name: "", phone: "", whatsapp: "", email: "" });
  const [phoneCountry, setPhoneCountry] = useState(COUNTRY_CODES[0].dial);
  const [whatsappCountry, setWhatsappCountry] = useState(COUNTRY_CODES[0].dial);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const phoneDigits = lead.phone.replace(/\D/g, "");
  const whatsappDigits = lead.whatsapp.replace(/\D/g, "");

  const emailValid = lead.email.length === 0 || EMAIL_REGEX.test(lead.email);
  const phoneValid = lead.phone.length === 0 || isValidNationalNumber(phoneDigits);
  const whatsappValid = lead.whatsapp.length === 0 || isValidNationalNumber(whatsappDigits);

  const canSubmitLead =
    !!lead.name &&
    !!lead.phone &&
    !!lead.email &&
    EMAIL_REGEX.test(lead.email) &&
    isValidNationalNumber(phoneDigits) &&
    (lead.whatsapp.length === 0 || isValidNationalNumber(whatsappDigits));

  const markTouched = (key: string) => setTouched((s) => ({ ...s, [key]: true }));

  const submitLead = async () => {
    if (!canSubmitLead) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const fullPhone = `${phoneCountry}${phoneDigits}`;
      const fullWhatsapp = whatsappDigits ? `${whatsappCountry}${whatsappDigits}` : fullPhone;

      const res = await fetch(`${API_BASE}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: lead.name,
          phone: fullPhone,
          whatsapp: fullWhatsapp,
          email: lead.email,
          planner_answers: answers,
          event_summary: {
            event_type: answers.event_type,
            event_date: answers.event_date,
            city: answers.city,
            guest_count: answers.guest_count,
            budget: answers.budget,
            theme: answers.theme,
          },
        }),
      });
      if (!res.ok) throw new Error("Submission failed. Please try again.");
      setStage("sent");
      setTimeout(() => router.push("/thank-you"), 400);
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream pt-28 sm:pt-32 pb-40" data-testid="planner-page">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-[11px] tracking-[0.24em] uppercase text-muted">
            <span data-testid="planner-step-counter">
              Step {Math.min(current + 1, total).toString().padStart(2, "0")} /{" "}
              {total.toString().padStart(2, "0")}
            </span>
            <span>
              {stage === "steps"
                ? `${progress}%`
                : stage === "summary"
                ? "Review"
                : stage === "contact"
                ? "Almost there"
                : "Sent"}
            </span>
          </div>
          <div className="mt-3 h-[3px] bg-line rounded-full overflow-hidden">
            <motion.div
              initial={false}
              animate={{
                width:
                  stage === "steps"
                    ? `${progress}%`
                    : stage === "summary"
                    ? "100%"
                    : stage === "contact"
                    ? "100%"
                    : "100%",
              }}
              transition={{ duration: 0.5 }}
              className="h-full bg-burnt"
              data-testid="planner-progress"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* -------------- STEPS -------------- */}
          {stage === "steps" && (
            <motion.div
              key={`step-${current}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3">
                <span className="divider-line" />
                <span className="eyebrow">{step.eyebrow}</span>
              </div>
              <h1 className="mt-4 h-display text-3xl sm:text-5xl text-ink">{step.title}</h1>
              <p className="mt-4 text-muted leading-relaxed max-w-xl">{step.subtitle}</p>

              {renderInput()}

              {step.aiTopic && step.aiLabel && (
                <AISuggestButton
                  topic={step.aiTopic}
                  label={step.aiLabel}
                  context={answers as Record<string, unknown>}
                  onApply={(text) => {
                    if (step.type === "text" || step.type === "textarea") {
                      setValue(step.id, text.slice(0, 500));
                    }
                  }}
                />
              )}

              <div className="mt-12 flex items-center gap-3">
                <button
                  onClick={prev}
                  disabled={current === 0}
                  className="btn-ghost disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink"
                  data-testid="planner-back"
                >
                  <ArrowLeft size={16} className="mr-2" /> Back
                </button>
                <button
                  onClick={next}
                  disabled={!canProceed}
                  className="btn-primary disabled:opacity-40 disabled:hover:bg-ink disabled:cursor-not-allowed"
                  data-testid="planner-next"
                >
                  {current === total - 1 ? "Review Summary" : "Continue"}
                  <ArrowRight size={16} className="ml-2" />
                </button>
                {step.optional && !canProceed && (
                  <button
                    onClick={next}
                    className="text-[12px] tracking-[0.22em] uppercase text-muted hover:text-ink"
                    data-testid="planner-skip"
                  >
                    Skip
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* -------------- SUMMARY -------------- */}
          {stage === "summary" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              data-testid="planner-summary"
            >
              <div className="flex items-center gap-3">
                <span className="divider-line" />
                <span className="eyebrow">Your Event · At a glance</span>
              </div>
              <h1 className="mt-4 h-display text-4xl sm:text-5xl text-ink">
                {`Beautiful. Here's what we've heard.`}
              </h1>
              <p className="mt-4 text-muted max-w-xl leading-relaxed">
                Review the details. Tap any row to edit before we send it to our specialist.
              </p>

              <AISuggestButton
                topic="summary"
                label="Have AI polish this into a proposal paragraph"
                context={answers as Record<string, unknown>}
              />

              <div className="mt-10 lux-card p-6 sm:p-8">
                <div className="divide-y divide-[rgba(58,45,36,0.10)]">
                  {summaryRows.map((row) => (
                    <div
                      key={row.id as string}
                      className="py-4 flex items-start gap-4 group"
                      data-testid={`summary-row-${row.id as string}`}
                    >
                      <div className="w-32 shrink-0 text-[10px] tracking-[0.24em] uppercase text-muted pt-1">
                        {row.eyebrow}
                      </div>
                      <div className="flex-1">
                           <div className="text-ink">{row.value}</div>
                      </div>
                      <button
                        onClick={() => {
                          const index = steps.findIndex((s) => s.id === row.id);
                          if (index !== -1) {
                            setCurrent(index);
                            setStage("steps");
                          }
                        }}
                        className="opacity-40 group-hover:opacity-100 text-ink hover:text-burnt transition"
                        data-testid={`edit-${row.id as string}`}
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setStage("steps");
                    setCurrent(0);
                  }}
                  className="btn-ghost"
                  data-testid="planner-back-to-steps"
                >
                  <ArrowLeft size={14} className="mr-2" /> Edit from start
                </button>
                <button
                  onClick={() => setStage("contact")}
                  className="btn-primary"
                  data-testid="planner-to-contact"
                >
                  Looks good — Submit <ArrowRight size={16} className="ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {/* -------------- CONTACT -------------- */}
          {stage === "contact" && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              data-testid="planner-contact"
            >
              <div className="flex items-center gap-3">
                <span className="divider-line" />
                <span className="eyebrow">One last thing</span>
              </div>
              <h1 className="mt-4 h-display text-4xl sm:text-5xl text-ink">
                Where should we <span className="italic text-burnt">reach you?</span>
              </h1>
              <p className="mt-4 text-muted max-w-xl leading-relaxed">
                Our specialist will call within 12 hours — no obligation. We treat every
                submission with discretion.
              </p>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                <label className="block">
                  <span className="text-[11px] tracking-[0.22em] uppercase text-muted">
                    Full name
                  </span>
                  <input
                    type="text"
                    data-testid="lead-input-name"
                    value={lead.name}
                    onChange={(e) => setLead((l) => ({ ...l, name: e.target.value }))}
                    placeholder="Your name"
                    className="mt-2 w-full px-4 py-3 rounded-2xl border border-line-strong bg-card text-ink focus:border-burnt outline-none"
                  />
                </label>

                {/* Phone with country code */}
                <label className="block">
                  <span className="text-[11px] tracking-[0.22em] uppercase text-muted">
                    Phone
                  </span>
                  <div className="mt-2 flex gap-2">
                   <div className="relative shrink-0">
                      <select
                        value={phoneCountry}
                        onChange={(e) => setPhoneCountry(e.target.value)}
                        data-testid="lead-input-phone-country"
                        className="appearance-none pl-3 pr-8 py-3 rounded-2xl border border-line-strong bg-card text-ink outline-none focus:border-burnt w-full"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.dial}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted"
                      />
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      data-testid="lead-input-phone"
                      value={lead.phone}
                      onChange={(e) =>
                        setLead((l) => ({ ...l, phone: e.target.value.replace(/[^\d\s-]/g, "") }))
                      }
                      onBlur={() => markTouched("phone")}
                      placeholder="98765 43210"
                      className={`mt-0 w-full px-4 py-3 rounded-2xl border bg-card text-ink outline-none ${
                        touched.phone && !phoneValid
                          ? "border-burnt-deep focus:border-burnt-deep"
                          : "border-line-strong focus:border-burnt"
                      }`}
                    />
                  </div>
                  {touched.phone && !phoneValid && (
                    <span className="mt-1 block text-xs text-burnt-deep">
                      Enter a valid phone number (7–12 digits).
                    </span>
                  )}
                </label>

                {/* WhatsApp with country code */}
                <label className="block">
                  <span className="text-[11px] tracking-[0.22em] uppercase text-muted">
                    WhatsApp (if different)
                  </span>
                  <div className="mt-2 flex gap-2">
                   <div className="relative shrink-0">
                    <select
                      value={whatsappCountry}
                      onChange={(e) => setWhatsappCountry(e.target.value)}
                      data-testid="lead-input-whatsapp-country"
                      className="appearance-none pl-3 pr-8 py-3 rounded-2xl border border-line-strong bg-card text-ink outline-none focus:border-burnt w-full"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.dial}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted"
                    />
</div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      data-testid="lead-input-whatsapp"
                      value={lead.whatsapp}
                      onChange={(e) =>
                        setLead((l) => ({ ...l, whatsapp: e.target.value.replace(/[^\d\s-]/g, "") }))
                      }
                      onBlur={() => markTouched("whatsapp")}
                      placeholder="Same as phone if left blank"
                      className={`mt-0 w-full px-4 py-3 rounded-2xl border bg-card text-ink outline-none ${
                        touched.whatsapp && !whatsappValid
                          ? "border-burnt-deep focus:border-burnt-deep"
                          : "border-line-strong focus:border-burnt"
                      }`}
                    />
                  </div>
                  {touched.whatsapp && !whatsappValid && (
                    <span className="mt-1 block text-xs text-burnt-deep">
                      Enter a valid WhatsApp number (7–12 digits).
                    </span>
                  )}
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-[11px] tracking-[0.22em] uppercase text-muted">
                    Email
                  </span>
                  <input
                    type="email"
                    data-testid="lead-input-email"
                    value={lead.email}
                    onChange={(e) => setLead((l) => ({ ...l, email: e.target.value }))}
                    onBlur={() => markTouched("email")}
                    placeholder="you@example.com"
                    className={`mt-2 w-full px-4 py-3 rounded-2xl border bg-card text-ink outline-none ${
                      touched.email && !emailValid
                        ? "border-burnt-deep focus:border-burnt-deep"
                        : "border-line-strong focus:border-burnt"
                    }`}
                  />
                  {touched.email && !emailValid && (
                    <span className="mt-1 block text-xs text-burnt-deep">
                      Enter a valid email address.
                    </span>
                  )}
                </label>
              </div>

              {submitError && (
                <div className="mt-4 text-sm text-burnt-deep" data-testid="submit-error">
                  {submitError}
                </div>
              )}

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setStage("summary")}
                  className="btn-ghost"
                  data-testid="planner-back-to-summary"
                >
                  <ArrowLeft size={14} className="mr-2" /> Back to summary
                </button>
                <button
                  onClick={submitLead}
                  disabled={!canSubmitLead || submitting}
                  className="btn-primary disabled:opacity-40"
                  data-testid="submit-lead"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      <Send size={16} className="mr-2" /> Submit My Plan
                    </>
                  )}
                </button>
              </div>

              <p className="mt-6 text-[11px] tracking-wide text-muted flex items-center gap-2">
                <Sparkles size={12} className="text-burnt" /> Your details are kept
                private and never shared outside the SAMBARAM team.
              </p>
            </motion.div>
          )}

          {/* -------------- SENT (transient) -------------- */}
          {stage === "sent" && (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24"
              data-testid="planner-sent"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-burnt text-cream flex items-center justify-center">
                <CheckCircle2 size={26} />
              </div>
              <h2 className="mt-6 h-display text-3xl text-ink">Sending your vision…</h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
