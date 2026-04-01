"use client"

import { useState, useCallback, useRef } from "react"
import {
  Upload,
  FileText,
  FileSpreadsheet,
  FileSignature,
  FileType,
  X,
  CheckCircle2,
  Folder,
  AlertCircle,
  Shield
} from "lucide-react"
import { cn } from "@/lib/utils"

// File type configurations
const QUESTIONNAIRE_EXTENSIONS = ["pdf", "xlsx", "xls"]
const DOCUMENTS_EXTENSIONS = ["pdf", "docx", "xlsx", "xls", "txt"]

type FileTypeKey = "pdf" | "excel" | "word" | "text" | "unknown"

interface UploadSectionProps {
  onChange?: (data: { questionnaireFile: File | null; documents: File[] }) => void
  className?: string
}

// Utility functions
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const getFileType = (fileName: string): FileTypeKey => {
  const extension = fileName.split('.').pop()?.toLowerCase() || ""
  if (extension === "pdf") return "pdf"
  if (["xlsx", "xls"].includes(extension)) return "excel"
  if (extension === "docx") return "word"
  if (extension === "txt") return "text"
  return "unknown"
}

const isValidFileType = (fileName: string, allowedExtensions: string[]): boolean => {
  const extension = fileName.split('.').pop()?.toLowerCase() || ""
  return allowedExtensions.includes(extension)
}

const getFileIcon = (type: FileTypeKey, className?: string) => {
  const iconClass = cn("h-5 w-5", className)

  switch (type) {
    case "pdf":
      return <FileText className={cn(iconClass, "text-red-400")} />
    case "excel":
      return <FileSpreadsheet className={cn(iconClass, "text-emerald-400")} />
    case "word":
      return <FileSignature className={cn(iconClass, "text-blue-400")} />
    case "text":
      return <FileText className={cn(iconClass, "text-slate-400")} />
    default:
      return <FileType className={cn(iconClass, "text-muted-foreground")} />
  }
}

// Reusable UploadZone Component
interface UploadZoneProps {
  title: string
  description: string
  isActive: boolean
  onClick: () => void
  onDrop: (event: React.DragEvent) => void
  onDragOver: (event: React.DragEvent) => void
  onDragLeave: (event: React.DragEvent) => void
  highlighted?: boolean
  className?: string
}

