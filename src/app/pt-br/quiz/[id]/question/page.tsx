"use client";
import { useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { ProgressDots } from "@/components/quiz/ProgressDots";
import { getStepById, getSectionIndex } from "@/lib/quiz-data";

function QuestionContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = Number(params.id);
  const age = searchParams.get("age") || "1";
  const step = getStepById(id);

  const [selected, setSelected] = useState<number | null>(0);

  if (!step || step.type !== "question") {
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
      router.push(`/pt-br/result?age=${age}`);
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
            className="font-bold mb-6 text-left"
            style={{ fontSize: "20px", color: "#111113", lineHeight: "1.4" }}
          >
            {step.question}
          </h2>

          <div className="flex flex-col gap-2">
            {step.options?.map((opt, i) => {
              const isSelected = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className="flex items-center justify-between w-full text-left transition-all duration-200 active:scale-[0.98]"
                  style={{
                    backgroundColor: isSelected ? "#111113" : "#f1f3f9",
                    color: isSelected ? "#ffffff" : "#111113",
                    borderRadius: "9px",
                    padding: "15px 18px",
                    minHeight: "53px",
                    fontSize: "16px",
                    fontWeight: isSelected ? "700" : "400",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <span>
                    {opt.label}
                    {opt.subLabel && (
                      <span
                        className="block"
                        style={{
                          fontSize: "13px",
                          opacity: 0.8,
                          fontWeight: "400",
                        }}
                      >
                        {opt.subLabel}
                      </span>
                    )}
                  </span>
                  <span
                    className="flex-shrink-0 flex items-center justify-center ml-3"
                    style={{
                      width: "23px",
                      height: "23px",
                      borderRadius: "50%",
                      backgroundColor: isSelected ? "#ffffff" : "transparent",
                      border: isSelected ? "none" : "2px solid #d1d5db",
                      fontSize: "14px",
                    }}
                  >
                    {isSelected && (
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path
                          d="M1 5L4.5 8.5L11 1"
                          stroke="#111113"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </span>
                </button>
              );
            })}
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

export default function QuestionPage() {
  return (
    <Suspense>
      <QuestionContent />
    </Suspense>
  );
}
