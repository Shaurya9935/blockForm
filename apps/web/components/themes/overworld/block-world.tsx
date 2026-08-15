'use client'

import React, { useEffect, useRef } from 'react'
import type { BlockWorldProps, EnvPalette } from './types'

export const ENV_PALETTES: EnvPalette[] = [
  { grass: '#5a8a3c', grassTop: '#7ab84e', dirt: '#8b5c2a', stone: '#7a7a7a', tree: '#2d5a1e', leaves: '#4a8a30', mountain: '#9a9a9a', snow: '#e8e8f0', cloud: 'rgba(255,255,255,0.85)', sun: '#f4c842', path: '#c8a050' },
  { grass: '#3d7a2e', grassTop: '#5a9a40', dirt: '#6b4820', stone: '#5a6a5a', tree: '#1a4010', leaves: '#2d6020', mountain: '#4a6a4a', snow: '#d0e8d0', cloud: 'rgba(200,230,200,0.7)', sun: '#a8d080', path: '#8b6840' },
  { grass: '#4a6a3a', grassTop: '#6a8a4a', dirt: '#7a5a30', stone: '#8a8a9a', tree: '#3a5030', leaves: '#4a7040', mountain: '#b0b8c8', snow: '#e8eef8', cloud: 'rgba(220,230,250,0.8)', sun: '#d0e0f0', path: '#c0a080' },
  { grass: '#6a5a3a', grassTop: '#8a7a4a', dirt: '#9a6a40', stone: '#8a7a6a', tree: '#4a3820', leaves: '#7a5a30', mountain: '#c89a7a', snow: '#f0c8a0', cloud: 'rgba(255,200,150,0.6)', sun: '#f0a040', path: '#d08060' },
  { grass: '#1a2a3a', grassTop: '#2a3a4a', dirt: '#2a1a10', stone: '#3a3a4a', tree: '#101820', leaves: '#182830', mountain: '#2a3050', snow: '#404060', cloud: 'rgba(100,120,180,0.4)', sun: '#4060a0', path: '#302820' },
  { grass: '#6a7a2a', grassTop: '#9aaa3a', dirt: '#8a6a30', stone: '#a0987a', tree: '#4a5820', leaves: '#7a9030', mountain: '#c0b880', snow: '#f8f0c0', cloud: 'rgba(255,245,180,0.9)', sun: '#f8c840', path: '#e0c070' },
]

