"use client";

// ─── Pixel Art SVG Decorations ───────────────────────────────────────────────

export function GrassBlock({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
      <rect x="0" y="0" width="16" height="5" fill="#5D9E2F" />
      <rect x="0" y="4" width="16" height="1" fill="#4a7d26" />
      <rect x="0" y="5" width="16" height="11" fill="#8B5A2B" />
      <rect x="2" y="1" width="1" height="1" fill="#6db83a" />
      <rect x="6" y="0" width="2" height="1" fill="#6db83a" />
      <rect x="11" y="1" width="1" height="1" fill="#4a7d26" />
      <rect x="1" y="6" width="1" height="1" fill="#7a4e24" />
      <rect x="4" y="8" width="2" height="2" fill="#7a4e24" />
      <rect x="10" y="7" width="1" height="1" fill="#7a4e24" />
      <rect x="13" y="10" width="2" height="2" fill="#7a4e24" />
    </svg>
  );
}

export function StoneBlock({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
      <rect x="0" y="0" width="16" height="16" fill="#888" />
      <rect x="0" y="0" width="7" height="7" fill="#999" />
      <rect x="9" y="0" width="7" height="7" fill="#999" />
      <rect x="0" y="9" width="7" height="7" fill="#999" />
      <rect x="9" y="9" width="7" height="7" fill="#999" />
      <rect x="7" y="0" width="2" height="16" fill="#777" />
      <rect x="0" y="7" width="16" height="2" fill="#777" />
    </svg>
  );
}

export function FeaturePixelVisual({ type }: { type: 'blocks' | 'world' | 'share' | 'analytics' }) {
  if (type === 'blocks') {
    return (
      <svg width="64" height="48" viewBox="0 0 64 48" style={{ imageRendering: 'pixelated' }}>
        <rect x="4" y="24" width="16" height="16" fill="#6abf3c" />
        <rect x="4" y="24" width="16" height="4" fill="#7dd44a" />
        <rect x="4" y="28" width="4" height="12" fill="#4e9c2e" />
        <rect x="24" y="16" width="16" height="16" fill="#60a5fa" />
        <rect x="24" y="16" width="16" height="4" fill="#93c5fd" />
        <rect x="24" y="20" width="4" height="12" fill="#3b82f6" />
        <rect x="44" y="8" width="16" height="16" fill="#a78bfa" />
        <rect x="44" y="8" width="16" height="4" fill="#c4b5fd" />
        <rect x="44" y="12" width="4" height="12" fill="#7c3aed" />
        <rect x="4" y="36" width="56" height="4" fill="#21262d" />
      </svg>
    );
  }
  if (type === 'world') {
    return (
      <svg width="64" height="48" viewBox="0 0 64 48" style={{ imageRendering: 'pixelated' }}>
        <rect x="0" y="32" width="64" height="16" fill="#8B5A2B" />
        <rect x="0" y="28" width="64" height="6" fill="#5D9E2F" />
        <rect x="8" y="12" width="8" height="18" fill="#6B3D1E" />
        <rect x="4" y="6" width="16" height="10" fill="#3a8a28" />
        <rect x="6" y="2" width="12" height="6" fill="#4aaa32" />
        <rect x="40" y="20" width="8" height="10" fill="#888" />
        <rect x="38" y="12" width="12" height="10" fill="#999" />
        <rect x="36" y="8" width="16" height="6" fill="#aaa" />
        <rect x="20" y="26" width="6" height="4" fill="#60a5fa" opacity="0.6" />
        <rect x="48" y="24" width="8" height="6" fill="#60a5fa" opacity="0.4" />
      </svg>
    );
  }
  if (type === 'share') {
    return (
      <svg width="64" height="48" viewBox="0 0 64 48" style={{ imageRendering: 'pixelated' }}>
        <rect x="8" y="8" width="20" height="12" rx="2" fill="#1f2630" stroke="#6abf3c" strokeWidth="1" />
        <rect x="10" y="10" width="16" height="2" fill="#6abf3c" opacity="0.5" />
        <rect x="10" y="14" width="10" height="2" fill="#4e5a6a" />
        <rect x="36" y="4" width="20" height="12" rx="2" fill="#1f2630" stroke="#60a5fa" strokeWidth="1" />
        <rect x="38" y="6" width="16" height="2" fill="#60a5fa" opacity="0.5" />
        <rect x="38" y="10" width="10" height="2" fill="#4e5a6a" />
        <rect x="36" y="32" width="20" height="12" rx="2" fill="#1f2630" stroke="#a78bfa" strokeWidth="1" />
        <rect x="38" y="34" width="16" height="2" fill="#a78bfa" opacity="0.5" />
        <rect x="38" y="38" width="10" height="2" fill="#4e5a6a" />
        <line x1="28" y1="14" x2="36" y2="10" stroke="#6abf3c" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="28" y1="14" x2="36" y2="38" stroke="#6abf3c" strokeWidth="1" strokeDasharray="2,2" />
      </svg>
    );
  }
  return (
    <svg width="64" height="48" viewBox="0 0 64 48" style={{ imageRendering: 'pixelated' }}>
      <rect x="0" y="40" width="64" height="2" fill="#21262d" />
      <rect x="4" y="28" width="10" height="14" fill="#6abf3c" />
      <rect x="18" y="18" width="10" height="24" fill="#60a5fa" />
      <rect x="32" y="8" width="10" height="34" fill="#a78bfa" />
      <rect x="46" y="22" width="10" height="20" fill="#f59e0b" />
      <rect x="4" y="26" width="10" height="2" fill="#7dd44a" />
      <rect x="18" y="16" width="10" height="2" fill="#93c5fd" />
      <rect x="32" y="6" width="10" height="2" fill="#c4b5fd" />
      <rect x="46" y="20" width="10" height="2" fill="#fcd34d" />
    </svg>
  );
}

