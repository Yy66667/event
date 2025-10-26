"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Events", href: "/events" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/60 backdrop-blur-xl border-b border-white/30 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="text-[28px] font-bold tracking-[1.5px] uppercase text-[#0F0F0F]"
        >
          Sambaram
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="relative font-medium text-[#2A2A2A] hover:text-black transition"
              >
                {link.name}
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-black rounded-full transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Burger Menu */}
        <button
          className="md:hidden p-2 rounded-md text-[#111] hover:bg-black/5 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 right-0 h-full w-[75%] bg-white/80 backdrop-blur-xl border-l border-white/30 shadow-xl md:hidden z-40 flex flex-col"
          >
            <div className="flex justify-end p-6">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-black/5 rounded-full transition"
              >
                <X size={28} />
              </button>
            </div>

            <ul className="flex flex-col gap-6 px-8 mt-6">
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Link
                    href={link.href}
                    className="text-[20px] font-medium text-[#111] tracking-wide"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
export default Navbar;