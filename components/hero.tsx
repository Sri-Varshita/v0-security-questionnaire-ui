"use client"

import { useState, useEffect } from "react"

const typingPhrases = [
  "Parsing documents...",
  "Understanding policies...",
  "Generating responses...",
]

export function Hero() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentPhrase = typingPhrases[currentPhraseIndex]
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayedText.length < currentPhrase.length) {
          setDisplayedText(currentPhrase.slice(0, displayedText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 1500)
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(displayedText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setCurrentPhraseIndex((prev) => (prev + 1) % typingPhrases.length)
        }
      }
    }, isDeleting ? 40 : 80)

    return () => clearTimeout(timeout)
  }, [displayedText, isDeleting, currentPhraseIndex])

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-transparent to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/[0.03] rounded-full blur-3xl" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-20 text-center animate-in fade-in duration-700">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-xs font-medium border border-primary/20 rounded-full bg-primary/5 text-primary">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          AI-Powered Security Compliance
        </div>

        {/* Headline */}
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
          Automate Security Questionnaires in{" "}
          <span className="text-primary">Minutes</span>, Not Days
        </h1>

        {/* Subtext */}
        <p className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty">
          AI-powered compliance assistant using AWS Bedrock
        </p>

        {/* Typing animation */}
        <div className="mt-8 h-8 flex items-center justify-center">
          <div className="flex items-center gap-2 px-4 py-2 font-mono text-sm bg-card/50 border border-border/50 rounded-lg backdrop-blur-sm">
            <span className="text-primary/70">&gt;</span>
            <span className="text-muted-foreground">{displayedText}</span>
            <span className="w-2 h-5 bg-primary/70 animate-pulse" />
          </div>
        </div>

        {/* Subtle bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </div>
    </section>
  )
}