export function OverworldPattern() {
  return (
    <svg width="140" height="80" viewBox="0 0 140 80" style={{ imageRendering: 'pixelated' }}>
      <rect x="0" y="56" width="140" height="24" fill="#6B4423" />
      <rect x="0" y="48" width="140" height="10" fill="#5D9E2F" />
      <rect x="10" y="20" width="10" height="30" fill="#6B3D1E" />
      <rect x="6" y="10" width="18" height="14" fill="#3a8a28" />
      <rect x="8" y="4" width="14" height="8" fill="#4aaa32" />
      <rect x="50" y="28" width="10" height="22" fill="#6B3D1E" />
      <rect x="46" y="16" width="18" height="14" fill="#2D6E1F" />
      <rect x="48" y="10" width="14" height="8" fill="#3a8a28" />
      <rect x="90" y="22" width="10" height="28" fill="#6B3D1E" />
      <rect x="86" y="8" width="18" height="16" fill="#4aaa32" />
      <rect x="88" y="4" width="14" height="6" fill="#5bcc3e" />
      <rect x="20" y="36" width="18" height="8" fill="#888" />
      <rect x="70" y="40" width="16" height="8" fill="#999" />
      <rect x="110" y="38" width="20" height="10" fill="#777" />
      <rect x="0" y="0" width="140" height="14" fill="#87CEEB" opacity="0.3" />
      <rect x="30" y="6" width="24" height="8" fill="#fff" opacity="0.4" />
      <rect x="100" y="4" width="18" height="6" fill="#fff" opacity="0.3" />
    </svg>
  );
}

export function NetherPattern() {
  return (
    <svg width="140" height="80" viewBox="0 0 140 80" style={{ imageRendering: 'pixelated' }}>
      <rect x="0" y="0" width="140" height="80" fill="#1a0a00" />
      <rect x="0" y="60" width="140" height="20" fill="#6B1010" />
      <rect x="0" y="54" width="140" height="8" fill="#8B2010" />
      <rect x="20" y="20" width="16" height="36" fill="#4a0808" />
      <rect x="60" y="10" width="12" height="46" fill="#3a0606" />
      <rect x="100" y="24" width="14" height="32" fill="#4a0808" />
      <rect x="0" y="72" width="140" height="8" fill="#ff4400" opacity="0.4" />
      <rect x="40" y="68" width="20" height="12" fill="#ff6600" opacity="0.6" />
      <rect x="80" y="70" width="16" height="10" fill="#ff4400" opacity="0.5" />
      <circle cx="30" cy="58" r="4" fill="#ff6600" opacity="0.7" />
      <circle cx="90" cy="62" r="6" fill="#ff4400" opacity="0.5" />
      <circle cx="120" cy="56" r="3" fill="#ff8800" opacity="0.6" />
    </svg>
  );
}

