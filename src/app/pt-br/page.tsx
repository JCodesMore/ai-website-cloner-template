import Image from "next/image";
import Link from "next/link";
import { SOURCES } from "@/lib/quiz-data";

const AGE_OPTIONS = [
  { label: "25-35", value: "1", nextStep: 0 },
  { label: "35-45", value: "2", nextStep: 0 },
  { label: "45-55", value: "3", nextStep: 0 },
  { label: "55+", value: "4", nextStep: 0 },
];

export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{ backgroundColor: "#ffffff", fontFamily: "Roboto, sans-serif" }}
    >
      {/* Header */}
      <header className="w-full flex justify-center pt-4 pb-2">
        <Image
          src="https://quiz.kegel-plan.me/images/br/BR_logo_white_bg.webp"
          alt="Dr. Kegel logo"
          width={130}
          height={50}
          priority
          unoptimized
        />
      </header>

      {/* Hero section */}
      <div className="w-full flex flex-col items-center px-4" style={{ maxWidth: "600px" }}>
        <h1
          className="text-center font-extrabold mt-4 mb-4 leading-tight"
          style={{ fontSize: "26px", color: "#111113" }}
        >
          Adquira Seu{" "}
          <span className="kegel-gradient-text">Plano De Bem-Estar Sexual</span>
        </h1>

        {/* Happy couple mosaic */}
        <div className="w-full mb-4">
          <Image
            src="https://quiz.kegel-plan.me/images/happy_couple.webp"
            alt="happy couple"
            width={600}
            height={300}
            className="w-full object-contain"
            unoptimized
          />
        </div>

        {/* Trust badges */}
        <div className="w-full mb-6">
          <Image
            src="https://quiz.kegel-plan.me/images/br/BR_benefits.webp"
            alt="benefits"
            width={600}
            height={80}
            className="w-full object-contain"
            unoptimized
          />
        </div>

        {/* Age question */}
        <p
          className="text-center font-bold mb-4"
          style={{ fontSize: "20px", color: "#111113" }}
        >
          Qual é a sua idade?
        </p>

        {/* Age options grid */}
        <div
          className="w-full grid grid-cols-2 gap-2 mb-8"
          style={{ gap: "9px" }}
        >
          {AGE_OPTIONS.map((opt) => (
            <Link
              key={opt.value}
              href={`/pt-br/loading?age=${opt.value}`}
              className="flex items-center justify-between px-5 font-medium transition-all duration-200 hover:bg-gray-200 active:scale-95"
              style={{
                backgroundColor: "#f1f3f9",
                borderRadius: "9px",
                minHeight: "53px",
                fontSize: "18px",
                color: "#111113",
                textDecoration: "none",
              }}
            >
              <span>{opt.label}</span>
              <span style={{ fontSize: "14px", color: "#111113" }}>›</span>
            </Link>
          ))}
        </div>

        {/* Sources section */}
        <div className="w-full mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px" style={{ backgroundColor: "#e5e7eb" }} />
            <p
              className="font-bold tracking-widest"
              style={{ fontSize: "12px", color: "#111113" }}
            >
              FONTES:
            </p>
            <div className="flex-1 h-px" style={{ backgroundColor: "#e5e7eb" }} />
          </div>

          <Image
            src="https://quiz.kegel-plan.me/images/sources/img_source_logos_bw.webp"
            alt="sources"
            width={600}
            height={150}
            className="w-full object-contain mb-4"
            unoptimized
          />

          <ol className="list-decimal pl-5 space-y-2" style={{ fontSize: "12px", color: "#111113" }}>
            {SOURCES.map((src, i) => (
              <li key={i}>
                <span>{src.authors} </span>
                <span className="italic">{src.title}</span>{" "}
                <span className="font-bold">{src.journal}</span>{" "}
                <span>{src.detail}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Footer */}
        <div className="w-full text-center pb-8" style={{ fontSize: "12px", color: "#6b7280" }}>
          <p className="mb-2">
            Ao informar sua idade e continuar, você concorda com nossos{" "}
            <Link href="/terms.html" className="underline">
              Termos e condições
            </Link>{" "}
            e com a{" "}
            <Link href="/privacy-policy.html" className="underline">
              Política de privacidade
            </Link>
            . Por favor, analise antes de continuar.
          </p>
          <p>Appercut sp z o o · Warsaw, Twarda 18, 00-105</p>
        </div>
      </div>
    </div>
  );
}
