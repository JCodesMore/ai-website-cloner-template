"use client";

import Image from "next/image";
import { projects, type Sector } from "../data/projects";

type Props = {
  activeSector: Sector;
};

// Grid shows 3 cols × N rows of project thumbnails (right panel)
export default function ProjectGrid({ activeSector }: Props) {
  const filtered =
    activeSector === "Tous les secteurs"
      ? projects
      : projects.filter((p) => p.categories.includes(activeSector));

  // Pair projects into groups of 3 (tall, wide, tall) matching original grid pattern
  const col1 = filtered.filter((_, i) => i % 3 === 0); // tall images
  const col2 = filtered.filter((_, i) => i % 3 === 1); // wide images (offset down)
  const col3 = filtered.filter((_, i) => i % 3 === 2); // tall images

  return (
    <div className="h-full overflow-y-auto no-scrollbar pt-[64px] pb-8 bg-[#F7F8F9]">
      <div className="flex gap-2.5 px-3">
        {[col1, col2, col3].map((col, ci) => (
          <div
            key={ci}
            className="flex-1 flex flex-col gap-2.5"
            style={{ paddingTop: ci === 1 ? "40px" : "0" }}
          >
            {col.map((project, i) => (
              <a
                key={project.id}
                href={project.href}
                className="project-card block group"
              >
                {/* Image — colour, zoom on hover */}
                <div className="overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={400}
                    height={ci % 2 === 0 ? 500 : 330}
                    className="w-full h-auto object-cover transition-transform duration-700 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:scale-[1.06]"
                    loading={i < 3 ? "eager" : "lazy"}
                  />
                </div>
                {/* Title — subtle, always visible */}
                <p className="mt-1.5 text-[0.8rem] leading-tight text-[#212122]/60 group-hover:text-[#212122] transition-colors duration-300">
                  {project.title}
                </p>
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
