"use client"

import { useState, useEffect } from "react"
import { Settings, Brain, AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

type DetailLevel = "low" | "medium" | "high"

interface AppSettings {
  confidenceThreshold: number
  detailLevel: DetailLevel
  autoCite: boolean
}

interface SettingsPanelProps {
  settings: AppSettings
  onSettingsChange: (newSettings: AppSettings) => void
}

export function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const [threshold, setThreshold] = useState(settings.confidenceThreshold)
  const [detailLevel, setDetailLevel] = useState(settings.detailLevel)
  const [autoCite, setAutoCite] = useState(settings.autoCite)
  const [hasChanges, setHasChanges] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string>("")

  useEffect(() => {
    const changed =
      threshold !== settings.confidenceThreshold ||
      detailLevel !== settings.detailLevel ||
      autoCite !== settings.autoCite

    setHasChanges(changed)
  }, [threshold, detailLevel, autoCite, settings])

  const handleApply = () => {
    if (threshold < 0 || threshold > 100) {
      setError("Confidence threshold must be between 0 and 100")
      setSuccessMessage("")
      return
    }

    setError(null)

    const newSettings: AppSettings = {
      confidenceThreshold: threshold,
      detailLevel,
      autoCite,
    }

    onSettingsChange(newSettings)
    setHasChanges(false)
    setSuccessMessage("Settings saved successfully!")

    setTimeout(() => setSuccessMessage(""), 2500)
  }

  const handleReset = () => {
    setThreshold(settings.confidenceThreshold)
    setDetailLevel(settings.detailLevel)
    setAutoCite(settings.autoCite)
    setError(null)
    setSuccessMessage("")
    setHasChanges(false)
  }

  const detailOptions: DetailLevel[] = ["low", "medium", "high"]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Settings
        </h2>
        <p className="text-sm text-muted-foreground">
          Configure AI behavior and questionnaire processing preferences
        </p>
      </div>

      <div className="grid gap-4">
        <div className="glass-card p-5 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/20">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">AI Configuration</h3>
              <p className="text-xs text-muted-foreground">Adjust AI behavior and response sensitivity</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">Confidence Threshold</label>
                <span className="text-sm font-mono text-primary">{threshold}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Responses below this threshold will be marked as "Needs Review"
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Response Detail Level</label>
              <div className="grid grid-cols-3 gap-2">
                {detailOptions.map((level) => (
                  <button
                    key={level}
                    onClick={() => setDetailLevel(level)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                      detailLevel === level
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-foreground block">Auto-cite Sources</label>
                <p className="text-xs text-muted-foreground">Include document references in AI responses</p>
              </div>
              <button
                onClick={() => setAutoCite(!autoCite)}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-all duration-200",
                  autoCite ? "bg-primary" : "bg-muted/50"
                )}
                aria-label={autoCite ? "Disable auto-cite" : "Enable auto-cite"}
              >
                <div
                  className={cn(
                    "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200",
                    autoCite ? "right-0.5" : "left-0.5"
                  )}
                />
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-destructive/15 border border-destructive/30 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-xs text-destructive" role="alert">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mt-4 p-3 rounded-lg bg-primary/15 border border-primary/30 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <p className="text-xs text-primary" role="status">{successMessage}</p>
            </div>
          )}

          <div className="flex gap-2 mt-6 pt-4 border-t border-border/30">
            <button
              onClick={handleApply}
              disabled={!hasChanges}
              className={cn(
                "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                hasChanges
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted/30 text-muted-foreground cursor-not-allowed"
              )}
            >
              Apply Settings
            </button>
            <button
              onClick={handleReset}
              disabled={!hasChanges}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                hasChanges
                  ? "bg-muted/50 text-foreground hover:bg-muted/70"
                  : "bg-muted/30 text-muted-foreground cursor-not-allowed"
              )}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="glass-card p-5 rounded-lg">
          <h3 className="font-medium text-foreground mb-3">Current Configuration</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Confidence Threshold:</span>
              <span className="font-mono text-foreground">{settings.confidenceThreshold}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Detail Level:</span>
              <span className="font-mono text-foreground">{settings.detailLevel}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Auto-cite Sources:</span>
              <span className="font-mono text-foreground">{settings.autoCite ? "Enabled" : "Disabled"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
