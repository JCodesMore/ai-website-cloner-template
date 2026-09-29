export function Hero() {
  return (
    <section className="border-b border-border px-4 pt-20 pb-16 text-center sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          CSULBreach. CyberSecurity Club
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground text-balance">
          We&apos;re here for your, you&apos;re here to succeed
        </p>

        <div className="mt-10 flex justify-center">
          <a
            href="#events"
            className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
          >
            Get started
          </a>
        </div>
      </div>
    </section>
  );
}
