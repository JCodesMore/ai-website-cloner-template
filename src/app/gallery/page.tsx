"use client";

import { motion } from "framer-motion";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ImageGallerySchema, LocalBusinessRefSchema, BreadcrumbSchema } from "@/components/SchemaMarkup";
import { AdaptiveVideo } from "@/components/AdaptiveVideo";
import {
  ContainerScroll,
  ContainerSticky,
  GalleryContainer,
  GalleryCol,
} from "@/components/blocks/animated-gallery";
import { GalleryMobile } from "@/components/mobile/GalleryMobile";

const galleryItems = [
  { src: "/images/extracted/four-sperm-whales-formation.jpg", alt: "Four sperm whales (cachalotes) swimming in formation in the Sea of Cortez near La Ventana" },
  { src: "/images/extracted/two-whales-surfacing.jpg", alt: "Two humpback whales surfacing near a Bajablue Tours expedition boat in the Sea of Cortez" },
  { src: "/images/extracted/boat-surrounded-orcas.jpg", alt: "Bajablue expedition boat surrounded by an orca pod in the Sea of Cortez" },
  { src: "/images/extracted/sperm-whales-close.jpg", alt: "Sperm whales crossing the Sea of Cortez near La Ventana" },
  { src: "/images/extracted/humpback-boat-tourists.jpg", alt: "Humpback whale alongside a Bajablue boat with guests watching" },
  { src: "/images/extracted/orca-pod-cluster.jpg", alt: "Orca pod cluster swimming together in the Sea of Cortez near Cerralvo Island" },
  { src: "/images/extracted/boat-orca-breach.jpg", alt: "Bajablue Tours boat with an orca breaching nearby in the Sea of Cortez" },
  { src: "/images/extracted/orca-pair-aerial.jpg", alt: "Aerial view of two orcas swimming side by side in the Sea of Cortez" },
  { src: "/images/extracted/orcas-surfacing-captain.jpg", alt: "Crew view from the Bajablue boat with orcas surfacing nearby" },
  { src: "/images/extracted/sperm-whales-aerial.jpg", alt: "Aerial drone view of sperm whales during a Master Seafari expedition" },
  { src: "/images/extracted/whale-surface-mountains.jpg", alt: "Whale surfacing near a Bajablue boat with the Baja California Sur mountains in the background" },
  { src: "/images/extracted/humpback-tail.jpg", alt: "Humpback whale tail rising above the surface of the Sea of Cortez" },
  { src: "/images/extracted/open-horizon.jpg", alt: "Open water view of the Sea of Cortez near La Ventana" },
  { src: "/images/extracted/orca-pod-aerial.jpg", alt: "Aerial drone view of an orca pod swimming through the Sea of Cortez near La Ventana, BCS" },
  { src: "/images/extracted/cachalotes-water-texture.jpg", alt: "Textured surface of the Sea of Cortez near a sperm whale pod" },
  { src: "/images/extracted/boat-aerial-wide.jpg", alt: "Aerial wide shot of a Bajablue boat heading out toward Cerralvo Island in the Sea of Cortez" },
];

// Split into 3 columns — all 16 images, no clipping because column translates fully through viewport
const col1 = galleryItems.filter((_, i) => i % 3 === 0); // 6 items
const col2 = galleryItems.filter((_, i) => i % 3 === 1); // 5 items
const col3 = galleryItems.filter((_, i) => i % 3 === 2); // 5 items

export default function GalleryPage() {
  return (
    <SmoothScroll>
      <LocalBusinessRefSchema />
      <ImageGallerySchema images={galleryItems.map(i => ({ ...i, category: "Gallery", width: 1, height: 1 }))} />
      <BreadcrumbSchema items={[
        { name: "Home", href: "/" },
        { name: "Gallery", href: "/gallery" },
      ]} />
      <Navbar />
      {/* Mobile-first redesign */}
      <GalleryMobile items={galleryItems} />
      <main className="hidden md:block">
        {/* Hero */}
        <section className="relative h-[60vh] overflow-hidden">
          <AdaptiveVideo
            src4k="/videos/gallery-4k.mp4"
            src1080="/videos/gallery-1080p.mp4"
            src720="/videos/gallery-720p.mp4"
            src480="/videos/gallery-480p.mp4"
            poster="/videos/gallery-poster.jpg?v=2"
            posterAlt="Sperm whales swimming in formation in the Sea of Cortez"
            description="Footage of sperm whales crossing the Sea of Cortez near La Ventana."
            priority
            className="absolute inset-0 w-full h-full"
          />
          <div className="absolute inset-0 bg-navy/18" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/50 text-xs font-body tracking-[0.4em] uppercase mb-4"
            >
              Life Beneath the Surface
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-display text-white text-5xl md:text-8xl tracking-wide"
            >
              GALLERY
            </motion.h1>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-deep to-transparent z-10" />
        </section>

        {/* Long 3D animated gallery — all 16 images, fully scroll through, no top empty space */}
        <section className="bg-deep px-6">
          <ContainerScroll className="min-h-[450vh]">
            <ContainerSticky className="h-screen flex items-start justify-center overflow-hidden pt-28 md:pt-32">
              <GalleryContainer className="max-w-6xl mx-auto w-full">
                {/* Col 1: 6 images — most overflow, longest travel up */}
                <GalleryCol yRange={["0%", "-50%"]}>
                  {col1.map((item) => (
                    <img
                      key={item.src}
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/3] w-full rounded-xl object-cover"
                    />
                  ))}
                </GalleryCol>
                {/* Col 2: 5 images — slight offset for parallax */}
                <GalleryCol yRange={["-3%", "-42%"]} className="mt-[3%]">
                  {col2.map((item) => (
                    <img
                      key={item.src}
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/3] w-full rounded-xl object-cover"
                    />
                  ))}
                </GalleryCol>
                {/* Col 3: 5 images */}
                <GalleryCol yRange={["0%", "-45%"]}>
                  {col3.map((item) => (
                    <img
                      key={item.src}
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/3] w-full rounded-xl object-cover"
                    />
                  ))}
                </GalleryCol>
              </GalleryContainer>
            </ContainerSticky>
          </ContainerScroll>
        </section>
      </main>
      <Footer />
    </SmoothScroll>
  );
}
