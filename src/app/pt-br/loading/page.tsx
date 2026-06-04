"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";

const LOADING_ITEMS = [
  "Carregando dados para a sua faixa etária",
  "Filtrando as perguntas mais relevantes",
  "Estimando seu potencial de melhora",
  "Preparando seu plano personalizado",
];

function LoadingContent() {
  const router = useRouter();
  const params = useSearchParams();
  const age = params.get("age") || "1";

  const [progress, setProgress] = useState(0);
  const [activeItem, setActiveItem] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + 4;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            router.push(`/pt-br/quiz/0/question?age=${age}`);
          }, 300);
          return 100;
        }
        setActiveItem(Math.floor((next / 100) * LOADING_ITEMS.length));
        return next;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [router, age]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* Logo */}
      <div className="absolute top-4 left-4">
        <Image
          src="https://quiz.kegel-plan.me/images/br/BR_logo_white_bg.webp"
          alt="Dr. Kegel"
          width={100}
          height={38}
          unoptimized
        />
      </div>

      <div className="w-full flex flex-col items-center" style={{ maxWidth: "500px" }}>
        <h2
          className="text-center font-bold mb-8"
          style={{ fontSize: "24px", color: "#111113" }}
        >
          Vamos descobrir o que funciona melhor para você
        </h2>

        {/* Progress bar */}
        <div
          className="w-full mb-2 overflow-hidden"
          style={{ height: "6px", backgroundColor: "#e5e7eb", borderRadius: "3px" }}
        >
          <div
            className="h-full transition-all duration-200"
            style={{
              width: `${progress}%`,
              backgroundColor: "#5773d6",
              borderRadius: "3px",
            }}
          />
        </div>
        <p
          className="mb-8 text-center font-medium"
          style={{ fontSize: "14px", color: "#5773d6" }}
        >
          {progress}%
        </p>

        {/* Loading items */}
        <div className="w-full space-y-4">
          {LOADING_ITEMS.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: i < activeItem ? "#5773d6" : i === activeItem ? "#5773d6" : "#e5e7eb",
                  opacity: i > activeItem ? 0.4 : 1,
                }}
              >
                {i < activeItem && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
                {i === activeItem && (
                  <div
                    className="w-2 h-2 rounded-full bg-white"
                    style={{ animation: "pulse 1s infinite" }}
                  />
                )}
              </div>
              <span
                style={{
                  fontSize: "16px",
                  color: "#111113",
                  opacity: i > activeItem ? 0.4 : 1,
                  transition: "opacity 0.3s",
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LoadingPage() {
  return (
    <Suspense>
      <LoadingContent />
    </Suspense>
  );
}
