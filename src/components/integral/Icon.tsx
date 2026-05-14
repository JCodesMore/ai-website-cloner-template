/**
 * Tiny inline SVG icon. Takes a `path` prop (the `d` attribute of one or
 * more concatenated paths) and renders a 24×24 stroke icon.
 */
export function Icon({
  path,
  className,
  size = 24,
}: {
  path: string;
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {path.split("M").slice(1).map((p, i) => (
        <path key={i} d={"M" + p.trim()} />
      ))}
    </svg>
  );
}
