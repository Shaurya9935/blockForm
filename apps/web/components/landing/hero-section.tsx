"use client";

import { GrassBlock, StoneBlock } from "./pixel-art";

function FormBuilderMockup() {
  const blocks = [
    {
      type: 'TEXT',
      label: 'Full Name',
      color: '#6abf3c',
      bg: 'rgba(106,191,60,0.08)',
      border: 'rgba(106,191,60,0.3)',
      icon: '✏',
    },
    {
      type: 'EMAIL',
      label: 'Work Email',
      color: '#60a5fa',
      bg: 'rgba(96,165,250,0.08)',
      border: 'rgba(96,165,250,0.3)',
      icon: '@',
    },
    {
      type: 'RATING',
      label: 'How did we do?',
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.08)',
      border: 'rgba(245,158,11,0.3)',
      icon: '★',
    },
    {
      type: 'SELECT',
      label: 'Team Size',
      color: '#a78bfa',
      bg: 'rgba(167,139,250,0.08)',
      border: 'rgba(167,139,250,0.3)',
      icon: '▾',
    },
  ];

  return (
    <div className="bf-animate-float-slow" style={{ position: 'relative', width: '100%', maxWidth: 420 }}>
      {/* Glow base */}
      <div
        style={{
          position: 'absolute',
          inset: -40,
          background:
            'radial-gradient(ellipse at 50% 60%, rgba(106,191,60,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main builder card */}
      <div
        style={{
          backgroundColor: '#161b22',
          border: '1px solid #2d3741',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        {/* Window chrome */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 14px',
            borderBottom: '1px solid #21262d',
            backgroundColor: '#0d1117',
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#ff5f57' }} />
          <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#febc2e' }} />
          <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#28c840' }} />
          <div
            style={{
              flex: 1,
              marginLeft: 8,
              backgroundColor: '#1f2630',
              borderRadius: 4,
              padding: '3px 10px',
              fontSize: 11,
              color: '#4e5a6a',
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            blockform.app/my-feedback-form
          </div>
        </div>

        {/* Builder layout */}
        <div style={{ display: 'flex', minHeight: 360 }}>
          {/* Question blocks panel */}
          <div
            style={{
              flex: 1,
              padding: 16,
              borderRight: '1px solid #21262d',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div
              style={{
                fontSize: 9,
                fontFamily: "'Press Start 2P', monospace",
                color: '#4e5a6a',
                marginBottom: 4,
                letterSpacing: '0.5px',
              }}
            >
              BLOCKS
            </div>
            {blocks.map((block, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: block.bg,
                  border: `1px solid ${block.border}`,
                  borderRadius: 6,
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  transition: 'transform 0.15s',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.transform = 'translateX(2px)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.transform = 'translateX(0)')
                }
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    backgroundColor: block.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    color: '#0d1117',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {block.icon}
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#eceae4', fontWeight: 600, lineHeight: 1.2 }}>
                    {block.label}
                  </div>
                  <div
                    style={{
                      fontSize: 8,
                      fontFamily: "'Press Start 2P', monospace",
                      color: block.color,
                      marginTop: 2,
                      opacity: 0.8,
                    }}
                  >
                    {block.type}
                  </div>
                </div>
              </div>
            ))}

            {/* Add block button */}
            <div
              style={{
                border: '1px dashed #2d3741',
                borderRadius: 6,
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                color: '#4e5a6a',
                fontSize: 12,
                cursor: 'pointer',
                marginTop: 4,
              }}
            >
              <span style={{ fontSize: 16 }}>+</span> Add Block
            </div>
          </div>

          {/* Properties panel */}
          <div style={{ width: 140, padding: 14 }}>
            <div
              style={{
                fontSize: 9,
                fontFamily: "'Press Start 2P', monospace",
                color: '#4e5a6a',
                marginBottom: 12,
                letterSpacing: '0.5px',
              }}
            >
              PROPS
            </div>
            {[
              { label: 'Required', value: true },
              { label: 'Placeholder', value: '...' },
              { label: 'Max length', value: '120' },
            ].map((prop, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: '#6e7a8a', marginBottom: 4 }}>{prop.label}</div>
                {typeof prop.value === 'boolean' ? (
                  <div
                    style={{
                      width: 32,
                      height: 16,
                      backgroundColor: '#6abf3c',
                      borderRadius: 8,
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        right: 2,
                        top: 2,
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: '#fff',
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      backgroundColor: '#1f2630',
                      border: '1px solid #2d3741',
                      borderRadius: 4,
                      padding: '4px 8px',
                      fontSize: 11,
                      color: '#8b9ab0',
                    }}
                  >
                    {prop.value}
                  </div>
                )}
              </div>
            ))}

            {/* Mini preview */}
            <div style={{ marginTop: 16, borderTop: '1px solid #21262d', paddingTop: 12 }}>
              <div style={{ fontSize: 9, fontFamily: "'Press Start 2P', monospace", color: '#4e5a6a', marginBottom: 8 }}>
                PREVIEW
              </div>
              <div
                style={{
                  backgroundColor: '#0d1117',
                  borderRadius: 6,
                  padding: 10,
                  border: '1px solid #21262d',
                }}
              >
                <div style={{ fontSize: 10, color: '#8b9ab0', marginBottom: 6 }}>Full Name</div>
                <div
                  style={{
                    height: 1,
                    backgroundColor: '#6abf3c',
                    width: '60%',
                    marginBottom: 6,
                  }}
                />
                <div
                  style={{
                    fontSize: 9,
                    color: '#6abf3c',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <span>Type here</span>
                  <span className="bf-animate-blink" style={{ display: 'inline-block', width: 6, height: 10, backgroundColor: '#6abf3c', marginLeft: 1 }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Publish bar */}
        <div
          style={{
            borderTop: '1px solid #21262d',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#0d1117',
          }}
        >
          <div style={{ display: 'flex', gap: 6 }}>
            {['Draft', 'Preview', 'Share'].map((tab, i) => (
              <div
                key={tab}
                style={{
                  fontSize: 11,
                  padding: '4px 10px',
                  borderRadius: 4,
                  backgroundColor: i === 0 ? '#1f2630' : 'transparent',
                  color: i === 0 ? '#eceae4' : '#4e5a6a',
                  cursor: 'pointer',
                }}
              >
                {tab}
              </div>
            ))}
          </div>
          <div
            style={{
              backgroundColor: '#6abf3c',
              color: '#0d1117',
              fontSize: 11,
              fontWeight: 700,
              padding: '5px 12px',
              borderRadius: 5,
              cursor: 'pointer',
            }}
          >
            ▶ Publish
          </div>
        </div>
      </div>

      {/* Floating pixel decorations */}
      <div
        style={{ position: 'absolute', top: -20, right: -16, opacity: 0.8 }}
        className="bf-animate-float"
      >
        <GrassBlock size={28} />
      </div>
      <div
        style={{ position: 'absolute', bottom: 30, right: -24, opacity: 0.6 }}
        className="bf-animate-float"
      >
        <StoneBlock size={20} />
      </div>
      <div style={{ position: 'absolute', top: 60, left: -28, opacity: 0.5 }}>
        <GrassBlock size={18} />
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section
      style={{
        minHeight: '100vh',
        paddingTop: 120,
        paddingBottom: 80,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(106,191,60,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(106,191,60,0.04) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at 50% 0%, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, black 40%, transparent 80%)',
        }}
      />

      {/* Radial glow top */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 800,
          height: 400,
          background: 'radial-gradient(ellipse, rgba(106,191,60,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            alignItems: 'center',
          }}
          className="bf-hero-grid"
        >
          {/* Left column */}
          <div>
            {/* Eyebrow badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  backgroundColor: 'rgba(106,191,60,0.1)',
                  border: '1px solid rgba(106,191,60,0.25)',
                  borderRadius: 100,
                  padding: '6px 14px',
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: 1, backgroundColor: '#6abf3c' }} />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#6abf3c',
                    letterSpacing: '0.5px',
                  }}
                >
                  Now in public beta
                </span>
              </div>
            </div>

            {/* Heading */}
            <h1
              style={{
                margin: '0 0 20px',
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-1.5px',
                color: '#eceae4',
              }}
            >
              Build forms.{' '}
              <span
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'clamp(24px, 3.5vw, 44px)',
                  color: '#6abf3c',
                  display: 'block',
                  marginTop: 8,
                  letterSpacing: '-1px',
                  textShadow: '0 0 40px rgba(106,191,60,0.4)',
                }}
              >
                Block by block.
              </span>
            </h1>

            <p
              style={{
                margin: '0 0 40px',
                fontSize: 18,
                lineHeight: 1.7,
                color: '#8b9ab0',
                maxWidth: 480,
                fontWeight: 400,
              }}
            >
              Create beautiful forms, share them anywhere, and turn every response into something
              you can build on.
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                style={{
                  backgroundColor: '#6abf3c',
                  color: '#0d1117',
                  border: 'none',
                  borderRadius: 8,
                  padding: '14px 28px',
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily: "'Outfit', sans-serif",
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 20px rgba(106,191,60,0.3)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#7dd44a';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 8px 30px rgba(106,191,60,0.4)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#6abf3c';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 4px 20px rgba(106,191,60,0.3)';
                }}
                onClick={() => {
                  const el = document.getElementById('cta-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <span>▶</span> Start Building
              </button>
              <button
                style={{
                  backgroundColor: 'transparent',
                  color: '#eceae4',
                  border: '1px solid #2d3741',
                  borderRadius: 8,
                  padding: '14px 28px',
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: "'Outfit', sans-serif",
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#6abf3c';
                  (e.currentTarget as HTMLElement).style.color = '#6abf3c';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#2d3741';
                  (e.currentTarget as HTMLElement).style.color = '#eceae4';
                }}
              >
                Explore Forms
              </button>
            </div>

            {/* Trust row */}
            <div
              style={{
                marginTop: 40,
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', gap: -4 }}>
                  {['#6abf3c', '#60a5fa', '#f59e0b', '#a78bfa', '#f472b6'].map((c, i) => (
                    <div
                      key={i}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: c,
                        border: '2px solid #0d1117',
                        marginLeft: i > 0 ? -8 : 0,
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: 13, color: '#6e7a8a' }}>10K+ builders</span>
              </div>
              <div style={{ width: 1, height: 16, backgroundColor: '#21262d' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#f59e0b', fontSize: 14 }}>★★★★★</span>
                <span style={{ fontSize: 13, color: '#6e7a8a' }}>4.9 / 5</span>
              </div>
            </div>
          </div>

          {/* Right column — Form Builder Mockup */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <FormBuilderMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
