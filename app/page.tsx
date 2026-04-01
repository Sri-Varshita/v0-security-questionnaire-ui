"use client"

import { useState, useCallback } from "react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Hero } from "@/components/hero"
import { UploadSection } from "@/components/upload-section"
import { ProcessingTerminal } from "@/components/processing-terminal"
import { ResultsDashboard } from "@/components/results-dashboard"
import { SettingsPanel } from "@/components/settings-panel"
import { StepProgress } from "@/components/step-progress"
import { AIInsightsPanel } from "@/components/ai-insights-panel"
import { cn } from "@/lib/utils"

interface UploadedFile {
  id: string
  name: string
  type: "pdf" | "excel" | "doc"
  category: "questionnaire" | "company"
}

// Pre-loaded sample files
const initialFiles: UploadedFile[] = [
  { id: "1", name: "Security_Questionnaire_2024.pdf", type: "pdf", category: "questionnaire" },
  { id: "2", name: "SOC2_Type_II_Report.pdf", type: "pdf", category: "company" },
  { id: "3", name: "Information_Security_Policy.pdf", type: "pdf", category: "company" },
  { id: "4", name: "Vendor_Risk_Assessment.xlsx", type: "excel", category: "company" },
]

export default function SecurityQuestionnaireAgent() {
  const [activeSection, setActiveSection] = useState("upload")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(initialFiles)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [currentStep, setCurrentStep] = useState<"upload" | "processing" | "results">("upload")

  const handleProcess = () => {
    setIsProcessing(true)
    setShowResults(false)
    setCurrentStep("processing")
  }

  const handleProcessComplete = useCallback(() => {
    setIsProcessing(false)
    setShowResults(true)
    setActiveSection("results")
    setCurrentStep("results")
  }, [])

  return (
    <div className="min-h-screen bg-background matrix-bg scanlines relative">
      <Navbar />
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="pl-64 pt-16">
        <Hero />
        
        {/* Step Progress Indicator */}
        <div className="border-b border-border/30 bg-card/20 backdrop-blur-sm">
          <StepProgress currentStep={currentStep} />
        </div>

        <div className="p-8 max-w-5xl mx-auto relative">
          {activeSection === "upload" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <UploadSection
                uploadedFiles={uploadedFiles}
                onFilesChange={setUploadedFiles}
              />
              
              <div className="border-t border-border/30 pt-8">
                <ProcessingTerminal
                  isProcessing={isProcessing}
                  onProcess={handleProcess}
                  onComplete={handleProcessComplete}
                />
              </div>
            </div>
          )}
          
          {activeSection === "results" && (
            <div className="animate-in fade-in duration-500 space-y-6">
              <div className="mb-2">
                <h2 className="text-xl font-semibold text-foreground mb-2">Results Dashboard</h2>
                <p className="text-sm text-muted-foreground">
                  AI-generated responses for your security questionnaire
                </p>
              </div>
              
              {/* AI Insights Panel */}
              {showResults && (
                <AIInsightsPanel 
                  totalQuestions={10}
                  autoAnswered={8}
                  needsReview={2}
                />
              )}
              
              <ResultsDashboard showResults={showResults} />
            </div>
          )}
          
          {activeSection === "settings" && (
            <div className="animate-in fade-in duration-500">
              <SettingsPanel />
            </div>
          )}
        </div>
      </main>

      {/* Processing Overlay - Dimmed Background */}
      {isProcessing && (
        <div 
          className={cn(
            "fixed inset-0 z-30 bg-background/60 backdrop-blur-sm",
            "pointer-events-none",
            "animate-in fade-in duration-300"
          )}
          style={{ left: "256px", top: "64px" }}
        />
      )}

      {/* Subtle ambient glow effects */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/[0.025] rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-64 w-64 h-64 bg-primary/[0.015] rounded-full blur-3xl pointer-events-none" />

      {/* AWS Attribution Footer */}
      <footer className="fixed bottom-0 right-0 p-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 backdrop-blur-sm border border-border/30">
          <span className="text-xs text-muted-foreground">Powered by</span>
          <span className="text-xs font-semibold text-primary">AWS Bedrock</span>
          <span className="text-xs text-muted-foreground">+</span>
          <span className="text-xs font-semibold text-primary">Textract</span>
        </div>
      </footer>
    </div>
  )
}
