"use client"

import { useEffect, useRef, useState } from "react"
import { Utensils, Droplet, RotateCw, GlassWater, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  number: number
  icon: LucideIcon
  bold: string
  rest: string
}

const steps: Step[] = [
  {
    number: 1,
    icon: Utensils,
    bold: "2 cuillères",
    rest: "de poudre",
  },
  {
    number: 2,
    icon: Droplet,
    bold: "250mL",
    rest: "d'eau fraîche",
  },
  {
    number: 3,
    icon: RotateCw,
    bold: "Secouez",
    rest: "bien",
  },
  {
    number: 4,
    icon: GlassWater,
    bold: "Buvez",
    rest: ", et profitez !",
  },
]

export function Routine() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="routine"
      ref={sectionRef}
      className="bg-[#FBF9F2] py-20"
    >
      <div className="mx-auto max-w-[1000px] px-6">
        <h2 className="font-heading text-center text-[32px] font-semibold text-[#003D2A]">
          La routine onday
        </h2>

        <div className="relative mt-14 flex flex-col items-stretch gap-10 md:flex-row md:items-start md:justify-between md:gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isLast = index === steps.length - 1

            return (
              <div
                key={step.number}
                className="relative flex flex-1 flex-col items-center text-center"
              >
                {/* Connector to next step */}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute border-[#003D2A]/30",
                      "left-8 top-16 h-[calc(100%-1rem)] border-l-2 border-dashed",
                      "md:left-[calc(50%+2.5rem)] md:top-8 md:h-0 md:w-[calc(100%-5rem)] md:border-t-2 md:border-l-0"
                    )}
                  />
                )}

                <div
                  className={cn(
                    "relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#003D2A] transition-all duration-700 ease-out",
                    visible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-3 opacity-0"
                  )}
                  style={{ transitionDelay: `${index * 120}ms` }}
                >
                  <Icon className="h-7 w-7 text-[#e0ff0c]" strokeWidth={2} />
                </div>

                <span
                  className={cn(
                    "relative z-10 mt-4 text-xs font-semibold uppercase tracking-wider text-[#003D2A]/60 transition-all duration-700 ease-out",
                    visible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-3 opacity-0"
                  )}
                  style={{ transitionDelay: `${index * 120 + 80}ms` }}
                >
                  Étape {step.number}
                </span>

                <p
                  className={cn(
                    "relative z-10 mt-2 max-w-[180px] text-base text-[#003D2A] transition-all duration-700 ease-out",
                    visible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-3 opacity-0"
                  )}
                  style={{ transitionDelay: `${index * 120 + 160}ms` }}
                >
                  <span className="font-semibold">{step.bold}</span>{" "}
                  <span className="font-normal">{step.rest}</span>
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
