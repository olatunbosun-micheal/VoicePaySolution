"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter, usePathname } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { narrator } from "@/lib/voice-narrator"

type Language = "en" | "yo" | "ig" | "ha" | "sw" | "pcm"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const languageNames: Record<Language, string> = {
  en: "English",
  yo: "Yorùbá",
  ig: "Igbo",
  ha: "Hausa",
  sw: "Kiswahili",
  pcm: "Pidgin",
}

const makeGreeting = (name: string): Record<Language, string> => ({
  en: `Hello ${name}! I can help you send money, pay bills, buy airtime, and more. You can also upload bills and I'll help you pay them!`,
  yo: `Ẹ káàbọ̀ ${name}! Mo lè ràn ọ́ lọ́wọ́ láti fi owó ránṣẹ́, san àwọn ìwé-owó, ra airtime, àti bẹ́ẹ̀ bẹ́ẹ̀ lọ. O tún lè gbe ìwé-owó sókè, màá ràn ọ́ lọ́wọ́!`,
  ig: `Nnọọ ${name}! Enwere m ike inyere gị aka izipu ego, ịkwụ ụgwọ, ịzụta airtime, na ndị ọzọ. Ị nwekwara ike ibulite ụgwọ, m ga-enyere gị aka ịkwụ ha!`,
  ha: `Sannu ${name}! Zan iya taimaka maka aika kudi, biyan kudade, siyan airtime, da dai sauransu. Kuna iya loda kudade, zan taimaka ku biya su!`,
  sw: `Habari ${name}! Ninaweza kukusaidia kutuma pesa, kulipa bili, kununua airtime, na zaidi. Unaweza pia kupakia bili, nami nitakusaidia kuzilipa!`,
  pcm: `How far ${name}! I fit help you send money, pay bill, buy airtime, and plenty more. You fit upload bills too, I go help you pay am!`,
})

const placeholders: Record<Language, string> = {
  en: "Type your message or upload a bill...",
  yo: "Kọ ìránṣẹ́ rẹ tàbí gbe ìwé-owó sókè...",
  ig: "Dee ozi gị ma ọ bụ bulite ụgwọ...",
  ha: "Rubuta sakonka ko loda kudin...",
  sw: "Andika ujumbe wako au pakia bili...",
  pcm: "Type your message or upload bill...",
}

const quickActionsTranslations: Record<Language, string[]> = {
  en: ["Check balance", "Send money", "Pay electricity", "Buy airtime", "Upload bill", "Help me save"],
  yo: ["Ṣàyẹ̀wò owó", "Fi owó ránṣẹ́", "San iná", "Ra airtime", "Gbe ìwé-owó", "Ràn mí lọ́wọ́ pamọ́"],
  ig: ["Lee ego", "Zipu ego", "Kwụọ ọkụ", "Zụta airtime", "Bulite ụgwọ", "Nyere m aka"],
  ha: ["Duba kuɗi", "Aika kuɗi", "Biya wuta", "Sayi airtime", "Loda kudin", "Taimake ni"],
  sw: ["Angalia salio", "Tuma pesa", "Lipa umeme", "Nunua airtime", "Pakia bili", "Nisaidie"],
  pcm: ["Check balance", "Send money", "Pay light", "Buy airtime", "Upload bill", "Help me save"],
}

