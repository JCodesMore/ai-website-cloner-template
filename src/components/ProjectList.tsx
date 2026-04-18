"use client";

import Image from "next/image";
import { projects, type Sector } from "../data/projects";

type Props = {
  activeSector: Sector;
};

export default function ProjectList({ activeSector }: Props) {
  const filtered =
    activeSector === "Tous les secteurs"
      ? projects
      : projects.filter((p) => p.categories.includes(activeSector));

  return (
    <div className="h-full overflow-y-auto no-scrollbar pt-[80px] pb-16 px-5 bg-[#F7F8F9]">
      <ul className="divide-y divide-[rgba(33,33,34,0.12)]">
        {filtered.map((project) => (
          <li key={project.id}>
            <a
              href={project.href}
              className="project-card flex items-end gap-6 py-5 group"
            >
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-24 h-16 overflow-hidden project-img">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={96}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-[1.375rem] leading-tight font-medium group-hover:opacity-60 transition-opacity duration-300"
                  style={{ fontFamily: '"Neue Haas Grotesk Display", sans-serif' }}
                >
                  {project.title}
                </p>
                <p className="text-sm text-[#212122]/60 mt-0.5">
                  {project.categories.join(", ")}
                </p>
              </div>

              {/* Arrow */}
              <svg
                viewBox="0 0 17.5 11"
                className="w-4 h-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 fill-current"
              >
                <path d="M0.8,4.8C0.3,4.8,0,5.1,0,5.5s0.3,0.8,0.8,0.8V4.8z M17.3,6.1c0.3-0.3,0.3-0.8,0-1.1l-4.8-4.8c-0.3-0.3-0.8-0.3-1.1,0s-0.3,0.8,0,1.1l4.2,4.2l-4.2,4.2c-0.3,0.3-0.3,0.8,0,1.1s0.8,0.3,1.1,0L17.3,6.1z M0.8,6.3h16V4.8h-16V6.3z" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
