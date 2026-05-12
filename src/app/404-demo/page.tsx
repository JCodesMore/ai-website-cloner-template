import Link from "next/link";

export const metadata = { title: "404 — Page Not Found" };

export default function FourOhFourDemoPage() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center pt-32 pb-16 text-center"
      style={{ backgroundImage: "url(/img/bg/bg-06.jpg)" }}
    >
      <div aria-hidden className="absolute inset-0 bg-secondary/85" />
      <div className="relative z-10 yo-container text-white">
        <div className="text-[140px] md:text-[200px] lg:text-[260px] font-extrabold leading-none tracking-tighter">
          <span className="text-primary">4</span>0
          <span className="text-primary">4</span>
        </div>
        <h2 className="yo-headline-split text-[28px] md:text-[40px] leading-none mt-4 mb-6">
          Page <span className="light">not found</span>
        </h2>
        <p className="text-white/80 max-w-md mx-auto mb-10">
          The page you&apos;re looking for has moved or never existed. Let&apos;s get you back on track.
        </p>
        <Link href="/" className="yo-btn yo-btn-primary">
          Back to home
        </Link>
      </div>
    </section>
  );
}
