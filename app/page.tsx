"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { languageNames, type Language } from "@/lib/language-context"
import { narrator } from "@/lib/voice-narrator"
import { useLanguage } from "@/lib/language-context"

export default function SplashScreen() {
  const router = useRouter()
  const { setLanguage } = useLanguage()
  const [fadeOut, setFadeOut] = useState(false)
  const [showLanguageSelection, setShowLanguageSelection] = useState(false)

  const handleNext = () => {
    // Immediately show language selection for a snappier UX
    setShowLanguageSelection(true)
    setFadeOut(false)
  }

  const handleLanguageSelect = (lang: Language) => {
    localStorage.setItem("iyabola-language", lang)
    localStorage.setItem("iyabola-language-confirmed", "true")
    setLanguage(lang)
    if (narrator) {
      narrator.setLanguage(lang)
      narrator.setEnabled(true)
      const confirmMap: Record<string, string> = {
        en: `You have selected ${languageNames[lang]}`,
        yo: `O ti yan ${languageNames[lang]}`,
        ig: `Ị họrọla ${languageNames[lang]}`,
        ha: `Ka zaba ${languageNames[lang]}`,
        sw: `Umechagua ${languageNames[lang]}`,
        pcm: `You don choose ${languageNames[lang]}`,
        tw: `Wo apaw ${languageNames[lang]}`,
      }
      narrator.speak(confirmMap[lang] || confirmMap.en, "high")
    }

    setFadeOut(true)
    setTimeout(() => {
      router.push("/login")
    }, 800)
  }

  if (showLanguageSelection) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-xl border-primary/10 bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-2">
              <svg className="w-10 h-10 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
            </div>
            <CardTitle className="text-3xl font-bold text-balance">Select Your Language</CardTitle>
            <CardDescription className="text-base">Choose your preferred language</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(Object.keys(languageNames) as Language[]).map((lang) => (
              <Button
                key={lang}
                variant="outline"
                className="w-full h-14 text-lg justify-start gap-3 hover:bg-primary/10 hover:border-primary bg-transparent"
                onClick={() => handleLanguageSelect(lang)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
                {languageNames[lang]}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Splash screen
  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-8 transition-opacity duration-800 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Enhanced background overlay for splash screen */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-background/50 to-accent/20 backdrop-blur-sm -z-10" />

      <div className="text-center space-y-8 animate-fade-in-up">
        {/* Logo or Icon */}
        <div className="flex justify-center mb-6 animate-bounce-in">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-2xl">
            <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Main Title with elegant font */}
        <div className="space-y-4 animate-slide-up">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
              Welcome to
            </span>
          </h1>
          <h2 className="text-6xl md:text-8xl font-black text-primary drop-shadow-lg animate-scale-in">
            VoicePay
          </h2>
          <p className="text-2xl md:text-3xl text-muted-foreground font-medium animate-fade-in-delayed">
            Voice Banking for Everyone
          </p>
        </div>

        {/* Built by credit */}
        <div className="pt-8 animate-fade-in-delayed-2">
          <p className="text-lg md:text-xl text-muted-foreground/80 font-medium">
            Built by <span className="text-primary font-bold text-2xl">Dynamites</span>
          </p>
        </div>

        <div className="pt-12 animate-fade-in-delayed-2">
          <Button
            onClick={handleNext}
            size="lg"
            className="h-14 px-12 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Next
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}
