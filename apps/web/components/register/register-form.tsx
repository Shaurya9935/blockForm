"use client";

import { useState } from "react";

// ─── Password Strength ────────────────────────────────────────────────────────

function getPasswordStrength(pw: string): { level: 0 | 1 | 2 | 3; label: string } {
  if (pw.length === 0) return { level: 0, label: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: 'Weak' };
  if (score === 2 || score === 3) return { level: 2, label: 'Medium' };
  return { level: 3, label: 'Strong' };
}

function PasswordStrengthBar({ password }: { password: string }) {
  const { level, label } = getPasswordStrength(password);
  if (level === 0) return null;

  const colors: Record<number, string> = { 1: '#dc2626', 2: '#f59e0b', 3: '#6abf3c' };
  const color = colors[level];

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              backgroundColor: i <= level ? color : '#21262d',
              transition: 'background-color 0.3s',
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: 11, color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
        <span
          style={{
            display: 'inline-block',
            width: 5,
            height: 5,
            borderRadius: 1,
            backgroundColor: color,
            imageRendering: 'pixelated',
          }}
        />
        {label} password
      </div>
    </div>
  );
}

// ─── Input Field ──────────────────────────────────────────────────────────────

function InputField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  autoComplete,
  rightSlot,
  error,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  rightSlot?: React.ReactNode;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#b0bec5', letterSpacing: '0.1px' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: rightSlot ? '12px 44px 12px 14px' : '12px 14px',
            backgroundColor: '#0d1117',
            border: `1.5px solid ${error ? '#dc2626' : focused ? '#6abf3c' : '#2d3741'}`,
            borderRadius: 8,
            fontSize: 14,
            color: '#eceae4',
            fontFamily: "'Outfit', sans-serif",
            outline: 'none',
            transition: 'border-color 0.15s',
            boxShadow: focused ? `0 0 0 3px ${error ? 'rgba(220,38,38,0.12)' : 'rgba(106,191,60,0.1)'}` : 'none',
            boxSizing: 'border-box',
          }}
        />
        {rightSlot && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {rightSlot}
          </div>
        )}
      </div>
      {error && (
        <div style={{ fontSize: 12, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>⚠</span> {error}
        </div>
      )}
    </div>
  );
}

// ─── Eye Icon ─────────────────────────────────────────────────────────────────

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6e7a8a" strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6e7a8a" strokeWidth="2" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

// ─── OAuth Button ─────────────────────────────────────────────────────────────

function OAuthButton({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '10px 12px',
        backgroundColor: hov ? '#1f2630' : '#161b22',
        border: `1px solid ${hov ? '#3d4d5d' : '#21262d'}`,
        borderRadius: 8,
        color: '#b0bec5',
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "'Outfit', sans-serif",
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#b0bec5">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#b0bec5">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

// ─── Stacked Blocks Decoration ────────────────────────────────────────────────

function StackedBlocksDecor() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end', opacity: 0.45 }}>
      {[
        { w: 10, color: '#6abf3c', shadow: '#3d7020' },
        { w: 14, color: '#888', shadow: '#555' },
        { w: 10, color: '#6B4423', shadow: '#4a2d16' },
        { w: 12, color: '#5D9E2F', shadow: '#3d7020' },
        { w: 8, color: '#888', shadow: '#555' },
      ].map((b, i) => (
        <svg key={i} width={b.w} height={b.w} viewBox="0 0 8 8" style={{ imageRendering: 'pixelated' }}>
          <rect x="0" y="0" width="8" height="8" fill={b.color} />
          <rect x="0" y="0" width="8" height="2" fill={b.color} opacity="0.6" />
          <rect x="0" y="0" width="2" height="8" fill={b.shadow} opacity="0.5" />
        </svg>
      ))}
    </div>
  );
}

// ─── Register Form ────────────────────────────────────────────────────────────

