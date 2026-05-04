// Login page gets its own layout — no sidebar, no auth provider wrapping
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
