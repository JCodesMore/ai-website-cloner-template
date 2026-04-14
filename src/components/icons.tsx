// Inline SVG icons for the HBO Max Help Center clone.
// Each uses currentColor so parent text color drives the fill/stroke.

import type { SVGProps } from "react";

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 12 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={12}
      height={8}
      {...props}
    >
      <path
        d="M1 1.5L6 6.5L11 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 27 27"
      xmlns="http://www.w3.org/2000/svg"
      width={14}
      height={14}
      {...props}
    >
      <path
        d="M3 3 L24 24 M24 3 L3 24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      {...props}
    >
      <circle
        cx="9"
        cy="9"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M14 14L18 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function InfoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      {...props}
    >
      <circle cx="16" cy="16" r="15" fill="#71B8F2" />
      <circle cx="16" cy="10" r="1.8" fill="white" />
      <rect x="14.5" y="13.5" width="3" height="10" rx="1.1" fill="white" />
    </svg>
  );
}

export function GlobeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={14}
      height={14}
      {...props}
    >
      <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="10" cy="10" rx="4" ry="8.5" stroke="currentColor" strokeWidth="1.2" />
      <line x1="1.5" y1="10" x2="18.5" y2="10" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function HboMaxLogo(props: SVGProps<SVGSVGElement>) {
  // Stylized "HBO max" lockup — white.
  return (
    <svg
      viewBox="0 0 67 43"
      xmlns="http://www.w3.org/2000/svg"
      width={67}
      height={43}
      aria-label="HBO Max"
      {...props}
    >
      <g fill="#fff">
        {/* HBO row */}
        <text
          x="0"
          y="17"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="17"
          fontWeight="900"
          letterSpacing="-0.5"
        >
          HB
        </text>
        <circle cx="42" cy="11" r="6.5" stroke="#fff" strokeWidth="2" fill="none" />
        {/* max row */}
        <text
          x="14"
          y="38"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="16"
          fontWeight="700"
          letterSpacing="-0.5"
        >
          max
        </text>
      </g>
    </svg>
  );
}

export function TwitterXIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="currentColor"
      {...props}
    >
      <path d="M18.244 2H21.5l-7.52 8.59L23 22h-6.8l-5.33-6.97L4.64 22H1.38l8.04-9.19L1 2h6.94l4.83 6.39L18.244 2ZM17.08 20h1.86L7.01 4h-1.99l12.06 16Z" />
    </svg>
  );
}

export function BulletDot(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 8 8"
      xmlns="http://www.w3.org/2000/svg"
      width={6}
      height={6}
      {...props}
    >
      <circle cx="4" cy="4" r="3" fill="currentColor" />
    </svg>
  );
}
