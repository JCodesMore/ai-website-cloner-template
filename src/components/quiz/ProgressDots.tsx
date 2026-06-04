interface ProgressDotsProps {
  currentSection: number;
  totalSections?: number;
  dark?: boolean;
}

export function ProgressDots({
  currentSection,
  totalSections = 4,
  dark = false,
}: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center w-full px-4 mb-4" style={{ maxWidth: "320px", margin: "0 auto 16px" }}>
      {Array.from({ length: totalSections }).map((_, i) => (
        <div key={i} className="flex items-center flex-1">
          <div
            className="flex-shrink-0 transition-all duration-300"
            style={{
              width: i === currentSection ? "16px" : "10px",
              height: i === currentSection ? "16px" : "10px",
              borderRadius: "50%",
              backgroundColor:
                i === currentSection
                  ? dark ? "#e44240" : "#111113"
                  : dark ? "#333e51" : "#d1d5db",
            }}
          />
          {i < totalSections - 1 && (
            <div
              className="flex-1 mx-1"
              style={{
                height: "2px",
                backgroundColor: dark ? "#333e51" : "#d1d5db",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
