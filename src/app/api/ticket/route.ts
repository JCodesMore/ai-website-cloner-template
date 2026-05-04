import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type TicketPayload = {
  source: "page-request" | "settings-change";
  page?: string;
  setting?: string;
  request: string;
  priority?: "low" | "normal" | "high";
};

export async function POST(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json(
      { ok: false, error: "Telegram credentials not configured" },
      { status: 500 }
    );
  }

  let body: TicketPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.request || typeof body.request !== "string" || body.request.trim().length === 0) {
    return NextResponse.json({ ok: false, error: "Request text required" }, { status: 400 });
  }

  const priorityIcon = { low: "🟢", normal: "🔵", high: "🔴" }[body.priority ?? "normal"] ?? "🔵";
  const sourceLabel = body.source === "settings-change" ? "Settings change" : "Page change";
  const target = body.source === "settings-change" ? body.setting : body.page;

  const lines = [
    `🎫 *New ticket from Bajablue admin*`,
    ``,
    `*Type:* ${sourceLabel}`,
    target ? `*Target:* ${target}` : null,
    `*Priority:* ${priorityIcon} ${(body.priority ?? "normal").toUpperCase()}`,
    ``,
    `*Request:*`,
    body.request.trim(),
    ``,
    `_${new Date().toISOString()}_`,
  ].filter(Boolean) as string[];

  const telegramRes = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join("\n"),
        parse_mode: "Markdown",
      }),
    }
  );

  if (!telegramRes.ok) {
    const detail = await telegramRes.text();
    return NextResponse.json(
      { ok: false, error: "Telegram delivery failed", detail },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
