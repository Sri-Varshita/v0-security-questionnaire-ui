"use client"

import { Upload, FileText, Settings, ChevronRight } from "lucide-react"
import type { SectionKey } from "../lib/app-types"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeSection: SectionKey
  onSectionChange: (section: SectionKey) => void
}

const navItems: Array<{ id: SectionKey; label: string; icon: typeof Upload }> = [
  { id: "upload", label: "Upload", icon: Upload },
  { id: "results", label: "Results", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
]

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 border-r border-border/50 bg-sidebar/50 backdrop-blur-xl z-30">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group",
                isActive
                  ? "bg-primary/15 border border-primary/30 text-primary glow-green-subtle"
                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground border border-transparent"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )} />
              <span className="font-medium">{item.label}</span>
              <ChevronRight className={cn(
                "h-4 w-4 ml-auto transition-all",
                isActive ? "text-primary opacity-100" : "opacity-0 group-hover:opacity-50"
              )} />
            </button>
          )
        })}
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <div className="glass-card p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground">System Status</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">AI Engine</span>
              <span className="text-primary font-mono">Online</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Knowledge Base</span>
              <span className="text-primary font-mono">Ready</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
