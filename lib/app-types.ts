export type SectionKey = "upload" | "results" | "settings"

export type StepKey = "upload" | "processing" | "results"

export type DetailLevel = "brief" | "standard" | "detailed"

export interface AppSettings {
  confidenceThreshold: number
  detailLevel: DetailLevel
  autoCite: boolean
}
