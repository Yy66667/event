"use client";

import { useEffect, useState } from "react";

type Props = {
  words?: string[];
  interval?: number;       // total time per word (including animation)
  className?: string;
};

const defaultWords = ["craft", "design", "create", "plan", "make"];

const MorphWord = ({ words = defaultWords,  className = "" }: Props) => {
  const [index, setIndex] = useState(0);
  const [lettersVisible, setLettersVisible] = useState(0);
  const [wordFade, setWordFade] = useState(false);

  useEffect(() => {
    const currentWord = words[index];
    const letterInterval = 150;

    currentWord.split("").forEach((_, i) => {
      setTimeout(() => {
        setLettersVisible((prev) => prev + 1);
      }, i * letterInterval);
    });

    // Fade out word before switching
    const fadeOutTime = currentWord.length * letterInterval + 800; // wait until word completes
    const fadeTimeout = setTimeout(() => setWordFade(true), fadeOutTime);

    // Switch word
    const totalTime = fadeOutTime + 400; // extra time for fade-out before next
    const switchTimeout = setTimeout(
      () => setIndex((prev) => (prev + 1) % words.length),
      totalTime
    );

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(switchTimeout);
      setLettersVisible(0);
      setWordFade(false);
    };
  }, [index, words]);

  const word = words[index];
  const visibleText = word.slice(0, lettersVisible);

  return (
    <span
      className={`inline-flex bg-amber-100 w-41 items-center  font-serif transition-opacity duration-500 
        ${wordFade ? "opacity-0" : "opacity-100"} ${className}`}
    >
      {visibleText.split("").map((letter, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            opacity: 0,
            transform: "translateY(6px)",
            animation: `fadeUp 0.4s forwards`,
            animationDelay: `${i * 0.12}s`, // <-- adjust this delay for stagger speed
          }}
        >
          {letter}
        </span>
      ))}

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </span>
  );
};

export default MorphWord;
