"use client"

import { useState, useCallback } from "react"
import { Upload, FileText, FileSpreadsheet, X, File } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadedFile {
  id: string
  name: string
  type: "pdf" | "excel" | "doc"
  category: "questionnaire" | "company"
}

interface UploadSectionProps {
  uploadedFiles: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
}

export function UploadSection({ uploadedFiles, onFilesChange }: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false)
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // Simulate file upload
    const newFile: UploadedFile = {
      id: Date.now().toString(),
      name: "uploaded-file.pdf",
      type: "pdf",
      category: "questionnaire"
    }
    onFilesChange([...uploadedFiles, newFile])
  }, [uploadedFiles, onFilesChange])
  
  const removeFile = (id: string) => {
    onFilesChange(uploadedFiles.filter(f => f.id !== id))
  }

  const getFileIcon = (type: UploadedFile["type"]) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4" />
      case "excel":
        return <FileSpreadsheet className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  const questionnaireFiles = uploadedFiles.filter(f => f.category === "questionnaire")
  const companyFiles = uploadedFiles.filter(f => f.category === "company")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Upload Documents</h2>
        <p className="text-sm text-muted-foreground">
          Upload your security questionnaire and company documents for AI-powered analysis
        </p>
      </div>

      {/* Questionnaire Upload */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          Security Questionnaire
        </label>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 transition-all duration-300 cursor-pointer",
            "hover:border-primary/50 hover:bg-primary/5",
            isDragging
              ? "border-primary bg-primary/10 glow-green"
              : "border-border/50 bg-muted/20"
          )}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div className={cn(
              "p-4 rounded-full transition-all duration-300",
              isDragging ? "bg-primary/20" : "bg-muted/50"
            )}>
              <Upload className={cn(
                "h-8 w-8 transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Drop your questionnaire here
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, Excel (.xlsx, .xls) supported
              </p>
            </div>
          </div>
          
          {isDragging && (
            <div className="absolute inset-0 rounded-lg animate-border-glow border-2 border-primary pointer-events-none" />
          )}
        </div>
        
        {questionnaireFiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {questionnaireFiles.map(file => (
              <div
                key={file.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-sm"
              >
                {getFileIcon(file.type)}
                <span className="text-foreground font-mono text-xs">{file.name}</span>
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Company Documents Upload */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-primary" />
          Company Documents
        </label>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            const newFile: UploadedFile = {
              id: Date.now().toString(),
              name: "company-doc.pdf",
              type: "pdf",
              category: "company"
            }
            onFilesChange([...uploadedFiles, newFile])
          }}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 transition-all duration-300 cursor-pointer",
            "hover:border-primary/50 hover:bg-primary/5",
            "border-border/50 bg-muted/20"
          )}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Security policies, SOC2 reports, compliance docs
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                These help the AI provide accurate answers
              </p>
            </div>
          </div>
        </div>
        
        {companyFiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {companyFiles.map(file => (
              <div
                key={file.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/20 border border-secondary/30 text-sm"
              >
                {getFileIcon(file.type)}
                <span className="text-foreground font-mono text-xs">{file.name}</span>
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