export function BlockWorld({ envIndex, showFullScene }: BlockWorldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)

  const palIndex = Math.max(0, Math.min(envIndex, ENV_PALETTES.length - 1))
  const pal = (ENV_PALETTES[palIndex] ?? ENV_PALETTES[0]) as EnvPalette


  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const drawBlock = (
      x: number,
      y: number,
      w: number,
      h: number,
      topColor: string,
      sideColor: string,
      frontColor: string,
      depth = 6
    ) => {
      // Front face
      ctx.fillStyle = frontColor
      ctx.fillRect(x, y + depth, w, h - depth)
      // Top face
      ctx.fillStyle = topColor
      ctx.beginPath()
      ctx.moveTo(x, y + depth)
      ctx.lineTo(x + depth, y)
      ctx.lineTo(x + w + depth, y)
      ctx.lineTo(x + w, y + depth)
      ctx.closePath()
      ctx.fill()
      // Side face
      ctx.fillStyle = sideColor
      ctx.beginPath()
      ctx.moveTo(x + w, y + depth)
      ctx.lineTo(x + w + depth, y)
      ctx.lineTo(x + w + depth, y + h - depth)
      ctx.lineTo(x + w, y + h)
      ctx.closePath()
      ctx.fill()
    }

    const draw = (t: number) => {
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      // Clouds
      const numClouds = 4
      for (let i = 0; i < numClouds; i++) {
        const speed = 0.3 + i * 0.12
        const cx = ((t * speed * 0.4 + i * (W / numClouds)) % (W + 300)) - 150
        const cy = 60 + i * 35 + Math.sin(t * 0.5 + i) * 8
        ctx.fillStyle = pal.cloud
        ctx.beginPath()
        ctx.ellipse(cx, cy, 60, 22, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.ellipse(cx + 40, cy - 8, 40, 18, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.ellipse(cx - 30, cy - 4, 35, 15, 0, 0, Math.PI * 2)
        ctx.fill()
      }

      // Sun / moon
      const sunX = W * 0.82
      const sunY = H * 0.18
      ctx.fillStyle = pal.sun
      ctx.fillRect(sunX - 14, sunY - 14, 28, 28)
      // Pixel glow rays
      ctx.fillStyle = pal.sun + '60'
      ctx.fillRect(sunX - 22, sunY - 4, 8, 8)
      ctx.fillRect(sunX + 14, sunY - 4, 8, 8)
      ctx.fillRect(sunX - 4, sunY - 22, 8, 8)
      ctx.fillRect(sunX - 4, sunY + 14, 8, 8)

      // Mountains (distant)
      const mtColors = [pal.mountain, pal.stone]
      const mtData = [
        { x: W * 0.05, w: W * 0.25, h: H * 0.35 },
        { x: W * 0.22, w: W * 0.2, h: H * 0.28 },
        { x: W * 0.6, w: W * 0.28, h: H * 0.32 },
        { x: W * 0.78, w: W * 0.2, h: H * 0.24 },
      ]
      mtData.forEach((mt, i) => {
        ctx.fillStyle = mtColors[i % 2] ?? pal.mountain
        ctx.beginPath()
        ctx.moveTo(mt.x, H * 0.65)
        ctx.lineTo(mt.x + mt.w / 2, H * 0.65 - mt.h)
        ctx.lineTo(mt.x + mt.w, H * 0.65)
        ctx.closePath()
        ctx.fill()
        // Snow cap
        ctx.fillStyle = pal.snow
        ctx.beginPath()
        ctx.moveTo(mt.x + mt.w * 0.35, H * 0.65 - mt.h * 0.65)
        ctx.lineTo(mt.x + mt.w / 2, H * 0.65 - mt.h)
        ctx.lineTo(mt.x + mt.w * 0.65, H * 0.65 - mt.h * 0.65)
        ctx.closePath()
        ctx.fill()
      })

      // Terrain base — ground plane
      const groundY = H * 0.68
      const blockSize = 32

      // Stone base rows
      for (let col = -1; col < Math.ceil(W / blockSize) + 2; col++) {
        const bx = col * blockSize
        drawBlock(bx, groundY + blockSize * 1, blockSize, blockSize * 2, '#666', '#555', '#7a7a7a', 4)
        drawBlock(bx, groundY + blockSize * 2, blockSize, blockSize * 2, '#5a5a5a', '#484848', '#6a6a6a', 4)
      }

      // Dirt row
      for (let col = -1; col < Math.ceil(W / blockSize) + 2; col++) {
        const bx = col * blockSize
        drawBlock(bx, groundY, blockSize, blockSize, pal.dirt, pal.dirt + 'cc', pal.dirt + 'ee', 4)
      }

      // Grass top row
      const heights = [0, -1, 0, 1, 0, -1, 1, 0, 0, 1, -1, 0, 1, 0, 0, -1, 0, 1]
      for (let col = -1; col < Math.ceil(W / blockSize) + 2; col++) {
        const bx = col * blockSize
        const hOff = (heights[((col % heights.length) + heights.length) % heights.length] || 0) * 6
        drawBlock(bx, groundY - blockSize + hOff, blockSize, blockSize, pal.grassTop, pal.grass + 'cc', pal.grass, 4)
      }

      // Path in the center
      const pathW = 3
      const pathStart = Math.floor(W / (2 * blockSize)) - Math.floor(pathW / 2)
      for (let col = pathStart; col < pathStart + pathW; col++) {
        const bx = col * blockSize
        drawBlock(bx, groundY - blockSize, blockSize, blockSize, pal.path, pal.path + 'aa', pal.path + 'cc', 4)
        // Extend path down to edge
        ctx.fillStyle = pal.path + 'aa'
        ctx.fillRect(bx, groundY, blockSize, H - groundY)
      }

      // Trees on sides
      const treePositions = [
        { col: 2, height: 4 }, { col: 4, height: 3 },
        { col: 6, height: 5 }, { col: 8, height: 3 },
        { col: Math.ceil(W / blockSize) - 4, height: 4 },
        { col: Math.ceil(W / blockSize) - 6, height: 5 },
        { col: Math.ceil(W / blockSize) - 9, height: 3 },
        { col: Math.ceil(W / blockSize) - 11, height: 4 },
      ]

      treePositions.forEach(({ col, height }) => {
        const bx = col * blockSize
        const groundTop = groundY - blockSize
        // Trunk
        for (let i = 0; i < height; i++) {
          drawBlock(bx + 8, groundTop - blockSize * i, blockSize - 16, blockSize, pal.tree + 'ee', pal.tree + 'aa', pal.tree, 3)
        }
        // Leaves (3x3 blob at top)
        for (let lx = -1; lx <= 1; lx++) {
          for (let ly = 0; ly <= 2; ly++) {
            if (Math.abs(lx) === 1 && ly === 2) continue
            drawBlock(
              bx + lx * (blockSize - 4) - 4,
              groundTop - blockSize * (height + ly) + 8,
              blockSize, blockSize - 4,
              pal.leaves + 'ee', pal.leaves + 'bb', pal.leaves, 3
            )
          }
        }
      })

      // Particles (fireflies/dust)
      const numParticles = envIndex === 4 ? 20 : 8
      for (let i = 0; i < numParticles; i++) {
        const px = ((Math.sin(t * 0.3 + i * 137) * 0.5 + 0.5) * W * 0.8 + W * 0.1)
        const py = (groundY - 40) - ((t * (0.5 + i * 0.1) + i * 60) % (groundY - 80))
        const alpha = Math.abs(Math.sin(t * 1.2 + i * 0.7))
        ctx.fillStyle = envIndex === 4 ? `rgba(150,180,255,${alpha * 0.7})` : `rgba(255,245,180,${alpha * 0.5})`
        const ps = 3
        ctx.fillRect(px - ps / 2, py - ps / 2, ps, ps)
      }

      if (!showFullScene) {
        // Vignette overlay for form mode
        const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75)
        vignette.addColorStop(0, 'rgba(0,0,0,0)')
        vignette.addColorStop(1, 'rgba(0,0,0,0.55)')
        ctx.fillStyle = vignette
        ctx.fillRect(0, 0, W, H)
      }
    }

    const tick = (t: number) => {
      timeRef.current = t / 1000
      draw(timeRef.current)
      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [envIndex, showFullScene, pal])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 1 }}
    />
  )
}
