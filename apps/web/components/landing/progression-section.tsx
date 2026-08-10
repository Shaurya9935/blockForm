"use client";

import { useState } from "react";

function ProgressionStep({
  step,
  label,
  sublabel,
  active,
  onClick,
}: {
  step: number;
  label: string;
  sublabel: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        opacity: active ? 1 : 0.45,
        transition: 'opacity 0.2s',
        padding: '8px 12px',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          backgroundColor: active ? '#6abf3c' : '#1f2630',
          border: `1px solid ${active ? '#6abf3c' : '#2d3741'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          fontWeight: 800,
          color: active ? '#0d1117' : '#4e5a6a',
          fontFamily: "'Press Start 2P', monospace",
          transition: 'all 0.2s',
        }}
      >
        {step}
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#eceae4' }}>{label}</div>
        <div style={{ fontSize: 11, color: '#4e5a6a', marginTop: 2 }}>{sublabel}</div>
      </div>
    </button>
  );
}

function ProgressionVisual({ step }: { step: number }) {
  const visuals = [
    // Step 1: Empty canvas
    <div
      key={0}
      style={{
        backgroundColor: '#0d1117',
        border: '1px solid #21262d',
        borderRadius: 8,
        padding: 24,
        minHeight: 220,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          border: '2px dashed #21262d',
          borderRadius: 8,
          width: '100%',
          height: 160,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                backgroundColor: '#21262d',
                opacity: 0.5 + i * 0.2,
              }}
            />
          ))}
        </div>
        <p style={{ margin: 0, fontSize: 13, color: '#4e5a6a', textAlign: 'center' }}>
          Your form canvas awaits
          <br />
          <span style={{ fontSize: 11, opacity: 0.6 }}>Drop blocks to begin</span>
        </p>
      </div>
    </div>,

    // Step 2: Questions added
    <div
      key={1}
      style={{
        backgroundColor: '#0d1117',
        border: '1px solid #21262d',
        borderRadius: 8,
        padding: 20,
        minHeight: 220,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {[
        { label: 'Your name', type: 'TEXT', color: '#6abf3c' },
        { label: 'Email address', type: 'EMAIL', color: '#60a5fa' },
        { label: 'Satisfaction rating', type: 'RATING', color: '#f59e0b' },
      ].map((block, i) => (
        <div
          key={i}
          style={{
            border: `1px solid ${block.color}33`,
            borderLeft: `3px solid ${block.color}`,
            borderRadius: 6,
            padding: '10px 14px',
            backgroundColor: `${block.color}08`,
          }}
        >
          <div style={{ fontSize: 12, color: '#eceae4', fontWeight: 600 }}>{block.label}</div>
          <div
            style={{
              fontSize: 8,
              fontFamily: "'Press Start 2P', monospace",
              color: block.color,
              marginTop: 4,
            }}
          >
            {block.type}
          </div>
        </div>
      ))}
    </div>,

    // Step 3: Styled form
    <div
      key={2}
      style={{
        background: 'linear-gradient(135deg, #0d1117 0%, #1a2030 100%)',
        border: '1px solid #6abf3c33',
        borderRadius: 12,
        padding: 24,
        minHeight: 220,
      }}
    >
      <div
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 10,
          color: '#6abf3c',
          marginBottom: 16,
        }}
      >
        FEEDBACK FORM
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {['Your name', 'Email address'].map((label, i) => (
          <div key={i}>
            <div style={{ fontSize: 12, color: '#8b9ab0', marginBottom: 6 }}>{label}</div>
            <div
              style={{
                height: 36,
                borderRadius: 6,
                border: '1px solid #2d3741',
                backgroundColor: '#161b22',
              }}
            />
          </div>
        ))}
        <div>
          <div style={{ fontSize: 12, color: '#8b9ab0', marginBottom: 8 }}>Satisfaction</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 4,
                  backgroundColor: n <= 4 ? '#6abf3c' : '#1f2630',
                  border: `1px solid ${n <= 4 ? '#6abf3c' : '#2d3741'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  color: n <= 4 ? '#0d1117' : '#4e5a6a',
                  fontWeight: 700,
                }}
              >
                {n}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,

    // Step 4: Published
    <div
      key={3}
      style={{
        backgroundColor: '#0d1117',
        border: '1px solid #21262d',
        borderRadius: 8,
        padding: 20,
        minHeight: 220,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          backgroundColor: 'rgba(106,191,60,0.12)',
          border: '1px solid rgba(106,191,60,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
        }}
      >
        ✓
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#eceae4', marginBottom: 6 }}>
          Your build is live!
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: '#1f2630',
            border: '1px solid #2d3741',
            borderRadius: 6,
            padding: '6px 12px',
          }}
        >
          <span style={{ fontSize: 12, color: '#6abf3c', fontFamily: 'monospace' }}>
            blockform.app/f/feedback-2024
          </span>
          <span style={{ fontSize: 12, color: '#4e5a6a' }}>↗</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        {['12 views', '8 responses', '66%'].map((v, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#6abf3c' }}>{v}</div>
            <div style={{ fontSize: 10, color: '#4e5a6a' }}>
              {['Views', 'Responses', 'Completion'][i]}
            </div>
          </div>
        ))}
      </div>
    </div>,
  ];

  return visuals[step];
}

export function ProgressionSection() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: 'Empty Canvas', sublabel: 'Start fresh' },
    { label: 'Add Blocks', sublabel: 'Assemble questions' },
    { label: 'Style It', sublabel: 'Choose your world' },
    { label: 'Go Live', sublabel: 'Launch your build' },
  ];

  return (
    <section
      style={{
        padding: '100px 24px',
        backgroundColor: '#0a0e14',
        borderTop: '1px solid #21262d',
        borderBottom: '1px solid #21262d',
      }}
    >
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
            HOW IT WORKS
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
            From a few blocks to a{' '}
            <span style={{ color: '#6abf3c' }}>complete form.</span>
          </h2>
        </div>

        <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }} className="bf-progression-layout">
          {/* Step selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                <ProgressionStep
                  step={i + 1}
                  label={s.label}
                  sublabel={s.sublabel}
                  active={i === activeStep}
                  onClick={() => setActiveStep(i)}
                />
                {i < steps.length - 1 && (
                  <div
                    style={{
                      width: 1,
                      height: 24,
                      backgroundColor: '#21262d',
                      marginLeft: 29,
                      marginTop: 4,
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Visual */}
          <div style={{ flex: 1 }}>
            <ProgressionVisual step={activeStep} />
          </div>
        </div>
      </div>
    </section>
  );
}
