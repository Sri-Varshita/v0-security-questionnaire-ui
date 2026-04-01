"use client"

import { Shield, Cpu } from "lucide-react"

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Shield className="h-8 w-8 text-primary" />
            <div className="absolute inset-0 animate-pulse-glow rounded-full" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-foreground">
              Security Questionnaire Agent
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              AI-Powered Compliance
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </div>
          <span className="text-sm font-mono text-primary">AI Ready</span>
          <Cpu className="h-4 w-4 text-primary" />
        </div>
      </div>
    </header>
  )
}
