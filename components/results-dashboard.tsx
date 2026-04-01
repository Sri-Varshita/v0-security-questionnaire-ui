"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, AlertCircle, FileText, TrendingUp, ShieldCheck, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

// Animated Confidence Bar Component
function ConfidenceBar({ confidence, delay = 0 }: { confidence: number; delay?: number }) {
  const [animatedValue, setAnimatedValue] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(confidence)
    }, delay + 100)
    return () => clearTimeout(timer)
  }, [confidence, delay])

  const getBarColor = (value: number) => {
    if (value >= 80) return "bg-primary"
    if (value >= 60) return "bg-chart-4"
    return "bg-destructive"
  }

  const getTextColor = (value: number) => {
    if (value >= 80) return "text-primary"
    if (value >= 60) return "text-chart-4"
    return "text-destructive"
  }

  const getGlowColor = (value: number) => {
    if (value >= 80) return "shadow-primary/30"
    if (value >= 60) return "shadow-chart-4/30"
    return "shadow-destructive/30"
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-muted/40 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out shadow-sm",
            getBarColor(confidence),
            getGlowColor(confidence)
          )}
          style={{ width: `${animatedValue}%` }}
        />
      </div>
      <span className={cn(
        "text-sm font-mono font-bold min-w-[3rem] text-right tabular-nums",
        getTextColor(confidence)
      )}>
        {animatedValue}%
      </span>
    </div>
  )
}

interface QuestionResult {
  id: string
  question: string
  answer: string
  confidence: number
  source: string
  status: "auto-answered" | "needs-review"
}

const dummyResults: QuestionResult[] = [
  {
    id: "1",
    question: "Does your organization have a documented information security policy?",
    answer: "Yes, our organization maintains a comprehensive Information Security Policy that is reviewed annually by the CISO and executive leadership. The policy covers data classification, access controls, incident response, and employee responsibilities.",
    confidence: 95,
    source: "Information Security Policy v3.2",
    status: "auto-answered"
  },
  {
    id: "2",
    question: "Do you perform regular vulnerability assessments and penetration testing?",
    answer: "We conduct quarterly vulnerability assessments using automated scanning tools and annual third-party penetration tests. Critical findings are remediated within 30 days, high severity within 60 days.",
    confidence: 92,
    source: "Security Operations Handbook",
    status: "auto-answered"
  },
  {
    id: "3",
    question: "How do you ensure data encryption at rest and in transit?",
    answer: "All data at rest is encrypted using AES-256 encryption. Data in transit is protected using TLS 1.3. Database-level encryption is implemented across all production systems.",
    confidence: 88,
    source: "Data Protection Standard",
    status: "auto-answered"
  },
  {
    id: "4",
    question: "What is your incident response process?",
    answer: "Our incident response follows a 6-phase approach: Preparation, Identification, Containment, Eradication, Recovery, and Lessons Learned. We maintain a 24/7 SOC team with defined escalation procedures.",
    confidence: 91,
    source: "Incident Response Plan",
    status: "auto-answered"
  },
  {
    id: "5",
    question: "Do you have SOC 2 Type II certification?",
    answer: "Yes, we maintain SOC 2 Type II certification. Our most recent audit was completed in Q4 2024 with no exceptions noted. The report is available upon request under NDA.",
    confidence: 98,
    source: "SOC 2 Type II Report 2024",
    status: "auto-answered"
  },
  {
    id: "6",
    question: "How do you handle third-party vendor security assessments?",
    answer: "All vendors undergo security assessment before onboarding. Critical vendors are reviewed annually. We use standardized security questionnaires and require SOC 2 or equivalent certifications.",
    confidence: 85,
    source: "Vendor Management Policy",
    status: "auto-answered"
  },
  {
    id: "7",
    question: "What physical security controls are in place at your data centers?",
    answer: "Our data centers (AWS) feature 24/7 security personnel, biometric access controls, CCTV surveillance, and mantrap entry systems. All facilities are SOC 2 and ISO 27001 certified.",
    confidence: 72,
    source: "Infrastructure Documentation",
    status: "needs-review"
  },
  {
    id: "8",
    question: "Do you have a business continuity and disaster recovery plan?",
    answer: "We maintain comprehensive BCP/DR plans with RPO of 4 hours and RTO of 8 hours. Plans are tested quarterly through tabletop exercises and annually through full failover tests.",
    confidence: 89,
    source: "Business Continuity Plan",
    status: "auto-answered"
  },
  {
    id: "9",
    question: "How do you manage employee access and authentication?",
    answer: "We implement role-based access control (RBAC) with the principle of least privilege. All employees use SSO with MFA. Access reviews are conducted quarterly.",
    confidence: 94,
    source: "Access Control Policy",
    status: "auto-answered"
  },
  {
    id: "10",
    question: "What security training do employees receive?",
    answer: "All employees complete mandatory security awareness training upon hiring and annually thereafter. This includes phishing simulations, data handling procedures, and incident reporting.",
    confidence: 58,
    source: "HR Training Records",
    status: "needs-review"
  }
]

