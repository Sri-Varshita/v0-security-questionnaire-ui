"use client"

import { useState, useCallback } from "react"
import { Upload, FileText, FileSpreadsheet, X, File, CheckCircle2, Folder } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadedFile {
  id: string
  name: string
  size: string
  type: "pdf" | "excel" | "doc"
  category: "questionnaire" | "company"
  isNew?: boolean
}

interface UploadSectionProps {
  uploadedFiles: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export function UploadSection({ uploadedFiles, onFilesChange }: UploadSectionProps) {
  const [isDraggingQuestionnaire, setIsDraggingQuestionnaire] = useState(false)
  const [isDraggingCompany, setIsDraggingCompany] = useState(false)
  
  const handleDragOver = useCallback((e: React.DragEvent, zone: 'questionnaire' | 'company') => {
    e.preventDefault()
    if (zone === 'questionnaire') {
      setIsDraggingQuestionnaire(true)
    } else {
      setIsDraggingCompany(true)
    }
  }, [])
  
  const handleDragLeave = useCallback((e: React.DragEvent, zone: 'questionnaire' | 'company') => {
    e.preventDefault()
    if (zone === 'questionnaire') {
      setIsDraggingQuestionnaire(false)
    } else {
      setIsDraggingCompany(false)
    }
  }, [])
  
  const handleDrop = useCallback((e: React.DragEvent, category: 'questionnaire' | 'company') => {
    e.preventDefault()
    setIsDraggingQuestionnaire(false)
    setIsDraggingCompany(false)
    
    const files = Array.from(e.dataTransfer.files)
    const newFiles: UploadedFile[] = files.map((file, index) => {
      const ext = file.name.split('.').pop()?.toLowerCase()
      let type: UploadedFile["type"] = "doc"
      if (ext === 'pdf') type = "pdf"
      else if (['xlsx', 'xls', 'csv'].includes(ext || '')) type = "excel"
      
      return {
        id: `${Date.now()}-${index}`,
        name: file.name,
        size: formatFileSize(file.size),
        type,
        category,
        isNew: true
      }
    })
    
    onFilesChange([...uploadedFiles, ...newFiles])
    
    // Remove "new" flag after animation
    setTimeout(() => {
      onFilesChange(prev => prev.map(f => ({ ...f, isNew: false })))
    }, 600)
  }, [uploadedFiles, onFilesChange])
  
  const removeFile = (id: string) => {
    onFilesChange(uploadedFiles.filter(f => f.id !== id))
  }

  const getFileIcon = (type: UploadedFile["type"]) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-400" />
      case "excel":
        return <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
      default:
        return <File className="h-5 w-5 text-blue-400" />
    }
  }

  const questionnaireFiles = uploadedFiles.filter(f => f.category === "questionnaire")
  const companyFiles = uploadedFiles.filter(f => f.category === "company")

  const FileCard = ({ file }: { file: UploadedFile }) => (
    <div
      className={cn(
        "group relative flex items-center gap-3 p-3 rounded-lg transition-all duration-300",
        "bg-card/80 border border-border/50 hover:border-primary/30",
        "hover:bg-card hover:shadow-[0_0_15px_rgba(34,197,94,0.08)]",
        file.isNew && "animate-in fade-in zoom-in-95 duration-300"
      )}
    >
      <div className="flex-shrink-0 p-2 rounded-md bg-muted/50">
        {getFileIcon(file.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate font-mono">
          {file.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">{file.size}</span>
          <span className="flex items-center gap-1 text-xs text-primary">
            <CheckCircle2 className="h-3 w-3" />
            Ready
          </span>
        </div>
      </div>
      <button
        onClick={() => removeFile(file.id)}
        className={cn(
          "absolute -top-2 -right-2 p-1 rounded-full transition-all duration-200",
          "bg-destructive/90 text-destructive-foreground",
          "opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100",
          "hover:bg-destructive shadow-lg"
        )}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Upload Documents</h2>
        <p className="text-sm text-muted-foreground">
          Upload your security questionnaire and company documents for AI-powered analysis
        </p>
      </div>

      {/* Questionnaire Upload */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          Security Questionnaire
        </label>
        <div
          onDragOver={(e) => handleDragOver(e, 'questionnaire')}
          onDragLeave={(e) => handleDragLeave(e, 'questionnaire')}
          onDrop={(e) => handleDrop(e, 'questionnaire')}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer",
            "hover:border-primary/50",
            isDraggingQuestionnaire
              ? "border-primary bg-primary/[0.08] shadow-[0_0_30px_rgba(34,197,94,0.12)]"
              : "border-border/60 bg-muted/10 hover:bg-muted/20"
          )}
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <div className={cn(
              "p-4 rounded-2xl transition-all duration-300",
              isDraggingQuestionnaire 
                ? "bg-primary/20 scale-110" 
                : "bg-muted/50 group-hover:bg-muted"
            )}>
              <Upload className={cn(
                "h-8 w-8 transition-all duration-300",
                isDraggingQuestionnaire ? "text-primary scale-110" : "text-muted-foreground"
              )} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {isDraggingQuestionnaire ? "Drop to upload" : "Drag & drop your questionnaire"}
              </p>
              <p className="text-xs text-muted-foreground">
                or click to browse - PDF, Excel (.xlsx, .xls) supported
              </p>
            </div>
          </div>
          
          {isDraggingQuestionnaire && (
            <div className="absolute inset-0 rounded-xl border-2 border-primary pointer-events-none animate-pulse" />
          )}
        </div>
        
        {questionnaireFiles.length > 0 && (
          <div className="grid gap-2">
            {questionnaireFiles.map(file => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>
        )}
      </div>

      {/* Company Documents Upload */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Folder className="h-4 w-4 text-primary" />
          Company Documents
          <span className="text-xs text-muted-foreground font-normal">(Knowledge Base)</span>
        </label>
        <div
          onDragOver={(e) => handleDragOver(e, 'company')}
          onDragLeave={(e) => handleDragLeave(e, 'company')}
          onDrop={(e) => handleDrop(e, 'company')}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 cursor-pointer",
            "hover:border-primary/50",
            isDraggingCompany
              ? "border-primary bg-primary/[0.08] shadow-[0_0_30px_rgba(34,197,94,0.12)]"
              : "border-border/60 bg-muted/10 hover:bg-muted/20"
          )}
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-xl transition-all duration-300",
              isDraggingCompany ? "bg-primary/20 scale-105" : "bg-muted/50"
            )}>
              <Upload className={cn(
                "h-6 w-6 transition-colors duration-300",
                isDraggingCompany ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {isDraggingCompany ? "Drop files here" : "Security policies, SOC2 reports, compliance docs"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                These documents help the AI provide accurate, context-aware answers
              </p>
            </div>
          </div>
          
          {isDraggingCompany && (
            <div className="absolute inset-0 rounded-xl border-2 border-primary pointer-events-none animate-pulse" />
          )}
        </div>
        
        {companyFiles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {companyFiles.map(file => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
