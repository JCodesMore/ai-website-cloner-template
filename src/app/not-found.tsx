import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-deep flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-display text-warm-white text-[clamp(4rem,15vw,12rem)] leading-none tracking-tight">
        404
      </h1>
      <p className="text-warm-white/50 text-lg font-body mt-4 mb-8">
        This page drifted out to sea.
      </p>
      <Link
        href="/"
        className="bg-coral hover:bg-coral-light text-deep px-8 py-3 font-body text-xs tracking-[0.2em] uppercase transition-colors duration-300"
      >
        Back to Shore →
      </Link>
    </div>
  );
}
