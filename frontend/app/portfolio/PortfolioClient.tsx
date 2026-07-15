"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { EVENT_CATEGORIES, API_BASE } from "../lib/constants";
import { Project, ProjectTile } from "../components/PortfolioPreview";

const ALL_CHIPS = ["All", ...EVENT_CATEGORIES] as const;

export default function PortfolioClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get("category") || "All";

  const [projects, setProjects] = useState<Project[]>([]);
  const [category, setCategory] = useState<string>(initialCategory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/portfolio`)
      .then((r) => r.json())
      .then((d: Project[]) => setProjects(d))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (category === "All") return projects;
    return projects.filter((p) => p.category === category);
  }, [projects, category]);

  return (
    <>
      <section className="relative pt-36 sm:pt-44 pb-16 bg-cream-warm/40 overflow-hidden">
        <div className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-burnt/10 blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative">
          <div className="flex items-center gap-3">
            <span className="divider-line" />
            <span className="eyebrow">Portfolio</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-4 h-display text-5xl sm:text-6xl lg:text-7xl text-ink max-w-4xl"
          >
            Every event, a
            <br />
            <span className="italic text-burnt">story we've kept.</span>
          </motion.h1>
          <p className="mt-6 max-w-xl text-muted leading-relaxed">
            Handpicked chapters from our studio. Filter by occasion to see how we
            think — from Kakatiya-inspired weddings to founder summits.
          </p>

          <div className="mt-10 flex flex-wrap gap-2" data-testid="portfolio-filters">
            {ALL_CHIPS.map((c) => (
              <button
                key={c}
                data-testid={`portfolio-chip-${c.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setCategory(c)}
                className={`chip ${category === c ? "active" : ""}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="aspect-[4/5] rounded-3xl bg-card animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="font-serif text-2xl text-ink">No projects in this category yet.</div>
              <p className="mt-3 text-muted">Try another filter — new work is added regularly.</p>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              data-testid="portfolio-grid"
            >
              {filtered.map((p, i) => (
                <ProjectTile key={p.slug} project={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
