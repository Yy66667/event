import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-cream pt-32 pb-24 px-6 text-center">
      <div className="eyebrow">404 · Page not found</div>
      <h1 className="mt-4 h-display text-5xl sm:text-7xl text-ink">
        The path you followed <br />
        <span className="italic text-burnt">has wandered off.</span>
      </h1>
      <p className="mt-6 text-muted max-w-md">
        Let's bring you back to something beautiful.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-primary">Back home</Link>
        <Link href="/portfolio" className="btn-ghost">Browse work</Link>
      </div>
    </section>
  );
}
