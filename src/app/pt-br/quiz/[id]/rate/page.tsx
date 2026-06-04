"use client";
import { useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { ProgressDots } from "@/components/quiz/ProgressDots";
import { getStepById, getSectionIndex } from "@/lib/quiz-data";

function RateContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = Number(params.id);
  const age = searchParams.get("age") || "1";
  const step = getStepById(id);

  const [selected, setSelected] = useState<number | null>(3);

  if (!step || step.type !== "rate") {
    return <div className="p-8 text-center">Pergunta não encontrada</div>;
  }

  const sectionIndex = getSectionIndex(id);

  const handleNext = () => {
    if (step.nextStep !== null && step.nextStep !== undefined) {
      const nextStep = step.nextStep;
      const nextStepData = getStepById(nextStep);
      if (nextStepData) {
        router.push(`/pt-br/quiz/${nextStep}/${nextStepData.type}?age=${age}`);
      }
    } else {
      router.push(`/pt-br/enter-email?age=${age}`);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div
        className="flex flex-col flex-1 w-full mx-auto pb-32"
        style={{ maxWidth: "600px" }}
      >
        <QuizHeader />

        <div className="px-4 pt-2">
          <ProgressDots currentSection={sectionIndex} totalSections={4} />

          <h2
            className="font-bold mb-2 text-left"
            style={{ fontSize: "20px", color: "#111113", lineHeight: "1.4" }}
          >
            {step.question}
          </h2>

          <p
            className="mb-6 text-center"
            style={{ fontSize: "16px", color: "#6b7280" }}
          >
            {step.ratingLabel}
          </p>

          {/* Rating buttons */}
          <div className="flex gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((val) => {
              const isSelected = selected === val;
              return (
                <button
                  key={val}
                  onClick={() => setSelected(val)}
                  className="flex-1 flex items-center justify-center font-bold transition-all duration-200 active:scale-95"
                  style={{
                    backgroundColor: isSelected ? "#111113" : "#f1f3f9",
                    color: isSelected ? "#ffffff" : "#111113",
                    borderRadius: "9px",
                    height: "60px",
                    fontSize: "20px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {val}
                </button>
              );
            })}
          </div>

          {/* Labels */}
          <div className="flex justify-between px-1">
            <span style={{ fontSize: "13px", color: "#6b7280" }}>{step.ratingMin}</span>
            <span style={{ fontSize: "13px", color: "#6b7280" }}>{step.ratingMax}</span>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div
        className="fixed bottom-0 left-0 right-0 flex justify-center"
        style={{
          background: "linear-gradient(180deg, transparent 0%, #ffffff 30%)",
          paddingBottom: "24px",
          paddingTop: "48px",
        }}
      >
        <div
          className="flex items-center justify-center gap-3 w-full px-4"
          style={{ maxWidth: "600px" }}
        >
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 font-medium transition-all duration-200"
            style={{
              backgroundColor: "#f1f3f9",
              color: "#6b7280",
              borderRadius: "20px",
              padding: "14px 28px",
              fontSize: "16px",
              minWidth: "120px",
              cursor: "pointer",
              border: "none",
            }}
          >
            ← Voltar
          </button>
          <button
            onClick={handleNext}
            disabled={selected === null}
            className="flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-95"
            style={{
              backgroundColor: selected !== null ? "#111113" : "#e5e7eb",
              color: selected !== null ? "#ffffff" : "#9ca3af",
              borderRadius: "20px",
              padding: "14px 28px",
              fontSize: "16px",
              minWidth: "160px",
              cursor: selected !== null ? "pointer" : "not-allowed",
              border: "none",
            }}
          >
            Avançar →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RatePage() {
  return (
    <Suspense>
      <RateContent />
    </Suspense>
  );
}
