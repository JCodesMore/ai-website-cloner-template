import Link from "next/link";
import Image from "next/image";

export default function SuccessPage() {
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
      <div className="text-center" style={{ maxWidth: "480px" }}>
        <div className="text-6xl mb-4">✅</div>
        <h1 className="font-extrabold mb-3" style={{ fontSize: "26px", color: "#111113" }}>
          Pagamento Confirmado!
        </h1>
        <p className="mb-6" style={{ fontSize: "16px", color: "#6b7280", lineHeight: "1.6" }}>
          O teu Plano Kegel pessoal está a caminho. Verifica o teu email para acederes ao plano e começares a tua jornada.
        </p>
        <div
          className="rounded-xl p-5 mb-8 text-left"
          style={{ backgroundColor: "#f0fdf4", border: "1px solid #86efac" }}
        >
          <p className="font-bold mb-2" style={{ color: "#16a34a" }}>📧 Próximos passos:</p>
          <ul className="space-y-1" style={{ fontSize: "14px", color: "#166534" }}>
            <li>• Verifica o teu email para o link de acesso</li>
            <li>• Descarrega a app Dr. Kegel</li>
            <li>• Começa o teu programa personalizado hoje</li>
          </ul>
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
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
}
