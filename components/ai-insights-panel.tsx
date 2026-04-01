"use client"

import { useEffect, useState } from "react"
import { Brain, CheckCircle2, AlertTriangle, ShieldAlert, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIInsightsPanelProps {
  totalQuestions: number
  autoAnswered: number
  needsReview: number
}

export function AIInsightsPanel({ totalQuestions, autoAnswered, needsReview }: AIInsightsPanelProps) {
  const [animated, setAnimated] = useState(false)
  const autoAnsweredPercent = Math.round((autoAnswered / totalQuestions) * 100)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div 
      className={cn(
        "rounded-2xl overflow-hidden transition-all duration-700",
        "bg-card/40 backdrop-blur-xl border border-border/40",
        "shadow-lg shadow-black/5",
        animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border/30 bg-primary/5">
        <div className="p-2 rounded-lg bg-primary/15">
          <Brain className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI Insights</h3>
          <p className="text-xs text-muted-foreground">Analysis summary from AWS Bedrock</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6">
        {/* Total Processed */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-muted/30">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground tabular-nums">{totalQuestions}</p>
            <p className="text-xs text-muted-foreground">Questions Processed</p>
          </div>
        </div>

        {/* Auto-Answered */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/15">
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-primary tabular-nums">{autoAnsweredPercent}%</p>
            <p className="text-xs text-muted-foreground">Auto-Answered</p>
          </div>
        </div>

        {/* Needs Review */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-chart-4/15">
            <AlertTriangle className="h-4 w-4 text-chart-4" />
          </div>
          <div>
            <p className="text-2xl font-bold text-chart-4 tabular-nums">{needsReview}</p>
            <p className="text-xs text-muted-foreground">Needs Review</p>
          </div>
        </div>

        {/* Risk Insight */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-destructive/15">
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground mb-0.5">Key Risk</p>
            <p className="text-xs text-muted-foreground truncate">
              Data encryption responses need review
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
