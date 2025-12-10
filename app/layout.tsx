import type React from "react"
import type { Metadata } from "next"
import { Nunito, Inter } from "next/font/google"
import "./globals.css"
import { Suspense } from "react"
import { LanguageProvider } from "@/lib/language-context"
import AIGuideWidget from "@/components/ai-guide-widget"
import PageGuide from "@/components/page-guide"
import AuthGuard from "@/components/auth-guard"

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "VoicePay — Inclusive Voice Banking",
  description: "Send money, pay bills, buy airtime and save with VoicePay",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${nunito.variable} ${inter.variable} antialiased`}>
        <LanguageProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <AIGuideWidget />
          <PageGuide />
          <AuthGuard />
        </LanguageProvider>
      </body>
    </html>
  )
}
