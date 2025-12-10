"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { usePathname } from "next/navigation"

export type Language = "en" | "yo" | "ig" | "ha" | "sw" | "pcm" | "tw"

export const languageNames: Record<Language, string> = {
  en: "English",
  yo: "Yorùbá",
  ig: "Igbo",
  ha: "Hausa",
  sw: "Kiswahili",
  pcm: "Pidgin",
  tw: "Twi", // Added Twi (Ghanaian language)
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Default to English on first render (SSR-safe)
  const [language, setLanguageState] = useState<Language>("en")
  const pathname = usePathname() || "/"

  // After mount, optionally adopt a saved language IF user has confirmed previously
  useEffect(() => {
    const confirmed = localStorage.getItem("iyabola-language-confirmed") === "true"
    // Never auto-adopt saved language on the splash route
    if (confirmed && pathname !== "/") {
      const saved = localStorage.getItem("iyabola-language") as Language
      if (saved && languageNames[saved]) setLanguageState(saved)
    }
  }, [pathname])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("iyabola-language", lang)
  }

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
