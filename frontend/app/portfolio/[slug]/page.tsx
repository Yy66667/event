import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Users, Palette, Calendar, ArrowUpRight, CheckCircle2 } from "lucide-react";

type Project = {
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
};

const API = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.REACT_APP_BACKEND_URL || "";

async function getProject(slug: string): Promise<Project | null> {
  try {
    const res = await fetch(`${API}/api/portfolio/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as Project;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) return { title: "Project · SAMBARAM" };
  return {
    title: `${p.title} · ${p.category}`,
    description: p.story,
    openGraph: { title: p.title, description: p.story },
  };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <>
      <section
        className="relative pt-32 sm:pt-40 pb-20 overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${project.accent} 0%, ${project.accent}CC 55%, #171310 100%)`,
        }}
        data-testid="project-hero"
      >
        <div className="absolute inset-0 grain opacity-30" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 text-cream">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-cream/80 hover:text-cream text-sm"
          >
            <ArrowLeft size={14} /> All Work
          </Link>

          <div className="mt-8 flex items-center gap-3">
            <span className="inline-block h-px w-14 bg-cream/60" />
            <span className="text-[11px] tracking-[0.28em] uppercase text-cream/80">
              {project.category}
            </span>
          </div>
          <h1 className="mt-4 h-display text-4xl sm:text-6xl lg:text-7xl leading-[1.03] max-w-4xl">
            {project.title}
          </h1>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
            {[
              { icon: MapPin, label: "Venue", value: `${project.venue}` },
              { icon: Users, label: "Guests", value: `${project.guests}` },
              { icon: Palette, label: "Theme", value: project.theme },
              { icon: Calendar, label: "Duration", value: project.duration },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label}>
                  <div className="flex items-center gap-2 text-cream/70 text-[10px] tracking-[0.24em] uppercase">
                    <Icon size={12} /> {m.label}
                  </div>
                  <div className="mt-2 font-serif text-lg leading-snug">{m.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-7">
            <div className="flex items-center gap-3">
              <span className="divider-line" />
              <span className="eyebrow">The Story</span>
            </div>
            <p className="mt-6 font-serif text-2xl sm:text-3xl leading-[1.4] text-ink">
              {project.story}
            </p>
          </div>
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="divider-line" />
              <span className="eyebrow">Highlights</span>
            </div>
            <ul className="mt-6 space-y-4">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-text">
                  <CheckCircle2 size={18} className="mt-1 text-burnt flex-shrink-0" />
                  <span className="leading-relaxed">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section bg-cream-warm/40">
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <div className="flex items-center gap-3">
            <span className="divider-line" />
            <span className="eyebrow">Gallery</span>
          </div>
          <h2 className="mt-4 h-display text-3xl sm:text-4xl text-ink">
            Moments from the day.
          </h2>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`relative rounded-2xl overflow-hidden ${
                  i === 0 || i === 4 ? "aspect-[3/4]" : "aspect-square"
                }`}
                style={{
                  background: `linear-gradient(${45 + i * 30}deg, ${project.accent}, ${project.accent}88 60%, #2A231E)`,
                }}
              >
                <div className="absolute inset-0 grain opacity-30" />
                <div className="absolute bottom-3 left-3 right-3 text-cream/85 text-[10px] tracking-[0.22em] uppercase flex justify-between">
                  <span>Frame</span>
                  <span>0{i + 1}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-muted italic">
            Gallery images are being prepared. Reach out to view the full film & photo album.
          </p>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 text-center">
          <div className="inline-flex items-center gap-3">
            <span className="divider-line" />
            <span className="eyebrow">Your Turn</span>
            <span className="divider-line" />
          </div>
          <h2 className="mt-4 h-display text-4xl sm:text-5xl text-ink">
            Ready for your own <span className="italic text-burnt">chapter?</span>
          </h2>
          <p className="mt-6 text-muted max-w-2xl mx-auto leading-relaxed">
            Whether you're planning a heritage wedding, a milestone birthday, or an
            intimate gathering — we'd love to hear your vision.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/planner" className="btn-primary">
              Start Planning <ArrowUpRight size={16} className="ml-2" />
            </Link>
            <Link href="/contact" className="btn-ghost">
              Book a Consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
