"use client";

import { useState, useEffect } from "react";

export function BlockWorldLandscape() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 50);
    return () => clearInterval(id);
  }, []);

  const floatingBlocks = [
    { x: '12%', baseY: 28, amp: 7, phase: 0, size: 18, color: '#5D9E2F', shadow: '#3d7020', delay: 0 },
    { x: '22%', baseY: 18, amp: 5, phase: 1.2, size: 14, color: '#888', shadow: '#555', delay: 0.8 },
    { x: '68%', baseY: 22, amp: 9, phase: 0.6, size: 22, color: '#5D9E2F', shadow: '#3d7020', delay: 0.3 },
    { x: '78%', baseY: 15, amp: 6, phase: 2.1, size: 12, color: '#6B4423', shadow: '#4a2d16', delay: 1.5 },
    { x: '88%', baseY: 35, amp: 8, phase: 0.9, size: 16, color: '#888', shadow: '#555', delay: 0.6 },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Sky — deep gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(175deg, #060d18 0%, #0c1a2e 35%, #0f2240 55%, #142d1a 100%)',
        }}
      />

      {/* Stars */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '40%' }}
        viewBox="0 0 600 240"
        preserveAspectRatio="xMidYMid slice"
      >
        {[
          [42, 18], [110, 8], [180, 30], [260, 12], [340, 22], [420, 6], [510, 28], [570, 14],
          [80, 50], [200, 60], [310, 40], [450, 55], [540, 42], [150, 80], [380, 70],
          [30, 90], [490, 85], [240, 100], [560, 96], [70, 120],
        ].map(([x, y], i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width={i % 5 === 0 ? 2 : 1}
            height={i % 5 === 0 ? 2 : 1}
            fill="#c8dff0"
            opacity={0.3 + (i % 4) * 0.15}
            style={{ imageRendering: 'pixelated' }}
          />
        ))}
      </svg>

      {/* Moon */}
      <svg
        style={{ position: 'absolute', top: '6%', right: '18%', imageRendering: 'pixelated' }}
        width="48"
        height="48"
        viewBox="0 0 12 12"
      >
        <rect x="2" y="0" width="8" height="2" fill="#e8f0e0" opacity="0.85" />
        <rect x="0" y="2" width="12" height="6" fill="#e8f0e0" opacity="0.85" />
        <rect x="2" y="8" width="8" height="2" fill="#dbe8d0" opacity="0.85" />
        <rect x="1" y="1" width="2" height="2" fill="#c8d8b8" opacity="0.5" />
        <rect x="7" y="4" width="3" height="3" fill="#c8d8b8" opacity="0.4" />
      </svg>

      {/* Main SVG landscape */}
      <svg
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', imageRendering: 'pixelated' }}
        viewBox="0 0 600 520"
        preserveAspectRatio="xMidYMax meet"
      >
        {/* Distant mountains */}
        <rect x="0" y="220" width="600" height="300" fill="#111a0c" />

        {/* Far mountain range */}
        {[
          [0, 300, 90, 220], [70, 300, 100, 200], [150, 300, 120, 180],
          [240, 300, 80, 210], [300, 300, 110, 190], [380, 300, 90, 215],
          [450, 300, 130, 175], [540, 300, 80, 220],
        ].map(([x, y, w, top], i) => (
          <rect key={i} x={x} y={top} width={w} height={(y as number) - (top as number)} fill={i % 2 === 0 ? '#1e2d1a' : '#1a2816'} />
        ))}

        {/* Snow caps */}
        {[
          [20, 220, 50, 8], [160, 180, 60, 10], [460, 175, 70, 12], [300, 190, 50, 8],
        ].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill="#c8d8b8" opacity="0.18" />
        ))}

        {/* Mid ground hills */}
        <rect x="0" y="300" width="600" height="220" fill="#1a280e" />
        {[
          [0, 320, 160, 300], [120, 310, 180, 300], [260, 305, 160, 300],
          [380, 312, 180, 300], [520, 308, 80, 300],
        ].map(([x, top, w, bot], i) => (
          <rect key={i} x={x} y={top} width={w} height={(bot as number) - (top as number)} fill={i % 2 === 0 ? '#1f3012' : '#1a2a0e'} />
        ))}

        {/* Grass strip top */}
        <rect x="0" y="340" width="600" height="12" fill="#2e5c18" />
        <rect x="0" y="338" width="600" height="4" fill="#3d7a22" />

        {/* Ground base */}
        <rect x="0" y="350" width="600" height="170" fill="#1e3410" />

        {/* Dirt layer */}
        <rect x="0" y="410" width="600" height="110" fill="#4a2c0e" />

        {/* Stone deeper */}
        <rect x="0" y="460" width="600" height="60" fill="#333" />

        {/* Grass block row — front */}
        {Array.from({ length: 20 }, (_, i) => (
          <g key={i}>
            <rect x={i * 32} y={340} width={30} height={30} fill="#3d7a22" />
            <rect x={i * 32} y={340} width={30} height={6} fill="#4d9a2a" />
            <rect x={i * 32} y={346} width={6} height={24} fill="#2e5c18" />
            <rect x={i * 32} y={370} width={30} height={40} fill="#5a3410" />
            <rect x={i * 32 + 6} y={372} width={6} height={6} fill="#4a2c0e" />
            <rect x={i * 32 + 18} y={378} width={8} height={8} fill="#4a2c0e" />
          </g>
        ))}

        {/* Large Trees */}
        {[
          [30, 260, 1.0],
          [110, 275, 0.85],
          [190, 255, 1.1],
          [290, 268, 0.9],
          [380, 250, 1.2],
          [460, 270, 0.8],
          [530, 258, 1.0],
        ].map(([x, y, scale], i) => {
          const s = scale as number;
          const bx = x as number;
          const by = y as number;
          return (
            <g key={i} transform={`translate(${bx},${by}) scale(${s})`}>
              <rect x={6} y={30} width={8} height={40} fill="#4a2c10" />
              <rect x={8} y={30} width={4} height={40} fill="#5a3818" />
              <rect x={-2} y={16} width={24} height={18} fill="#1e5c10" />
              <rect x={0} y={8} width={20} height={12} fill="#257014" />
              <rect x={2} y={2} width={16} height={10} fill="#2e8a1a" />
              <rect x={4} y={-2} width={12} height={6} fill="#3aaa22" />
              <rect x={2} y={8} width={3} height={3} fill="#40c028" opacity="0.5" />
              <rect x={14} y={14} width={3} height={3} fill="#1a4a0c" opacity="0.6" />
            </g>
          );
        })}

        {/* Small cabin/house */}
        <rect x="470" y="298" width="52" height="44" fill="#5a3818" />
        <rect x="468" y="284" width="56" height="16" fill="#2e5c18" />
        <rect x="466" y="280" width="60" height="6" fill="#3d7a22" />
        <rect x="480" y="316" width="14" height="26" fill="#3a2010" />
        <rect x="494" y="304" width="14" height="10" fill="#c8d8a0" opacity="0.4" />
        <rect x="494" y="304" width="14" height="10" fill="#f5c842" opacity="0.15" />

        {/* Stone wall segment */}
        {Array.from({ length: 8 }, (_, i) => (
          <g key={i}>
            <rect x={80 + i * 16} y={340} width={14} height={14} fill={i % 2 === 0 ? '#555' : '#666'} />
            <rect x={80 + i * 16} y={354} width={14} height={14} fill={i % 2 === 0 ? '#666' : '#555'} />
          </g>
        ))}

        {/* Path blocks */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <rect key={i} x={240 + i * 14} y={380} width={12} height={6} fill="#8a7460" opacity="0.6" />
        ))}

        {/* Glowing particles / fireflies */}
        {[
          [100, 290, '#6abf3c'],
          [230, 270, '#a3e063'],
          [360, 285, '#6abf3c'],
          [490, 275, '#c8f0a0'],
          [55, 310, '#a3e063'],
          [410, 305, '#6abf3c'],
        ].map(([x, y, c], i) => (
          <g key={i}>
            <rect
              x={(x as number) - 1}
              y={(y as number) - 1}
              width={3}
              height={3}
              fill={c as string}
              opacity={0.7 + Math.sin((tick / 10 + i * 0.8)) * 0.25}
            />
            <rect
              x={(x as number) - 3}
              y={(y as number) - 3}
              width={7}
              height={7}
              fill={c as string}
              opacity={0.08 + Math.sin((tick / 10 + i * 0.8)) * 0.04}
            />
          </g>
        ))}

        {/* Clouds */}
        {[
          [40, 150, 1.0],
          [180, 130, 0.8],
          [330, 160, 1.1],
          [490, 140, 0.9],
        ].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x},${y}) scale(${s})`} opacity="0.55">
            <rect x={8} y={8} width={40} height={14} fill="#c8dff0" />
            <rect x={16} y={2} width={24} height={10} fill="#d8eaf8" />
            <rect x={0} y={12} width={16} height={8} fill="#c8dff0" />
            <rect x={40} y={12} width={12} height={8} fill="#c8dff0" />
          </g>
        ))}
      </svg>

      {/* Animated floating blocks */}
      {floatingBlocks.map((b, i) => {
        const yOffset = Math.sin((tick / 20) + b.phase) * b.amp;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: b.x,
              top: `${b.baseY + yOffset}%`,
              transition: 'top 0.05s linear',
              imageRendering: 'pixelated',
            }}
          >
            <svg width={b.size} height={b.size} viewBox="0 0 8 8" style={{ imageRendering: 'pixelated' }}>
              <rect x="0" y="0" width="8" height="8" fill={b.color} />
              <rect x="0" y="0" width="8" height="2" fill={b.color === '#888' ? '#aaa' : '#7dd44a'} opacity="0.6" />
              <rect x="0" y="0" width="2" height="8" fill={b.shadow} opacity="0.4" />
              <rect x="6" y="6" width="2" height="2" fill={b.shadow} opacity="0.3" />
            </svg>
          </div>
        );
      })}

      {/* Logo — top left */}
      <div
        style={{
          position: 'absolute',
          top: 32,
          left: 36,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', gap: 2 }}>
          <div style={{ width: 11, height: 11, backgroundColor: '#6abf3c', borderRadius: 2, imageRendering: 'pixelated' }} />
          <div style={{ width: 11, height: 11, backgroundColor: '#4e9c2e', borderRadius: 2, marginTop: 6, imageRendering: 'pixelated' }} />
        </div>
        <a
          href="/"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 13,
            color: '#eceae4',
            textDecoration: 'none',
            letterSpacing: '-0.3px',
          }}
        >
          Block<span style={{ color: '#6abf3c' }}>Form</span>
        </a>
      </div>

      {/* Bottom text — lower left */}
      <div
        style={{
          position: 'absolute',
          bottom: 56,
          left: 36,
          right: 36,
          zIndex: 10,
          maxWidth: 380,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            backgroundColor: 'rgba(106,191,60,0.12)',
            border: '1px solid rgba(106,191,60,0.2)',
            borderRadius: 100,
            padding: '5px 12px',
            marginBottom: 16,
          }}
        >
          <div style={{ width: 5, height: 5, borderRadius: 1, backgroundColor: '#6abf3c', imageRendering: 'pixelated' }} />
          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: '#6abf3c', letterSpacing: '0.5px' }}>
            BUILD YOUR WORLD
          </span>
        </div>

        <h2
          style={{
            margin: '0 0 12px',
            fontSize: 28,
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.6px',
            color: '#eceae4',
            textShadow: '0 2px 16px rgba(0,0,0,0.6)',
          }}
        >
          Build something people
          <br />
          <span style={{ color: '#6abf3c' }}>can respond to.</span>
        </h2>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: 'rgba(200,218,190,0.7)', maxWidth: 340 }}>
          Create beautiful forms, share them anywhere, and turn every response into something you can build on.
        </p>

        {/* Social proof mini row */}
        <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex' }}>
              {['#6abf3c', '#60a5fa', '#f59e0b'].map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: c,
                    border: '2px solid rgba(10,15,20,0.6)',
                    marginLeft: i > 0 ? -7 : 0,
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: 12, color: 'rgba(200,218,190,0.6)' }}>10K+ builders</span>
          </div>
          <div style={{ width: 1, height: 14, backgroundColor: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: 12, color: 'rgba(200,218,190,0.6)' }}>Free to start</span>
        </div>
      </div>

      {/* Subtle vignette overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 30% 50%, transparent 50%, rgba(6,12,18,0.4) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
