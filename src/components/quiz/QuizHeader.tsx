import Image from "next/image";

interface QuizHeaderProps {
  dark?: boolean;
}

export function QuizHeader({ dark = false }: QuizHeaderProps) {
  const logoSrc = dark
    ? "https://quiz.kegel-plan.me/images/br/BR_logo_dark_bg.webp"
    : "https://quiz.kegel-plan.me/images/br/BR_logo_white_bg.webp";

  return (
    <header className="w-full flex justify-center pt-3 pb-2">
      <Image
        src={logoSrc}
        alt="header-logo"
        width={100}
        height={38}
        unoptimized
        priority
      />
    </header>
  );
}
