import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureRailProps {
  id: string;
  eyebrow: string;
  heading: string;
  body: string;
  link?: { label: string; href: string };
  visual: ReactNode;
  reverse?: boolean;
}

export function FeatureRail({
  id,
  eyebrow,
  heading,
  body,
  link,
  visual,
  reverse,
}: FeatureRailProps) {
  return (
    <section
      id={id}
      className="scroll-mt-16 border-b border-border px-4 py-20 sm:px-6 lg:px-8"
    >
      <div
        className={cn(
          "mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2",
          reverse && "lg:[&>*:first-child]:order-2"
        )}
      >
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-4 max-w-md text-base text-muted-foreground">
            {body}
          </p>
          {link && (
            <a
              href={link.href}
              className="mt-6 inline-block text-sm font-medium underline underline-offset-4 hover:no-underline"
            >
              {link.label} &rarr;
            </a>
          )}
        </div>
        <div className="flex items-center justify-center">{visual}</div>
      </div>
    </section>
  );
}
