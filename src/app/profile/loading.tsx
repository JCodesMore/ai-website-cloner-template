export default function ProfileLoading() {
  const block = {
    background: "#f0f0f0", borderRadius: 8, height: 16,
  };
  return (
    <div className="ley-inner" style={{ padding: "30px 20px 60px", maxWidth: 800, margin: "0 auto" }}>
      <div style={{ width: 160, height: 28, background: "#f0f0f0", borderRadius: 8, marginBottom: 24 }} />
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, marginBottom: 20 }}>
        <div style={{ width: 120, ...block, marginBottom: 16 }} />
        <div style={{ display: "grid", gap: 12, maxWidth: 400 }}>
          <div style={{ ...block, width: "60%" }} />
          <div style={{ ...block, width: "50%" }} />
          <div style={{ ...block, width: "70%" }} />
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, marginBottom: 20 }}>
        <div style={{ width: 120, ...block, marginBottom: 16 }} />
        <div style={{ display: "grid", gap: 10, maxWidth: 400 }}>
          <div style={{ height: 40, background: "#f0f0f0", borderRadius: 6 }} />
          <div style={{ height: 40, background: "#f0f0f0", borderRadius: 6 }} />
          <div style={{ height: 40, background: "#f0f0f0", borderRadius: 6 }} />
        </div>
      </div>
    </div>
  );
}
