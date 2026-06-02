import { db, schema } from "@/lib/db";
import { guardAdmin } from "@/lib/api-utils";
import { eq, like, and, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = await guardAdmin();
  if (auth) return auth;

  const url = new URL(req.url);
  const statusFilter = url.searchParams.get("status") || "";
  const search = url.searchParams.get("search") || "";
  const cityFilter = url.searchParams.get("city") || "";
  const purposeFilter = url.searchParams.get("purpose") || "";
  const dateFrom = url.searchParams.get("dateFrom") || "";
  const dateTo = url.searchParams.get("dateTo") || "";

  const conditions = [];
  if (statusFilter) conditions.push(eq(schema.loanApplications.status, statusFilter));
  if (search) conditions.push(like(schema.loanApplications.phone, `%${search}%`));
  if (cityFilter) conditions.push(sql`notes::jsonb->>'city' ILIKE ${'%' + cityFilter + '%'}`);
  if (purposeFilter) conditions.push(sql`notes::jsonb->>'purpose' ILIKE ${'%' + purposeFilter + '%'}`);
  if (dateFrom) conditions.push(sql`created_at::date >= ${dateFrom}::date`);
  if (dateTo) conditions.push(sql`created_at::date <= ${dateTo}::date`);
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const items = await db.select().from(schema.loanApplications).where(where).orderBy(sql`created_at desc`).limit(5000);

  const STATUS_LABELS: Record<string, string> = { new: "待联系", contacted: "已联系", followup: "跟进中", done: "已成交", rejected: "已拒绝" };

  const header = "ID,类型,称呼,手机号,金额,用途,城市,状态,备注,时间";
  const rows = items.map((item) => {
    let extra: Record<string, string> = {};
    try { if (item.notes) extra = JSON.parse(item.notes); } catch {}
    const type = item.loanType === "company" ? "企业" : "个人";
    const name = extra.name || "";
    const purpose = extra.purpose || "";
    const city = extra.city || "";
    const status = STATUS_LABELS[item.status || ""] || item.status || "";
    const notes = (item.notes || "").replace(/"/g, '""');
    const time = item.createdAt ? new Date(item.createdAt).toLocaleString("zh-CN") : "";
    return `${item.id},${type},${name},${item.phone},${item.amount},${purpose},${city},${status},"${notes}",${time}`;
  });

  const bom = "﻿";
  const csv = bom + header + "\n" + rows.join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="loan-applications-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
