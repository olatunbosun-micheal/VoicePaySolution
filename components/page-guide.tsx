"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { narrator } from "@/lib/voice-narrator"

export default function PageGuide() {
  const { language } = useLanguage()
  const pathname = usePathname() || "/"
  const [visible, setVisible] = useState(true)
  const lastKeyRef = useRef<string>("")
  const [confirmed, setConfirmed] = useState(false)

  const descMap: Record<string, Record<string, string>> = {
    "/": {
      en: "Welcome. Choose your language to start.",
      yo: "Ẹ káàbọ̀. Yan èdè rẹ kí o bẹ̀rẹ̀.",
      ig: "Nnọọ. Họrọ asụsụ ka ị bido.",
      ha: "Barka da zuwa. Zaɓi harshe ka fara.",
      sw: "Karibu. Chagua lugha uanze.",
      pcm: "Welcome. Choose your language to start.",
      tw: "Akwaaba. Paw kasa a wopɛ na fi ase.",
    },
    "/login": {
      en: "Login to continue. We'll always confirm before any action.",
      yo: "Wọlé kí o tẹ̀síwájú. A máa jẹ́ kó dájú kí a tó ṣe ohunkóhun.",
      ig: "Banye ka ị gaa n'ihu. Anyị ga-ekwenye tupu ihe ọ bụla.",
      ha: "Shiga ciki don ci gaba. Zamu tabbatar kafin kowace aiki.",
      sw: "Ingia kuendelea. Tutathibitisha kabla ya hatua yoyote.",
      pcm: "Login to continue. We go confirm before anything.",
      tw: "Kɔ mu na toa so. Yɛbɛsɔ mu ansa na yebɛyɛ biribiara.",
    },
    "/home": {
      en: "Home. Pick Send Money, Bills, Airtime or Savings.",
      yo: "Ojú-ìwé ilé. Yan Fíránṣé Owo, Ìwé-owó, Airtime tàbí Ìfowópamọ́.",
      ig: "Ụlọ. Họrọ Zipu Ego, Ụgwọ, Airtime ma ọ bụ Nchekwa.",
      ha: "Gida. Zaɓi Aika Kuɗi, Kuɗade, Airtime ko Ajiya.",
      sw: "Nyumbani. Chagua Tuma Pesa, Bili, Airtime au Akiba.",
      pcm: "Home. Choose Send Money, Bills, Airtime or Savings.",
      tw: "Fie. Paw Send Money, Bills, Airtime anaa Savings.",
    },
    "/send": {
      en: "Send money. Enter recipient and amount. We'll show fees and ask to confirm.",
      yo: "Fíránṣé owó. Tẹ ẹni tí o ń fún àti owó. A ó fi owó ìtanràn hàn kí a sì jẹ́ kó dájú.",
      ig: "Zipu ego. Tinye onye nnata na ego. Anyị ga-egosi ụgwọ ma jụọ ka ekwenye.",
      ha: "Aika kudi. Shigar da mai karɓa da kuɗi. Zamu nuna kuɗin sabis mu nemi tabbaci.",
      sw: "Tuma pesa. Weka mpokeaji na kiasi. Tutaonyesha ada na kuuliza uthibitisho.",
      pcm: "Send money. Enter who and amount. We go show fees then confirm.",
      tw: "Tua sika. Fa obi a wobɛtua no ne sika dodow. Yɛbɛkyerɛ ka na yɛmfa nni so ansa.",
    },
    "/bills": {
      en: "Bills. Upload or pick a bill to pay. Review before paying.",
      yo: "Ìwé-owó. Gbe ìwé-owó soke tàbí yan láti san. Ṣàyẹwo kí o tó san.",
      ig: "Ụgwọ. Bulite ma ọ bụ họrọ ụgwọ ịkwụ. Lelee tupu ịkwụ.",
      ha: "Kuɗade. Loda ko zaɓi kudin da za a biya. Duba kafin biyan kuɗi.",
      sw: "Bili. Pakia au chagua bili kulipa. Kagua kabla ya kulipa.",
      pcm: "Bills. Upload bill or choose one to pay. Check before you pay.",
      tw: "Bills. Sɔ anaa paw bill na tua. Hwɛ ansa na wotua no.",
    },
    "/airtime": {
      en: "Airtime. Choose network and amount. Confirm before purchase.",
      yo: "Airtime. Yan nẹ́tíwọ́ọ̀kì àti owó. Jẹ́ kó dájú kí o tó ra.",
      ig: "Airtime. Họrọ network na ego. Kwado tupu ịzụcha.",
      ha: "Airtime. Zaɓi network da kuɗi. Tabbatar kafin saya.",
      sw: "Airtime. Chagua mtandao na kiasi. Thibitisha kabla ya ununuzi.",
      pcm: "Airtime. Choose network and amount. Confirm before you buy.",
      tw: "Airtime. Paw network ne sika dodow. Fa to mu ansa na wotɔ no.",
    },
    "/save": {
      en: "Savings. Set a small goal and we can remind you gently.",
      yo: "Ìfowópamọ́. Ṣètò ibi-afẹ́ kékeré, a lè rántí ẹ pẹ̀lẹ́pẹ̀lẹ́.",
      ig: "Nchekwa. Tọọgo ebe nta, anyị nwere ike cheta gị nwayọ.",
      ha: "Ajiya. Saita ƙaramin buri, zamu iya tuna maka a hankali.",
      sw: "Akiba. Weka lengo dogo, tutakukumbusha kwa upole.",
      pcm: "Savings. Set small goal; we fit remind you small.",
      tw: "Sikasie. Siw targee ketewa; yɛbɛkae wo brɛoo.",
    },
  }

  const text = useMemo(() => {
    const key = Object.keys(descMap).find((k) => pathname === k || pathname.startsWith(k + "/")) || "/"
    const map = descMap[key]
    const isSplash = pathname === "/"
    // Always show English on splash page
    const displayLang = isSplash ? "en" : language
    return (map && (map[displayLang] || map.en)) || ""
  }, [pathname, language])

  useEffect(() => {
    if (typeof window !== "undefined") {
      setConfirmed(localStorage.getItem("iyabola-language-confirmed") === "true")
    }
  }, [])

  useEffect(() => {
    // Show banner again when route changes
    setVisible(true)
    const key = `${language}:${pathname}`
    if (lastKeyRef.current !== key) {
      lastKeyRef.current = key
      const isSplash = pathname === "/"
      if (narrator && text && (confirmed || isSplash)) {
        // Always speak English on splash page
        narrator.setLanguage(isSplash ? "en" : language)
        narrator.setEnabled(true)
        narrator.speak(text, "high")
      }
    }
  }, [pathname, language, text, confirmed])

  const isSplash = pathname === "/"
  if ((!confirmed && !isSplash) || !visible || !text) return null

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-40">
      <div className="px-4 py-2 rounded-full bg-card/90 border border-primary/20 shadow backdrop-blur flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">i</span>
        <span className="text-sm">{text}</span>
        <button
          onClick={() => setVisible(false)}
          className="ml-2 inline-flex items-center justify-center w-7 h-7 rounded-full hover:bg-muted/60"
          aria-label="Dismiss"
          title="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