export function RegisterForm({ onGoLogin }: { onGoLogin: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address';
    if (password.length < 8) e.password = 'Password must be at least 8 characters';
    if (!agreed) e.agreed = 'You must accept the terms to continue';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1600);
  };

  if (submitted) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          padding: '48px 0',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 14,
            backgroundColor: 'rgba(106,191,60,0.12)',
            border: '1.5px solid rgba(106,191,60,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
          }}
        >
          ✓
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#eceae4', marginBottom: 8 }}>
            Account created!
          </div>
          <div style={{ fontSize: 14, color: '#6e7a8a', lineHeight: 1.6 }}>
            Welcome to BlockForm, {name.split(' ')[0]}.
            <br />
            Check your email to verify your account.
          </div>
        </div>
        <button
          style={{
            backgroundColor: '#6abf3c',
            color: '#0d1117',
            border: 'none',
            borderRadius: 8,
            padding: '12px 28px',
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "'Outfit', sans-serif",
            cursor: 'pointer',
          }}
        >
          Go to Dashboard →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Name */}
        <InputField
          label="Full name"
          placeholder="Alex Johnson"
          value={name}
          onChange={(v) => { setName(v); setErrors((p) => ({ ...p, name: '' })); }}
          autoComplete="name"
          error={errors.name}
        />

        {/* Email */}
        <InputField
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(v) => { setEmail(v); setErrors((p) => ({ ...p, email: '' })); }}
          autoComplete="email"
          error={errors.email}
        />

        {/* Password */}
        <div>
          <InputField
            label="Password"
            type={showPw ? 'text' : 'password'}
            placeholder="Create a strong password"
            value={password}
            onChange={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: '' })); }}
            autoComplete="new-password"
            error={errors.password}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPw((p) => !p)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                <EyeIcon visible={showPw} />
              </button>
            }
          />
          <PasswordStrengthBar password={password} />
        </div>

        {/* Terms */}
        <div>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
            <div style={{ position: 'relative', flexShrink: 0, marginTop: 1 }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => { setAgreed(e.target.checked); setErrors((p) => ({ ...p, agreed: '' })); }}
                style={{ opacity: 0, position: 'absolute', width: 0, height: 0 }}
              />
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  backgroundColor: agreed ? '#6abf3c' : '#0d1117',
                  border: `1.5px solid ${errors.agreed ? '#dc2626' : agreed ? '#6abf3c' : '#2d3741'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s',
                  imageRendering: 'pixelated',
                }}
              >
                {agreed && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="#0d1117" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </div>
            </div>
            <span style={{ fontSize: 13, color: '#8b9ab0', lineHeight: 1.5 }}>
              I agree to the{' '}
              <a href="#" style={{ color: '#6abf3c', textDecoration: 'none' }}>Terms of Service</a>
              {' '}and{' '}
              <a href="#" style={{ color: '#6abf3c', textDecoration: 'none' }}>Privacy Policy</a>
            </span>
          </label>
          {errors.agreed && (
            <div style={{ fontSize: 12, color: '#dc2626', marginTop: 6, marginLeft: 28 }}>
              ⚠ {errors.agreed}
            </div>
          )}
        </div>

        {/* Submit CTA */}
        <div>
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 7,
              color: '#4e5a6a',
              letterSpacing: '1px',
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            READY TO BUILD?
          </div>
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '14px 24px',
              backgroundColor: submitting ? '#4a8a28' : '#6abf3c',
              color: '#0d1117',
              border: 'none',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "'Outfit', sans-serif",
              cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s',
              boxShadow: '0 4px 16px rgba(106,191,60,0.25)',
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#7dd44a';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(106,191,60,0.38)';
              }
            }}
            onMouseLeave={(e) => {
              if (!submitting) {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#6abf3c';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(106,191,60,0.25)';
              }
            }}
          >
            {submitting ? (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{ animation: 'reg-spin 0.8s linear infinite' }}
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Building your account...
              </>
            ) : (
              <>
                Create Account
                <span style={{ fontSize: 18 }}>→</span>
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: '#21262d' }} />
          <span style={{ fontSize: 11, color: '#4e5a6a', fontWeight: 600, letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
            OR CONTINUE WITH
          </span>
          <div style={{ flex: 1, height: 1, backgroundColor: '#21262d' }} />
        </div>

        {/* OAuth */}
        <div style={{ display: 'flex', gap: 8 }}>
          <OAuthButton label="Google" icon={<GoogleIcon />} />
          <OAuthButton label="GitHub" icon={<GitHubIcon />} />
          <OAuthButton label="Apple" icon={<AppleIcon />} />
        </div>

        {/* Login link */}
        <p style={{ margin: 0, textAlign: 'center', fontSize: 13, color: '#6e7a8a' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onGoLogin}
            style={{
              background: 'none',
              border: 'none',
              color: '#6abf3c',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif",
              padding: 0,
            }}
          >
            Log in
          </button>
        </p>
      </div>
    </form>
  );
}

// ─── Right Panel (card + decorations) ────────────────────────────────────────

export function RegisterRightPanel() {
  return (
    <div
      className="register-right"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '48px 48px',
        backgroundColor: '#0d1117',
        borderLeft: '1px solid #21262d',
        overflowY: 'auto',
        position: 'relative',
      }}
    >
      {/* Mobile logo */}
      <div
        className="register-logo-mobile"
        style={{ display: 'none', alignItems: 'center', gap: 10, marginBottom: 32 }}
      >
        <div style={{ display: 'flex', gap: 2 }}>
          <div style={{ width: 10, height: 10, backgroundColor: '#6abf3c', borderRadius: 1 }} />
          <div style={{ width: 10, height: 10, backgroundColor: '#4e9c2e', borderRadius: 1, marginTop: 5 }} />
        </div>
        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 12, color: '#eceae4' }}>
          Block<span style={{ color: '#6abf3c' }}>Form</span>
        </span>
      </div>

      {/* Decorative blocks — top right corner */}
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <StackedBlocksDecor />
      </div>

      {/* Card */}
      <div style={{ maxWidth: 420, width: '100%', margin: '0 auto' }}>
        {/* Card header */}
        <div style={{ marginBottom: 32 }}>
          {/* Pixel tag */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 16,
              padding: '4px 10px',
              backgroundColor: 'rgba(106,191,60,0.08)',
              border: '1px solid rgba(106,191,60,0.18)',
              borderRadius: 6,
            }}
          >
            <svg width="8" height="8" viewBox="0 0 8 8" style={{ imageRendering: 'pixelated' }}>
              <rect x="0" y="0" width="4" height="4" fill="#6abf3c" />
              <rect x="4" y="4" width="4" height="4" fill="#4e9c2e" />
              <rect x="4" y="0" width="4" height="4" fill="#3d7020" />
              <rect x="0" y="4" width="4" height="4" fill="#5aad32" />
            </svg>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: '#6abf3c', letterSpacing: '0.5px' }}>
              NEW ACCOUNT
            </span>
          </div>

          <h1
            style={{
              margin: '0 0 10px',
              fontSize: 26,
              fontWeight: 800,
              color: '#eceae4',
              letterSpacing: '-0.5px',
              lineHeight: 1.2,
            }}
          >
            Create your account
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: '#6e7a8a', lineHeight: 1.6 }}>
            Start building your first form in minutes.
          </p>
        </div>

        {/* Registration form */}
        <RegisterForm onGoLogin={() => {}} />
      </div>

      {/* Footer note */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 11,
          color: '#2d3741',
        }}
      >
        © 2024 BlockForm · Built block by block
      </div>
    </div>
  );
}
