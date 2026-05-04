"use client";

import { ScrollReveal, StaggerReveal, StaggerChild } from "./ScrollReveal";

export function IntroSection() {
  return (
    <section className="relative bg-deep py-24 md:py-40 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <ScrollReveal>
          <p className="text-teal-light text-xs font-body tracking-[0.4em] uppercase mb-6">The World&apos;s Aquarium</p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="text-display text-warm-white text-4xl md:text-6xl tracking-wide mb-10">What Makes the Sea of Cortez Special?</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-warm-white/70 text-lg md:text-xl leading-relaxed font-body">
            The Sea of Cortez — also called the Gulf of California — is the body of water separating the Baja California peninsula from mainland Mexico, and it is one of the most biodiverse marine environments on Earth. Recognized as a UNESCO World Heritage Site in 2005, the Gulf contains 39% of the world&apos;s marine mammal species and approximately one-third of all cetacean species (Source: UNESCO World Heritage Centre). Jacques Cousteau famously called it &quot;the world&apos;s aquarium&quot; after documenting its extraordinary density of orcas, humpback whales, blue whales, whale sharks, mobula rays, sea lions, and over 800 species of fish. Bajablue Tours operates from La Ventana, a quiet Baja California Sur village 45 minutes south of La Paz, where the Cerralvo Channel funnels migrating marine wildlife within a 90-minute boat ride of shore.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <p className="text-warm-white/40 text-base md:text-lg leading-relaxed font-body mt-6">
            From La Ventana, a quiet fishing village on the coast of Baja California Sur, we run small-group expeditions into these legendary waters. Tours head to the productive waters around Cerralvo Island, the southernmost island in the Sea of Cortez. Small groups. Experienced guides. Encounters that change how you see the ocean.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <div className="dashed-divider w-32 mx-auto mt-14 mb-14" />
        </ScrollReveal>

        <StaggerReveal className="grid grid-cols-3 gap-8 max-w-md mx-auto" staggerDelay={0.15}>
          <StaggerChild>
            <span className="text-display text-teal-light text-4xl md:text-5xl">3</span>
            <p className="text-warm-white/30 text-xs font-body mt-2 tracking-[0.3em] uppercase">Expedition tiers</p>
          </StaggerChild>
          <StaggerChild>
            <span className="text-display text-teal-light text-4xl md:text-5xl">6</span>
            <p className="text-warm-white/30 text-xs font-body mt-2 tracking-[0.3em] uppercase">Max group size</p>
          </StaggerChild>
          <StaggerChild>
            <span className="text-display text-teal-light text-4xl md:text-5xl">12+</span>
            <p className="text-warm-white/30 text-xs font-body mt-2 tracking-[0.3em] uppercase">Species encountered</p>
          </StaggerChild>
        </StaggerReveal>
      </div>
    </section>
  );
}
