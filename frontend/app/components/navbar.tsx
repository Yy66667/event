"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { NAV_LINKS, BRAND } from "../lib/constants";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <nav
        data-testid="site-navbar"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#F8F4EC]/85 backdrop-blur-xl border-b border-[rgba(58,45,36,0.08)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            data-testid="navbar-brand"
            className="flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-[22px] sm:text-[26px] font-serif font-semibold tracking-[0.14em] uppercase text-ink">
              {BRAND.name}
            </span>
            <span className="hidden sm:inline text-[9px] tracking-[0.32em] uppercase text-muted pt-2">
              · est. 2014
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-9">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  data-testid={`nav-link-${link.name.toLowerCase()}`}
                  className="text-[13.5px] tracking-wide text-text hover:text-ink link-underline transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/planner"
                data-testid="nav-cta-start-planning"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-cream text-[13px] font-medium hover:bg-burnt transition"
              >
                Start Planning <ArrowUpRight size={14} />
              </Link>
            </li>
          </ul>

          <button
            data-testid="mobile-menu-toggle"
            className="md:hidden p-2 rounded-md text-ink hover:bg-black/5 transition"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#F8F4EC] md:hidden flex flex-col pt-24 px-8"
            data-testid="mobile-menu"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-[rgba(58,45,36,0.08)]"
                >
                  <Link
                    href={link.href}
                    data-testid={`mobile-nav-link-${link.name.toLowerCase()}`}
                    className="block py-5 text-[32px] font-serif font-medium text-ink"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="mt-10"
            >
              <Link
                href="/planner"
                onClick={() => setIsOpen(false)}
                data-testid="mobile-cta-start-planning"
                className="btn-primary w-full"
              >
                Start Planning <ArrowUpRight size={16} className="ml-1" />
              </Link>

              <div className="mt-8 flex flex-col gap-2 text-[13px] text-muted">
                <a href={`tel:${BRAND.phoneRaw}`} className="link-underline w-fit">
                  {BRAND.phone}
                </a>
                <a href={`mailto:${BRAND.email}`} className="link-underline w-fit">
                  {BRAND.email}
                </a>
                <a
                  href={BRAND.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline w-fit"
                >
                  @{BRAND.instagram}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
