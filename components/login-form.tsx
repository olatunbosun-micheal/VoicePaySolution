"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { languageNames, type Language } from "@/lib/language-context"
import { t } from "@/lib/translations"
import { narrator } from "@/lib/voice-narrator"

type AuthStep = "language" | "register" | "otp" | "pin" | "login"

interface UserData {
  name: string
  email: string
  phone: string
  pin?: string
}

export function LoginForm() {
  const router = useRouter()
  const [step, setStep] = useState<AuthStep>("language")
  const [language, setLanguage] = useState<Language>("en")
  const [isLoading, setIsLoading] = useState(false)

  // Registration data
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    phone: "",
  })

  // OTP verification
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)

  // PIN creation/entry
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [isCreatingPin, setIsCreatingPin] = useState(true)

  // Login mode
  const [isReturningUser, setIsReturningUser] = useState(false)
  const [loginIdentifier, setLoginIdentifier] = useState("")

  useEffect(() => {
    const savedLang = localStorage.getItem("iyabola-language") as Language
    const confirmed = localStorage.getItem("iyabola-language-confirmed") === "true"
    const existingUser = localStorage.getItem("iyabola-user")

    if (savedLang && languageNames[savedLang]) {
      setLanguage(savedLang)
      if (narrator) {
        narrator.setLanguage(savedLang)
        narrator.setEnabled(true)
      }
    }

    if (existingUser) {
      setIsReturningUser(true)
    }

    // If splash already confirmed language, skip this component's language screen
    if (confirmed) {
      setStep(existingUser ? "login" : "register")
    }
  }, [])

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("iyabola-language", lang)
    if (narrator) {
      narrator.setLanguage(lang)
      narrator.speak(t("languageSelected", lang), "high")
    }
    setStep(isReturningUser ? "login" : "register")
  }

  const handleRegister = async () => {
    if (!userData.name || !userData.email || !userData.phone) return

    setIsLoading(true)
    narrator?.speak(t("sendingOTP", language), "high")

    // Simulate sending OTP
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setOtpSent(true)
    setIsLoading(false)
    setStep("otp")
    narrator?.speak(t("otpSentMessage", language), "high")
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return

    setIsLoading(true)
    narrator?.speak(t("verifyingOTP", language), "high")

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    setStep("pin")
    narrator?.speak(t("createPinMessage", language), "high")
  }

  const handleCreatePin = async () => {
    if (pin.length < 4 || pin !== confirmPin) {
      narrator?.speak(t("pinMismatch", language), "high")
      return
    }

    setIsLoading(true)
    narrator?.speak(t("creatingAccount", language), "high")

    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Save user data
    const user = { ...userData, pin }
    localStorage.setItem("iyabola-user", JSON.stringify(user))
    localStorage.setItem("iyabola-authenticated", "true")

    setIsLoading(false)
    narrator?.speak(t("accountCreated", language), "high")

    setTimeout(() => {
      router.push("/home")
    }, 1000)
  }

  const handleLogin = async () => {
    if (!loginIdentifier || pin.length < 4) return

    setIsLoading(true)
    narrator?.speak(t("authenticating", language), "high")

    await new Promise((resolve) => setTimeout(resolve, 1500))

    localStorage.setItem("iyabola-authenticated", "true")
    setIsLoading(false)
    narrator?.speak(t("loginSuccessful", language), "high")

    setTimeout(() => {
      router.push("/home")
    }, 1000)
  }

  const handleBack = () => {
    if (step === "otp") {
      setStep("register")
      setOtpSent(false)
      setOtp("")
    } else if (step === "pin") {
      setStep("otp")
      setPin("")
      setConfirmPin("")
    } else if (step === "register" || step === "login") {
      setStep("language")
    }
  }

  // Language Selection Screen
  if (step === "language") {
    return (
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
          <CardTitle className="text-3xl font-bold text-balance">{t("selectLanguage", language)}</CardTitle>
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
    )
  }

  // Registration Screen
  if (step === "register") {
    return (
      <Card className="w-full max-w-md shadow-xl border-primary/10 bg-card/95 backdrop-blur-sm">
        <CardHeader className="space-y-3 text-center relative">
          <Button variant="ghost" size="icon" className="absolute left-0 top-0" onClick={handleBack}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-2">
            <svg className="w-10 h-10 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold text-balance">{t("createAccount", language)}</CardTitle>
          <CardDescription className="text-base">{t("enterYourDetails", language)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("fullName", language)}</Label>
            <Input
              id="name"
              type="text"
              placeholder={t("enterName", language)}
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("emailAddress", language)}</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t("phoneNumber", language)}</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+234 800 000 0000"
              value={userData.phone}
              onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              className="h-12"
            />
          </div>

          <Button
            className="w-full h-12 text-base font-semibold"
            onClick={handleRegister}
            disabled={isLoading || !userData.name || !userData.email || !userData.phone}
          >
            {isLoading ? t("sending", language) : t("continue", language)}
          </Button>

          <div className="text-center pt-2">
            <button onClick={() => setStep("login")} className="text-sm text-primary hover:underline">
              {t("alreadyHaveAccount", language)}
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // OTP Verification Screen
  if (step === "otp") {
    return (
      <Card className="w-full max-w-md shadow-xl border-primary/10 bg-card/95 backdrop-blur-sm">
        <CardHeader className="space-y-3 text-center relative">
          <Button variant="ghost" size="icon" className="absolute left-0 top-0" onClick={handleBack}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-2">
            <svg className="w-10 h-10 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold text-balance">{t("verifyOTP", language)}</CardTitle>
          <CardDescription className="text-base">
            {t("otpSentTo", language)} {userData.phone}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp-code">{t("enterOTP", language)}</Label>
            <Input
              id="otp-code"
              type="text"
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="text-center text-2xl tracking-widest h-14"
            />
          </div>

          <Button
            className="w-full h-12 text-base font-semibold"
            onClick={handleVerifyOTP}
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? t("verifying", language) : t("verifyOTP", language)}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // PIN Creation Screen
  if (step === "pin") {
    return (
      <Card className="w-full max-w-md shadow-xl border-primary/10 bg-card/95 backdrop-blur-sm">
        <CardHeader className="space-y-3 text-center relative">
          <Button variant="ghost" size="icon" className="absolute left-0 top-0" onClick={handleBack}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-2">
            <svg className="w-10 h-10 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold text-balance">{t("createPin", language)}</CardTitle>
          <CardDescription className="text-base">{t("pinDescription", language)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pin">{t("enterPin", language)}</Label>
            <Input
              id="pin"
              type="password"
              placeholder="••••"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              className="text-center text-2xl tracking-widest h-14"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-pin">{t("confirmPin", language)}</Label>
            <Input
              id="confirm-pin"
              type="password"
              placeholder="••••"
              maxLength={6}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
              className="text-center text-2xl tracking-widest h-14"
            />
          </div>

          {pin && confirmPin && pin !== confirmPin && (
            <p className="text-sm text-destructive text-center">{t("pinMismatch", language)}</p>
          )}

          <Button
            className="w-full h-12 text-base font-semibold"
            onClick={handleCreatePin}
            disabled={isLoading || pin.length < 4 || pin !== confirmPin}
          >
            {isLoading ? t("creatingAccount", language) : t("createAccount", language)}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Login Screen (for returning users)
  if (step === "login") {
    return (
      <Card className="w-full max-w-md shadow-xl border-primary/10 bg-card/95 backdrop-blur-sm">
        <CardHeader className="space-y-3 text-center relative">
          <Button variant="ghost" size="icon" className="absolute left-0 top-0" onClick={handleBack}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-2">
            <svg className="w-10 h-10 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold text-balance">{t("welcomeBack", language)}</CardTitle>
          <CardDescription className="text-base">{t("loginToContinue", language)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier">{t("emailOrPhone", language)}</Label>
            <Input
              id="identifier"
              type="text"
              placeholder={t("enterEmailOrPhone", language)}
              value={loginIdentifier}
              onChange={(e) => setLoginIdentifier(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-pin">{t("enterPin", language)}</Label>
            <Input
              id="login-pin"
              type="password"
              placeholder="••••"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              className="text-center text-2xl tracking-widest h-14"
            />
          </div>

          <Button
            className="w-full h-12 text-base font-semibold"
            onClick={handleLogin}
            disabled={isLoading || !loginIdentifier || pin.length < 4}
          >
            {isLoading ? t("authenticating", language) : t("login", language)}
          </Button>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                setIsReturningUser(false)
                setStep("register")
              }}
              className="text-sm text-primary hover:underline"
            >
              {t("createNewAccount", language)}
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
