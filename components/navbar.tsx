"use client"

import { Shield, Cpu, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type SectionKey = "upload" | "results" | "settings"

interface NavbarProps {
  activeSection: SectionKey
  onSectionChange: (section: SectionKey) => void
}

export function Navbar({ activeSection, onSectionChange }: NavbarProps) {
  const sections: Array<{ key: SectionKey; label: string }> = [
    { key: "upload", label: "Upload" },
    { key: "results", label: "Results" },
    { key: "settings", label: "Settings" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Shield className="h-8 w-8 text-primary" />
            <div className="absolute inset-0 animate-pulse-glow rounded-full" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-foreground">Security Questionnaire Agent</span>
            <span className="text-xs font-mono text-muted-foreground">AI-Powered Compliance</span>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          {sections.map((item) => (
            <button
              key={item.key}
              onClick={() => onSectionChange(item.key)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                activeSection === item.key
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted/20 text-muted-foreground hover:bg-muted/50"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30">
          <UserCircle className="h-5 w-5 text-primary" />
          <span className="text-sm font-mono text-primary">Guest</span>
          <Cpu className="h-4 w-4 text-primary" />
        </div>
      </div>
    </header>
  )
}
