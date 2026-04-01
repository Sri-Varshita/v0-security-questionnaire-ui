"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  speed: number
  char: string
  opacity: number
  maxOpacity: number
  pulsePhase: number
  streamLength: number
  layer: number
  isDot: boolean
  isBinary: boolean
  horizontalDrift: number
  driftSpeed: number
}

export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationIdRef = useRef<number | null>(null)
  const frameCountRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    updateCanvasSize()

    // Characters for the matrix effect
    const katakanaChars = "ｦｭﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗﾍﾌﾙﾜﾝアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"
    const fontSize = 12

    // Create multiple layers of particles
    const createParticles = () => {
      const particles: Particle[] = []
      
      // Much higher density - fill the screen
      const columnCount = Math.ceil(canvas.width / (fontSize * 0.6)) // Smaller spacing for density
      const rowDensity = Math.ceil(canvas.height / (fontSize * 0.8))
      
      // Layer 0: Background (slow, faint)
      for (let i = 0; i < columnCount * 0.8; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height * 2,
          speed: Math.random() * 0.2 + 0.1, // Very slow
          char: katakanaChars[Math.floor(Math.random() * katakanaChars.length)],
          opacity: 0,
          maxOpacity: Math.random() * 0.1 + 0.05, // 5-15% - very faint
          pulsePhase: Math.random() * Math.PI * 2,
          streamLength: Math.random() * 8 + 3,
          layer: 0,
          isDot: Math.random() > 0.85,
          isBinary: Math.random() > 0.9,
          horizontalDrift: (Math.random() - 0.5) * 0.3,
          driftSpeed: Math.random() * 0.002,
        })
      }

      // Layer 1: Mid (medium speed, medium opacity)
      for (let i = 0; i < columnCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height * 1.5,
          speed: Math.random() * 0.4 + 0.25, // Medium speed
          char: katakanaChars[Math.floor(Math.random() * katakanaChars.length)],
          opacity: 0,
          maxOpacity: Math.random() * 0.12 + 0.08, // 8-20%
          pulsePhase: Math.random() * Math.PI * 2,
          streamLength: Math.random() * 12 + 5,
          layer: 1,
          isDot: Math.random() > 0.88,
          isBinary: Math.random() > 0.88,
          horizontalDrift: (Math.random() - 0.5) * 0.5,
          driftSpeed: Math.random() * 0.003,
        })
      }

      // Layer 2: Foreground (faster, brighter)
      for (let i = 0; i < columnCount * 1.2; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          speed: Math.random() * 0.6 + 0.4, // Faster
          char: katakanaChars[Math.floor(Math.random() * katakanaChars.length)],
          opacity: 0,
          maxOpacity: Math.random() * 0.15 + 0.15, // 15-30% - brightest
          pulsePhase: Math.random() * Math.PI * 2,
          streamLength: Math.random() * 15 + 8,
          layer: 2,
          isDot: Math.random() > 0.85,
          isBinary: Math.random() > 0.85,
          horizontalDrift: (Math.random() - 0.5) * 0.8,
          driftSpeed: Math.random() * 0.004,
        })
      }

      return particles
    }

    particlesRef.current = createParticles()

    // Colors with variations
    const primaryColor = "#22C55E" // Soft green
    const accentColor = "#10B981" // Medium green
    const darkColor = "#065F46" // Dark green

    const getColor = (opacity: number, layer: number) => {
      const rand = Math.random()
      if (rand > 0.7) {
        return `rgba(16, 185, 129, ${opacity})`
      } else if (rand > 0.4) {
        return `rgba(34, 197, 78, ${opacity})`
      }
      return `rgba(6, 95, 70, ${opacity})`
    }

    const animate = () => {
      frameCountRef.current++

      // Clear canvas with very subtle fade for motion blur effect
      ctx.fillStyle = "rgba(2, 6, 23, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw top gradient overlay for readability
      const topGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.15)
      topGradient.addColorStop(0, "rgba(2, 6, 23, 0.6)")
      topGradient.addColorStop(1, "rgba(2, 6, 23, 0)")
      ctx.fillStyle = topGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.15)

      // Draw bottom gradient overlay
      const bottomGradient = ctx.createLinearGradient(0, canvas.height * 0.85, 0, canvas.height)
      bottomGradient.addColorStop(0, "rgba(2, 6, 23, 0)")
      bottomGradient.addColorStop(1, "rgba(2, 6, 23, 0.5)")
      ctx.fillStyle = bottomGradient
      ctx.fillRect(0, canvas.height * 0.85, canvas.width, canvas.height * 0.15)

      // Draw particles
      particlesRef.current.forEach((particle) => {
        // Subtle pulsing effect
        const pulseAmount = Math.sin(particle.pulsePhase + frameCountRef.current * 0.01) * 0.5 + 0.5
        particle.opacity = particle.maxOpacity * (pulseAmount * 0.4 + 0.6) // Never fully transparent

        // Horizontal drift based on layer
        particle.horizontalDrift += particle.driftSpeed
        const driftX = Math.sin(particle.horizontalDrift) * (particle.layer + 1) * 2

        // Draw particle trail (streaming effect)
        for (let i = 0; i < particle.streamLength; i++) {
          const trailY = particle.y - i * (fontSize * 0.7)
          const trailOpacity = particle.opacity * (1 - i / particle.streamLength) * 0.8

          if (trailY > 0 && trailY < canvas.height) {
            ctx.fillStyle = getColor(trailOpacity, particle.layer)

            if (particle.isDot) {
              // Draw dot
              ctx.beginPath()
              ctx.arc(particle.x + driftX, trailY, 2, 0, Math.PI * 2)
              ctx.fill()
            } else if (particle.isBinary) {
              // Draw binary (0 or 1)
              const char = Math.random() > 0.5 ? "0" : "1"
              ctx.font = `${fontSize * 0.8}px 'Monaco', 'Courier New', monospace`
              ctx.textAlign = "center"
              ctx.textBaseline = "top"
              ctx.shadowColor = `rgba(34, 197, 78, ${trailOpacity * 0.3})`
              ctx.shadowBlur = 3
              ctx.fillText(char, particle.x + driftX, trailY)
            } else {
              // Draw katakana character
              ctx.font = `${fontSize}px 'Monaco', 'Courier New', monospace`
              ctx.textAlign = "center"
              ctx.textBaseline = "top"
              ctx.shadowColor = `rgba(34, 197, 78, ${trailOpacity * 0.4})`
              ctx.shadowBlur = 4
              ctx.fillText(particle.char, particle.x + driftX, trailY)
            }
          }
        }

        // Update position
        particle.y += particle.speed * (particle.layer + 1) * 0.5

        // Reset, when it goes off screen
        if (particle.y > canvas.height + canvas.height * 0.1) {
          particle.y = -particle.streamLength * fontSize
          particle.x = Math.random() * canvas.width
          particle.char = katakanaChars[Math.floor(Math.random() * katakanaChars.length)]
          particle.isDot = Math.random() > 0.85
          particle.isBinary = Math.random() > (0.88 - particle.layer * 0.01)
          particle.streamLength = Math.random() * (8 + particle.layer * 4) + (3 + particle.layer * 2)
          particle.horizontalDrift = (Math.random() - 0.5) * (0.3 + particle.layer * 0.25)
        }

        // Occasionally change character
        if (Math.random() < 0.008) {
          if (Math.random() > 0.9) {
            particle.isDot = !particle.isDot
          } else if (Math.random() > 0.92) {
            particle.isBinary = !particle.isBinary
          } else {
            particle.char = katakanaChars[Math.floor(Math.random() * katakanaChars.length)]
          }
        }
      })

      ctx.shadowColor = "transparent"
      animationIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      updateCanvasSize()
      particlesRef.current = createParticles()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [])

  return (
    <>
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: "#020617",
        }}
      />

      {/* Radial Gradient Overlay for Depth */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% 50%, rgba(2, 6, 23, 0.1) 0%, rgba(2, 6, 23, 0.35) 100%)
          `,
        }}
      />

      {/* Subtle vignette effect */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 120px rgba(0, 0, 0, 0.3)",
        }}
      />
    </>
  )
}