function UploadZone({
  title,
  description,
  isActive,
  onClick,
  onDrop,
  onDragOver,
  onDragLeave,
  highlighted = false,
  className
}: UploadZoneProps) {
  return (
    <div
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={cn(
        "relative rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all duration-300",
        "hover:scale-[1.02] hover:shadow-lg",
        highlighted
          ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(34,197,94,0.12)]"
          : isActive
          ? "border-primary bg-primary/10 scale-[1.02] shadow-lg"
          : "border-border/60 bg-card/20 hover:border-primary/50 hover:bg-card/30",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className={cn(
          "p-4 rounded-2xl transition-all duration-300",
          highlighted ? "bg-primary/20" : "bg-muted/40",
          isActive && "scale-110"
        )}>
          <Upload className={cn(
            "h-8 w-8 transition-all duration-300",
            highlighted ? "text-primary" : "text-muted-foreground",
            isActive && "scale-110"
          )} />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <p className="text-xs font-mono text-primary animate-pulse">
          Drag & Drop or Click to Upload
        </p>
      </div>

      {isActive && (
        <div className="absolute inset-0 border-2 border-primary/70 rounded-xl pointer-events-none animate-pulse" />
      )}
    </div>
  )
}

// File Card Component
interface FileCardProps {
  file: File
  onRemove: () => void
  badge?: string
  highlighted?: boolean
  className?: string
  style?: React.CSSProperties
}

function FileCard({ file, onRemove, badge, highlighted = false, className, style }: FileCardProps) {
  const fileType = getFileType(file.name)

  return (
    <div
      style={style}
      className={cn(
        "group relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300",
        "hover:scale-[1.02] hover:shadow-xl animate-in fade-in zoom-in-95",
        highlighted
          ? "border border-primary/40 bg-primary/10 shadow-lg shadow-primary/10"
          : "border border-border/50 bg-card/80 hover:shadow-lg",
        className
      )}
    >
      <div className="flex-shrink-0 p-3 rounded-xl bg-muted/50 group-hover:bg-muted transition-colors">
        {getFileIcon(fileType)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-semibold text-foreground truncate">
            {file.name}
          </p>
          {badge && (
            <span className="text-xs uppercase tracking-widest px-2 py-1 rounded-full bg-primary/20 text-primary font-medium whitespace-nowrap">
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {formatFileSize(file.size)}
          </span>
          <div className="flex items-center gap-1 text-xs text-primary">
            <CheckCircle2 className="h-3 w-3" />
            Ready
          </div>
        </div>
      </div>

      <button
        onClick={onRemove}
        className={cn(
          "absolute -top-2 -right-2 p-1.5 rounded-full transition-all duration-200",
          "bg-destructive/90 text-destructive-foreground",
          "opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100",
          "hover:bg-destructive shadow-lg",
          "focus:ring-2 focus:ring-destructive focus:ring-offset-2 focus:outline-none"
        )}
        aria-label={`Remove ${file.name}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// Main UploadSection Component
export function UploadSection({ onChange, className }: UploadSectionProps) {
  // State management
  const [questionnaireFile, setQuestionnaireFile] = useState<File | null>(null)
  const [documents, setDocuments] = useState<File[]>([])
  const [error, setError] = useState<string>("")
  const [draggingQuestionnaire, setDraggingQuestionnaire] = useState(false)
  const [draggingDocuments, setDraggingDocuments] = useState(false)

  // Refs for file inputs
  const questionnaireRef = useRef<HTMLInputElement>(null)
  const documentsRef = useRef<HTMLInputElement>(null)

  // Notify parent of changes
  const notifyChange = useCallback(
    (qFile: File | null, docs: File[]) => {
      onChange?.({ questionnaireFile: qFile, documents: docs })
    },
    [onChange]
  )

  // Error handling
  const setErrorMessage = useCallback((message: string) => {
    setError(message)
    setTimeout(() => setError(""), 5000)
  }, [])

  // Questionnaire file handling
  const handleQuestionnaireFile = useCallback(
    (file: File) => {
      if (!isValidFileType(file.name, QUESTIONNAIRE_EXTENSIONS)) {
        setErrorMessage("Questionnaire supports only PDF and Excel files.")
        return
      }
      setQuestionnaireFile(file)
      notifyChange(file, documents)
    },
    [documents, notifyChange, setErrorMessage]
  )

  // Company documents handling
  const handleCompanyDocuments = useCallback(
    (files: File[]) => {
      const accepted: File[] = []
      const rejected: string[] = []

      files.forEach(file => {
        if (!isValidFileType(file.name, DOCUMENTS_EXTENSIONS)) {
          rejected.push(file.name)
          return
        }

        // Prevent duplicates
        if (documents.some(item => item.name === file.name)) {
          return
        }

        accepted.push(file)
      })

      if (rejected.length > 0) {
        setErrorMessage(`Unsupported format(s): ${rejected.join(', ')}. Supported: PDF, Word, Excel, Text.`)
      }

      if (accepted.length > 0) {
        const nextDocs = [...documents, ...accepted]
        setDocuments(nextDocs)
        notifyChange(questionnaireFile, nextDocs)
      }
    },
    [documents, notifyChange, questionnaireFile, setErrorMessage]
  )

  // File processing
  const processFiles = useCallback(
    (files: FileList | File[], category: "questionnaire" | "documents") => {
      const fileArray = Array.from(files)
      if (category === "questionnaire") {
        if (fileArray.length > 0) {
          handleQuestionnaireFile(fileArray[0])
        }
      } else {
        handleCompanyDocuments(fileArray)
      }
    },
    [handleCompanyDocuments, handleQuestionnaireFile]
  )

  // Remove functions
  const removeDocument = useCallback(
    (fileName: string) => {
      const nextDocs = documents.filter(doc => doc.name !== fileName)
      setDocuments(nextDocs)
      notifyChange(questionnaireFile, nextDocs)
    },
    [documents, notifyChange, questionnaireFile]
  )

  const clearQuestionnaire = useCallback(() => {
    setQuestionnaireFile(null)
    notifyChange(null, documents)
  }, [documents, notifyChange])

  // Drag handlers
  const handleQuestionnaireDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDraggingQuestionnaire(false)
    processFiles(e.dataTransfer.files, "questionnaire")
  }, [processFiles])

  const handleDocumentsDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDraggingDocuments(false)
    processFiles(e.dataTransfer.files, "documents")
  }, [processFiles])

  return (
    <section className={cn("space-y-8", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          Security Questionnaire Agent
        </h2>
        <p className="text-muted-foreground">
          Upload your questionnaire and supporting documents for AI-powered compliance analysis
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Questionnaire Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Upload Security Questionnaire</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium">
            Required
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Upload your security questionnaire (PDF or Excel) for AI-powered compliance analysis
        </p>

        <input
          ref={questionnaireRef}
          type="file"
          accept=".pdf,.xlsx,.xls"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) processFiles([e.target.files[0]], "questionnaire")
            e.target.value = ""
          }}
        />

        <UploadZone
          title="Select or Drag & Drop Your Questionnaire"
          description="PDF or Excel format"
          isActive={draggingQuestionnaire}
          highlighted={true}
          onClick={() => questionnaireRef.current?.click()}
          onDrop={handleQuestionnaireDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setDraggingQuestionnaire(true)
          }}
          onDragLeave={() => setDraggingQuestionnaire(false)}
        />

        {questionnaireFile ? (
          <FileCard
            file={questionnaireFile}
            onRemove={clearQuestionnaire}
            badge="Questionnaire"
            highlighted={true}
          />
        ) : (
          <div className="text-center py-6 text-muted-foreground border-2 border-dashed border-border/30 rounded-xl">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No questionnaire uploaded yet</p>
          </div>
        )}
      </div>

      {/* Company Documents Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Folder className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Upload Company Documents</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium">
            Optional
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Upload policies, SOC2 reports, and security documents to help AI generate accurate responses
        </p>

        <input
          ref={documentsRef}
          type="file"
          accept=".pdf,.docx,.xlsx,.xls,.txt"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) processFiles(e.target.files, "documents")
            e.target.value = ""
          }}
        />

        <UploadZone
          title="Select or Drag & Drop Your Documents"
          description="PDF, Word, Excel, or Text files"
          isActive={draggingDocuments}
          highlighted={true}
          onClick={() => documentsRef.current?.click()}
          onDrop={handleDocumentsDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setDraggingDocuments(true)
          }}
          onDragLeave={() => setDraggingDocuments(false)}
        />

        {documents.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground border-2 border-dashed border-border/30 rounded-xl">
            <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No documents uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc, index) => (
              <FileCard
                key={`${doc.name}-${index}`}
                file={doc}
                onRemove={() => removeDocument(doc.name)}
                className="animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${index * 100}ms` }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
