export function LogoShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 42 46" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g clipPath="url(#logo-shape-clip)">
        <path d="M8.20548 0H6.85254V35.9496H8.20548V0Z" fill="currentColor" stroke="currentColor" strokeWidth="0.343067" />
        <path d="M25.0207 28.2186H23.6677V46.0001H25.0207V28.2186Z" fill="currentColor" stroke="currentColor" strokeWidth="0.343067" />
        <path d="M34.1047 10.0503H32.7517V28.2184H34.1047V10.0503Z" fill="currentColor" stroke="currentColor" strokeWidth="0.343067" />
        <path d="M33.437 17.0963H0V18.4493H33.437V17.0963Z" fill="currentColor" stroke="currentColor" strokeWidth="0.343067" />
        <path d="M41.1681 27.5333H7.53784V28.8863H41.1681V27.5333Z" fill="currentColor" stroke="currentColor" strokeWidth="0.343067" />
      </g>
      <defs>
        <clipPath id="logo-shape-clip">
          <rect width="41.1681" height="46" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function LogoH({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 113 207" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M21.7559 206.746H0.762695V0H21.7559V206.746ZM82.6737 113.138H30.753V93.0449H82.6737V113.138ZM112.701 206.746H91.7083V0H112.701V206.746Z" />
    </svg>
  );
}

export function LogoT({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 116 208" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M116.137 20.1209H0V0.627197H116.137V20.1209ZM68.7153 207.373H47.7221V29.118H68.7153V207.373Z" />
    </svg>
  );
}

export function LogoA({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 139 208" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M22.2931 207.746H1L53.5205 5.49854H55.02L64.6169 44.2235L22.2931 207.746ZM137.231 207.746H115.638L103.042 158.224H44.5234L49.6218 139.03H98.8433L62.8175 1H83.5108L137.231 207.746Z" />
    </svg>
  );
}

export function ArrowDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 9.2 5.2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M5.2,3.6C5.2,3.3,4.9,3,4.6,3S4,3.3,4,3.6H5.2z M4.2,5C4.4,5.3,4.8,5.3,5,5l4-4c0.2-0.2,0.2-0.6,0-0.9 c-0.2-0.2-0.6-0.2-0.9,0L4.6,3.7L1.1,0.2c-0.2-0.2-0.6-0.2-0.9,0c-0.2,0.2-0.2,0.6,0,0.9L4.2,5z M4,3.6v1h1.2v-1H4z" />
    </svg>
  );
}

export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12.3 11.8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M11.3,11.8c-0.1,0-0.3,0-0.4-0.1L0.1,0.9C0,0.7,0,0.3,0.1,0.1s0.5-0.2,0.7,0L11.7,11c0.2,0.2,0.2,0.5,0,0.7C11.6,11.8,11.4,11.8,11.3,11.8z" />
      <path d="M1,11.8c-0.1,0-0.3,0-0.4-0.1c-0.2-0.2-0.2-0.5,0-0.7L11.5,0.1C11.7,0,12,0,12.2,0.1s0.2,0.5,0,0.7L1.4,11.7C1.3,11.8,1.1,11.8,1,11.8z" />
    </svg>
  );
}

export function GridIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="1" y="1" width="7" height="7" />
      <rect x="12" y="1" width="7" height="7" />
      <rect x="1" y="12" width="7" height="7" />
      <rect x="12" y="12" width="7" height="7" />
    </svg>
  );
}

export function ListIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="1" y="3" width="18" height="2" />
      <rect x="1" y="9" width="18" height="2" />
      <rect x="1" y="15" width="18" height="2" />
    </svg>
  );
}
