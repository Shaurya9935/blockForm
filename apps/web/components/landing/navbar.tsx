"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottom: '1px solid #21262d',
        backgroundColor: 'rgba(13,17,23,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ display: 'flex', gap: 2 }}>
              <div style={{ width: 10, height: 10, backgroundColor: '#6abf3c', borderRadius: 1 }} />
              <div style={{ width: 10, height: 10, backgroundColor: '#4e9c2e', borderRadius: 1, marginTop: 5 }} />
            </div>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 13, color: '#eceae4', letterSpacing: '-0.5px' }}>
              Block<span style={{ color: '#6abf3c' }}>Form</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="bf-hidden-mobile">
            {['Product', 'Templates', 'Pricing', 'API'].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  color: '#8b9ab0',
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#eceae4')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#8b9ab0')}
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link
              href="/signin"
              style={{ color: '#8b9ab0', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}
              className="bf-hidden-mobile"
            >
              Login
            </Link>
            <button
              onClick={() => router.push('/signup')}
              style={{
                backgroundColor: '#6abf3c',
                color: '#0d1117',
                border: 'none',
                borderRadius: 6,
                padding: '8px 18px',
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "'Outfit', sans-serif",
                cursor: 'pointer',
                transition: 'background-color 0.15s, transform 0.1s',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#7dd44a';
                (e.target as HTMLElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#6abf3c';
                (e.target as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              Start Building
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: '#eceae4',
                cursor: 'pointer',
                padding: 4,
              }}
              className="bf-show-mobile"
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <rect x="0" y="4" width="20" height="2" />
                <rect x="0" y="9" width="20" height="2" />
                <rect x="0" y="14" width="20" height="2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            style={{
              borderTop: '1px solid #21262d',
              padding: '16px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {['Product', 'Templates', 'Pricing', 'API'].map((item) => (
              <a
                key={item}
                href="#"
                style={{ color: '#8b9ab0', fontSize: 15, textDecoration: 'none' }}
              >
                {item}
              </a>
            ))}
            <Link
              href="/signin"
              style={{ color: '#8b9ab0', fontSize: 15, textDecoration: 'none' }}
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>
            <button
              onClick={() => {
                setMobileOpen(false);
                router.push('/signup');
              }}
              style={{
                backgroundColor: '#6abf3c',
                color: '#0d1117',
                border: 'none',
                borderRadius: 6,
                padding: '8px 18px',
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "'Outfit', sans-serif",
                cursor: 'pointer',
                alignSelf: 'flex-start',
              }}
            >
              Start Building
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
