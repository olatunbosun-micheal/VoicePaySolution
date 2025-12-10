"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/language-context"
import { narrator } from "@/lib/voice-narrator"
import React from "react"

export default function AIGuideWidget() {
  const { language } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState("")
  const [userName, setUserName] = useState("Friend")

  // Load user's first name for personalization
  useEffect(() => {
    const user = localStorage.getItem("iyabola-user")
    if (user) {
      try {
        const parsed = JSON.parse(user)
        if (parsed?.name) setUserName(String(parsed.name).split(" ")[0])
      } catch {}
    }
  }, [])

  const titleMap: Record<string, Record<string, string>> = {
    en: {
      guide: "Need help?",
      ask: "Ask",
      tips: "Tips for this page",
      goChat: "Open Chat",
      placeholder: "Ask a quick question...",
      send: "Send",
    },
    yo: {
      guide: "Ìrànlọ́wọ́?",
      ask: "Beere",
      tips: "Àmọ̀ràn fún ojú-ìwé yìí",
      goChat: "Ṣí ìbànísọ̀rọ̀",
      placeholder: "Beere ìbéèrè kíákíá...",
      send: "Firanṣẹ́",
    },
    ig: {
      guide: "Chọọ enyemaka?",
      ask: "Jụọ",
      tips: "Ndụmọdụ maka ibe a",
      goChat: "Meghee Okwu",
      placeholder: "Jụọ ajụjụ ngwa ngwa...",
      send: "Zipu",
    },
    ha: {
      guide: "Kana bukatar taimako?",
      ask: "Tambaya",
      tips: "Shawarwari don wannan shafi",
      goChat: "Bude Tattaunawa",
      placeholder: "Tambayi tambaya cikin sauri...",
      send: "Aika",
    },
    sw: {
      guide: "Unahitaji msaada?",
      ask: "Uliza",
      tips: "Vidokezo kwa ukurasa huu",
      goChat: "Fungua Gumzo",
      placeholder: "Uliza swali haraka...",
      send: "Tuma",
    },
    pcm: {
      guide: "You need help?",
      ask: "Ask",
      tips: "Tips for this page",
      goChat: "Open Chat",
      placeholder: "Ask quick question...",
      send: "Send",
    },
    tw: {
      guide: "Wopɛ mmoa?",
      ask: "Bisa",
      tips: "Nkyerɛkyerɛmu ma kratafa yi",
      goChat: "Bue Nkomɔ",
      placeholder: "Bisa nsɛmmisa ntɛm...",
      send: "Mane",
    },
  }

  const tipsMap: Record<string, Record<string, string[]>> = {
    "/": {
      en: ["Choose your language to start.", "Voice guidance is available."],
      yo: ["Yan èdè rẹ kí o bẹ̀rẹ̀.", "Ohùn ìtọ́nisọ́nà wà."],
      ig: ["Họrọ asụsụ ka ị bido.", "Olu nduzi dị."],
      ha: ["Zaɓi harshe ka fara.", "Jagorar murya na nan."],
      sw: ["Chagua lugha uanze.", "Mwongozo wa sauti upo."],
      pcm: ["Choose your language to start.", "Voice guide dey available."],
      tw: ["Pawɔ kasa a wopɛ na fi ase.", "Vɔɔs akyerɛkyerɛwɔ hɔ."],
    },
    "/login": {
      en: ["Enter your details carefully.", "We will confirm before any action."],
      yo: ["Tẹ alaye rẹ ní pẹkipẹki.", "A máa jẹ́ kó dájú kí a tó ṣe ohunkóhun."],
      ig: ["Tinye nkọwa gị nke ọma.", "Anyị ga-ekwenye tupu ihe ọ bụla."],
      ha: ["Shigar da bayananka a hankali.", "Zamu tabbatar kafin duk aiki."],
      sw: ["Weka maelezo kwa uangalifu.", "Tutathibitisha kabla ya hatua yoyote."],
      pcm: ["Enter your details well.", "We go confirm before anything."],
      tw: ["Kɔ nsɛm no yie mu.", "Yɛbɛsɔ mu ansa na yebɛyɛ biribi."],
    },
    "/home": {
      en: ["Pick an action like Send, Bills or Airtime.", "Use the mic for voice help."],
      yo: ["Yan ìṣe bíi Fíránṣé, Ìwé-owó tàbí Airtime.", "Lo miki fun ìrànlọ́wọ́ ohùn."],
      ig: ["Họrọ omume dịka Zipu, Ụgwọ ma ọ bụ Airtime.", "Jiri mic maka enyemaka olu."],
      ha: ["Zaɓi aiki kamar Aika, Kudi ko Airtime.", "Yi amfani da mic don taimako."],
      sw: ["Chagua hatua kama Tuma, Bili au Airtime.", "Tumia mic kwa msaada wa sauti."],
      pcm: ["Choose action like Send, Bills or Airtime.", "Use mic for voice help."],
      tw: ["Fa adeɛ te sɛ Send, Bills anaa Airtime.", "Fa mic no di dwuma ma vɔɔs mmoa."],
    },
    "/send": {
      en: ["Enter recipient and amount.", "We will show fees and ask to confirm."],
      yo: ["Tẹ ẹni tí o ń fún àti owó.", "A ó fi owó ìtanràn hàn kí a sì jẹ́ kó dájú."],
      ig: ["Tinye onye nnata na ego.", "Anyị ga-egosi ụgwọ ma jụọ ka ekwenye."],
      ha: ["Shigar da mai karɓa da kuɗi.", "Zamu nuna kuɗin sabis mu nemi tabbaci."],
      sw: ["Weka mpokeaji na kiasi.", "Tutaonyesha ada na kuuliza uthibitisho."],
      pcm: ["Enter who you dey send give and amount.", "We go show fees and confirm."],
      tw: ["Fa obi a wobɛtua no na sika dodow no.", "Yɛbɛkyerɛ ka ne sɛ yɛmfa nni so ansa."],
    },
    "/bills": {
      en: ["Upload or pick a bill to pay.", "Review details before paying."],
      yo: ["Gbe ìwé-owó soke tàbí yan láti san.", "Ṣàyẹwo gbogbo alaye kí o tó san."],
      ig: ["Bulite ma ọ bụ họrọ ụgwọ ịkwụ.", "Lelee nkọwa tupu ịkwụ."],
      ha: ["Loda ko zaɓi kudin da za a biya.", "Duba bayanai kafin biyan kuɗi."],
      sw: ["Pakia au chagua bili kulipa.", "Kagua maelezo kabla ya kulipa."],
      pcm: ["Upload bill or choose one pay.", "Check details before you pay."],
      tw: ["Sɔ bill anaa paw bi na tua.", "Hwɛ nsɛm no yie ansa na wotua."],
    },
    "/airtime": {
      en: ["Choose network and amount.", "Confirm purchase before finalizing."],
      yo: ["Yan nẹ́tíwọ́ọ̀kì àti owó.", "Jẹ́ kó dájú kí o tó ra."],
      ig: ["Họrọ network na ego.", "Kwado tupu ịzụcha."],
      ha: ["Zaɓi network da kuɗi.", "Tabbatar kafin kammalawa."],
      sw: ["Chagua mtandao na kiasi.", "Thibitisha ununuzi kabla ya kumaliza."],
      pcm: ["Choose network and amount.", "Confirm before you buy."],
      tw: ["Paw network ne sika dodow.", "Fa to mu ansa na wotɔ."],
    },
    "/save": {
      en: ["Set a small savings goal.", "We can remind you gently."],
      yo: ["Ṣètò ibi-afẹ́ ìfowópamọ́ kékeré.", "A lè rántí ẹ lérò pẹ̀lẹ́."],
      ig: ["Tọọgo ebe nchekwa nta.", "Anyị nwere ike cheta gị nwayọ."],
      ha: ["Saita ƙaramin manufa na ajiya.", "Zamu tuna maka a hankali."],
      sw: ["Weka lengo dogo la akiba.", "Tunakukumbusha kwa upole."],
      pcm: ["Set small savings goal.", "We fit remind you small small."],
      tw: ["Siw targee ketewa ma sika sie.", "Yɛbɛkae wo brɛoo."],
    },
  }

  const t = titleMap[language] || titleMap.en
  const tips = useMemo(() => {
    const base = pathname || "/"
    const key = Object.keys(tipsMap).find((k) => base === k || base.startsWith(k + "/")) || "/"
    const map = tipsMap[key]
    return (map && (map[language] || map.en)) || []
  }, [pathname, language])

  useEffect(() => {
    if (open && narrator) {
      const joined = tips.slice(0, 2).join(". ")
      if (joined) narrator.speak(joined, "high")
    }
  }, [open])

  const ask = async () => {
    if (!input.trim()) return
    setLoading(true)
    setAnswer("")
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `${input} (Current page: ${pathname})`,
            },
          ],
          language,
        }),
      })
      const data = await res.json()
      const text = data.text || ""
      setAnswer(text)
      if (narrator && text) narrator.speak(text)
    } catch (e) {
      setAnswer("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open ? (
        <Button
          size="lg"
          onClick={() => setOpen(true)}
          className="rounded-full h-12 px-4 shadow-lg"
        >
          {t.guide}
        </Button>
      ) : (
        <Card className="w-[320px] shadow-2xl border-primary/20">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{t.ask} {userName}</div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-2">{t.tips}</div>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-2">
              <Input
                placeholder={t.placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) ask()
                }}
              />
              <Button onClick={ask} disabled={loading} className="rounded-full">
                {t.send}
              </Button>
            </div>

            {answer && (
              <div className="text-sm bg-muted/50 rounded-md p-2 whitespace-pre-wrap max-h-40 overflow-auto">
                {answer}
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" className="w-full" onClick={() => router.push("/chat")}> 
                {t.goChat}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
