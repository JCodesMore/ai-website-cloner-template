export default function GlobalLoading() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f6f8" }}>
      <div style={{ textAlign: "center", color: "#999", fontSize: 14 }}>
        <div style={{ width: 32, height: 32, border: "3px solid #f0f0f0", borderTopColor: "#ff5f16", borderRadius: "50%", margin: "0 auto 12px", animation: "spin 0.6s linear infinite" }} />
        加载中...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
