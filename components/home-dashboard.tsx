"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { t } from "@/lib/translations"
import { narrator } from "@/lib/voice-narrator"
import { formatCurrency } from "@/lib/number-formatter"

const actionTiles = [
  {
    title: "Send",
    href: "/send",
    color: "bg-primary",
    description: "Transfer money",
  },
  {
    title: "Bills",
    href: "/bills",
    color: "bg-accent",
    description: "Pay utilities",
  },
  {
    title: "Airtime",
    href: "/airtime",
    color: "bg-chart-3",
    description: "Buy airtime",
  },
  {
    title: "Save",
    href: "/save",
    color: "bg-chart-2",
    description: "Start saving",
  },
]

const extendedFeatures = [
  {
    title: "Education",
    href: "/education",
    icon: "📚",
    color: "bg-blue-500",
    description: "Financial education",
  },
  {
    title: "Agriculture",
    href: "/agriculture",
    icon: "🌾",
    color: "bg-green-500",
    description: "Farm services",
  },
  {
    title: "Government",
    href: "/government",
    icon: "🏛️",
    color: "bg-purple-500",
    description: "Gov services",
  },
]

const recentTransactions = [
  { id: 1, type: "sent", name: "Adebayo Okon", amount: 5000, date: "Today, 2:30 PM" },
  { id: 2, type: "received", name: "Chioma Nwankwo", amount: 12000, date: "Today, 11:15 AM" },
  { id: 3, type: "sent", name: "IKEDC Bill", amount: 8500, date: "Yesterday, 4:20 PM" },
]

export function HomeDashboard() {
  const [balanceVisible, setBalanceVisible] = useState(true)
  const { language } = useLanguage()
  const router = useRouter()
  const [userName, setUserName] = useState("User")
  const [balance] = useState(245680.5)

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("iyabola-authenticated")
    if (!isAuthenticated) {
      router.replace("/login")
      return
    }

    const userData = localStorage.getItem("iyabola-user")
    if (userData) {
      try {
        const user = JSON.parse(userData)
        const firstName = user.name.split(" ")[0]
        setUserName(firstName)

        if (narrator) {
          narrator.setLanguage(language)
          narrator.setEnabled(true)
          narrator.speak(`${t("welcomeBack", language)} ${firstName}`, "high")
        }
      } catch (error) {
        console.error("[v0] Error parsing user data:", error)
      }
    }
  }, [router, language])

  const handleLogout = () => {
    narrator?.speak(t("loggingOut", language), "high")
    localStorage.removeItem("iyabola-authenticated")
    setTimeout(() => {
      router.replace("/")
    }, 500)
  }

  const handleActionClick = (action: string) => {
    narrator?.speak(t("navigatingTo", language) + " " + action, "normal")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="bg-card border-b border-border/50 sticky top-0 z-10 backdrop-blur-sm bg-card/95">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">{userName}</h1>
              <p className="text-xs text-muted-foreground">
                {t("goodAfternoon", language)}, {userName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </Button>
            <Link href="/chat">
              <Button variant="ghost" size="icon">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </Button>
            <Avatar className="w-9 h-9 border-2 border-primary/20">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <Card className="bg-gradient-to-br from-primary to-accent border-0 text-primary-foreground shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-primary-foreground/80 text-sm mb-1">{t("totalBalance", language)}</p>
                <div className="flex items-center gap-3">
                  <h2 className="text-4xl font-bold">
                    {balanceVisible ? formatCurrency(balance, language) : "₦••••••••"}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={() => setBalanceVisible(!balanceVisible)}
                  >
                    {balanceVisible ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </Button>
                </div>
              </div>
              <div className="bg-primary-foreground/10 rounded-lg p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-primary-foreground/80">{t("thisMonth", language)}:</span>
              <span className="font-semibold">+₦12,450</span>
              <span className="text-primary-foreground/60">(+5.3%)</span>
            </div>
          </CardContent>
        </Card>

        <div>
          <h3 className="text-lg font-semibold mb-4">{t("quickActions", language)}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {actionTiles.map((action, idx) => (
              <Link key={action.title} href={action.href} onClick={() => handleActionClick(action.title)}>
                <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer border-primary/10">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                    <div className={`${action.color} w-14 h-14 rounded-2xl flex items-center justify-center`}>
                      {idx === 0 && (
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      )}
                      {idx === 1 && (
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      )}
                      {idx === 2 && (
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      )}
                      {idx === 3 && (
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 2 0 00-2 2v6a2 2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 2 0 00-2-2H9a2 2 2 0 00-2 2v6a2 2 2 0 013 3v1"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-base">{t(action.title.toLowerCase() as any, language)}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">More Services</h3>
          <div className="grid grid-cols-3 gap-4">
            {extendedFeatures.map((feature) => (
              <Link key={feature.title} href={feature.href} onClick={() => handleActionClick(feature.title)}>
                <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer border-primary/10">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                    <div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{t("recentTransactions", language)}</h3>
            <Button variant="ghost" size="sm" className="text-primary">
              {t("viewAll", language)}
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              {recentTransactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className={`flex items-center justify-between p-4 hover:bg-muted/50 transition-colors ${
                    index !== recentTransactions.length - 1 ? "border-b border-border/50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "sent" ? "bg-destructive/10" : "bg-primary/10"
                      }`}
                    >
                      {transaction.type === "sent" ? (
                        <svg className="w-5 h-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.name}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${transaction.type === "sent" ? "text-destructive" : "text-primary"}`}>
                    {transaction.type === "sent" ? "-" : "+"}
                    {formatCurrency(transaction.amount, language)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
