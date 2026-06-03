"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f6f8" }}>
      <div style={{ textAlign: "center", padding: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>页面加载异常</h2>
        <p style={{ fontSize: 14, color: "#999", marginBottom: 20 }}>请稍后重试</p>
        <button onClick={reset}
          style={{ padding: "10px 32px", borderRadius: 8, background: "#ff5f16", border: "none", color: "#fff", fontSize: 14, cursor: "pointer" }}>
          重新加载
        </button>
      </div>
    </div>
  );
}
