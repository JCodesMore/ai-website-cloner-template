"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function EnterEmailContent() {
  const router = useRouter();
  const params = useSearchParams();
  const age = params.get("age") || "1";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Por favor insere um email válido.");
      return;
    }
    setLoading(true);
    router.push(`/pt-br/landing?age=${age}&email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen relative flex items-end justify-center pb-0" style={{ backgroundColor: "#f5f5f5" }}>
      {/* Blurred background */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="https://quiz.kegel-plan.me/images/confirm-email-bg.webp"
          alt="background"
          fill
          className="object-cover object-top"
          unoptimized
          style={{ filter: "blur(4px)", transform: "scale(1.05)" }}
        />
      </div>

      {/* Email card */}
      <div
        className="relative w-full rounded-t-2xl shadow-2xl px-6 pt-8 pb-10"
        style={{ backgroundColor: "#ffffff", maxWidth: "600px" }}
      >
        <h2
          className="text-center font-bold mb-6"
          style={{ fontSize: "22px", color: "#111113", lineHeight: "1.4" }}
        >
          Insira o email para receber<br />o seu Plano Kegel pessoal
        </h2>

        <form onSubmit={handleSubmit}>
          <div
            className="flex items-center mb-2"
            style={{
              backgroundColor: "#f1f3f9",
              borderRadius: "12px",
              padding: "4px 16px",
              border: error ? "1px solid #e44240" : "none",
            }}
          >
            <input
              type="email"
              placeholder="Insira o seu email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              className="flex-1 bg-transparent outline-none py-4"
              style={{ fontSize: "16px", color: "#111113" }}
            />
            <span style={{ fontSize: "18px" }}>🔒</span>
          </div>
          {error && (
            <p className="mb-2" style={{ fontSize: "12px", color: "#e44240" }}>{error}</p>
          )}

          <p
            className="text-center mb-6"
            style={{ fontSize: "12px", color: "#9ca3af", lineHeight: "1.5" }}
          >
            Os seus dados pessoais estão seguros connosco. Usaremos o seu email para atualizações, recibos e detalhes de subscrição.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full font-bold transition-all duration-200 active:scale-95"
            style={{
              backgroundColor: "#e44240",
              color: "#ffffff",
              borderRadius: "50px",
              padding: "18px",
              fontSize: "18px",
              border: "none",
              cursor: loading ? "wait" : "pointer",
              boxShadow: "0 0 20px rgba(228, 66, 64, 0.4)",
            }}
          >
            {loading ? "A carregar..." : "Continuar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function EnterEmailPage() {
  return (
    <Suspense>
      <EnterEmailContent />
    </Suspense>
  );
}
