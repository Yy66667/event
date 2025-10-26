// components/FancyCursor.tsx

"use client";

import React, { useEffect, useState } from "react";

const FancyCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [smoothPos, setSmoothPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  useEffect(() => {
    const follow = () => {
      setSmoothPos(prev => ({
        x: prev.x + (position.x - prev.x) * 0.15,
        y: prev.y + (position.y - prev.y) * 0.15,
      }));
      requestAnimationFrame(follow);
    };
    follow();
  }, [position]);

  return (
    <>
      <style>{`body { cursor: none; }`}</style>
      <div
        style={{
          position: "fixed",
          left: smoothPos.x,
          top: smoothPos.y,
          width: 20,
          height: 20,
          borderRadius: "50%",
          backgroundColor: "rgba(255, 200, 0, 0.9)",
          pointerEvents: "none",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
        }}
      ></div>
    </>
  );
};

export default FancyCursor;
