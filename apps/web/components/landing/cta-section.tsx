"use client";

import { useRouter } from "next/navigation";
import { GrassBlock, PixelLandscape } from "./pixel-art";

export function CTASection() {
  const router = useRouter();

  return (
    <section
      id="cta-section"
      style={{
        padding: '100px 24px 0',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#0a0e14',
        borderTop: '1px solid #21262d',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 300,
          background: 'radial-gradient(ellipse, rgba(106,191,60,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <div
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 9,
            color: '#4e5a6a',
            letterSpacing: '2px',
            marginBottom: 24,
          }}
        >
          GET STARTED
        </div>
        <h2
          style={{
            margin: '0 0 20px',
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 800,
            letterSpacing: '-1.5px',
            color: '#eceae4',
            lineHeight: 1.1,
          }}
        >
          Ready to build{' '}
          <span style={{ color: '#6abf3c', textShadow: '0 0 40px rgba(106,191,60,0.4)' }}>
            something?
          </span>
        </h2>
        <p
          style={{
            margin: '0 auto 40px',
            fontSize: 17,
            lineHeight: 1.7,
            color: '#6e7a8a',
            maxWidth: 480,
          }}
        >
          Join 10,000+ builders. Start with a blank canvas or pick a blueprint — your first form is free, forever.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => router.push('/signup')}
            style={{
              backgroundColor: '#6abf3c',
              color: '#0d1117',
              border: 'none',
              borderRadius: 10,
              padding: '16px 36px',
              fontSize: 16,
              fontWeight: 700,
              fontFamily: "'Outfit', sans-serif",
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              transition: 'all 0.2s',
              boxShadow: '0 4px 24px rgba(106,191,60,0.35)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#7dd44a';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(106,191,60,0.5)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#6abf3c';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(106,191,60,0.35)';
            }}
          >
            <GrassBlock size={18} />
            Create Your First Form
          </button>
        </div>

        <p style={{ marginTop: 16, fontSize: 12, color: '#4e5a6a' }}>
          No credit card required · Free forever plan available
        </p>
      </div>

      {/* Pixel landscape at bottom */}
      <div style={{ marginTop: 60 }}>
        <PixelLandscape />
      </div>
    </section>
  );
}
