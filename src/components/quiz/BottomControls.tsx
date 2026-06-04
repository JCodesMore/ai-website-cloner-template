import Link from "next/link";

interface BottomControlsProps {
  onNext?: () => void;
  nextHref?: string;
  backHref?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  dark?: boolean;
  nextRed?: boolean;
}

export function BottomControls({
  onNext,
  nextHref,
  backHref,
  nextLabel = "Avançar",
  nextDisabled = false,
  dark = false,
  nextRed = false,
}: BottomControlsProps) {
  const bgGradient = dark
    ? "linear-gradient(180deg, transparent 0%, #111113 30%)"
    : "linear-gradient(180deg, transparent 0%, #ffffff 30%)";

  const nextBg = nextRed ? "#e44240" : dark ? "#282828" : "#111113";
  const nextDisabledBg = dark ? "#282828" : "#e5e7eb";
  const nextDisabledColor = dark ? "#6b7280" : "#9ca3af";

  const NextButton = nextHref ? (
    <Link
      href={nextHref}
      className="flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-95"
      style={{
        backgroundColor: nextDisabled ? nextDisabledBg : nextBg,
        color: nextDisabled ? nextDisabledColor : "#ffffff",
        borderRadius: "20px",
        padding: "14px 28px",
        fontSize: "16px",
        minWidth: "160px",
        textDecoration: "none",
        pointerEvents: nextDisabled ? "none" : "auto",
      }}
    >
      {nextLabel} →
    </Link>
  ) : (
    <button
      onClick={onNext}
      disabled={nextDisabled}
      className="flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-95"
      style={{
        backgroundColor: nextDisabled ? nextDisabledBg : nextBg,
        color: nextDisabled ? nextDisabledColor : "#ffffff",
        borderRadius: "20px",
        padding: "14px 28px",
        fontSize: "16px",
        minWidth: "160px",
        cursor: nextDisabled ? "not-allowed" : "pointer",
      }}
    >
      {nextLabel} →
    </button>
  );

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex justify-center"
      style={{ background: bgGradient, paddingBottom: "24px", paddingTop: "48px" }}
    >
      <div
        className="flex items-center justify-center gap-3 w-full px-4"
        style={{ maxWidth: "600px" }}
      >
        {backHref ? (
          <Link
            href={backHref}
            className="flex items-center justify-center gap-2 font-medium transition-all duration-200"
            style={{
              backgroundColor: dark ? "#282828" : "#f1f3f9",
              color: dark ? "#9ca3af" : "#6b7280",
              borderRadius: "20px",
              padding: "14px 28px",
              fontSize: "16px",
              minWidth: "120px",
              textDecoration: "none",
            }}
          >
            ← Voltar
          </Link>
        ) : (
          <div style={{ minWidth: "120px" }} />
        )}
        {NextButton}
      </div>
    </div>
  );
}
