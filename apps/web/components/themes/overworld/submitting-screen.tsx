'use client'

import React, { useState, useEffect } from 'react'

export function SubmittingScreen() {
  const [frame, setFrame] = useState(0)
  const frames = ['▱▱▱', '▰▱▱', '▰▰▱', '▰▰▰']

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % frames.length), 420)
    return () => clearInterval(id)
  }, [frames.length])

  return (
    <div style={{ textAlign: 'center', animation: 'overworld-fadeSlideUp 0.4s ease forwards' }}>
      <div className="pixel-font" style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, marginBottom: 16 }}>
        {frames[frame]}
      </div>
      <div className="pixel-font" style={{ fontSize: 9, color: 'rgba(212,168,67,0.8)', letterSpacing: 1 }}>
        BUILDING YOUR RESPONSE…
      </div>
    </div>
  )
}