export function EndPattern() {
  return (
    <svg width="140" height="80" viewBox="0 0 140 80" style={{ imageRendering: 'pixelated' }}>
      <rect x="0" y="0" width="140" height="80" fill="#0a0a14" />
      <rect x="0" y="60" width="140" height="20" fill="#1a1428" />
      <rect x="30" y="30" width="80" height="40" fill="#1e1432" />
      <rect x="50" y="10" width="40" height="20" fill="#141020" />
      {[10, 30, 60, 90, 110, 130].map((x, i) => (
        <rect key={i} x={x} y={i * 8} width="2" height="2" fill="#c4b5fd" opacity="0.8" />
      ))}
      <rect x="56" y="16" width="28" height="28" rx="14" fill="#7c3aed" opacity="0.3" />
      <rect x="60" y="20" width="20" height="20" rx="10" fill="#a78bfa" opacity="0.2" />
      <rect x="130" y="8" width="4" height="4" fill="#c4b5fd" opacity="0.6" />
      <rect x="10" y="40" width="4" height="4" fill="#c4b5fd" opacity="0.4" />
      <rect x="70" y="5" width="2" height="2" fill="#e9d5ff" opacity="0.9" />
    </svg>
  );
}

export function CyberpunkPattern() {
  return (
    <svg width="140" height="80" viewBox="0 0 140 80" style={{ imageRendering: 'pixelated' }}>
      <rect x="0" y="0" width="140" height="80" fill="#0a0014" />
      <rect x="0" y="60" width="140" height="20" fill="#14001e" />
      {[0, 20, 40, 60, 80, 100, 120].map((x, i) => (
        <rect key={i} x={x} y={i % 2 === 0 ? 10 : 20} width="12" height="50" fill="#1a0028" />
      ))}
      {[0, 30, 60, 90, 120].map((x, i) => (
        <rect key={i} x={x} y={0} width="1" height="80" fill="#ff00ff" opacity="0.15" />
      ))}
      {[10, 30, 50, 70].map((y, i) => (
        <rect key={i} x={0} y={y} width="140" height="1" fill="#00ffff" opacity="0.08" />
      ))}
      <rect x="20" y="30" width="30" height="3" fill="#ff00ff" opacity="0.6" />
      <rect x="80" y="20" width="20" height="3" fill="#00ffff" opacity="0.6" />
      <rect x="110" y="40" width="24" height="3" fill="#ff00ff" opacity="0.4" />
    </svg>
  );
}

export function RetroOSPattern() {
  return (
    <svg width="140" height="80" viewBox="0 0 140 80" style={{ imageRendering: 'pixelated' }}>
      <rect x="0" y="0" width="140" height="80" fill="#008080" />
      <rect x="10" y="16" width="80" height="56" fill="#c0c0c0" />
      <rect x="10" y="16" width="80" height="14" fill="#000080" />
      <text x="14" y="26" style={{ fill: 'white', fontSize: 8, fontFamily: 'monospace' }}>
        BlockForm.exe
      </text>
      <rect x="84" y="18" width="4" height="10" fill="#c0c0c0" />
      <rect x="10" y="30" width="80" height="40" fill="#fff" />
      <rect x="16" y="36" width="60" height="4" fill="#c0c0c0" />
      <rect x="16" y="44" width="40" height="4" fill="#c0c0c0" />
      <rect x="16" y="52" width="50" height="4" fill="#c0c0c0" />
      <rect x="0" y="70" width="140" height="10" fill="#c0c0c0" />
      <rect x="2" y="72" width="20" height="6" fill="#008080" />
      <rect x="24" y="72" width="1" height="6" fill="#888" />
    </svg>
  );
}

export function StartupPattern() {
  return (
    <svg width="140" height="80" viewBox="0 0 140 80" style={{ imageRendering: 'pixelated' }}>
      <rect x="0" y="0" width="140" height="80" fill="#f8fafc" />
      <rect x="10" y="10" width="120" height="60" rx="4" fill="#fff" />
      <rect x="10" y="10" width="120" height="16" fill="#f1f5f9" />
      <rect x="14" y="14" width="40" height="8" fill="#e2e8f0" />
      <rect x="20" y="34" width="60" height="6" fill="#e2e8f0" />
      <rect x="20" y="44" width="40" height="4" fill="#f1f5f9" />
      <rect x="20" y="52" width="50" height="4" fill="#f1f5f9" />
      <rect x="80" y="42" width="40" height="22" rx="4" fill="#6abf3c" />
      <rect x="86" y="48" width="28" height="4" fill="#fff" opacity="0.8" />
      <rect x="86" y="55" width="20" height="4" fill="#fff" opacity="0.6" />
    </svg>
  );
}

