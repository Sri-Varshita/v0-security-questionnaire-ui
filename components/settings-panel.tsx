"use client"

import { Settings, Brain, Database, Shield, Bell, Key } from "lucide-react"
import { cn } from "@/lib/utils"

export function SettingsPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Settings
        </h2>
        <p className="text-sm text-muted-foreground">
          Configure your AI agent and system preferences
        </p>
      </div>

      <div className="grid gap-4">
        {/* AI Configuration */}
        <div className="glass-card p-5 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/20">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">AI Configuration</h3>
              <p className="text-xs text-muted-foreground">Adjust AI behavior and responses</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-foreground">Confidence Threshold</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="50"
                  max="95"
                  defaultValue="80"
                  className="w-24 accent-primary"
                />
                <span className="text-sm font-mono text-primary w-12">80%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-foreground">Response Detail Level</label>
              <select className="px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50 text-sm text-foreground">
                <option>Detailed</option>
                <option>Standard</option>
                <option>Brief</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-foreground">Auto-cite sources</label>
              <div className={cn(
                "relative w-11 h-6 rounded-full cursor-pointer transition-colors",
                "bg-primary"
              )}>
                <div className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-primary-foreground transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Knowledge Base */}
        <div className="glass-card p-5 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-secondary/30">
              <Database className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Knowledge Base</h3>
              <p className="text-xs text-muted-foreground">Manage document sources</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div>
                <p className="text-sm font-medium text-foreground">Security Policies</p>
                <p className="text-xs text-muted-foreground">12 documents indexed</p>
              </div>
              <span className="text-xs font-mono text-primary px-2 py-1 rounded bg-primary/20">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div>
                <p className="text-sm font-medium text-foreground">SOC 2 Reports</p>
                <p className="text-xs text-muted-foreground">3 documents indexed</p>
              </div>
              <span className="text-xs font-mono text-primary px-2 py-1 rounded bg-primary/20">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div>
                <p className="text-sm font-medium text-foreground">Compliance Frameworks</p>
                <p className="text-xs text-muted-foreground">ISO 27001, NIST, GDPR</p>
              </div>
              <span className="text-xs font-mono text-primary px-2 py-1 rounded bg-primary/20">Active</span>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="glass-card p-5 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-muted/50">
              <Shield className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Security</h3>
              <p className="text-xs text-muted-foreground">Access and encryption settings</p>
            </div>
          </div>
          
          <div className="space-y-3 opacity-60">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
              <Key className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">API Key Management</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Notification Preferences</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
