"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { narrator } from "@/lib/voice-narrator"
import { Button } from "@/components/ui/button"
import { InstructionOverlay } from "@/components/instruction-overlay"

type Step = { el: Element; tip: string }

export default function VisualTour() {
  const { language } = useLanguage()
  const pathname = usePathname() || "/"
  const [index, setIndex] = useState(0)
  const boxRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("tour-enabled") === "true"
    }
    return false
  })
  const [langConfirmed, setLangConfirmed] = useState<boolean>(false)
  const [speaking, setSpeaking] = useState<boolean>(true)
  const [steps, setSteps] = useState<Step[]>([])

  // Discover element-driven steps via [data-tour-step] and optional [data-tour-message]
  useEffect(() => {
    if (!mounted) return
    const nodes = Array.from(document.querySelectorAll('[data-tour-step]'))
      .map((el) => {
        const stepStr = (el as HTMLElement).dataset.tourStep || ""
        const n = Number.parseInt(stepStr || "", 10)
        const tip = (el as HTMLElement).dataset.tourMessage || (el.getAttribute('aria-label') || el.textContent || "").trim()
        return { el, n: Number.isFinite(n) ? n : Number.MAX_SAFE_INTEGER, tip }
      })
      .sort((a, b) => a.n - b.n)
      .map(({ el, tip }) => ({ el, tip }))
    setSteps(nodes)
    setIndex(0)
  }, [mounted, pathname])

  useEffect(() => {
    // Ensure client-only behavior to avoid hydration mismatches
    setMounted(true)
    setIndex(0)
  }, [pathname, language])

  useEffect(() => {
    // read confirmation only; no auto-start
    if (typeof window !== "undefined") {
      const confirmed = localStorage.getItem("iyabola-language-confirmed") === "true"
      setLangConfirmed(confirmed)
    }

    if (!enabled) {
      const box = boxRef.current
      if (box) box.style.opacity = "0"
      if (timerRef.current) window.clearTimeout(timerRef.current)
      return
    }
    const box = boxRef.current
    if (!box) return

    const step = steps[index]
    if (!step) {
      box.style.opacity = "0"
      return
    }

    const target: Element | null = step.el

    if (!target) {
      box.style.opacity = "0"
      return
    }

    const rect = target.getBoundingClientRect()
    const pad = 8
    const x = rect.left - pad + window.scrollX
    const y = rect.top - pad + window.scrollY
    const w = rect.width + pad * 2
    const h = rect.height + pad * 2

    box.style.opacity = "1"
    box.style.transform = `translate(${x}px, ${y}px)`
    box.style.width = `${w}px`
    box.style.height = `${h}px`

    if (narrator && speaking) {
      // Use English before confirmation; chosen language after
      const langKey = langConfirmed ? language : "en"
      narrator.setLanguage(langKey)
      narrator.setEnabled(true)
      narrator.speak(step.tip || "", "high")
    }

    // No auto-advance; manual Next only

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [steps, index, language, enabled, pathname, mounted, langConfirmed, speaking])

  const toggle = () => {
    const next = !enabled
    setEnabled(next)
    if (typeof window !== "undefined") localStorage.setItem("tour-enabled", next ? "true" : "false")
    if (!next) setIndex(0)
  }
  const nextStep = () => {
    if (!enabled) return
    setIndex((i) => Math.min(i + 1, Math.max(steps.length - 1, 0)))
  }
  const skip = () => {
    setEnabled(false)
    if (typeof window !== "undefined") localStorage.setItem("tour-enabled", "false")
    setIndex(0)
  }
  const toggleSpeak = () => {
    const next = !speaking
    setSpeaking(next)
    if (!next && typeof window !== "undefined") {
      window.speechSynthesis?.cancel?.()
    }
  }

  if (!mounted) return null

  return (
    <>
      {/* Dimmer (non-blocking) */}
      {enabled && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", pointerEvents: "none", zIndex: 55 }}
          aria-hidden
        />
      )}
      {/* Moving highlight box */}
      <div
        ref={boxRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          border: enabled ? "3px solid #22c55e" : "0",
          borderRadius: 8,
          boxShadow: enabled ? "0 0 0 6px rgba(34,197,94,0.2)" : "none",
          transition: "transform 600ms ease, width 600ms ease, height 600ms ease, opacity 200ms ease",
          pointerEvents: "none",
          zIndex: 60,
          opacity: 0,
        }}
        aria-hidden
      />
      {/* Toggle control (bottom-left) */}
      {langConfirmed && steps.length > 0 && (
        <div className="fixed bottom-4 left-4 z-50 flex gap-2">
          <Button variant={enabled ? "default" : "outline"} size="sm" onClick={toggle} className="rounded-full">
            {enabled ? "Stop Guide" : "Start Guide"}
          </Button>
          {enabled && (
            <Button variant="outline" size="sm" onClick={nextStep} className="rounded-full">
              Next
            </Button>
          )}
        </div>
      )}
      {/* Instruction overlay */}
      {enabled && steps.length > 0 && (
        <InstructionOverlay
          show={true}
          instruction={steps[index]?.tip || ""}
          step={index + 1}
          totalSteps={steps.length}
          position="bottom"
          onNext={nextStep}
          onSkip={skip}
          isSpeaking={speaking}
          onToggleSpeak={toggleSpeak}
          showSpeakControl={true}
        />
      )}
    </>
  )
}
