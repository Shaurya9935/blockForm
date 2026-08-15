'use client'

import React from 'react'
import {
  Ghast,
  Piglin,
  Glowstone,
  QuartzBlock,
  NetherrackBlock,
  NetherBrickWall,
  NetherPortal,
  CrimsonVines,
  NetherLantern,
  Embers,
} from './voxel-elements'

export function NetherScene() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <radialGradient id="skyGradNether" cx="50%" cy="25%" r="65%">
            <stop offset="0%" stopColor="#3d0808" />
            <stop offset="50%" stopColor="#1a0303" />
            <stop offset="100%" stopColor="#050101" />
          </radialGradient>
          <radialGradient id="lavaGlowNether" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#cc4400" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#661100" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="portalGlowNether" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9040ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4010a0" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky */}
        <rect width="1440" height="900" fill="url(#skyGradNether)" />

        {/* Distant lava glow on horizon */}
        <ellipse cx="720" cy="680" rx="600" ry="180" fill="url(#lavaGlowNether)" />

        {/* Ceiling netherrack */}
        {Array.from({ length: 18 }, (_, i) => (
          <NetherrackBlock key={`ceil-${i}`} x={i * 82 - 10} y={-4} w={80} h={28} />
        ))}
        {Array.from({ length: 14 }, (_, i) => (
          <NetherrackBlock key={`ceil2-${i}`} x={i * 106 - 20} y={22} w={100} h={20} />
        ))}
        {/* Stalactite formations */}
        {[80, 200, 380, 560, 750, 950, 1150, 1300, 1420].map((sx, i) => (
          <polygon
            key={i}
            points={`${sx},40 ${sx + 20},40 ${sx + 10},${70 + (i * 17) % 40}`}
            fill="#4a0c0c"
          />
        ))}

        {/* Glowstone clusters hanging from ceiling */}
        <Glowstone x={130} y={38} size={1.4} />
        <Glowstone x={420} y={28} size={1.8} />
        <Glowstone x={780} y={44} size={1.2} />
        <Glowstone x={1060} y={32} size={1.6} />
        <Glowstone x={1320} y={48} size={1.0} />

        {/* Glowstone poles */}
        <rect x={310} y={120} width={8} height={380} fill="#c87818" />
        <rect x={310} y={120} width={8} height={380} fill="rgba(255,160,40,0.3)" />
        <Glowstone x={294} y={100} size={1.6} />

        <rect x={1100} y={80} width={6} height={320} fill="#c87818" />
        <Glowstone x={1086} y={60} size={1.2} />

        {/* Hanging crimson vines */}
        <CrimsonVines x={0} y={42} count={8} />
        <CrimsonVines x={80} y={38} count={5} />
        <CrimsonVines x={470} y={44} count={4} />

        <CrimsonVines x={1200} y={40} count={6} />
        <CrimsonVines x={1350} y={36} count={5} />

        {/* Left cliff */}
        <polygon points="0,900 0,260 60,240 80,300 100,260 120,310 160,280 200,340 220,290 240,360 260,900" fill="#2a0606" />
        <polygon points="0,900 0,290 50,275 70,320 100,280 140,330 180,295 220,360 240,900" fill="#1e0404" />

        {/* Quartz blocks embedded in left cliff */}
        <QuartzBlock x={20} y={350} w={32} h={32} />
        <QuartzBlock x={55} y={380} w={24} h={24} />
        <QuartzBlock x={30} y={420} w={28} h={28} />
        <QuartzBlock x={80} y={460} w={20} h={20} />

        {/* Nether brick platform */}
        <NetherBrickWall x={0} y={560} cols={7} rows={4} />
        <NetherBrickWall x={0} y={620} cols={9} rows={6} />

        {/* Piglins on ledge */}
        <Piglin x={30} y={488} scale={1.2} />
        <Piglin x={130} y={510} scale={1.0} flipped />

        {/* Teal lantern */}
        <NetherLantern x={108} y={572} />

        {/* Center nether brick structure */}
        <rect x={550} y={400} width={340} height={300} fill="#1a0606" opacity="0.6" />
        <NetherBrickWall x={560} y={410} cols={12} rows={20} />

        {/* Staircase */}
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={580 + i * 28} y={700 - i * 22} width={32} height={22} fill="#2d1010" />
        ))}
        {/* Structure archways */}
        <rect x={610} y={440} width={12} height={80} fill="#3a0e0e" />
        <rect x={720} y={440} width={12} height={80} fill="#3a0e0e" />
        <rect x={610} y={440} width={122} height={14} fill="#3a0e0e" />
        {/* Glowing windows */}
        <rect x={630} y={470} width={20} height={20} fill="#c84010" opacity="0.7" style={{ filter: 'drop-shadow(0 0 8px rgba(200,80,20,0.8))' }} />
        <rect x={700} y={470} width={20} height={20} fill="#c84010" opacity="0.7" style={{ filter: 'drop-shadow(0 0 8px rgba(200,80,20,0.8))' }} />

        {/* Depth atmosphere */}
        <ellipse cx="720" cy="520" rx="260" ry="180" fill="rgba(60,8,8,0.4)" />

        {/* Right cliff */}
        <polygon points="1440,900 1440,220 1380,240 1350,200 1320,260 1280,230 1240,300 1200,260 1160,320 1140,900" fill="#2a0606" />
        <polygon points="1440,900 1440,250 1400,270 1370,220 1340,280 1300,240 1260,310 1220,270 1180,340 1160,900" fill="#1e0404" />

        {/* Quartz blocks in right cliff */}
        <QuartzBlock x={1360} y={340} w={36} h={36} />
        <QuartzBlock x={1390} y={390} w={28} h={28} />
        <QuartzBlock x={1350} y={430} w={24} h={24} />
        <QuartzBlock x={1410} y={460} w={20} h={20} />

        {/* Nether portal */}
        <ellipse cx="1230" cy="640" rx="80" ry="60" fill="url(#portalGlowNether)" />
        <NetherPortal x={1180} y={520} w={80} h={130} />

        {/* Small piglins near portal */}
        <Piglin x={1100} y={650} scale={0.7} />
        <Piglin x={1270} y={660} scale={0.65} flipped />

        {/* Floor netherrack */}
        {Array.from({ length: 20 }, (_, i) => (
          <NetherrackBlock key={`floor-${i}`} x={i * 75} y={850} w={76} h={50} />
        ))}
        {Array.from({ length: 18 }, (_, i) => (
          <NetherrackBlock key={`floor2-${i}`} x={i * 82 - 10} y={820} w={80} h={34} />
        ))}

        {/* Lava river */}
        <ellipse cx="720" cy="860" rx="400" ry="60" fill="#cc4400" opacity="0.85" />
        <ellipse cx="720" cy="855" rx="340" ry="45" fill="#e05010" opacity="0.6" />
        <ellipse cx="720" cy="850" rx="260" ry="30" fill="#f07020" opacity="0.5" />

        {/* Lava surface shimmer */}
        <ellipse cx="680" cy="852" rx="80" ry="12" fill="#ff9030" opacity="0.4" style={{ animation: 'lava-shimmer 3s ease-in-out infinite' }} />
        <ellipse cx="760" cy="856" rx="60" ry="10" fill="#ff8020" opacity="0.3" style={{ animation: 'lava-shimmer 4s 1s ease-in-out infinite reverse' }} />

        {/* Lava crack streams */}
        <path d="M200,900 Q280,840 350,870 Q420,800 500,840 Q560,810 600,870" stroke="#cc4400" strokeWidth="8" fill="none" opacity="0.5" />
        <path d="M900,870 Q960,820 1040,850 Q1100,810 1180,840 Q1240,820 1300,880" stroke="#cc4400" strokeWidth="6" fill="none" opacity="0.4" />

        {/* Magma blocks */}
        {[160, 290, 430, 900, 1020, 1180].map((mx, i) => (
          <g key={i}>
            <rect x={mx} y={810} width={28} height={28} fill="#7a2008" />
            <rect x={mx + 2} y={812} width={24} height={24} fill="#8a2a0a" />
            <rect x={mx + 6} y={816} width={8} height={6} fill="#e06020" opacity="0.7" style={{ animation: `lava-shimmer ${2 + i * 0.5}s ease-in-out infinite` }} />
          </g>
        ))}

        {/* Fog drift */}
        <rect x="0" y="300" width="1440" height="200" fill="rgba(30,4,4,0.25)" style={{ animation: 'fog-drift 14s ease-in-out infinite' }} />
        <rect x="0" y="500" width="1440" height="150" fill="rgba(20,3,3,0.2)" style={{ animation: 'fog-drift 20s 3s ease-in-out infinite reverse' }} />

        {/* Ghasts */}
        <Ghast x={960} y={80} scale={1.4} delay={0} />
        <Ghast x={340} y={110} scale={0.75} delay={1.8} />
        <Ghast x={1240} y={150} scale={0.5} delay={3.2} />
      </svg>

      <Embers />
    </div>
  )
}
