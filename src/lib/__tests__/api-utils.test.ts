import { describe, it, expect } from "vitest";
import { checkCsrf } from "@/lib/api-utils";
import { NextRequest } from "next/server";

function makeReq(method: string, headers: Record<string, string> = {}): NextRequest {
  const url = new URL("http://localhost:3000/api/test");
  const init: any = { method };
  if (Object.keys(headers).length > 0) {
    init.headers = new Headers(headers);
  }
  return new NextRequest(url, init);
}

describe("checkCsrf", () => {
  it("allows GET requests without origin check", () => {
    const req = makeReq("GET");
    expect(checkCsrf(req)).toBeNull();
  });

  it("allows POST from same origin", () => {
    const req = makeReq("POST", { origin: "http://localhost:3000", host: "localhost:3000" });
    expect(checkCsrf(req)).toBeNull();
  });

  it("blocks POST from different origin", () => {
    const req = makeReq("POST", { origin: "https://evil.com", host: "localhost:3000" });
    const result = checkCsrf(req);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(403);
  });

  it("allows POST without origin header (direct request)", () => {
    const req = makeReq("POST");
    expect(checkCsrf(req)).toBeNull();
  });

  it("allows POST with empty origin", () => {
    const req = makeReq("POST", { origin: "", host: "localhost:3000" });
    expect(checkCsrf(req)).toBeNull();
  });

  it("blocks PUT from different origin", () => {
    const req = makeReq("PUT", { origin: "https://attacker.example", host: "yinmaiquan.com" });
    const result = checkCsrf(req);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(403);
  });

  it("allows DELETE from same origin with port", () => {
    const req = makeReq("DELETE", { origin: "http://localhost:3000", host: "localhost:3000" });
    expect(checkCsrf(req)).toBeNull();
  });

  it("blocks POST when origin port differs", () => {
    const req = makeReq("POST", { origin: "http://localhost:4000", host: "localhost:3000" });
    const result = checkCsrf(req);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(403);
  });

  it("returns Chinese error message for blocked request", async () => {
    const req = makeReq("POST", { origin: "https://bad.example", host: "localhost:3000" });
    const result = checkCsrf(req);
    const body = await result!.json();
    expect(body.error).toBe("请求来源不合法");
  });
});
