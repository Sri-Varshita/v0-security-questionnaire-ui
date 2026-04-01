"use client"

import { useState, useEffect } from "react"
import { Rocket, Terminal, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProcessingTerminalProps {
  isProcessing: boolean
  onProcess: () => void
  onComplete: () => void
}

const terminalLogs = [
  { text: "Initializing AI engine...", delay: 0 },
  { text: "Parsing questionnaire document...", delay: 800 },
  { text: "Extracting 47 questions found...", delay: 1500 },
  { text: "Connecting to knowledge base...", delay: 2200 },
  { text: "Loading security policies...", delay: 2800 },
  { text: "Cross-referencing SOC2 requirements...", delay: 3500 },
  { text: "Generating AI responses...", delay: 4200 },
  { text: "Calculating confidence scores...", delay: 5000 },
  { text: "Validating compliance mappings...", delay: 5800 },
  { text: "✓ Processing complete!", delay: 6500 },
]

export function ProcessingTerminal({ isProcessing, onProcess, onComplete }: ProcessingTerminalProps) {
  const [logs, setLogs] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState("")
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (!isProcessing) {
      setLogs([])
      setCurrentLine("")
      return
    }

    const timeouts: NodeJS.Timeout[] = []

    terminalLogs.forEach((log, index) => {
      const timeout = setTimeout(() => {
        if (index < terminalLogs.length - 1) {
          setLogs(prev => [...prev, log.text])
          setCurrentLine("")
        } else {
          setCurrentLine(log.text)
          setTimeout(() => {
            setLogs(prev => [...prev, log.text])
            setCurrentLine("")
            onComplete()
          }, 500)
        }
      }, log.delay)
      timeouts.push(timeout)
    })

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [isProcessing, onComplete])

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Main Action Button */}
      <div className="flex justify-center">
        <button
          onClick={onProcess}
          disabled={isProcessing}
          className={cn(
            "relative group px-8 py-4 rounded-lg font-mono text-lg font-semibold",
            "bg-primary text-primary-foreground",
            "transition-all duration-300",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            !isProcessing && "hover:scale-105 animate-flicker glow-green"
          )}
        >
          <span className="flex items-center gap-3">
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Terminal className="h-5 w-5" />
                Auto-Fill Questionnaire
                <Rocket className="h-5 w-5" />
              </>
            )}
          </span>
          
          {!isProcessing && (
            <div className="absolute inset-0 rounded-lg bg-primary/50 blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
          )}
        </button>
      </div>

      {/* Terminal Display */}
      {isProcessing && (
        <div className="glass-card rounded-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border-b border-border/50">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-destructive/70" />
              <div className="h-3 w-3 rounded-full bg-chart-4/70" />
              <div className="h-3 w-3 rounded-full bg-primary/70" />
            </div>
            <span className="text-xs font-mono text-muted-foreground ml-2">
              security-agent@compliance:~$
            </span>
          </div>
          
          <div className="p-4 font-mono text-sm space-y-1 min-h-[200px] max-h-[300px] overflow-y-auto">
            {logs.map((log, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-2 animate-in fade-in slide-in-from-left-2 duration-300",
                  log.includes("✓") ? "text-primary" : "text-muted-foreground"
                )}
              >
                {log.includes("✓") ? (
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                ) : (
                  <span className="text-primary">{">"}</span>
                )}
                <span>{log}</span>
              </div>
            ))}
            
            {currentLine && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <span className="text-primary">{">"}</span>
                <span>
                  {currentLine}
                  <span className={cn(
                    "inline-block w-2 h-4 bg-primary ml-1 align-middle",
                    showCursor ? "opacity-100" : "opacity-0"
                  )} />
                </span>
              </div>
            )}
            
            {!currentLine && isProcessing && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-primary">{">"}</span>
                <span className={cn(
                  "inline-block w-2 h-4 bg-primary",
                  showCursor ? "opacity-100" : "opacity-0"
                )} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
