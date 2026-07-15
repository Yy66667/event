"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { API_BASE } from "../lib/constants";

export type Project = {
  slug: string;
  title: string;
  category: string;
  venue: string;
  city: string;
  theme: string;
  guests: number;
  duration: string;
  story: string;
  highlights: string[];
  images: string[];
  accent: string;
  featured?: boolean;
};

export function ProjectTile({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      data-testid={`portfolio-tile-${project.slug}`}
    >
      <Link href={`/portfolio/${project.slug}`} className="group block">
        <div
          className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br"
          style={{
            background: `linear-gradient(135deg, ${project.accent}, ${project.accent}66 60%, #171310)`,
          }}
        >
          <div className="absolute inset-0 grain" />
          {/* Placeholder illustration */}
          <svg
            className="absolute inset-0 w-full h-full opacity-40 mix-blend-soft-light"
            viewBox="0 0 400 500"
            aria-hidden
          >
            <defs>
              <linearGradient id={`g-${project.slug}`} x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#F8F4EC" stopOpacity="0.7" />
                <stop offset="1" stopColor="#F8F4EC" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 320 C 100 260 300 400 400 320 L 400 500 L 0 500 Z"
              fill={`url(#g-${project.slug})`}
            />
            <circle cx="200" cy="180" r="70" fill="#F8F4EC" fillOpacity="0.15" />
            <circle cx="200" cy="180" r="46" fill="#F8F4EC" fillOpacity="0.2" />
          </svg>

          {/* Category */}
          <div className="absolute top-5 left-5 flex items-center gap-2 text-cream/90 text-[10px] tracking-[0.28em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cream/80" /> {project.category}
          </div>

          {/* Bottom meta */}
          <div className="absolute inset-x-5 bottom-5 text-cream">
            <div className="font-serif text-2xl sm:text-3xl leading-tight">{project.title}</div>
            <div className="mt-2 flex items-center justify-between text-[11px] tracking-[0.22em] uppercase text-cream/85">
              <span>{project.city}</span>
              <span>{project.guests} guests</span>
            </div>
          </div>

          {/* Hover cta */}
          <div className="absolute top-5 right-5 w-11 h-11 rounded-full bg-cream text-ink flex items-center justify-center opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition duration-500">
            <ArrowUpRight size={16} />
          </div>
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-4">
          <div>
            <div className="text-[11px] tracking-[0.24em] uppercase text-muted">{project.theme}</div>
            <div className="mt-1 text-ink font-medium">{project.venue}</div>
          </div>
          <div className="text-[11px] tracking-[0.24em] uppercase text-burnt">
            Case 0{index + 1}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function PortfolioPreview() {
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    fetch(`${API_BASE}/api/portfolio`)
      .then((r) => r.json())
      .then((d: Project[]) => setProjects(d.filter((p) => p.featured).slice(0, 3)))
      .catch(() => setProjects([]));
  }, []);

  return (
    <section
      id="portfolio-preview"
      data-testid="portfolio-preview"
      className="relative section bg-cream-warm/40"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3">
              <span className="divider-line" />
              <span className="eyebrow">Selected Work</span>
            </div>
            <h2 className="mt-4 h-display text-4xl sm:text-5xl lg:text-6xl text-ink max-w-2xl">
              Chapters we've been
              <br />
              <span className="italic text-burnt">honoured to design.</span>
            </h2>
          </div>

          <Link
            href="/portfolio"
            data-testid="portfolio-preview-view-all"
            className="btn-ghost self-start"
          >
            View All Work <ArrowUpRight size={14} className="ml-2" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="aspect-[4/5] rounded-3xl bg-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {projects.map((p, i) => (
              <ProjectTile key={p.slug} project={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
