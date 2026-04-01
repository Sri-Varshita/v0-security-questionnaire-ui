"use client"

import { Upload, Cpu, FileCheck, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepProgressProps {
  currentStep: "upload" | "processing" | "results"
}

const steps = [
  { id: "upload", label: "Upload", icon: Upload },
  { id: "processing", label: "Processing", icon: Cpu },
  { id: "results", label: "Results", icon: FileCheck },
]

export function StepProgress({ currentStep }: StepProgressProps) {
  const getCurrentStepIndex = () => {
    return steps.findIndex(s => s.id === currentStep)
  }

  const currentIndex = getCurrentStepIndex()

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <div className="relative flex items-center justify-between">
        {/* Connecting Line Background */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border/50" />
        
        {/* Progress Line */}
        <div 
          className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-700 ease-out"
          style={{ 
            width: currentIndex === 0 ? "0%" : currentIndex === 1 ? "50%" : "100%"
          }}
        />

        {steps.map((step, index) => {
          const Icon = step.icon
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isPending = index > currentIndex

          return (
            <div 
              key={step.id}
              className="relative flex flex-col items-center z-10"
            >
              {/* Step Circle */}
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500",
                  "backdrop-blur-sm",
                  isCompleted && "bg-primary border-primary",
                  isCurrent && "bg-primary/20 border-primary glow-green-subtle",
                  isPending && "bg-card border-border/50"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-primary-foreground animate-in zoom-in duration-300" />
                ) : (
                  <Icon 
                    className={cn(
                      "h-5 w-5 transition-colors duration-300",
                      isCurrent && "text-primary",
                      isPending && "text-muted-foreground"
                    )}
                  />
                )}
                
                {/* Pulse ring for current step */}
                {isCurrent && (
                  <span className="absolute inset-0 rounded-full animate-ping bg-primary/30" style={{ animationDuration: "2s" }} />
                )}
              </div>

              {/* Step Label */}
              <span
                className={cn(
                  "mt-2.5 text-xs font-medium transition-colors duration-300",
                  isCompleted && "text-primary",
                  isCurrent && "text-primary font-semibold",
                  isPending && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
