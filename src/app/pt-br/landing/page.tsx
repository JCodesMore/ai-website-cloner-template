"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

const PLANS = [
  {
    id: "week",
    label: "PLANO 1 SEMANA",
    originalPrice: 26,
    price: 13,
    perDay: (13 / 7).toFixed(2),
    originalPerDay: (26 / 7).toFixed(2),
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_WEEK || "",
  },
  {
    id: "month",
    label: "PLANO 1 MÊS",
    badge: "MAIS POPULAR",
    originalPrice: 64,
    price: 32,
    perDay: (32 / 30).toFixed(2),
    originalPerDay: (64 / 30).toFixed(2),
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTH || "",
  },
  {
    id: "quarter",
    label: "PLANO 3 MESES",
    originalPrice: 102,
    price: 51,
    perDay: (51 / 90).toFixed(2),
    originalPerDay: (102 / 90).toFixed(2),
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_QUARTER || "",
  },
];

const IMPROVEMENTS = [
  { icon: "⚡", label: "Função erétil" },
  { icon: "🎯", label: "Controlo da ejaculação" },
  { icon: "🛡️", label: "Saúde da próstata" },
  { icon: "💪", label: "Confiança" },
  { icon: "❤️", label: "Felicidade no relacionamento" },
];

const REVIEWS = [
  {
    name: "Pepsi Zero",
    title: "Fazendo dá para acreditar que funciona mesmo",
    body: "Fui muito cético no início. Mas comecei a ter problemas há 1 ano. Comprei suplementos, nunca funcionaram. Então encontrei este anúncio e decidi tentar. Em 2 semanas notei diferença. Agora já faço os exercícios há 72 dias seguidos. Acordo com vigor, maior, mais forte. Definitivamente recomendo.",
  },
  {
    name: "Marcus T.",
    title: "Superou as minhas expectativas",
    body: "Não acreditava que exercícios pudessem fazer diferença. Depois de 3 semanas com o plano personalizado, a minha parceira notou a diferença. Estou muito satisfeito com os resultados.",
  },
  {
    name: "Ricardo M.",
    title: "Finalmente uma solução que funciona",
    body: "Tentei muita coisa antes disto. O plano Kegel é o único que realmente me deu resultados consistentes. 5 estrelas sem dúvida.",
  },
];

