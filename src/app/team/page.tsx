import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import {
  FacebookIcon,
  LinkedinIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/icons";
import { TEAM_MEMBERS } from "@/lib/pages-content";

export const metadata = { title: "Our Team — VertexLink" };

export default function TeamPage() {
  return (
    <>
      <PageHero title="Our Team" />

      <section className="py-24 lg:py-32">
        <div className="yo-container">
          <div className="text-center mb-16">
            <span className="yo-subtitle">Our Team</span>
            <h2 className="yo-headline-split text-[36px] md:text-[44px] lg:text-[48px] leading-none mt-5 max-w-2xl mx-auto">
              Meet the people <span className="light">keeping you connected</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM_MEMBERS.map((m) => (
              <article
                key={m.name}
                className="group rounded-[10px] overflow-hidden bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
              >
                <div className="relative overflow-hidden aspect-[3/4]">
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <ul className="flex gap-2 justify-center">
                      {[FacebookIcon, XIcon, YoutubeIcon, LinkedinIcon].map((Icon, i) => (
                        <li key={i}>
                          <a
                            href="#"
                            aria-label="Social"
                            className="size-9 rounded-full bg-white hover:bg-primary hover:text-white text-secondary grid place-items-center transition-colors"
                          >
                            <Icon className="size-4" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-lg font-extrabold mb-1">{m.name}</h3>
                  <span className="text-sm font-medium text-secondary">{m.role}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