interface ResultsDashboardProps {
  showResults: boolean
}

export function ResultsDashboard({ showResults }: ResultsDashboardProps) {
  const [filter, setFilter] = useState<"all" | "auto-answered" | "needs-review">("all")

  if (!showResults) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-6 rounded-full bg-muted/30 mb-4">
          <FileText className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Results Yet</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Upload your security questionnaire and company documents, then click &quot;Auto-Fill Questionnaire&quot; to generate AI-powered responses.
        </p>
      </div>
    )
  }

  const filteredResults = dummyResults.filter(r => 
    filter === "all" ? true : r.status === filter
  )

  const stats = {
    total: dummyResults.length,
    autoAnswered: dummyResults.filter(r => r.status === "auto-answered").length,
    needsReview: dummyResults.filter(r => r.status === "needs-review").length,
    avgConfidence: Math.round(dummyResults.reduce((acc, r) => acc + r.confidence, 0) / dummyResults.length)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-primary"
    if (confidence >= 60) return "text-chart-4"
    return "text-destructive"
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <FileText className="h-4 w-4" />
            <span className="text-xs font-mono">Total Questions</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-2 text-primary mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-xs font-mono">Auto-Answered</span>
          </div>
          <p className="text-2xl font-bold text-primary">{stats.autoAnswered}</p>
        </div>
        
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-2 text-chart-4 mb-1">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-mono">Needs Review</span>
          </div>
          <p className="text-2xl font-bold text-chart-4">{stats.needsReview}</p>
        </div>
        
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-mono">Avg Confidence</span>
          </div>
          <p className={cn("text-2xl font-bold", getConfidenceColor(stats.avgConfidence))}>
            {stats.avgConfidence}%
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { id: "all", label: "All Questions", count: stats.total },
          { id: "auto-answered", label: "Auto-Answered", count: stats.autoAnswered },
          { id: "needs-review", label: "Needs Review", count: stats.needsReview },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as typeof filter)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              filter === tab.id
                ? "bg-primary/15 text-primary border border-primary/30"
                : "bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent"
            )}
          >
            {tab.label}
            <span className="ml-2 text-xs opacity-70">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Results Cards - Stacked Vertically */}
      <div className="flex flex-col gap-4">
        {filteredResults.map((result, index) => (
          <div
            key={result.id}
            className={cn(
              "group relative rounded-2xl overflow-hidden transition-all duration-300",
              "bg-card/40 backdrop-blur-xl border border-border/40",
              "shadow-lg shadow-black/5",
              "hover:shadow-xl hover:shadow-primary/5",
              "hover:border-primary/20",
              "hover:-translate-y-1",
              "animate-in fade-in zoom-in-95"
            )}
            style={{ animationDelay: `${index * 60}ms`, animationFillMode: "backwards" }}
          >
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative p-6">
              {/* Status Badge - Top Right */}
              <div className="absolute top-4 right-4">
                {result.status === "auto-answered" ? (
                  <div 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30"
                    style={{ boxShadow: "0 0 12px rgba(34, 197, 94, 0.15)" }}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-semibold text-primary">Auto-Answered</span>
                  </div>
                ) : (
                  <div 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/15 border border-destructive/30"
                    style={{ boxShadow: "0 0 12px rgba(239, 68, 68, 0.15)" }}
                  >
                    <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                    <span className="text-xs font-semibold text-destructive">Needs Review</span>
                  </div>
                )}
              </div>

              {/* Question */}
              <h3 className="text-base font-semibold text-foreground leading-relaxed mb-3 pr-32">
                {result.question}
              </h3>

              {/* Confidence Bar */}
              <div className="mb-4 p-3 rounded-lg bg-muted/20 border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Confidence Score</span>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    result.confidence >= 80 ? "bg-primary/15 text-primary" :
                    result.confidence >= 60 ? "bg-chart-4/15 text-chart-4" :
                    "bg-destructive/15 text-destructive"
                  )}>
                    {result.confidence >= 80 ? "High" : result.confidence >= 60 ? "Medium" : "Low"}
                  </span>
                </div>
                <ConfidenceBar confidence={result.confidence} delay={index * 60} />
              </div>

              {/* Answer */}
              <div className="mb-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.answer}
                </p>
              </div>

              {/* Source Document Chip */}
              <div className="flex items-center gap-2 pt-4 border-t border-border/30">
                <span className="text-xs text-muted-foreground">Source:</span>
                <button 
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
        ))}
      </div>
    </div>
  )
}
