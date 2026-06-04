"use client";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { ProgressDots } from "@/components/quiz/ProgressDots";
import { getStepById, getSectionIndex } from "@/lib/quiz-data";

function S1Content() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = Number(params.id);
  const age = searchParams.get("age") || "1";
  const step = getStepById(id);

  if (!step || step.type !== "s1") {
    return <div className="p-8 text-center text-white">Conteúdo não encontrado</div>;
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
      style={{ backgroundColor: "#111113" }}
    >
      <div
        className="flex flex-col flex-1 w-full mx-auto pb-32"
        style={{ maxWidth: "600px" }}
      >
        <QuizHeader dark />

        <div className="px-4 pt-2">
          <ProgressDots currentSection={sectionIndex} totalSections={4} dark />

          <h2
            className="font-bold mb-6 text-center"
            style={{ fontSize: "20px", color: "#ffffff", lineHeight: "1.5" }}
          >
            {step.title}{" "}
            <span style={{ color: "#53cc58" }}>{step.titleHighlight}</span>
          </h2>

          {/* MAP Muscles illustration — video */}
          <div className="flex justify-center mb-6">
            <video
              src="https://quiz.kegel-plan.me/video/video_ED_s1.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full object-contain"
              style={{ maxWidth: "500px" }}
            >
              <source src="https://quiz.kegel-plan.me/video/video_ED_s1.mp4" type="video/mp4" />
            </video>
          </div>

          <p
            className="text-center"
            style={{ fontSize: "16px", color: "#e5e7eb", lineHeight: "1.6" }}
          >
            {step.description}
          </p>
        </div>
      </div>

      {/* Bottom controls - dark */}
      <div
        className="fixed bottom-0 left-0 right-0 flex justify-center"
        style={{
          background: "linear-gradient(180deg, transparent 0%, #111113 30%)",
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
              backgroundColor: "#282828",
              color: "#9ca3af",
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
            className="flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-95"
            style={{
              backgroundColor: "#e44240",
              color: "#ffffff",
              borderRadius: "20px",
              padding: "14px 28px",
              fontSize: "16px",
              minWidth: "160px",
              cursor: "pointer",
              border: "none",
            }}
          >
            Entendi →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function S1Page() {
  return (
    <Suspense>
      <S1Content />
    </Suspense>
  );
}
