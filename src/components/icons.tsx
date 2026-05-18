import type { SVGProps } from "react";

/**
 * The Aurora monogram — four bean-shaped quadrants made of two concentric
 * arcs each, arranged in an interlocking S / figure-8. Used as the hero
 * watermark and as the mark in the wordmark logo.
 */
export function AuroraMonogram(props: SVGProps<SVGSVGElement>) {
  // viewBox 200x200, two halves vertically split with a tiny gap.
  // Top-left bean: outer arc (r=100) from top-center down to left-middle,
  //                inner arc (r=50) back from left-middle-inner to top-center-inner.
  // The other three quadrants are rotated copies.
  const bean = "M 100 0 A 100 100 0 0 0 0 100 L 50 100 A 50 50 0 0 1 100 50 Z";
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      {...props}
    >
      {/* top-left */}
      <path d={bean} />
      {/* top-right — mirrored horizontally */}
      <g transform="translate(200 0) scale(-1 1)">
        <path d={bean} />
      </g>
      {/* bottom-right — rotated 180° */}
      <g transform="translate(200 200) rotate(180)">
        <path d={bean} />
      </g>
      {/* bottom-left — mirrored vertically */}
      <g transform="translate(0 200) scale(1 -1)">
        <path d={bean} />
      </g>
    </svg>
  );
}

export function AuroraLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 163 45" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g>
        <path d="M0 30 L11 0 L22 30 Z M5.5 22 L16.5 22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      </g>
      <text x="34" y="22" fontFamily="Almarena, sans-serif" fontSize="20" fontWeight="700" fill="currentColor">Aurora</text>
      <text x="34" y="38" fontFamily="Almarena, sans-serif" fontSize="11" fontWeight="400" fill="currentColor">Agency</text>
    </svg>
  );
}

export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M1 10 H22 M14 2 L23 10 L14 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M24 10 H3 M11 2 L2 10 L11 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 19 26" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2 1 L18 13 L2 25 Z" />
    </svg>
  );
}

export function ScrollCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5 5 L19 19 M19 5 L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function BurgerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4 8 H20 M4 16 H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SwirlIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 31 30" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M15 4 C8 4 4 8 4 15 C4 22 8 26 15 26 C22 26 26 22 26 15 C26 12 24 10 21 10 C18 10 16 12 16 15 C16 17 17 18 19 18 C20 18 21 17 21 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="21" cy="16" r="1.5" />
    </svg>
  );
}
