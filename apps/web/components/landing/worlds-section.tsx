"use client";

import { useState } from "react";
import {
  OverworldPattern,
  NetherPattern,
  EndPattern,
  CyberpunkPattern,
  RetroOSPattern,
  StartupPattern,
  GamingPattern,
  CollegePattern,
} from "./pixel-art";

function WorldCard({
  name,
  accent,
  bg,
  pattern,
  desc,
}: {
  name: string;
  accent: string;
  bg: string;
  pattern: React.ReactNode;
  desc: string;
}) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        backgroundColor: '#161b22',
        border: `1px solid ${hov ? accent : '#21262d'}`,
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.2s, transform 0.2s',
        transform: hov ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      {/* Visual area */}
      <div
        style={{
          height: 110,
          backgroundColor: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {pattern}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 24,
            background: 'linear-gradient(transparent, rgba(22,27,34,0.6))',
          }}
        />
      </div>

      {/* Label */}
      <div style={{ padding: '12px 16px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#eceae4', marginBottom: 3 }}>
          {name}
        </div>
        <div style={{ fontSize: 11, color: '#4e5a6a' }}>{desc}</div>
        <div
          style={{
            marginTop: 8,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 10,
            color: accent,
          }}
        >
          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7 }}>USE</span>
          <span>→</span>
        </div>
      </div>
    </div>
  );
}

export function WorldsSection() {
  const worlds = [
    {
      name: 'Overworld',
      accent: '#5D9E2F',
      bg: '#1a2a10',
      pattern: <OverworldPattern />,
      desc: 'Classic green & earth tones',
    },
    {
      name: 'Nether',
      accent: '#dc2626',
      bg: '#1a0a00',
      pattern: <NetherPattern />,
      desc: 'Fire and brimstone red',
    },
    {
      name: 'The End',
      accent: '#a78bfa',
      bg: '#0a0a14',
      pattern: <EndPattern />,
      desc: 'Void purple and stars',
    },
    {
      name: 'Cyberpunk',
      accent: '#ff00ff',
      bg: '#0a0014',
      pattern: <CyberpunkPattern />,
      desc: 'Neon and grid lines',
    },
    {
      name: 'Retro OS',
      accent: '#000080',
      bg: '#008080',
      pattern: <RetroOSPattern />,
      desc: 'Classic desktop nostalgia',
    },
    {
      name: 'Startup',
      accent: '#6abf3c',
      bg: '#f8fafc',
      pattern: <StartupPattern />,
      desc: 'Clean minimal SaaS look',
    },
    {
      name: 'Gaming',
      accent: '#f59e0b',
      bg: '#0f0f1a',
      pattern: <GamingPattern />,
      desc: 'Dark mode gamer energy',
    },
    {
      name: 'College Events',
      accent: '#c9a84c',
      bg: '#1e3a5f',
      pattern: <CollegePattern />,
      desc: 'Campus pride colors',
    },
  ];

  return (
    <section style={{ padding: '100px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 9,
              color: '#4e5a6a',
              letterSpacing: '2px',
              marginBottom: 16,
            }}
          >
            THEMES
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800,
              letterSpacing: '-1px',
              color: '#eceae4',
            }}
          >
            Choose your{' '}
            <span style={{ color: '#a78bfa' }}>world.</span>
          </h2>
          <p
            style={{
              margin: '16px auto 0',
              fontSize: 16,
              color: '#6e7a8a',
              maxWidth: 480,
              lineHeight: 1.65,
            }}
          >
            Every form is a new world. Pick a blueprint and make it yours.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
          }}
          className="bf-worlds-grid"
        >
          {worlds.map((w, i) => (
            <WorldCard key={i} {...w} />
          ))}
        </div>
      </div>
    </section>
  );
}
