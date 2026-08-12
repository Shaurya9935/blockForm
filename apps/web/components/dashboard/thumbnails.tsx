import React from 'react'

export function ThumbCollege() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 240 120" style={{ imageRendering: 'pixelated' }} preserveAspectRatio="xMidYMid slice">
      <rect width="240" height="120" fill="#1e3a5f" />
      <rect x="0" y="85" width="240" height="35" fill="#2a4a3a" />
      <rect x="0" y="80" width="240" height="8" fill="#3d7a22" />
      {/* Building */}
      <rect x="80" y="30" width="80" height="55" fill="#2a4a7f" />
      <rect x="76" y="26" width="88" height="8" fill="#c9a84c" />
      <rect x="72" y="22" width="96" height="6" fill="#1e3a5f" />
      <rect x="100" y="54" width="20" height="30" fill="#1e3a5f" />
      {[0, 1, 2].map(i => <rect key={i} x={86 + i * 28} y={36} width={16} height={14} fill="#c8d8a0" opacity="0.35" />)}
      {/* Side buildings */}
      <rect x="20" y="55" width="50" height="30" fill="#2a4a7f" opacity="0.8" />
      <rect x="170" y="50" width="55" height="35" fill="#2a4a7f" opacity="0.8" />
      {/* Clouds */}
      <rect x="10" y="12" width="36" height="10" fill="#c8dff0" opacity="0.3" />
      <rect x="180" y="8" width="44" height="12" fill="#c8dff0" opacity="0.25" />
      <rect x="140" y="18" width="28" height="8" fill="#c8dff0" opacity="0.2" />
    </svg>
  )
}

export function ThumbEvent() {
  const stars: [number, number][] = [[30, 10], [70, 6], [140, 8], [200, 12], [220, 5]]
  return (
    <svg width="100%" height="100%" viewBox="0 0 240 120" style={{ imageRendering: 'pixelated' }} preserveAspectRatio="xMidYMid slice">
      <rect width="240" height="120" fill="#0f1e12" />
      <rect x="0" y="80" width="240" height="40" fill="#1a3010" />
      <rect x="0" y="74" width="240" height="8" fill="#2e5c18" />
      {/* Stage */}
      <rect x="60" y="42" width="120" height="38" fill="#1f3018" />
      <rect x="56" y="38" width="128" height="6" fill="#3d7a22" />
      {/* Lights */}
      {[80, 120, 160].map((x, i) => (
        <g key={i}>
          <rect x={x - 4} y={14} width={8} height={26} fill="#2a3820" />
          <rect x={x - 8} y={8} width={16} height={8} fill="#888" />
          <rect x={x - 10} y={38} width={20} height={4} fill={['#f59e0b', '#6abf3c', '#60a5fa'][i]} opacity="0.5" />
        </g>
      ))}
      {/* Trees sides */}
      <rect x="8" y="50" width="10" height="30" fill="#4a2c10" />
      <rect x="0" y="36" width="26" height="18" fill="#2D6E1F" />
      <rect x="220" y="50" width="10" height="30" fill="#4a2c10" />
      <rect x="214" y="36" width="26" height="18" fill="#2D6E1F" />
      {/* Stars */}
      {stars.map(([x, y], i) => <rect key={i} x={x} y={y} width={2} height={2} fill="#c8dff0" opacity="0.5" />)}
    </svg>
  )
}

