'use client'

import React from 'react'
import type { FormQuestionProps } from './types'
import {
  UnderlineInput,
  DeptSelector,
  YearSelector,
  InterestTagSelector,
  OptionSelector,
  ErrorMsg,
} from './question-inputs'
import { FestivalPass } from './festival-pass'
import { ProgressBar } from './progress-bar'
import { BgDecor } from './bg-decor'

export function FormQuestion({
  question,
  questionIndex,
  totalQuestions,
  formData,
  passId,
  value,
  error,
  transitioning,
  direction,
  isMobile,
  mobilePassOpen,
  onToggleMobilePass,
  onChange,
  onNext,
  onBack,
  canGoBack,
}: FormQuestionProps) {
  const strVal = typeof value === 'string' ? value : ''
  const arrVal = Array.isArray(value) ? value : []

  const subLabelStyle: React.CSSProperties = {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 11,
    letterSpacing: 3,
    color: 'rgba(245,240,232,0.35)',
    textTransform: 'uppercase',
    marginBottom: 12,
  }

  const qTitleStyle: React.CSSProperties = {
    fontFamily: '"Anton", sans-serif',
    fontSize: isMobile ? 'clamp(36px, 10vw, 52px)' : 'clamp(40px, 5vw, 64px)',
    color: '#F5F0E8',
    letterSpacing: 0.5,
    lineHeight: 1.05,
  }

  const hintTextStyle: React.CSSProperties = {
    fontFamily: '"Inter", sans-serif',
    fontSize: 12,
    color: 'rgba(245,240,232,0.25)',
    letterSpacing: 0.5,
    marginTop: 14,
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onNext()
    if (e.key === 'ArrowLeft' && canGoBack) onBack()
  }

  return (
    <div
      className="grain"
      style={{ minHeight: '100vh', background: '#080B14', position: 'relative', overflow: 'hidden' }}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <BgDecor step={questionIndex + 1} />

      {/* Top bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          background: 'rgba(8,11,20,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(245,240,232,0.06)',
          padding: isMobile ? '14px 20px' : '14px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div className="font-anton-aura" style={{ fontSize: 18, color: '#00F0FF', letterSpacing: 2 }}>
          AURA <span style={{ color: 'rgba(245,240,232,0.3)', fontSize: 12, letterSpacing: 4 }}>2026</span>
        </div>
        <ProgressBar current={questionIndex + 1} total={totalQuestions} />
      </div>

      {/* Main layout */}
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          minHeight: '100vh',
          paddingTop: 64,
        }}
      >
        {/* Left: Question */}
        <div
          style={{
            flex: isMobile ? 'auto' : '0 0 58%',
            padding: isMobile ? '40px 24px 160px' : '72px 64px 80px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Step number watermark */}
          <div
            className="font-anton-aura"
            style={{
              fontSize: isMobile ? 80 : 120,
              color: 'rgba(245,240,232,0.04)',
              position: 'absolute',
              top: isMobile ? 40 : 60,
              left: isMobile ? 16 : 48,
              lineHeight: 1,
              pointerEvents: 'none',
            }}
          >
            {String(questionIndex + 1).padStart(2, '0')}
          </div>

          {/* Question content */}
          <div
            style={{
              opacity: transitioning ? 0 : 1,
              transform: transitioning
                ? direction === 'fwd'
                  ? 'translateY(-20px)'
                  : 'translateY(20px)'
                : 'translateY(0)',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
            }}
          >
            <div className="anim-fade-up" style={subLabelStyle}>
              {question.description || `Question ${questionIndex + 1} of ${totalQuestions}`}
              {question.required && (
                <span style={{ color: '#FF5C00', marginLeft: 8 }}>* Required</span>
              )}
            </div>
            <h2 className="anim-fade-up delay-1" style={qTitleStyle}>
              {question.question}
            </h2>

            <div className="anim-fade-up delay-2">
              {(question.type === 'text' || question.type === 'email' || question.type === 'number') && (
                <div style={{ marginTop: 32 }}>
                  <UnderlineInput
                    type={question.type === 'email' ? 'email' : question.type === 'number' ? 'number' : 'text'}
                    placeholder={question.placeholder || 'Type your answer...'}
                    value={strVal}
                    onChange={(v) => onChange(v)}
                    onKeyDown={handleKeyDown}
                  />
                  <div style={hintTextStyle}>Press Enter ↵ to continue</div>
                </div>
              )}

              {question.type === 'dept' && (
                <DeptSelector
                  selected={strVal}
                  onSelect={(v) => onChange(v)}
                  onKeyDown={handleKeyDown}
                />
              )}

              {question.type === 'year' && (
                <YearSelector
                  selected={strVal}
                  isMobile={isMobile}
                  onSelect={(v) => onChange(v)}
                  onKeyDown={handleKeyDown}
                />
              )}

              {question.type === 'checkbox' && (
                <>
                  <InterestTagSelector
                    options={question.options}
                    selected={arrVal}
                    onToggle={(tag) => {
                      const next = arrVal.includes(tag)
                        ? arrVal.filter((t) => t !== tag)
                        : [...arrVal, tag]
                      onChange(next)
                    }}
                    onKeyDown={handleKeyDown}
                  />
                  <div style={{ ...hintTextStyle, marginTop: 16 }}>
                    Select all that apply. Press Enter ↵ to continue.
                  </div>
                </>
              )}

              {question.type === 'dropdown' && question.options && (
                <OptionSelector
                  options={question.options}
                  selected={strVal}
                  onSelect={(v) => onChange(v)}
                  onKeyDown={handleKeyDown}
                />
              )}
            </div>
          </div>

          {/* Error */}
          {error && <ErrorMsg msg={error} />}

          {/* Navigation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginTop: 40,
            }}
          >
            {canGoBack && (
              <button type="button" className="ghost-btn" onClick={onBack}>
                ← Back
              </button>
            )}
            <button
              type="button"
              className="cta-btn"
              onClick={onNext}
              style={{ fontSize: 15, padding: '14px 28px' }}
            >
              {questionIndex === totalQuestions - 1 ? 'GET MY PASS' : 'Continue'}
              <span style={{ fontSize: 16 }}>→</span>
            </button>
          </div>
        </div>

        {/* Right: Festival Pass preview (desktop only) */}
        {!isMobile && (
          <div
            style={{
              flex: '0 0 42%',
              padding: '80px 48px 80px 24px',
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: 340,
                opacity: transitioning ? 0.6 : 1,
                transition: 'opacity 0.3s ease',
              }}
            >
              <div
                className="font-mono-aura"
                style={{
                  fontSize: 9,
                  letterSpacing: 3,
                  color: 'rgba(245,240,232,0.25)',
                  marginBottom: 12,
                  textTransform: 'uppercase',
                }}
              >
                Live Preview ·
              </div>
              <FestivalPass data={formData} passId={passId} />
            </div>
          </div>
        )}
      </div>

      {/* Mobile sticky pass preview */}
      {isMobile && (
        <div className="mobile-pass-preview" onClick={onToggleMobilePass}>
          <div
            style={{
              background: 'linear-gradient(135deg, #0D1B2A 0%, #12103A 100%)',
              border: '1px solid rgba(0,240,255,0.3)',
              borderRadius: 10,
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="font-anton-aura" style={{ fontSize: 14, color: '#00F0FF', letterSpacing: 2 }}>
                AURA 2026
              </div>
              <div style={{ fontSize: 11, color: 'rgba(245,240,232,0.6)' }}>
                {[formData.name.split(' ')[0], formData.dept, formData.year ? `${formData.year} YR` : '']
                  .filter(Boolean)
                  .join(' · ') || 'Your pass builds here'}
              </div>
            </div>
            <div style={{ fontSize: 10, color: 'rgba(245,240,232,0.3)' }}>
              {mobilePassOpen ? '▼' : '▲'} PASS
            </div>
          </div>

          {mobilePassOpen && (
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                right: 0,
                marginBottom: 8,
                maxHeight: '60vh',
                overflowY: 'auto',
              }}
            >
              <FestivalPass data={formData} passId={passId} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
