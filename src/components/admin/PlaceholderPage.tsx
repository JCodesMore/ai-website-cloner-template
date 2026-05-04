interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: string;
}

export function PlaceholderPage({ title, description, icon = "🚧" }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h2 className="text-display text-warm-white text-2xl tracking-wide mb-3">{title}</h2>
      <p className="text-warm-white/40 text-sm font-body max-w-md leading-relaxed">{description}</p>
    </div>
  );
}
