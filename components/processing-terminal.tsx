"use client"

import { useState, useEffect, useRef } from "react"
import { Rocket, Terminal, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProcessingTerminalProps {
  isProcessing: boolean
  filesCount: number
  onProcess: () => void
  onComplete: () => void
}

interface LogEntry {
  text: string
  type: "info" | "success" | "processing" | "system"
  delay: number
}

const createTerminalLogs = (filesCount: number): LogEntry[] => [
  { text: "[SYSTEM] Initializing AI Security Agent v2.4.1", type: "system", delay: 0 },
  { text: `Upload received - Processing ${filesCount} file${filesCount !== 1 ? "s" : ""}...`, type: "info", delay: 600 },
  { text: "Validating document format: PDF detected", type: "info", delay: 1200 },
  { text: "Extracting questions...", type: "processing", delay: 1800 },
  { text: "Found 47 security questions in questionnaire", type: "info", delay: 2600 },
  { text: "Searching knowledge base...", type: "processing", delay: 3200 },
  { text: "Loaded 12 policy documents (SOC2, ISO27001, GDPR)", type: "info", delay: 4000 },
  { text: "Understanding policies...", type: "processing", delay: 4600 },
  { text: "Mapping compliance requirements...", type: "info", delay: 5400 },
  { text: "Generating responses...", type: "processing", delay: 6000 },
  { text: "AI confidence scoring in progress...", type: "info", delay: 6800 },
  { text: "Validating 47/47 answers generated", type: "info", delay: 7600 },
  { text: "[SUCCESS] Processing complete - Ready for review", type: "success", delay: 8400 },
]

export function ProcessingTerminal({ isProcessing, filesCount, onProcess, onComplete }: ProcessingTerminalProps) {
  const [displayedLogs, setDisplayedLogs] = useState<{ text: string; type: string; isTyping: boolean }[]>([])
  const [currentTypingIndex, setCurrentTypingIndex] = useState(-1)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const terminalRef = useRef<HTMLDivElement>(null)
  
  const terminalLogs = createTerminalLogs(filesCount)

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [displayedLogs, currentCharIndex])

  // Main processing effect
  useEffect(() => {
    if (!isProcessing) {
      setDisplayedLogs([])
      setCurrentTypingIndex(-1)
      setCurrentCharIndex(0)
      return
    }

    const timeouts: NodeJS.Timeout[] = []

    terminalLogs.forEach((log, index) => {
      const timeout = setTimeout(() => {
        setCurrentTypingIndex(index)
        setCurrentCharIndex(0)
        
        // Add the new log entry as "typing"
        setDisplayedLogs(prev => [
          ...prev.map(l => ({ ...l, isTyping: false })),
          { text: "", type: log.type, isTyping: true }
        ])
      }, log.delay)
      timeouts.push(timeout)
    })

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [isProcessing])

  // Character-by-character typing effect
  useEffect(() => {
    if (currentTypingIndex < 0 || currentTypingIndex >= terminalLogs.length) return

    const currentLog = terminalLogs[currentTypingIndex]
    
    if (currentCharIndex < currentLog.text.length) {
      const typingSpeed = currentLog.type === "system" ? 15 : 25 + Math.random() * 20
      
      const timeout = setTimeout(() => {
        setDisplayedLogs(prev => {
          const updated = [...prev]
          const lastIndex = updated.length - 1
          if (lastIndex >= 0) {
            updated[lastIndex] = {
              ...updated[lastIndex],
              text: currentLog.text.substring(0, currentCharIndex + 1)
            }
          }
          return updated
        })
        setCurrentCharIndex(prev => prev + 1)
      }, typingSpeed)

      return () => clearTimeout(timeout)
    } else {
      // Finished typing this line
      setDisplayedLogs(prev => {
        const updated = [...prev]
        const lastIndex = updated.length - 1
        if (lastIndex >= 0) {
          updated[lastIndex] = { ...updated[lastIndex], isTyping: false }
        }
        return updated
      })

      // Check if this is the last log
      if (currentTypingIndex === terminalLogs.length - 1) {
        setTimeout(() => {
          onComplete()
        }, 600)
      }
    }
  }, [currentTypingIndex, currentCharIndex, onComplete])

  const getLogColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-primary"
      case "system":
        return "text-primary/80"
      case "processing":
        return "text-foreground"
      default:
        return "text-muted-foreground"
    }
  }

  const getLogPrefix = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
      case "system":
        return <span className="text-primary/60 text-xs">$</span>
      case "processing":
        return <Loader2 className="h-3.5 w-3.5 text-primary animate-spin flex-shrink-0" />
      default:
        return <span className="text-primary/40">{">"}</span>
    }
  }

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
        <div 
          className={cn(
            "rounded-lg overflow-hidden",
            "bg-[#0a0f14] border border-primary/20",
            "animate-in fade-in slide-in-from-bottom-4 duration-500",
            "glow-green-subtle"
          )}
        >
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0d1117] border-b border-primary/10">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/70 hover:bg-yellow-500 transition-colors" />
              <div className="h-3 w-3 rounded-full bg-green-500/70 hover:bg-green-500 transition-colors" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-xs font-mono text-muted-foreground/60">
                security-agent@aws-bedrock ~ processing
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono text-primary/70">LIVE</span>
            </div>
          </div>
          
          {/* Terminal Body */}
          <div 
            ref={terminalRef}
            className="p-4 font-mono text-sm space-y-2 min-h-[240px] max-h-[320px] overflow-y-auto scrollbar-thin"
          >
            {/* Initial prompt */}
            <div className="text-primary/50 text-xs mb-3">
              {"// AWS Bedrock Security Agent initialized"}
            </div>
            
            {displayedLogs.map((log, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-2.5",
                  getLogColor(log.type),
                  !log.isTyping && "animate-in fade-in duration-200"
                )}
              >
                <span className="mt-0.5">{getLogPrefix(log.type)}</span>
                <span className="flex-1">
                  {log.text}
                  {log.isTyping && (
                    <span 
                      className={cn(
                        "inline-block w-2 h-4 bg-primary ml-0.5 align-middle transition-opacity",
                        showCursor ? "opacity-100" : "opacity-0"
                      )} 
                    />
                  )}
                </span>
                {!log.isTyping && log.type === "info" && (
                  <span className="text-xs text-muted-foreground/40 tabular-nums">
                    {new Date().toLocaleTimeString()}
                  </span>
                )}
              </div>
            ))}
            
            {/* Waiting cursor when between logs */}
            {displayedLogs.length > 0 && 
             displayedLogs[displayedLogs.length - 1]?.isTyping === false && 
             currentTypingIndex < terminalLogs.length - 1 && (
              <div className="flex items-center gap-2.5 text-muted-foreground/40">
                <span className="text-primary/40">{">"}</span>
                <span 
                  className={cn(
                    "inline-block w-2 h-4 bg-primary/60",
                    showCursor ? "opacity-100" : "opacity-0"
                  )} 
                />
              </div>
            )}
          </div>

          {/* Terminal Footer */}
          <div className="px-4 py-2 bg-[#0d1117] border-t border-primary/10 flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground/50">
              {displayedLogs.length}/{terminalLogs.length} operations
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-muted-foreground/50">
                Model: Claude 3.5 Sonnet
              </span>
              <span className="text-xs font-mono text-primary/60">
                AWS Bedrock
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
