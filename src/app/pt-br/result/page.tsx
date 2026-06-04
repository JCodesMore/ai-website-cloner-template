import Link from "next/link";
import Image from "next/image";

export default function ResultPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "#ffffff" }}
    >
      <Image
        src="https://quiz.kegel-plan.me/images/br/BR_logo_white_bg.webp"
        alt="Dr. Kegel"
        width={130}
        height={50}
        unoptimized
        className="mb-8"
      />
      <div
        className="w-full text-center"
        style={{ maxWidth: "500px" }}
      >
        <h1
          className="font-extrabold mb-4"
          style={{ fontSize: "28px", color: "#111113" }}
        >
          Seu plano personalizado está pronto!
        </h1>
        <p
          className="mb-8"
          style={{ fontSize: "16px", color: "#6b7280", lineHeight: "1.6" }}
        >
          Com base nas suas respostas, preparamos um plano de bem-estar sexual personalizado para você.
        </p>
        <div
          className="rounded-xl p-6 mb-8"
          style={{ backgroundColor: "#f1f3f9" }}
        >
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            🎯 Esta é uma demonstração do clone. O site original redireciona para uma página de planos e pagamento.
          </p>
        </div>
        <Link
          href="/pt-br"
          style={{
            backgroundColor: "#111113",
            color: "#ffffff",
            borderRadius: "20px",
            padding: "14px 32px",
            fontSize: "16px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          ← Recomeçar o Quiz
        </Link>
      </div>
    </div>
  );
}