export function ThumbStartup() {
  const pointsData: [number, number][] = [[20, 95], [60, 75], [100, 60], [140, 45], [180, 30], [220, 20]]
  return (
    <svg width="100%" height="100%" viewBox="0 0 240 120" style={{ imageRendering: 'pixelated' }} preserveAspectRatio="xMidYMid slice">
      <rect width="240" height="120" fill="#0a0f1a" />
      {/* Grid lines */}
      {[0, 1, 2, 3].map(i => <line key={i} x1={0} y1={i * 30} x2={240} y2={i * 30} stroke="#1f2630" strokeWidth="1" />)}
      {[0, 1, 2, 3, 4, 5].map(i => <line key={i} x1={i * 48} y1={0} x2={i * 48} y2={120} stroke="#1f2630" strokeWidth="1" />)}
      {/* Chart */}
      <polyline points="20,95 60,75 100,60 140,45 180,30 220,20" fill="none" stroke="#6abf3c" strokeWidth="2" />
      <polyline points="20,95 60,75 100,60 140,45 180,30 220,20" fill="url(#grad)" opacity="0.15" />
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6abf3c" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      {pointsData.map(([x, y], i) => <rect key={i} x={x - 3} y={y - 3} width={6} height={6} fill="#6abf3c" />)}
      {/* Cards */}
      <rect x="16" y="8" width="56" height="32" rx="2" fill="#161b22" stroke="#21262d" strokeWidth="1" />
      <rect x="20" y="12" width="28" height="4" fill="#6abf3c" opacity="0.7" />
      <rect x="20" y="20" width="20" height="3" fill="#4e5a6a" />
      <rect x="20" y="26" width="36" height="3" fill="#4e5a6a" opacity="0.5" />
    </svg>
  )
}

export function ThumbGaming() {
  const stars: [number, number][] = [[20, 15], [200, 20], [30, 80], [210, 75], [120, 10]]
  return (
    <svg width="100%" height="100%" viewBox="0 0 240 120" style={{ imageRendering: 'pixelated' }} preserveAspectRatio="xMidYMid slice">
      <rect width="240" height="120" fill="#0a0014" />
      {/* Grid neon */}
      {[0, 1, 2, 3].map(i => <line key={i} x1={0} y1={i * 30 + 30} x2={240} y2={i * 30 + 30} stroke="#a78bfa" strokeWidth="0.5" opacity="0.2" />)}
      {/* Controller outline */}
      <rect x="60" y="30" width="120" height="60" rx="24" fill="#1a0028" stroke="#a78bfa" strokeWidth="1.5" />
      <rect x="76" y="46" width="8" height="28" fill="#a78bfa" opacity="0.4" />
      <rect x="68" y="54" width="24" height="12" fill="#a78bfa" opacity="0.4" />
      <circle cx="164" cy="54" r="5" fill="#f59e0b" opacity="0.8" />
      <circle cx="175" cy="46" r="5" fill="#60a5fa" opacity="0.8" />
      <circle cx="175" cy="62" r="5" fill="#f472b6" opacity="0.8" />
      <circle cx="164" cy="70" r="5" fill="#6abf3c" opacity="0.8" />
      {/* Glow */}
      <rect x="60" y="30" width="120" height="60" rx="24" fill="transparent" style={{ filter: 'blur(2px)' }} stroke="#a78bfa" strokeWidth="4" opacity="0.1" />
      {/* Stars */}
      {stars.map(([x, y], i) => <rect key={i} x={x} y={y} width={2} height={2} fill="#c4b5fd" opacity="0.6" />)}
    </svg>
  )
}

