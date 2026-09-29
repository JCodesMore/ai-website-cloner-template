export function BottomCta() {
  return (
    <section className="border-b border-border px-4 py-24 text-center sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          Come to a meeting this week
        </h2>
        <div className="mt-8 flex justify-center">
          <a
            href="#events"
            className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
          >
            See upcoming events
          </a>
        </div>
      </div>
    </section>
  );
}
