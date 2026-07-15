"use client";

import Link from "next/link";
import { MessageCircle, Phone, Sparkles } from "lucide-react";
import { BRAND } from "../lib/constants";
import { usePathname } from "next/navigation";

export default function MobileCTABar() {
  const pathname = usePathname();
  if (pathname?.startsWith("/planner")) return null;
  if (pathname?.startsWith("/thank-you")) return null;

  return (
    <div
      data-testid="mobile-cta-bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-ink/95 backdrop-blur-lg border-t border-cream/10 safe-bottom"
    >
      <div className="flex items-stretch">
        <a
          href={`tel:${BRAND.phoneRaw}`}
          data-testid="mobile-cta-call"
          className="flex-1 flex flex-col items-center justify-center py-3 text-cream/80 hover:text-cream border-r border-cream/10"
        >
          <Phone size={16} />
          <span className="mt-1 text-[10px] tracking-[0.2em] uppercase">Call</span>
        </a>
        <a
          href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="mobile-cta-whatsapp"
          className="flex-1 flex flex-col items-center justify-center py-3 text-cream/80 hover:text-cream border-r border-cream/10"
        >
          <MessageCircle size={16} />
          <span className="mt-1 text-[10px] tracking-[0.2em] uppercase">WhatsApp</span>
        </a>
        <Link
          href="/planner"
          data-testid="mobile-cta-plan"
          className="flex-[1.4] flex items-center justify-center gap-2 py-3 bg-burnt text-cream font-medium text-[13px]"
        >
          <Sparkles size={14} /> Start Planning
        </Link>
      </div>
    </div>
  );
}
