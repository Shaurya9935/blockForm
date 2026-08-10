"use client";

export function StatsSection() {
  const stats = [
    { value: '10K+', label: 'Forms Built', sublabel: 'Across all builders' },
    { value: '250K+', label: 'Responses Collected', sublabel: 'And counting' },
    { value: '99.9%', label: 'Uptime', sublabel: 'SLA guaranteed' },
    { value: '<2s', label: 'Load Time', sublabel: 'Global CDN delivery' },
  ];

  return (
    <section style={{ padding: '72px 24px', borderTop: '1px solid #21262d', borderBottom: '1px solid #21262d' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1,
            backgroundColor: '#21262d',
            border: '1px solid #21262d',
            borderRadius: 12,
            overflow: 'hidden',
          }}
          className="bf-stats-grid"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#0d1117',
                padding: '40px 32px',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  fontSize: 'clamp(32px, 4vw, 48px)',
                  fontWeight: 800,
                  color: '#eceae4',
                  letterSpacing: '-1.5px',
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#6abf3c', marginBottom: 4 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 12, color: '#4e5a6a' }}>{stat.sublabel}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
