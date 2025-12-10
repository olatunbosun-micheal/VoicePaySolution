"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface InstructionOverlayProps {
  show: boolean
  instruction: string
  step?: number
  totalSteps?: number
  position?: "top" | "bottom" | "center"
  onNext?: () => void
  onSkip?: () => void
  isSpeaking?: boolean
  onToggleSpeak?: () => void
  showSpeakControl?: boolean
}

export function InstructionOverlay({
  show,
  instruction,
  step,
  totalSteps,
  position = "bottom",
  onNext,
  onSkip,
  isSpeaking = false,
  onToggleSpeak,
  showSpeakControl = true,
}: InstructionOverlayProps) {
  if (!show) return null

  const positionClasses: Record<string, string> = {
    top: "top-4",
    bottom: "bottom-4",
    center: "top-1/2 -translate-y-1/2",
  }

  return (
    <div
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-2xl px-4 transition-all duration-200",
        positionClasses[position]
      )}
      aria-live="polite"
    >
      <Card className="p-6 shadow-2xl border-2 border-primary/20 bg-background/95 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {step !== undefined && totalSteps !== undefined && (
                <span className="text-sm font-semibold text-primary">
                  Step {step} of {totalSteps}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {showSpeakControl && onToggleSpeak && (
                <Button variant="ghost" size="icon" onClick={onToggleSpeak} className="h-8 w-8" aria-label="Toggle voice">
                  {isSpeaking ? (
                    // Volume on icon
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5l-4 4H5a2 2 0 00-2 2v2a2 2 0 002 2h2l4 4V5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.54 8.46a5 5 0 010 7.07M17.657 6.343a8 8 0 010 11.314" />
                    </svg>
                  ) : (
                    // Volume off icon
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5l-4 4H5a2 2 0 00-2 2v2a2 2 0 002 2h2l4 4V5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 5l-6 6m0 0l6 6m-6-6h.01" />
                    </svg>
                  )}
                </Button>
              )}

              {onSkip && (
                <Button variant="ghost" size="icon" onClick={onSkip} className="h-8 w-8" aria-label="Skip guide">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-lg font-medium leading-relaxed text-foreground">{instruction}</p>
          </div>

          {onNext && (
            <div className="flex justify-end">
              <Button onClick={onNext} size="lg" className="rounded-xl gap-2">
                Next
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          )}

          {step !== undefined && totalSteps !== undefined && (
            <div className="flex gap-1">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <div
                  key={idx}
                  className={cn("h-1 flex-1 rounded-full transition-colors", idx < step ? "bg-primary" : "bg-muted")}
                />)
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
