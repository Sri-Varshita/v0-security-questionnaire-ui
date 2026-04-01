"use client"

import { useEffect, useState } from "react"
import { Brain, CheckCircle2, AlertTriangle, ShieldAlert, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuestionResult {
  id: string
  question: string
  answer: string
  confidence: number
  source: string
  status: "auto-answered" | "needs-review"
}

interface AppSettings {
  confidenceThreshold: number
  detailLevel: "brief" | "standard" | "detailed"
  autoCite: boolean
}

interface AIInsightsPanelProps {
  results: QuestionResult[]
  settings: AppSettings
}

export function AIInsightsPanel({ results, settings }: AIInsightsPanelProps) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Compute metrics from results
  const totalQuestions = results.length
  const autoAnswered = results.filter((r) => r.confidence > settings.confidenceThreshold).length
  const needsReview = results.filter((r) => r.confidence <= settings.confidenceThreshold).length
  const autoAnsweredPercent = totalQuestions > 0 ? Math.round((autoAnswered / totalQuestions) * 100) : 0
  const avgConfidence = totalQuestions > 0 ? Math.round(results.reduce((sum, r) => sum + r.confidence, 0) / totalQuestions) : 0

  // Find questions with lowest confidence (potential risks)
  const lowestConfidenceQuestions = results
    .sort((a, b) => a.confidence - b.confidence)
    .slice(0, 3)

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
          <p className="text-xs text-muted-foreground">Real-time analysis from generated results</p>
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
          <div className="p-2 rounded-lg bg-yellow-500/15">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-500 tabular-nums">{needsReview}</p>
            <p className="text-xs text-muted-foreground">Needs Review</p>
          </div>
        </div>

        {/* Avg Confidence */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-destructive/15">
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-2xl font-bold text-foreground tabular-nums">{avgConfidence}%</p>
            <p className="text-xs text-muted-foreground">Avg Confidence</p>
          </div>
        </div>
      </div>

      {/* Low Confidence Alerts */}
      {lowestConfidenceQuestions.length > 0 && (
        <div className="px-6 py-4 border-t border-border/30 bg-destructive/5">
          <p className="text-xs font-semibold text-foreground mb-3">Topics Requiring Attention</p>
          <div className="space-y-2">
            {lowestConfidenceQuestions
              .filter((q) => q.confidence <= settings.confidenceThreshold)
              .map((question) => (
                <div key={question.id} className="flex items-start gap-2 text-xs">
                  <span className="text-destructive/60 mt-0.5">•</span>
                  <span className="text-muted-foreground truncate">{question.question}</span>
                  <span className="text-destructive font-semibold whitespace-nowrap ml-auto">
                    {question.confidence}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
