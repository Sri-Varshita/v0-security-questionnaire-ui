"use client"

import { useState, useCallback, useRef } from "react"
import { Upload, FileText, FileSpreadsheet, X, File, CheckCircle2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadedFile {
  id: string
  name: string
  type: "pdf" | "excel" | "doc"
  category: "questionnaire" | "company"
  size?: string
  isNew?: boolean
}

interface UploadSectionProps {
  uploadedFiles: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
}

export function UploadSection({ uploadedFiles, onFilesChange }: UploadSectionProps) {
  const [isDraggingQuestionnaire, setIsDraggingQuestionnaire] = useState(false)
  const [isDraggingCompany, setIsDraggingCompany] = useState(false)
  const questionnaireInputRef = useRef<HTMLInputElement>(null)
  const companyInputRef = useRef<HTMLInputElement>(null)

  const getFileType = (fileName: string): "pdf" | "excel" | "doc" => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (ext === 'pdf') return 'pdf'
    if (['xlsx', 'xls', 'csv'].includes(ext || '')) return 'excel'
    return 'doc'
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleFiles = useCallback((files: FileList | null, category: "questionnaire" | "company") => {
    if (!files) return
    
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: getFileType(file.name),
      category,
      size: formatFileSize(file.size),
      isNew: true
    }))
    
    onFilesChange([...uploadedFiles, ...newFiles])
    
    // Remove "isNew" flag after animation
    setTimeout(() => {
      onFilesChange(prev => prev.map(f => ({ ...f, isNew: false })))
    }, 500)
  }, [uploadedFiles, onFilesChange])

  const handleDrop = useCallback((e: React.DragEvent, category: "questionnaire" | "company") => {
    e.preventDefault()
    if (category === "questionnaire") {
      setIsDraggingQuestionnaire(false)
    } else {
      setIsDraggingCompany(false)
    }
    handleFiles(e.dataTransfer.files, category)
  }, [handleFiles])

  const removeFile = (id: string) => {
    onFilesChange(uploadedFiles.filter(f => f.id !== id))
  }

  const getFileIcon = (type: UploadedFile["type"]) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5" />
      case "excel":
        return <FileSpreadsheet className="h-5 w-5" />
      default:
        return <File className="h-5 w-5" />
    }
  }

  const getFileColor = (type: UploadedFile["type"]) => {
    switch (type) {
      case "pdf":
        return "text-red-400"
      case "excel":
        return "text-emerald-400"
      default:
        return "text-blue-400"
    }
  }

  const questionnaireFiles = uploadedFiles.filter(f => f.category === "questionnaire")
  const companyFiles = uploadedFiles.filter(f => f.category === "company")

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Upload Documents
        </h2>
        <p className="text-sm text-muted-foreground">
          Upload your security questionnaire and company documents for AI-powered analysis
        </p>
      </div>

      {/* Questionnaire Upload */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          Security Questionnaire
          <span className="text-xs text-muted-foreground font-normal ml-1">(Required)</span>
        </label>
        
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDraggingQuestionnaire(true) }}
          onDragLeave={(e) => { e.preventDefault(); setIsDraggingQuestionnaire(false) }}
          onDrop={(e) => handleDrop(e, "questionnaire")}
          onClick={() => questionnaireInputRef.current?.click()}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-10 transition-all duration-300 cursor-pointer group",
            "hover:border-primary/60 hover:bg-primary/[0.03]",
            isDraggingQuestionnaire
              ? "border-primary bg-primary/[0.08] glow-green-subtle scale-[1.01]"
              : "border-border/40 bg-muted/10"
          )}
        >
          <input
            ref={questionnaireInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.xlsx,.xls,.csv,.doc,.docx"
            multiple
            onChange={(e) => handleFiles(e.target.files, "questionnaire")}
          />
          
          <div className="flex flex-col items-center gap-4 text-center">
            <div className={cn(
              "p-5 rounded-2xl transition-all duration-300 relative",
              isDraggingQuestionnaire 
                ? "bg-primary/20 scale-110" 
                : "bg-muted/30 group-hover:bg-primary/10 group-hover:scale-105"
            )}>
              <Upload className={cn(
                "h-10 w-10 transition-all duration-300",
                isDraggingQuestionnaire 
                  ? "text-primary" 
                  : "text-muted-foreground group-hover:text-primary"
              )} />
              {isDraggingQuestionnaire && (
                <div className="absolute inset-0 rounded-2xl animate-ping bg-primary/20" />
              )}
            </div>
            <div className="space-y-1.5">
              <p className={cn(
                "text-base font-medium transition-colors",
                isDraggingQuestionnaire ? "text-primary" : "text-foreground"
              )}>
                {isDraggingQuestionnaire ? "Release to upload" : "Drop your questionnaire here"}
              </p>
              <p className="text-sm text-muted-foreground">
                or <span className="text-primary hover:underline">browse files</span>
              </p>
              <p className="text-xs text-muted-foreground/70 mt-2">
                PDF, Excel, Word documents supported
              </p>
            </div>
          </div>
          
          {isDraggingQuestionnaire && (
            <div className="absolute inset-0 rounded-xl border-2 border-primary animate-pulse pointer-events-none" />
          )}
        </div>
        
        {/* Questionnaire File Cards */}
        {questionnaireFiles.length > 0 && (
          <div className="grid gap-3">
            {questionnaireFiles.map((file, index) => (
              <div
                key={file.id}
                className={cn(
                  "group flex items-center gap-4 p-4 rounded-xl bg-card/80 border border-border/50",
                  "hover:border-primary/30 hover:bg-card transition-all duration-300",
                  "hover:shadow-[0_0_20px_rgba(34,197,94,0.08)]",
                  file.isNew && "animate-in fade-in-0 zoom-in-95 duration-300"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={cn(
                  "p-3 rounded-lg bg-muted/50 transition-colors",
                  "group-hover:bg-primary/10",
                  getFileColor(file.type)
                )}>
                  {getFileIcon(file.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate font-mono">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {file.size && (
                      <span className="text-xs text-muted-foreground">{file.size}</span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-primary">
                      <CheckCircle2 className="h-3 w-3" />
                      Ready
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(file.id) }}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    "text-muted-foreground hover:text-destructive",
                    "hover:bg-destructive/10 opacity-0 group-hover:opacity-100"
                  )}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Company Documents Upload */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-secondary" />
          Company Documents
          <span className="text-xs text-muted-foreground font-normal ml-1">(Knowledge Base)</span>
        </label>
        
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDraggingCompany(true) }}
          onDragLeave={(e) => { e.preventDefault(); setIsDraggingCompany(false) }}
          onDrop={(e) => handleDrop(e, "company")}
          onClick={() => companyInputRef.current?.click()}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer group",
            "hover:border-secondary/60 hover:bg-secondary/[0.03]",
            isDraggingCompany
              ? "border-secondary bg-secondary/[0.08] scale-[1.01]"
              : "border-border/40 bg-muted/10"
          )}
        >
          <input
            ref={companyInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.xlsx,.xls,.csv,.doc,.docx,.txt"
            multiple
            onChange={(e) => handleFiles(e.target.files, "company")}
          />
          
          <div className="flex items-center gap-5">
            <div className={cn(
              "p-4 rounded-xl transition-all duration-300",
              isDraggingCompany 
                ? "bg-secondary/20 scale-105" 
                : "bg-muted/30 group-hover:bg-secondary/10"
            )}>
              <Upload className={cn(
                "h-7 w-7 transition-colors",
                isDraggingCompany 
                  ? "text-secondary" 
                  : "text-muted-foreground group-hover:text-secondary"
              )} />
            </div>
            <div className="flex-1">
              <p className={cn(
                "text-sm font-medium transition-colors",
                isDraggingCompany ? "text-secondary" : "text-foreground"
              )}>
                Security policies, SOC2 reports, compliance documentation
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                These documents help the AI provide accurate, context-aware answers
              </p>
            </div>
          </div>
        </div>
        
        {/* Company File Cards */}
        {companyFiles.length > 0 && (
          <div className="grid gap-3">
            {companyFiles.map((file, index) => (
              <div
                key={file.id}
                className={cn(
                  "group flex items-center gap-4 p-4 rounded-xl bg-card/80 border border-border/50",
                  "hover:border-secondary/30 hover:bg-card transition-all duration-300",
                  "hover:shadow-[0_0_20px_rgba(6,95,70,0.1)]",
                  file.isNew && "animate-in fade-in-0 zoom-in-95 duration-300"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={cn(
                  "p-3 rounded-lg bg-muted/50 transition-colors",
                  "group-hover:bg-secondary/10",
                  getFileColor(file.type)
                )}>
                  {getFileIcon(file.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate font-mono">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {file.size && (
                      <span className="text-xs text-muted-foreground">{file.size}</span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-secondary">
                      <CheckCircle2 className="h-3 w-3" />
                      Indexed
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(file.id) }}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    "text-muted-foreground hover:text-destructive",
                    "hover:bg-destructive/10 opacity-0 group-hover:opacity-100"
                  )}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
