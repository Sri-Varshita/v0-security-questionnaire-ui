"use client"

import { useState, useCallback } from "react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Hero } from "@/components/hero"
import { UploadSection } from "@/components/upload-section"
import { ProcessingTerminal } from "@/components/processing-terminal"
import { ResultsDashboard } from "@/components/results-dashboard"
import { SettingsPanel } from "@/components/settings-panel"

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

  const handleProcess = () => {
    setIsProcessing(true)
    setShowResults(false)
  }

  const handleProcessComplete = useCallback(() => {
    setIsProcessing(false)
    setShowResults(true)
    setActiveSection("results")
  }, [])

  return (
    <div className="min-h-screen bg-background matrix-bg scanlines relative">
      <Navbar />
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="pl-64 pt-16">
        <Hero />
        <div className="p-8 max-w-5xl mx-auto">
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
            <div className="animate-in fade-in duration-500">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-2">Results Dashboard</h2>
                <p className="text-sm text-muted-foreground">
                  AI-generated responses for your security questionnaire
                </p>
              </div>
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

      {/* Subtle ambient glow effects */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/[0.025] rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-64 w-64 h-64 bg-primary/[0.015] rounded-full blur-3xl pointer-events-none" />
    </div>
  )
}