function CountdownTimer({ seconds }: { seconds: number }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  useEffect(() => {
    const t = setInterval(() => setTimeLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const m = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const s = String(timeLeft % 60).padStart(2, "0");
  return <span style={{ color: "#e44240", fontWeight: 700 }}>{m}:{s}</span>;
}

function LandingContent() {
  const params = useSearchParams();
  const email = params.get("email") || "";
  const [selectedPlan, setSelectedPlan] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleGetPlan = async () => {
    const plan = PLANS[selectedPlan];
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id, email, price: plan.price }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Erro ao criar checkout. Tenta novamente.");
    } catch {
      alert("Erro de ligação. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#ffffff", fontFamily: "Roboto, sans-serif", color: "#111113" }}>

      {/* Sticky header */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 shadow-md"
        style={{ backgroundColor: "#ffffff", maxWidth: "600px", margin: "0 auto" }}
      >
        <div className="flex flex-col">
          <span style={{ fontSize: "13px", color: "#6b7280" }}>51% de desconto reservado para</span>
          <CountdownTimer seconds={600} />
        </div>
        <button
          onClick={handleGetPlan}
          className="font-bold transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg, #5773d6, #4361c2)",
            color: "#fff",
            borderRadius: "20px",
            padding: "10px 20px",
            fontSize: "14px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Obter o Meu Plano
        </button>
      </div>

      <div className="w-full mx-auto pt-16" style={{ maxWidth: "600px" }}>

        {/* Hero */}
        <div className="px-4 py-6 text-center">
          <h1 className="font-extrabold mb-4" style={{ fontSize: "26px" }}>
            O Seu Plano Pessoal Está Pronto!
          </h1>
          <Image
            src="https://quiz.kegel-plan.me/images/en/EN_img_beforeafter2.webp"
            alt="before after"
            width={560}
            height={320}
            className="w-full rounded-xl"
            unoptimized
          />
        </div>

        {/* Areas of improvement */}
        <div className="px-4 py-4">
          <h2 className="font-bold mb-4" style={{ fontSize: "20px" }}>Áreas de Melhoria</h2>
          <div className="flex flex-col gap-2">
            {IMPROVEMENTS.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ backgroundColor: "#f1f3f9" }}
              >
                <span style={{ fontSize: "20px" }}>{item.icon}</span>
                <span style={{ fontSize: "16px", fontWeight: 500 }}>{item.label}</span>
                <span className="ml-auto" style={{ color: "#53cc58", fontSize: "18px" }}>▲</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress chart */}
        <div className="px-4 py-6 text-center">
          <h2 className="font-bold mb-2" style={{ fontSize: "20px" }}>Quando Esperar Melhorias</h2>
          <p style={{ fontSize: "15px", color: "#6b7280" }}>Com base nos nossos dados podes atingir melhorias notáveis</p>
          <p className="font-bold mt-1 mb-4" style={{ color: "#5773d6", fontSize: "18px" }}>
            até 2 de Julho{" "}
            <span className="text-sm font-bold px-2 py-1 rounded-full" style={{ backgroundColor: "#53cc58", color: "#fff" }}>
              34% Mais Rápido
            </span>
          </p>
          <Image
            src="https://quiz.kegel-plan.me/images/en/EN_video_graph_final.webp"
            alt="progress chart"
            width={560}
            height={300}
            className="w-full rounded-xl"
            unoptimized
          />
          <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "8px" }}>*apenas para fins ilustrativos</p>
        </div>

        {/* Pricing section */}
        <div className="px-4 py-6" style={{ backgroundColor: "#f8f9fc" }}>
          <h2 className="font-extrabold text-center mb-4" style={{ fontSize: "24px" }}>
            Obtenha o Seu Plano Kegel Pessoal
          </h2>

          {/* Countdown banner */}
          <div
            className="flex items-center justify-center gap-2 mb-4 py-3 rounded-xl"
            style={{ backgroundColor: "#e44240" }}
          >
            <span style={{ fontSize: "16px" }}>⏱️</span>
            <span className="font-bold" style={{ color: "#fff", fontSize: "15px" }}>
              Esta oferta termina em <CountdownTimer seconds={550} />
            </span>
          </div>

          {/* Plans */}
          <div className="flex flex-col gap-3 mb-4">
            {PLANS.map((plan, i) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(i)}
                className="w-full text-left transition-all duration-200 relative"
                style={{
                  backgroundColor: selectedPlan === i ? "#ffffff" : "#ffffff",
                  border: selectedPlan === i ? "2px solid #5773d6" : "2px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "16px",
                  cursor: "pointer",
                }}
              >
                {plan.badge && (
                  <span
                    className="absolute -top-3 left-4 px-3 py-1 font-bold"
                    style={{
                      backgroundColor: "#5773d6",
                      color: "#fff",
                      borderRadius: "20px",
                      fontSize: "11px",
                    }}
                  >
                    {plan.badge}
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        border: selectedPlan === i ? "none" : "2px solid #d1d5db",
                        backgroundColor: selectedPlan === i ? "#5773d6" : "transparent",
                      }}
                    >
                      {selectedPlan === i && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-bold" style={{ fontSize: "15px" }}>{plan.label}</p>
                      <p style={{ fontSize: "13px", color: "#9ca3af" }}>
                        <span className="line-through">{plan.originalPrice.toFixed(2)} USD</span>{" "}
                        <span className="font-bold" style={{ color: "#111113" }}>{plan.price.toFixed(2)} USD</span>
                      </p>
                    </div>
                  </div>
                  <div
                    className="text-right px-3 py-2 rounded-lg"
                    style={{
                      backgroundColor: selectedPlan === i ? "#5773d6" : "#f1f3f9",
                    }}
                  >
                    <p
                      className="line-through"
                      style={{ fontSize: "12px", color: selectedPlan === i ? "rgba(255,255,255,0.7)" : "#9ca3af" }}
                    >
                      {plan.originalPerDay} USD
                    </p>
                    <p
                      className="font-bold"
                      style={{ fontSize: "16px", color: selectedPlan === i ? "#fff" : "#111113" }}
                    >
                      {plan.perDay} USD
                    </p>
                    <p style={{ fontSize: "11px", color: selectedPlan === i ? "rgba(255,255,255,0.8)" : "#9ca3af" }}>
                      por dia
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Guarantee */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span>🛡️</span>
            <span className="font-medium" style={{ fontSize: "14px", color: "#5773d6" }}>
              Garantia de reembolso de 30 dias
            </span>
          </div>

          {/* CTA button */}
          <button
            onClick={handleGetPlan}
            disabled={loading}
            className="w-full font-bold transition-all active:scale-95 mb-4"
            style={{
              background: "linear-gradient(135deg, #5773d6, #4361c2)",
              color: "#fff",
              borderRadius: "50px",
              padding: "18px",
              fontSize: "18px",
              border: "none",
              cursor: loading ? "wait" : "pointer",
              boxShadow: "0 4px 20px rgba(87,115,214,0.4)",
            }}
          >
            {loading ? "A processar..." : "Obter o Meu Plano →"}
          </button>

          <p style={{ fontSize: "11px", color: "#9ca3af", textAlign: "center", lineHeight: "1.6" }}>
            Aplicámos automaticamente o desconto ao seu Plano Kegel de 1 mês. Após 1 mês, a sua subscrição será renovada automaticamente ao preço completo de {PLANS[selectedPlan].originalPrice} USD por mês.
          </p>

          {/* Payment icons */}
          <div className="flex justify-center mt-4">
            <Image
              src="https://quiz.kegel-plan.me/images/all_cards.webp"
              alt="payment methods"
              width={280}
              height={40}
              unoptimized
            />
          </div>
        </div>

        {/* Trust badges */}
        <div className="px-4 py-6">
          <Image
            src="https://quiz.kegel-plan.me/images/en/EN_img_rating_trusted.webp"
            alt="rating and trusted"
            width={560}
            height={120}
            className="w-full"
            unoptimized
          />
        </div>

        {/* Reviews */}
        <div className="px-4 py-4">
          <h2 className="font-extrabold text-center mb-6" style={{ fontSize: "22px" }}>
            Histórias de Sucesso dos Nossos Clientes
          </h2>
          <div className="flex flex-col gap-4">
            {REVIEWS.map((review, i) => (
              <div
                key={i}
                className="rounded-xl p-5"
                style={{ border: "1px solid #e5e7eb" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <span key={j} style={{ color: "#00b67a", fontSize: "18px" }}>★</span>
                    ))}
                  </div>
                  <span style={{ fontSize: "13px", color: "#9ca3af" }}>{review.name}</span>
                </div>
                <p className="font-bold mb-2" style={{ fontSize: "15px" }}>{review.title}</p>
                <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6" }}>{review.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Money-back */}
        <div className="px-4 py-6 text-center">
          <Image
            src="https://quiz.kegel-plan.me/images/en/EN_img_moneyback.webp"
            alt="money back guarantee"
            width={200}
            height={200}
            className="mx-auto mb-4"
            unoptimized
          />
          <h3 className="font-bold mb-2" style={{ fontSize: "18px" }}>Garantia de Satisfação de 30 Dias</h3>
          <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6" }}>
            Se não estiveres satisfeito com o teu Plano Kegel nos primeiros 30 dias, devolvemos o dinheiro. Sem perguntas.
          </p>
        </div>

        {/* Second CTA */}
        <div className="px-4 pb-12">
          <button
            onClick={handleGetPlan}
            disabled={loading}
            className="w-full font-bold transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg, #5773d6, #4361c2)",
              color: "#fff",
              borderRadius: "50px",
              padding: "18px",
              fontSize: "18px",
              border: "none",
              cursor: loading ? "wait" : "pointer",
              boxShadow: "0 4px 20px rgba(87,115,214,0.4)",
            }}
          >
            {loading ? "A processar..." : "Obter o Meu Plano →"}
          </button>
        </div>

        {/* Footer */}
        <div className="px-4 pb-8 text-center border-t pt-6" style={{ borderColor: "#e5e7eb" }}>
          <p style={{ fontSize: "12px", color: "#9ca3af" }}>
            Appercut sp z o o · Warsaw, Twarda 18, 00-105
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense>
      <LandingContent />
    </Suspense>
  );
}