export function HeroLandscape() {
  const stars: [number, number][] = [[20, 15], [60, 8], [100, 20], [160, 6], [220, 14], [280, 9], [300, 22], [40, 35], [180, 28], [260, 40]]
  const hills: [number, number, number][] = [[0, 110, 80], [60, 100, 90], [140, 95, 100], [220, 105, 80], [290, 108, 60]]
  const trees: [number, number][] = [[30, 70], [100, 60], [190, 65], [270, 72]]
  const blocks: [number, number, string][] = [[60, 50, '#5D9E2F'], [160, 38, '#888'], [250, 44, '#6abf3c']]
  const clouds: [number, number][] = [[40, 30], [150, 24], [250, 32]]
  const particles: [number, number, string][] = [[80, 100, '#6abf3c'], [200, 95, '#a3e063'], [300, 98, '#6abf3c']]

  return (
    <svg width="100%" height="100%" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid meet" style={{ imageRendering: 'pixelated' }}>
      {/* Sky */}
      <rect width="320" height="180" fill="#0c1a2e" />
      {/* Stars */}
      {stars.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={1} height={1} fill="#c8dff0" opacity={0.4 + (i % 3) * 0.2} />
      ))}
      {/* Moon */}
      <rect x="260" y="12" width="24" height="24" rx="12" fill="#e8f0e0" opacity="0.7" />
      <rect x="266" y="18" width="12" height="12" rx="6" fill="#0c1a2e" opacity="0.3" />
      {/* Distant hills */}
      <rect x="0" y="90" width="320" height="90" fill="#1a280e" />
      {hills.map(([x, y, w], i) => (
        <rect key={i} x={x} y={y} width={w} height={180 - y} fill={i % 2 === 0 ? '#1f3012' : '#1a2a0e'} />
      ))}
      {/* Grass strip */}
      <rect x="0" y="116" width="320" height="6" fill="#3d7a22" />
      <rect x="0" y="112" width="320" height="5" fill="#4d9a2a" />
      {/* Ground */}
      <rect x="0" y="120" width="320" height="60" fill="#2a1a08" />
      {/* Grass blocks row */}
      {Array.from({ length: 12 }, (_, i) => (
        <g key={i}>
          <rect x={i * 28} y={115} width={26} height={18} fill="#3d7a22" />
          <rect x={i * 28} y={115} width={26} height={5} fill="#4d9a2a" />
          <rect x={i * 28 + 18} y={120} width={8} height={13} fill="#2e5c18" />
          <rect x={i * 28} y={133} width={26} height={15} fill="#5a3410" />
        </g>
      ))}
      {/* Trees */}
      {trees.map(([x, y], i) => (
        <g key={i}>
          <rect x={x + 5} y={y + 20} width={6} height={30} fill="#4a2c10" />
          <rect x={x} y={y + 8} width={16} height={14} fill="#2D6E1F" />
          <rect x={x + 2} y={y + 2} width={12} height={8} fill="#3a8a28" />
          <rect x={x + 4} y={y - 2} width={8} height={6} fill="#4aaa32" />
        </g>
      ))}
      {/* Floating blocks */}
      {blocks.map(([x, y, c], i) => (
        <g key={i}>
          <rect x={x} y={y} width={14} height={14} fill={c} />
          <rect x={x} y={y} width={14} height={4} fill={c} opacity="0.5" />
          <rect x={x} y={y} width={4} height={14} fill="#2a1a08" opacity="0.3" />
        </g>
      ))}
      {/* Clouds */}
      {clouds.map(([x, y], i) => (
        <g key={i} opacity="0.45">
          <rect x={x} y={y + 4} width={36} height={10} fill="#c8dff0" />
          <rect x={x + 6} y={y} width={24} height={8} fill="#d8eaf8" />
          <rect x={x + 34} y={y + 6} width={10} height={6} fill="#c8dff0" />
        </g>
      ))}
      {/* Particles */}
      {particles.map(([x, y, c], i) => (
        <rect key={i} x={x} y={y} width={3} height={3} fill={c} opacity="0.6" />
      ))}
    </svg>
  )
}

export function ResponseChart() {
  const data = [42, 68, 55, 90, 75, 110, 95, 130, 115, 148, 160, 143, 175, 162, 190]
  const W = 280, H = 90
  const min = Math.min(...data), max = Math.max(...data)
  const norm = (v: number) => H - ((v - min) / (max - min)) * (H - 16) - 8
  const step = W / (data.length - 1)
  const points = data.map((v, i) => `${i * step},${norm(v)}`).join(' ')
  const area = `0,${H} ${points} ${W},${H}`
  const lastVal = data[data.length - 1] ?? 0

  return (
    <svg width="100%" height="90" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6abf3c" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#6abf3c" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#chartGrad)" />
      <polyline points={points} fill="none" stroke="#6abf3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Last dot */}
      <circle cx={(data.length - 1) * step} cy={norm(lastVal)} r="3.5" fill="#6abf3c" />
    </svg>
  )
}

export function BlockSeparator() {
  return (
    <div
      style={{
        margin: '10px 16px 6px',
        display: 'flex',
        alignItems: 'center',
        gap: 3,
      }}
    >
      {/* Alternating block sizes — pixel-art inspired divider */}
      {[8, 5, 6, 4, 7, 5, 6, 4, 8, 5, 6, 4, 7, 5, 6].map((h, i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: h,
            backgroundColor: i % 3 === 0 ? '#1e2d1a' : i % 3 === 1 ? '#1a2030' : '#21262d',
            borderRadius: 1,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  )
}
