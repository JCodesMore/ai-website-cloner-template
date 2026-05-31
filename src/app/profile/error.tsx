"use client";

export default function ProfileError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="ley-inner" style={{ padding: "60px 20px", textAlign: "center" }}>
      <p style={{ fontSize: 16, color: "#ef4444", marginBottom: 16 }}>加载失败，请刷新重试</p>
      <button
        onClick={reset}
        style={{
          height: 40, padding: "0 24px", borderRadius: 8,
          background: "#ff5f16", border: "none", color: "#fff",
          fontSize: 14, fontWeight: 600, cursor: "pointer",
        }}
      >
        重试
      </button>
    </div>
  );
}
