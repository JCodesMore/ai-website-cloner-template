import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

const PLAN_PRICES: Record<string, number> = {
  week: 1300,    // $13.00
  month: 3200,   // $32.00
  quarter: 5100, // $51.00
};

const PLAN_NAMES: Record<string, string> = {
  week: "Dr. Kegel — Plano 1 Semana",
  month: "Dr. Kegel — Plano 1 Mês",
  quarter: "Dr. Kegel — Plano 3 Meses",
};

export async function POST(req: NextRequest) {
  try {
    const { planId, email } = await req.json();

    if (!planId || !PLAN_PRICES[planId]) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: PLAN_NAMES[planId],
              description: "Plano personalizado de exercícios Kegel para saúde masculina",
            },
            unit_amount: PLAN_PRICES[planId],
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/pt-br/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pt-br/landing`,
      metadata: { planId, email: email || "" },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
