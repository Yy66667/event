import Link from "next/link";
import { Instagram, Mail, Phone, MessageCircle } from "lucide-react";
import { BRAND, NAV_LINKS, EVENT_CATEGORIES } from "../lib/constants";

export default function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="relative bg-ink text-cream/90 pt-20 pb-10 px-6 sm:px-10 overflow-hidden"
    >
      <div className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-burnt/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-gold/10 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
        <div className="md:col-span-5">
          <div className="text-3xl font-serif font-semibold tracking-[0.14em] uppercase text-cream">
            {BRAND.name}
          </div>
          <p className="mt-1 text-[11px] tracking-[0.28em] uppercase text-gold">
            {BRAND.tagline}
          </p>

          <p className="mt-6 text-cream/70 max-w-md leading-relaxed">
            We plan heirloom weddings, milestone celebrations and cultural gatherings
            with a modern studio approach — honouring South-Indian tradition through
            elegant, considered design.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-whatsapp"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cream/15 hover:border-cream/40 hover:bg-cream/5 transition text-sm"
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
            <a
              href={`tel:${BRAND.phoneRaw}`}
              data-testid="footer-call"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cream/15 hover:border-cream/40 hover:bg-cream/5 transition text-sm"
            >
              <Phone size={14} /> Call
            </a>
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-instagram"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cream/15 hover:border-cream/40 hover:bg-cream/5 transition text-sm"
            >
              <Instagram size={14} /> Instagram
            </a>
            <a
              href={`mailto:${BRAND.email}`}
              data-testid="footer-email"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cream/15 hover:border-cream/40 hover:bg-cream/5 transition text-sm"
            >
              <Mail size={14} /> Email
            </a>
          </div>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-[11px] tracking-[0.28em] uppercase text-gold">Explore</h4>
          <ul className="mt-5 space-y-3">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-cream/80 hover:text-cream link-underline">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <h4 className="text-[11px] tracking-[0.28em] uppercase text-gold">We Plan</h4>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
            {EVENT_CATEGORIES.map((c) => (
              <li key={c}>
                <Link
                  href={`/portfolio?category=${encodeURIComponent(c)}`}
                  className="text-cream/80 hover:text-cream link-underline"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto mt-16 pt-8 border-t border-cream/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[12px] text-cream/60">
        <div>© {new Date().getFullYear()} SAMBARAM Event Studio — All rights reserved</div>
        <div>{BRAND.cities}</div>
      </div>
    </footer>
  );
}
