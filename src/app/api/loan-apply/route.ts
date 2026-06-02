import { db, schema } from "@/lib/db";
import { checkCsrf } from "@/lib/api-utils";
import { rateLimit } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const csrf = checkCsrf(request);
  if (csrf) return csrf;

  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const rl = rateLimit(`loan-apply:${ip}`, 3, 60_000);
  if (!rl.ok) return NextResponse.json({ ok: false, message: "请求过于频繁，请稍后再试" }, { status: 429 });

  try {
    const { type, phone, amount, name, purpose, city } = await request.json();

    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ ok: false, message: "请输入正确的手机号码" }, { status: 400 });
    }
    const validAmounts = ["5万以下", "5-10万", "10-20万", "20-50万", "50-100万", "100-300万", "300-500万", "500-1000万", "1000万以上", "未填写", ""];
    if (amount && !validAmounts.includes(amount)) {
      return NextResponse.json({ ok: false, message: "请选择有效的期望金额" }, { status: 400 });
    }

    const extra: Record<string, string> = {};
    if (name) extra.name = name.slice(0, 20);
    if (purpose) extra.purpose = purpose;
    if (city) extra.city = city;

    // Save to PostgreSQL
    await db.insert(schema.loanApplications).values({
      loanType: type || "person",
      phone,
      amount: amount || "未填写",
      status: "new",
      notes: Object.keys(extra).length > 0 ? JSON.stringify(extra) : undefined,
      createdAt: new Date(),
    });

    // Send push notification via webhook (if configured)
    const webhookUrl = process.env.NOTIFY_WEBHOOK_URL;
    if (webhookUrl) {
      let msg = `📞 新贷款申请\n类型: ${type === "company" ? "企业" : "个人"}\n手机: ${phone}\n金额: ${amount || "未填写"}`;
      if (name) msg += `\n称呼: ${name}`;
      if (purpose) msg += `\n用途: ${purpose}`;
      if (city) msg += `\n城市: ${city}`;
      msg += `\n时间: ${new Date().toLocaleString("zh-CN")}`;
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ msgtype: "text", text: { content: msg } }),
        });
      } catch { /* webhook failure is non-fatal */ }
    }

    return NextResponse.json({ ok: true, message: "申请已提交，客户经理将在1个工作日内与您联系" });
  } catch (e) {
    return NextResponse.json({ ok: false, message: "提交失败，请稍后重试" }, { status: 500 });
  }
}