export function ChatAssistant() {
  const router = useRouter()
  const pathname = usePathname() || "/"
  const [language, setLanguage] = useState<Language>("en")
  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [userName, setUserName] = useState<string>("Friend")

  useEffect(() => {
    const savedLang = localStorage.getItem("iyabola-language") as Language
    const confirmed = localStorage.getItem("iyabola-language-confirmed") === "true"
    const initialLang: Language = confirmed && savedLang && languageNames[savedLang] ? savedLang : "en"
    setLanguage(initialLang)
    const user = localStorage.getItem("iyabola-user")
    let firstName = "Friend"
    if (user) {
      try {
        const parsed = JSON.parse(user)
        if (parsed?.name) firstName = String(parsed.name).split(" ")[0]
      } catch {}
    }
    setUserName(firstName)

    const greetingMap = makeGreeting(firstName)
    const greeting = greetingMap[initialLang]
    setMessages([
      { id: "greeting", role: "assistant", content: greeting, timestamp: new Date() },
    ])

    if (narrator) {
      narrator.setLanguage(initialLang)
      narrator.setEnabled(true)
      setTimeout(() => narrator.speak(greeting), 500)
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (text: string, isAction = false) => {
    if (!text.trim()) return

    // Narrate user action
    if (narrator && voiceEnabled) {
      const actionNarrations: Record<Language, string> = {
        en: isAction ? `You selected: ${text}` : "Sending your message",
        yo: isAction ? `O yan: ${text}` : "N fi ìránṣẹ́ rẹ ránṣẹ́",
        ig: "Izipu ozi gị",
        ha: "Ana aika sakonka",
        sw: "Inatuma ujumbe wako",
        pcm: "I dey send your message",
      }
      narrator.speak(actionNarrations[language], "high")
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          language,
          userName,
          route: pathname,
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const contentType = response.headers.get("Content-Type") || ""
      const supportsStream = !!response.body && contentType.includes("text/event-stream")

      // Prepare assistant message entry
      const assistantId = (Date.now() + 1).toString()
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", timestamp: new Date() },
      ])

      if (supportsStream) {
        const reader = response.body!.getReader()
        const decoder = new TextDecoder()
        let assistantMessage = ""
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.text) {
                  assistantMessage += data.text
                  setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: assistantMessage } : m)))
                }
              } catch {}
            }
          }
        }
        if (narrator && voiceEnabled && assistantMessage) narrator.speak(assistantMessage)
      } else {
        // JSON response { text }
        const data = await response.json()
        const text = data.text || ""
        setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: text } : m)))
        if (narrator && voiceEnabled && text) narrator.speak(text)
      }
    } catch (error) {
      console.error("[v0] Chat error:", error)
      const errorMessages: Record<Language, string> = {
        en: "Sorry, I'm having trouble connecting. Please try again.",
        yo: "Má bínú, mo ní ìṣòro láti darapọ̀. Jọ̀wọ́ gbìyànjú lẹ́ẹ̀kan si.",
        ig: "Ndo, enwere m nsogbu ijikọ. Biko nwaa ọzọ.",
        ha: "Yi hakuri, ina da matsala wajen haɗawa. Don Allah sake gwadawa.",
        sw: "Samahani, nina shida kuunganisha. Tafadhali jaribu tena.",
        pcm: "Sorry, I dey find am hard to connect. Abeg try again.",
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: errorMessages[language],
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceToggle = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder

        const audioChunks: Blob[] = []
        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data)
        }

        mediaRecorder.onstop = () => {
          // Simulate voice command (in production, use speech-to-text API)
          const simulatedText = quickActionsTranslations[language][0]
          handleSendMessage(simulatedText, true)
          stream.getTracks().forEach((track) => track.stop())
        }

        mediaRecorder.start()
        setIsRecording(true)

        if (narrator && voiceEnabled) {
          const recordingMessages: Record<Language, string> = {
            en: "Listening... Speak now",
            yo: "Mo ń gbọ́... Sọ̀rọ̀ báyìí",
            ig: "Ana ege ntị... Kwuo ugbu a",
            ha: "Ina sauraro... Yi magana yanzu",
            sw: "Sikiliza... Sema sasa",
            pcm: "I dey listen... Talk now",
          }
          narrator.speak(recordingMessages[language], "high")
        }
      } catch (error) {
        console.error("Error accessing microphone:", error)
        alert("Unable to access microphone. Please check your permissions.")
      }
    } else {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop()
        setIsRecording(false)
      }
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (narrator && voiceEnabled) {
      const uploadMessages: Record<Language, string> = {
        en: "Bill uploaded. Let me help you with that.",
        yo: "Ìwé-owó ti gba. Jẹ́ kí n ràn ọ́ lọ́wọ́.",
        ig: "Ebulitela ụgwọ. Ka m nyere gị aka.",
        ha: "An loda kudin. Bari in taimake ku.",
        sw: "Bili imepakiwa. Wacha nikusaidie.",
        pcm: "Bill don upload. Make I help you.",
      }
      narrator.speak(uploadMessages[language], "high")
    }

    const uploadTexts: Record<Language, string> = {
      en: `I uploaded a bill: ${file.name}. Can you help me understand and pay it?`,
      yo: `Mo gbe ìwé-owó kan sókè: ${file.name}. Ṣé o lè ràn mí lọ́wọ́ láti lóye àti san?`,
      ig: `Ebulitere m ụgwọ: ${file.name}. Ị nwere ike inyere m aka ịghọta ma kwụọ ya?`,
      ha: `Na loda kudin: ${file.name}. Za ka iya taimaka min gane shi da biya shi?`,
      sw: `Nimepakia bili: ${file.name}. Unaweza kunisaidia kuelewa na kulipa?`,
      pcm: `I upload bill: ${file.name}. You fit help me understand am and pay am?`,
    }

    handleSendMessage(uploadTexts[language], true)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("iyabola-language", lang)
    if (narrator) {
      narrator.setLanguage(lang)
    }

    const langChangeMessages: Record<Language, string> = {
      en: "Language changed to English",
      yo: "Ti yi èdè sí Yorùbá",
      ig: "Agbanwela asụsụ ka ọ bụrụ Igbo",
      ha: "An canza harshe zuwa Hausa",
      sw: "Lugha imebadilishwa kuwa Kiswahili",
      pcm: "Language don change",
    }

    if (narrator && voiceEnabled) {
      narrator.speak(langChangeMessages[lang], "high")
    }
  }

  const toggleVoice = () => {
    const newState = !voiceEnabled
    setVoiceEnabled(newState)
    if (narrator) {
      narrator.setEnabled(newState)
      if (newState) {
        const enableMessages: Record<Language, string> = {
          en: "Voice assistant enabled",
          yo: "Olùrànlọ́wọ́ ohùn ti ṣiṣẹ́",
          ig: "Enyemaka olu agbanyere",
          ha: "An kunna mataimakin murya",
          sw: "Msaidizi wa sauti amewashwa",
          pcm: "Voice assistant don on",
        }
        narrator.speak(enableMessages[language])
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col relative">
      <div
        className="absolute inset-0 opacity-5 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: "url('/images/market-background.png')" }}
      />

      {/* Header */}
      <header className="bg-card/95 border-b border-border/50 sticky top-0 z-10 backdrop-blur-sm relative">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (narrator && voiceEnabled) {
                  narrator.speak("Going back to home", "high")
                }
                router.push("/home")
              }}
              className="rounded-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <Avatar className="w-10 h-10 border-2 border-primary/20">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">VA</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-bold">{userName}</h1>
              <p className="text-xs text-muted-foreground">Assistant ready to help</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleVoice}
              className={`rounded-full ${voiceEnabled ? "bg-primary/10" : ""}`}
              title={voiceEnabled ? "Voice On" : "Voice Off"}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {voiceEnabled ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                ) : (
                  <>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                    />
                  </>
                )}
              </svg>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="hidden sm:inline">{languageNames[language]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(Object.keys(languageNames) as Language[]).map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={language === lang ? "bg-accent" : ""}
                  >
                    {languageNames[lang]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-2 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <Avatar className="w-8 h-8 border-2 border-primary/20 flex-shrink-0">
                  <AvatarFallback
                    className={`text-xs font-semibold ${
                      message.role === "user"
                        ? "bg-accent text-accent-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {message.role === "user" ? "You" : "IA"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Card
                    className={`${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border/50"
                    }`}
                  >
                    <CardContent className="p-3">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </CardContent>
                  </Card>
                  <p className="text-xs text-muted-foreground mt-1 px-1">{formatTime(message.timestamp)}</p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[80%]">
                <Avatar className="w-8 h-8 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    IA
                  </AvatarFallback>
                </Avatar>
                <Card className="bg-card border-border/50">
                  <CardContent className="p-3">
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Quick Actions */}
      {messages.length <= 2 && (
        <div className="max-w-4xl mx-auto px-4 pb-4 relative">
          <p className="text-sm text-muted-foreground mb-3">Quick actions:</p>
          <div className="flex flex-wrap gap-2">
            {(pathname.startsWith("/bills")
              ? [
                  "Upload bill",
                  "Pay electricity",
                  "Help me read my bill",
                  "Explain my charges",
                  "Set a reminder to pay",
                ]
              : quickActionsTranslations[language]
            ).map((action) => (
              <Button
                key={action}
                variant="outline"
                size="sm"
                onClick={() => handleSendMessage(action, true)}
                className="rounded-full"
              >
                {action}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-card/95 border-t border-border/50 sticky bottom-0 backdrop-blur-sm relative">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full flex-shrink-0"
              title="Upload bill"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </Button>
            <Button
              variant={isRecording ? "default" : "outline"}
              size="icon"
              onClick={handleVoiceToggle}
              className={`rounded-full flex-shrink-0 ${
                isRecording ? "bg-destructive hover:bg-destructive/90 animate-pulse" : ""
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isRecording ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                )}
              </svg>
            </Button>
            <Input
              placeholder={isRecording ? "Listening..." : placeholders[language]}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(inputValue)
                }
              }}
              disabled={isRecording || isLoading}
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isRecording || isLoading}
              className="rounded-full flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </Button>
          </div>
          {isRecording && (
            <p className="text-xs text-center text-destructive mt-2 animate-pulse">Recording... Tap mic to stop</p>
          )}
        </div>
      </div>
    </div>
  )
}
