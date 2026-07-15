"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { API_BASE } from "../lib/constants";

type Props = {
  topic: "theme" | "budget" | "timeline" | "decor" | "services" | "summary";
  label: string;
  context: Record<string, unknown>;
  onApply?: (text: string) => void;
};

export default function AISuggestButton({ topic, label, context, onApply }: Props) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async () => {
    setOpen(true);
    setLoading(true);
    setError(null);
    setText("");
    try {
      const res = await fetch(`${API_BASE}/api/ai/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, context }),
      });
      if (!res.ok || !res.body) throw new Error("AI unavailable");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop() || "";
        for (const p of parts) {
          const line = p.trim().replace(/^data:\s*/, "");
          if (!line) continue;
          try {
            const json = JSON.parse(line);
            if (json.delta) setText((t) => t + json.delta);
            if (json.error) setError(json.error);
          } catch {
            // skip
          }
        }
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [topic, context]);

  return (
    <div className="mt-6" data-testid={`ai-block-${topic}`}>
      <button
        onClick={request}
        disabled={loading}
        data-testid={`ai-button-${topic}`}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-br from-burnt/10 to-gold/15 border border-line-strong text-ink text-sm hover:from-burnt hover:to-burnt hover:text-cream hover:border-burnt transition"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
        {label}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-4 overflow-hidden"
          >
            <div className="lux-card p-5 sm:p-6 bg-white/60 border-burnt/20">
              <div className="flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-burnt mb-3">
                <Wand2 size={12} /> SAMBARAM AI Concierge
              </div>
              <div
                className="text-text leading-relaxed whitespace-pre-wrap min-h-[3rem]"
                data-testid={`ai-response-${topic}`}
              >
                {text || (loading ? "Thinking…" : error ? `Sorry — ${error}` : "")}
              </div>
              {onApply && text && !loading && (
                <button
                  onClick={() => onApply(text)}
                  className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ink text-cream text-xs hover:bg-burnt transition"
                  data-testid={`ai-apply-${topic}`}
                >
                  Use this suggestion
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
