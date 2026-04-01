"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Hero } from "@/components/hero"
import { UploadSection } from "@/components/upload-section"
import { ProcessingTerminal } from "@/components/processing-terminal"
import { ResultsDashboard } from "@/components/results-dashboard"
import { SettingsPanel } from "@/components/settings-panel"
import { StepProgress } from "@/components/step-progress"
import { AIInsightsPanel } from "@/components/ai-insights-panel"
import { MatrixBackground } from "@/components/matrix-background"
import { cn } from "@/lib/utils"

// Type definitions
interface QuestionResult {
  id: string
  question: string
  answer: string
  confidence: number
  source: string
  status: "auto-answered" | "needs-review"
}

type DetailLevel = "low" | "medium" | "high"

interface AppSettings {
  confidenceThreshold: number
  detailLevel: DetailLevel
  autoCite: boolean
}

// Mock questions for generating results
const mockQuestions = [
  "Does your organization have a documented information security policy?",
  "Do you perform regular vulnerability assessments and penetration testing?",
  "How frequently are access reviews and user audits conducted?",
  "What is your incident response time for critical security events?",
  "Are all data transfers encrypted using industry-standard protocols?",
  "Do you maintain a comprehensive disaster recovery and business continuity plan?",
  "How are employee security training and awareness programs conducted?",
  "What mechanisms are in place for secure password management?",
  "How do you handle third-party/vendor risk assessments?",
  "Do you maintain audit logs for all critical system activities?"
]

const mockSources = [
  "Information Security Policy v3.2",
  "SOC2 Type II Report",
  "NIST Security Framework",
  "ISO 27001 Compliance Document",
  "Vendor Risk Assessment",
  "Incident Response Plan",
  "Data Classification Policy",
]

// Function to generate mock results
const generateMockResults = (): QuestionResult[] => {
  return mockQuestions.map((question, index) => {
    const confidence = Math.floor(Math.random() * 40 + 60) // 60-100
    return {
      id: `q-${index + 1}`,
      question,
      answer: `This question has been analyzed based on your uploaded security policies and compliance documents. Our AI system has processed the available security policies and generated a response based on industry best practices and your documented procedures. ${confidence > 80 ? "High confidence in this response based on available documentation." : "Additional review recommended for this answer."}`,
      confidence,
      source: mockSources[Math.floor(Math.random() * mockSources.length)],
      status: confidence > 80 ? "auto-answered" : "needs-review",
    }
  })
}

export default function SecurityQuestionnaireAgent() {
  const [activeSection, setActiveSection] = useState("upload")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [currentStep, setCurrentStep] = useState<"upload" | "processing" | "results">("upload")
  const uploadRef = useRef<HTMLElement | null>(null)

  // File management state
  const [questionnaireFile, setQuestionnaireFile] = useState<File | null>(null)
  const [documentFiles, setDocumentFiles] = useState<File[]>([])

  // Results state
  const [results, setResults] = useState<QuestionResult[]>([])

  // Settings state
  const [settings, setSettings] = useState<AppSettings>({
    confidenceThreshold: 80,
    detailLevel: "medium",
    autoCite: true,
  })

  // Load persisted settings and results from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return

    const storedSettings = localStorage.getItem("questionnaire-settings")
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings) as AppSettings
        setSettings((prev) => ({ ...prev, ...parsed }))
      } catch {
        // ignore malformed data
      }
    }

    const storedResults = localStorage.getItem("questionnaire-results")
    if (storedResults) {
      try {
        const parsed = JSON.parse(storedResults) as QuestionResult[]
        if (Array.isArray(parsed)) {
          setResults(parsed)
          setShowResults(parsed.length > 0)
          setCurrentStep(parsed.length > 0 ? "results" : "upload")
          if (parsed.length > 0) {
            setActiveSection("results")
          }
        }
      } catch {
        // ignore malformed data
      }
    }
  }, [])

  // Persist settings and results automatically
  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem("questionnaire-settings", JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem("questionnaire-results", JSON.stringify(results))
  }, [results])

  // Handle file upload
  const handleUploadChange = useCallback(
    (data: { questionnaireFile: File | null; documents: File[] }) => {
      setQuestionnaireFile(data.questionnaireFile)
      setDocumentFiles(data.documents)
      setCurrentStep("upload")
      setActiveSection("upload")
    },
    []
  )

  // Handle processing start
  const handleProcess = () => {
    setIsProcessing(true)
    setShowResults(false)
    setCurrentStep("processing")
  }

  // Handle processing complete - generate mock results
  const handleProcessComplete = useCallback(() => {
    setIsProcessing(false)
    // Generate mock results based on uploaded files
    const generatedResults = generateMockResults()
    setResults(generatedResults)
    setShowResults(true)
    setActiveSection("results")
    setCurrentStep("results")
  }, [])

  // Handle settings update
  const handleSettingsUpdate = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings)
  }, [])

  const handleSectionChange = useCallback(
    (section: "upload" | "processing" | "results") => {
      setActiveSection(section)
      setCurrentStep(section)
      if (section === "results") {
        setShowResults(results.length > 0)
      } else {
        setShowResults(false)
      }
      if (section === "upload") {
        uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    },
    [results]
  )

  const handleStartAnalysis = () => {
    setActiveSection("upload")
    setCurrentStep("upload")
    uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="min-h-screen bg-background relative">
      <MatrixBackground />
      <div className="relative z-10">
        <Navbar activeSection={activeSection} onSectionChange={handleSectionChange} />
        <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
        
        <main className="pl-64 pt-16">
          <Hero onStart={handleStartAnalysis} />
        
          {/* Step Progress Indicator */}
          <div className="border-b border-border/30 bg-card/20 backdrop-blur-sm">
            <StepProgress currentStep={currentStep} onStepChange={handleSectionChange} />
          </div>

          <div className="p-8 max-w-5xl mx-auto relative">
            {activeSection === "upload" && (
              <div ref={uploadRef} className="space-y-8 animate-in fade-in duration-500">
                <UploadSection onChange={handleUploadChange} />
                
                <div className="border-t border-border/30 pt-8">
                  <ProcessingTerminal
                    isProcessing={isProcessing}
                    onProcess={handleProcess}
                    onComplete={handleProcessComplete}
                    filesCount={documentFiles.length + (questionnaireFile ? 1 : 0)}
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
                {results.length > 0 && (
                  <AIInsightsPanel results={results} settings={settings} />
                )}
                
                <ResultsDashboard results={results} settings={settings} />
              </div>
            )}
            
            {activeSection === "settings" && (
              <div className="animate-in fade-in duration-500">
                <SettingsPanel settings={settings} onSettingsChange={handleSettingsUpdate} />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Processing Overlay - Dimmed Background */}
      {isProcessing && (
        <div 
          className={cn(
            "fixed inset-0 z-40 bg-background/60 backdrop-blur-sm",
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
      <footer className="fixed bottom-0 right-0 p-4 z-20">
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
