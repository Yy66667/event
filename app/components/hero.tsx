"use client";

import React from "react";
import { Calendar, Users, Sparkles, Award, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import WeddingIllustration from './illustrations/WeddingIllustration';
import PartyIllustration from './illustrations/PartyIllustration';
import CorporateIllustration from './illustrations/CorporateIllustration';
import MorphWord from "./MorphWord";

export const Hero: React.FC = () => {
  const COLORS = {
    burnt: "#C04A24",
    accent: "#E67E22",
    gold: "#D4A44E",
    cream: "#F8F4EC",
    card: "#FBF9F4",
    text: "#3B3228",
    muted: "#6A625A",
  };

  const services = [
    { icon: Calendar, title: 'Wedding Vibes', description: 'Your dream wedding, but make it aesthetic. We handle everything so you can just vibe.', illustration: WeddingIllustration },
    { icon: Users, title: 'Corporate Events', description: 'Level up your company events. Professional meets lit. No cap.', illustration: CorporateIllustration },
    { icon: Sparkles, title: 'Party Mode', description: 'Birthdays, anniversaries, or just because. We bring the energy, you bring the crew.', illustration: PartyIllustration },
    { icon: Award, title: 'Award Shows', description: 'Red carpet ready events that hit different. Elegant but edgy.', illustration: WeddingIllustration },
  ];

  const features = [
    { icon: Zap, title: 'Fast & Flawless', description: 'No delays, no drama. Just smooth vibes from start to finish.' },
    { icon: TrendingUp, title: 'Always On', description: 'Hit us up anytime. We got you 24/7, fr fr.' },
    { icon: Users, title: 'Squad Goals', description: 'Our team is stacked with pros who actually get it.' },
  ];

  return (
    <>
      <section className="relative w-full min-h-screen flex items-center bg-white" aria-label="SAMBARAM Hero — Premium South Indian Events">
        <div className="absolute inset-0 overflow-hidden">
          <video className="hidden sm:block absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline poster="/images/hero-poster.jpg" aria-hidden>
            <source src="/videos/hero.webm" type="video/webm" />
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
          <Image src="/images/hero-poster.jpg" alt="Hero Poster" width={1200} height={600} className="object-cover w-full h-48" />
        </div>

        <div className="absolute inset-0" style={{ background: "linear-linear(180deg, rgba(245,233,211,0.55) 0%, rgba(244,236,227,0.65) 40%, rgba(12,10,9,0.28) 100%)", mixBlendMode: "multiply" }} />

        <svg className="pointer-events-none hidden lg:block absolute right-8 top-12 w-80 -translate-y-4 opacity-10" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <g fill="none" stroke="#C8A34E" strokeWidth="1.2">
            <path d="M10 100 C 40 10, 160 10, 190 100" />
            <path d="M10 120 C 60 220, 140 220, 190 120" />
            <path d="M30 80 C 70 10, 130 10, 170 80" />
          </g>
        </svg>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
                <p className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-[#D45525]">
                  <span className="px-2 py-1 rounded-md bg-[#F5E9D3]/60 backdrop-blur-sm">SAMBARAM</span>
                </p>

                <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl leading-tight font-extrabold text-[#0F0F0F]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <span className="block">We <MorphWord /> unforgettable</span>
                  <span className="block text-[#3A2F28]">South-Indian celebrations</span>
                </h1>

                <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.6 }} className="mt-4 max-w-xl text-lg text-[#3A2F28]/90">
                  Bespoke weddings, cultural festivals, and premium events — designed with Telugu elegance and modern craftsmanship.
                </motion.p>

                <motion.div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.6 }}>
                  <Link href="/contact" className="inline-flex items-center justify-center rounded-md px-6 py-3 bg-[#D45525] text-white font-semibold shadow-md hover:bg-[#b6441f] focus:outline-none focus:ring-4 focus:ring-[#D45525]/30 transition transform hover:-translate-y-0.5">Plan My Event</Link>
                  <Link href="/portfolio" className="inline-flex items-center justify-center rounded-md px-6 py-3 border border-[#C8A34E]/40 bg-white/70 backdrop-blur-sm font-medium text-[#0F0F0F] hover:bg-white">View Our Work</Link>
                </motion.div>

                <div className="mt-6 flex items-center gap-4 text-sm text-[#3B3228]/80">
                  <span>Trusted by families & corporates</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">Established experiences across Telugu states</span>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5 hidden lg:flex items-center justify-center">
              <div className="w-full max-w-xs grid grid-cols-1 gap-4">
                <div className="rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition">
                  <Image src="/images/thumb-1.jpg" alt="Hero Poster" width={1200} height={600} className="object-cover w-full h-48" />
                </div>
                <div className="rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition">
                  <Image src="/images/thumb-2.jpg" alt="Festival sample" width={500} height={300} className="w-full h-48 object-cover" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute left-0 right-0 bottom-0 h-36 pointer-events-none" style={{ background: "linear-linear(180deg, rgba(12,10,9,0) 0%, rgba(12,10,9,0.12) 60%, rgba(12,10,9,0.22) 100%)" }} />
      </section>

      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8" style={{ background: COLORS.cream }} aria-labelledby="what-we-do-title">
        <svg className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 opacity-6 w-[680px] -z-10" aria-hidden viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="motifGrad" x1="0" x2="1">
              <stop offset="0" stopColor={COLORS.burnt} stopOpacity="0.06" />
              <stop offset="1" stopColor={COLORS.gold} stopOpacity="0.04" />
            </linearGradient>
          </defs>
          <path d="M20 120 C120 10, 270 10, 380 120 C520 260, 680 60, 780 120" stroke="url(#motifGrad)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, ease: "easeOut" }}>
            <h2 id="what-we-do-title" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 tracking-tight" style={{ color: COLORS.text, fontFamily: "'Playfair Display', serif" }}>What We Do</h2>
            <div className="w-20 h-1 mx-auto rounded-full mb-4 sm:mb-6" style={{ background: COLORS.burnt }} />
            <p className="text-lg sm:text-xl max-w-2xl mx-auto" style={{ color: COLORS.muted }}>
              Pick your vibe. We make it legendary — weddings, cultural celebrations, or corporate gatherings, every moment crafted with elegance, Telugu tradition and modern precision.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-12">
            {services.map((service, index) => {
              const Icon = service.icon;
              const Illustration = service.illustration;
              return (
                <motion.article key={index} className="group relative rounded-3xl overflow-hidden" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: index * 0.06 }} whileHover={{ scale: 1.03 }} style={{ background: COLORS.card, border: `1px solid rgba(58, 45, 36, 0.06)`, boxShadow: "0 10px 30px rgba(125,82,46,0.06)" }} aria-labelledby={`service-${index}-title`} tabIndex={0}>
                  <div className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-30" style={{ background: "linear-gradient(120deg, rgba(212,164,78,0.06) 0%, rgba(192,74,36,0.04) 40%, rgba(224,110,62,0.02) 100%)", mixBlendMode: "screen" }} />
                  <div className="relative z-10 p-6 sm:p-8">
                    {Illustration && <div className="w-full h-36 mb-5 sm:mb-6 rounded-2xl overflow-hidden bg-white/20 p-3 flex items-center justify-center"><Illustration /></div>}
                    <div className="flex items-center justify-center mb-4">
                      <div className="rounded-2xl flex items-center justify-center" style={{ width: 56, height: 56, background: `linear-gradient(135deg, ${COLORS.burnt}, ${COLORS.accent})`, boxShadow: "0 8px 24px rgba(192,74,36,0.14)" }}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <h3 id={`service-${index}-title`} className="text-xl sm:text-2xl font-semibold text-center mb-2" style={{ color: COLORS.text }}>{service.title}</h3>
                    <p className="text-sm sm:text-base text-center leading-relaxed" style={{ color: COLORS.muted }}>{service.description}</p>
                    <div className="mt-5 flex justify-center">
                      <span className="inline-block h-[3px] rounded-full transition-all duration-300" style={{ width: 36, background: COLORS.burnt, opacity: 0.95 }} />
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

     <section style={{ background: COLORS.cream }} className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-20">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold" style={{ color: COLORS.burnt }}>
            {`Why We're Built Different`}
          </h2>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto mt-4" style={{ color: "#6A625A" }}>
            {`Real talk: we’re better at this — thoughtfully designed for celebrations that matter.`}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                className="group relative rounded-3xl overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                whileHover={{ scale: 1.025 }}
                style={{
                  background: COLORS.card,
                  border: `1px solid rgba(58, 45, 36, 0.06)`,
                  boxShadow: "0 6px 18px rgba(125,82,46,0.06)",
                }}
              >
               
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{
                    background:
                      "linear-gradient(120deg, rgba(212,164,78,0.06) 0%, rgba(230,126,34,0.04) 40%, rgba(194,97,44,0.03) 100%)",
                    mixBlendMode: "screen",
                  }}
                />

                <div className="relative z-10 p-8 sm:p-10">
                  <div
                    className="mx-auto mb-6 sm:mb-8 flex items-center justify-center rounded-2xl"
                    style={{
                      width: 80,
                      height: 80,
                      background: `linear-gradient(135deg, ${COLORS.burnt}, ${COLORS.accent})`,
                      boxShadow: `0 8px 30px rgba(194,97,44,0.18)`,
                    }}
                  >
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-semibold text-center" style={{ color: COLORS.text }}>
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm sm:text-base text-center leading-relaxed" style={{ color: "#6A625A" }}>
                    {feature.description}
                  </p>

                  {/* subtle CTA underline (burnt) */}
                  <div className="mt-6 flex justify-center">
                    <span
                      className="inline-block h-0-5 rounded-full transition-all duration-300"
                      style={{
                        width: 36,
                        background: COLORS.burnt,
                        opacity: 0.9,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
    </>
  );
};

export default Hero;
