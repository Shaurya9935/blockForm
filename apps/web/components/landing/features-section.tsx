"use client";

import { FeaturePixelVisual } from "./pixel-art";

export function FeaturesSection() {
  const features = [
    {
      type: 'blocks' as const,
      tag: 'BLOCKS',
      tagColor: '#6abf3c',
      title: 'Build with Blocks',
      desc: 'Dynamic questions, validations, required fields and conditional logic — assembled block by block.',
    },
    {
      type: 'world' as const,
      tag: 'WORLDS',
      tagColor: '#a78bfa',
      title: 'Choose Your World',
      desc: 'Custom themes inspired by games, movies, anime, technology and communities. Your form, your world.',
    },
    {
      type: 'share' as const,
      tag: 'SHARE',
      tagColor: '#60a5fa',
      title: 'Share Anywhere',
      desc: 'Publish public or unlisted forms. Share with a link or QR code. Embed anywhere.',
    },
    {
      type: 'analytics' as const,
      tag: 'ANALYTICS',
      tagColor: '#f59e0b',
      title: 'Understand Your Responses',
      desc: 'Analytics, charts, response filtering and exports. Turn every response into a signal.',
    },
  ];

  return (
    <section style={{ padding: '100px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div
            style={{
              display: 'inline-block',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 9,
              color: '#4e5a6a',
              letterSpacing: '2px',
              marginBottom: 16,
              textTransform: 'uppercase',
            }}
          >
            FEATURES
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 800,
              letterSpacing: '-1px',
              color: '#eceae4',
            }}
          >
            Everything you need to{' '}
            <span style={{ color: '#6abf3c' }}>build your form.</span>
          </h2>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
          }}
          className="bf-features-grid"
        >
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#161b22',
                border: '1px solid #21262d',
                borderRadius: 12,
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                transition: 'border-color 0.2s, transform 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = f.tagColor;
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = '#21262d';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 72,
                  height: 56,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: `${f.tagColor}10`,
                  borderRadius: 8,
                  border: `1px solid ${f.tagColor}22`,
                }}
              >
                <FeaturePixelVisual type={f.type} />
              </div>

              {/* Tag */}
              <div>
                <span
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 7,
                    color: f.tagColor,
                    letterSpacing: '1px',
                  }}
                >
                  {f.tag}
                </span>
              </div>

              <div>
                <h3
                  style={{
                    margin: '0 0 10px',
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#eceae4',
                    letterSpacing: '-0.3px',
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: '#6e7a8a' }}>
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