export function GamingPattern() {
  return (
    <svg width="140" height="80" viewBox="0 0 140 80" style={{ imageRendering: 'pixelated' }}>
      <rect x="0" y="0" width="140" height="80" fill="#0f0f1a" />
      <rect x="20" y="20" width="100" height="50" rx="8" fill="#1a1a2e" />
      <rect x="22" y="22" width="96" height="46" rx="6" fill="#16213e" />
      <rect x="30" y="35" width="8" height="8" fill="#4e5a6a" />
      <rect x="38" y="35" width="8" height="8" fill="#4e5a6a" />
      <rect x="26" y="39" width="16" height="8" fill="#4e5a6a" />
      <rect x="34" y="31" width="8" height="16" fill="#4e5a6a" />
      <circle cx="100" cy="42" r="3" fill="#4e5a6a" />
      <circle cx="108" cy="34" r="3" fill="#f59e0b" />
      <circle cx="116" cy="42" r="3" fill="#60a5fa" />
      <circle cx="108" cy="50" r="3" fill="#f472b6" />
      <rect x="45" y="32" width="50" height="20" fill="#0f0f1a" opacity="0.4" />
      <rect x="50" y="36" width="40" height="4" fill="#6abf3c" opacity="0.6" />
      <rect x="50" y="43" width="25" height="4" fill="#f59e0b" opacity="0.4" />
    </svg>
  );
}

export function CollegePattern() {
  return (
    <svg width="140" height="80" viewBox="0 0 140 80" style={{ imageRendering: 'pixelated' }}>
      <rect x="0" y="0" width="140" height="80" fill="#1e3a5f" />
      <rect x="50" y="10" width="40" height="50" fill="#2a4a7f" />
      <rect x="46" y="8" width="48" height="6" fill="#1e3a5f" />
      <rect x="42" y="4" width="56" height="6" fill="#c9a84c" />
      <rect x="60" y="30" width="20" height="30" fill="#1e3a5f" />
      {[20, 90].map((x, i) => (
        <rect key={i} x={x} y={40} width="24" height="30" fill="#2a4a7f" />
      ))}
      <rect x="0" y="68" width="140" height="12" fill="#4a7f3a" />
      <rect x="0" y="64" width="140" height="6" fill="#5D9E2F" />
      {[14, 34, 54, 100, 118].map((x, i) => (
        <rect key={i} x={x} y={50} width="10" height="18" fill="#1e3a5f" opacity="0.8" />
      ))}
      <rect x="0" y="0" width="140" height="10" fill="#87CEEB" opacity="0.25" />
    </svg>
  );
}

export function PixelLandscape() {
  return (
    <svg
      width="100%"
      height="100"
      viewBox="0 0 1200 100"
      preserveAspectRatio="xMidYMax meet"
      style={{ imageRendering: 'pixelated', display: 'block' }}
    >
      <rect x="0" y="0" width="1200" height="100" fill="transparent" />
      <rect x="0" y="72" width="1200" height="28" fill="#3a2010" opacity="0.5" />
      <rect x="0" y="64" width="1200" height="10" fill="#3d6b20" opacity="0.6" />
      {[40, 120, 280, 400, 520, 680, 800, 940, 1060, 1160].map((x, i) => (
        <g key={i}>
          <rect x={x + 4} y={32 + (i % 3) * 6} width={6} height={34 - (i % 3) * 6} fill="#4a2810" opacity="0.5" />
          <rect x={x} y={18 + (i % 3) * 6} width={14} height={16} fill="#2D6E1F" opacity="0.5" />
          <rect x={x + 2} y={12 + (i % 3) * 6} width={10} height={8} fill="#3a8a28" opacity="0.5" />
        </g>
      ))}
      {[100, 300, 550, 750, 1000].map((x, i) => (
        <g key={i} opacity="0.25">
          <rect x={x} y={8 + (i % 2) * 10} width={48} height={10} fill="#d0e8f0" />
          <rect x={x + 8} y={4 + (i % 2) * 10} width={32} height={8} fill="#e0f0f8" />
        </g>
      ))}
      {[200, 460, 720, 990].map((x, i) => (
        <rect key={i} x={x} y={56} width={14} height={14} fill="#5D9E2F" opacity="0.4" />
      ))}
    </svg>
  );
}
