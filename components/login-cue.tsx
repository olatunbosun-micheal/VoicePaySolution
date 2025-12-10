"use client"

import { useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { narrator } from "@/lib/voice-narrator"

const texts: Record<string, Record<string, string>> = {
  en: {
    title: "Login",
    desc: "Enter your details. We will confirm before any action.",
  },
  yo: {
    title: "Ìwọlé",
    desc: "Tẹ alaye rẹ. A máa jẹ́ kó dájú kí a tó ṣe ohunkóhun.",
  },
  ig: {
    title: "Banye",
    desc: "Tinye nkọwa gị. Anyị ga-ekwenye tupu ihe ọ bụla.",
  },
  ha: {
    title: "Shiga",
    desc: "Shigar da bayananka. Zamu tabbatar kafin kowace aiki.",
  },
  sw: {
    title: "Ingia",
    desc: "Weka maelezo yako. Tutathibitisha kabla ya hatua yoyote.",
  },
  pcm: {
    title: "Login",
    desc: "Put your details. We go confirm before anything.",
  },
  tw: {
    title: "Kɔ mu",
    desc: "Kɔ w'nsɛm no mu. Yɛbɛsɔ mu ansa na yebɛyɛ biribiara.",
  },
}

export default function LoginCue() {
  const { language } = useLanguage()
  const t = texts[language] || texts.en

  useEffect(() => {
    if (!narrator) return
    const confirmed = typeof window !== "undefined" && localStorage.getItem("iyabola-language-confirmed") === "true"
    const langToUse = confirmed ? language : "en"
    narrator.setLanguage(langToUse)
    narrator.setEnabled(true)
    // Clear any prior utterances to avoid overlap
    try { window.speechSynthesis?.cancel?.() } catch {}
    const text = `${(texts[langToUse] || texts.en).title}. ${(texts[langToUse] || texts.en).desc}`
    const timer = setTimeout(() => narrator.speak(text, "high"), 350)
    return () => clearTimeout(timer)
  }, [language])

  return (
    <div className="mb-6 flex items-center gap-3" aria-live="polite">
      <div className="w-5 h-5 rounded-sm bg-green-500 shadow" aria-hidden="true" />
      <div>
        <p className="font-semibold text-foreground">{t.title}</p>
        <p className="text-sm text-muted-foreground">{t.desc}</p>
      </div>
    </div>
  )
}
