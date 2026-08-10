"use client";

export function Footer() {
  const links = {
    Product: ['Form Builder', 'Templates', 'Themes', 'Analytics', 'API'],
    Company: ['About', 'Blog', 'Changelog', 'Roadmap', 'Careers'],
    Legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
  };

  return (
    <footer
      style={{
        backgroundColor: '#0a0e14',
        borderTop: '1px solid #21262d',
        padding: '64px 24px 40px',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: 48,
            marginBottom: 56,
          }}
          className="bf-footer-grid"
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                <div style={{ width: 10, height: 10, backgroundColor: '#6abf3c', borderRadius: 1 }} />
                <div style={{ width: 10, height: 10, backgroundColor: '#4e9c2e', borderRadius: 1, marginTop: 5 }} />
              </div>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 12, color: '#eceae4' }}>
                Block<span style={{ color: '#6abf3c' }}>Form</span>
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: '#4e5a6a', lineHeight: 1.7, maxWidth: 260 }}>
              Build beautiful forms, block by block. The form builder for creators who care about craft.
            </p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <div
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 7,
                  color: '#4e5a6a',
                  letterSpacing: '1px',
                  marginBottom: 16,
                }}
              >
                {category.toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map((item) => (
                  <a
                    key={item}
                    href="#"
                    style={{
                      fontSize: 14,
                      color: '#6e7a8a',
                      textDecoration: 'none',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#eceae4')}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#6e7a8a')}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid #21262d',
            paddingTop: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 12, color: '#4e5a6a' }}>
            © 2024 BlockForm. Built block by block.
          </span>
          <div style={{ display: 'flex', gap: 16 }}>
            {['Twitter', 'GitHub', 'Discord'].map((s) => (
              <a
                key={s}
                href="#"
                style={{ fontSize: 12, color: '#4e5a6a', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#6abf3c')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#4e5a6a')}
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
