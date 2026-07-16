import { getHomeParts } from "@/lib/page-message";

export default function Home() {
  const { before, marker, after } = getHomeParts();

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">
        {before}
        <code className="font-mono text-foreground">{marker}</code>
        {after}
      </p>
    </main>
  );
}
