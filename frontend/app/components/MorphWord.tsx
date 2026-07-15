"use client";

import { useEffect, useState } from "react";

const DEFAULT_WORDS = ["design", "craft", "shape", "produce", "plan"];

export default function MorphWord({
  words = DEFAULT_WORDS,
}: {
  words?: string[];
}) {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFade(true), 2100);
    const s = setTimeout(() => {
      setIdx((i) => (i + 1) % words.length);
      setFade(false);
    }, 2500);
    return () => {
      clearTimeout(t);
      clearTimeout(s);
    };
  }, [idx, words.length]);

  const word = words[idx];

  return (
    <span
      className={`inline-block italic text-burnt transition-opacity duration-500 ${
        fade ? "opacity-0" : "opacity-100"
      }`}
      style={{ fontFeatureSettings: '"dlig", "liga"' }}
      data-testid="morph-word"
    >
      {word}
    </span>
  );
}
