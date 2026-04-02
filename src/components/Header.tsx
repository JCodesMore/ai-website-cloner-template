'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { label: 'INICIO', href: '/' },
  { label: 'NUEVAS CONSTRUCCIONES', href: '/nuevas-construcciones' },
  { label: 'SERVICIOS', href: '/servicios' },
  { label: 'MERCADOS', href: '/mercados' },
  { label: 'PARTNERS', href: '/partners' },
  { label: 'CONTACTO', href: '/contacto' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header style={{
      background: '#101010',
      borderBottom: '2px solid #024ffd',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      height: 64,
      display: 'flex',
      alignItems: 'center',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{ fontSize: 26, lineHeight: 1 }}>🦁</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#efefef', letterSpacing: '0.12em' }}>LION</div>
            <div style={{ fontSize: 9, color: '#024ffd', letterSpacing: '0.08em', fontWeight: 600 }}>GLOBAL SALES CONSULTING</div>
          </div>
        </Link>

        <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {NAV.map(({ label, href }) => {
            const isActive = pathname === href;
            const isContact = href === '/contacto';
            return (
              <Link
                key={href}
                href={href}
                style={{
                  background: isContact ? '#024ffd' : 'none',
                  color: isContact ? '#101010' : isActive ? '#024ffd' : '#efefef',
                  fontSize: 11,
                  fontWeight: 700,
                  textDecoration: 'none',
                  letterSpacing: '0.07em',
                  padding: isContact ? '7px 18px' : '2px 0',
                  borderRadius: isContact ? 4 : 0,
                  borderBottom: !isContact && isActive ? '2px solid #024ffd' : '2px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
