import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const JUMP_URLS_PATH = resolve(process.cwd(), "src/data/productJumpUrls.json");

function loadJumpUrls(): Record<string, string> {
  if (!existsSync(JUMP_URLS_PATH)) return {};
  try {
    return JSON.parse(readFileSync(JUMP_URLS_PATH, "utf-8"));
  } catch {
    return {};
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const urls = loadJumpUrls();
  const target = urls[id];

  if (target) {
    // External URL → redirect directly
    if (target.startsWith("http")) {
      return NextResponse.redirect(target, 302);
    }
    // Relative URL → resolve against site root
    return NextResponse.redirect(new URL(target, "https://yinmaiquan.com"), 302);
  }

  // Fallback: redirect to product detail page
  return NextResponse.redirect(new URL(`/products/detail/${id}`, _request.url), 302);
}
