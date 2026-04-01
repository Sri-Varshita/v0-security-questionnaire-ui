"use client"

import { useState } from "react"
import { CheckCircle2, AlertCircle, FileText, TrendingUp, ShieldCheck, Download } from "lucide-react"
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

interface ResultsDashboardProps {
  results: QuestionResult[]
  settings: AppSettings
}

// Animated Confidence Bar Component
function ConfidenceBar({ confidence, delay = 0 }: { confidence: number; delay?: number }) {
  const percentage = Math.min(confidence, 100)
  const color = percentage > 80 ? "bg-primary" : percentage > 60 ? "bg-yellow-500" : "bg-orange-500"

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-muted/30 overflow-hidden">
        <div
          className={cn("h-full transition-all duration-500", color)}
          style={{
            width: `${percentage}%`,
            animationDelay: `${delay}ms`,
          }}
        />
      </div>
      <span className="text-xs font-semibold tabular-nums min-w-[3rem] text-right">{confidence}%</span>
    </div>
  )
}

export function ResultsDashboard({ results, settings }: ResultsDashboardProps) {
  const [filter, setFilter] = useState<"all" | "auto-answered" | "needs-review">("all")
  const [selectedSource, setSelectedSource] = useState<string | null>(null)

  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">No results yet</p>
        <p className="text-sm">Upload documents and click "Auto-Fill Questionnaire" to generate responses</p>
      </div>
    )
  }

  // Filter logic based on confidence threshold
  const filteredResults = results.filter((result) => {
    if (filter === "all") return true
    if (filter === "auto-answered") return result.confidence > settings.confidenceThreshold
    if (filter === "needs-review") return result.confidence <= settings.confidenceThreshold
    return true
  })

  // Calculate statistics
  const stats = {
    total: results.length,
    autoAnswered: results.filter((r) => r.confidence > settings.confidenceThreshold).length,
    needsReview: results.filter((r) => r.confidence <= settings.confidenceThreshold).length,
    avgConfidence: Math.round(
      results.reduce((sum, r) => sum + r.confidence, 0) / results.length
    ),
  }

  // Export results as JSON
  const handleExport = () => {
    const dataStr = JSON.stringify(results, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `security-questionnaire-results-${Date.now()}.json`
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-mono">Total Questions</span>
          </div>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-xs font-mono">Auto-Answered</span>
          </div>
          <p className="text-2xl font-bold text-primary">
            {stats.autoAnswered} ({Math.round((stats.autoAnswered / stats.total) * 100)}%)
          </p>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <span className="text-xs font-mono">Needs Review</span>
          </div>
          <p className="text-2xl font-bold text-yellow-500">{stats.needsReview}</p>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-xs font-mono">Avg Confidence</span>
          </div>
          <p className={cn("text-2xl font-bold", stats.avgConfidence > 80 ? "text-primary" : "text-yellow-500")}>
            {stats.avgConfidence}%
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: "all" as const, label: "All Questions", count: stats.total },
          { id: "auto-answered" as const, label: "Auto-Answered", count: stats.autoAnswered },
          { id: "needs-review" as const, label: "Needs Review", count: stats.needsReview },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={cn(
              "px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium",
              filter === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
            )}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Export Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleExport}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg",
            "bg-primary/20 text-primary border border-primary/30",
            "hover:bg-primary/30 transition-colors",
            "text-sm font-medium"
          )}
        >
          <Download className="h-4 w-4" />
          Export Results (JSON)
        </button>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredResults.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No results match the selected filter</p>
          </div>
        ) : (
          filteredResults.map((result, index) => (
            <div
              key={result.id}
              className={cn(
                "glass-card p-6 rounded-xl",
                "border border-border/30 hover:border-border/60 transition-all duration-200",
                "animate-in fade-in slide-in-from-bottom-2"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="space-y-4">
                {/* Question */}
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-xs font-mono text-primary px-2 py-1 rounded bg-primary/20 whitespace-nowrap">
                      {result.status === "auto-answered" ? "Auto-Answered" : "Needs Review"}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{result.question}</p>
                </div>

                {/* Confidence Bar */}
                <ConfidenceBar confidence={result.confidence} delay={index * 50} />

                {/* Answer */}
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.answer}</p>
                </div>

                {/* Source Document Chip */}
                <div className="flex items-center gap-2 pt-4 border-t border-border/30">
                  <span className="text-xs text-muted-foreground">Source:</span>
                  <button
                    onClick={() => setSelectedSource(result.source)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
                      "bg-muted/30 border border-border/40",
                      "text-xs font-mono text-foreground",
                      "transition-all duration-200",
                      "hover:bg-primary/10 hover:border-primary/30 hover:text-primary",
                      "cursor-pointer active:scale-95"
                    )}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    {result.source}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-xl bg-card/90 border border-border/50 p-5 shadow-lg backdrop-blur-xl">
            <h4 className="text-sm font-semibold text-foreground mb-2">Source Information</h4>
            <p className="text-sm text-muted-foreground mb-4">{selectedSource}</p>
            <p className="text-xs text-muted-foreground">Click outside or "Close" to dismiss.</p>

            <button
              onClick={() => setSelectedSource(null)}
              className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
            >
              Close
            </button>
          </div>
          <button
            aria-label="Close modal"
            className="absolute inset-0"
            onClick={() => setSelectedSource(null)}
          />
        </div>
      )}
    </div>
  )
}
