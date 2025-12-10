"use client"

import { useState } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { narrateAction, narrator } from "@/lib/voice-narrator"
import { useLanguage } from "@/lib/language-context"
import { generateReceipt, type Receipt } from "@/lib/receipt-generator"
import { ReceiptModal } from "@/components/receipt-modal"
import { t } from "@/lib/translations"

export default function AirtimePage() {
  const router = useRouter()
  const { language } = useLanguage()
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [amount, setAmount] = useState("")
  const [pin, setPin] = useState("")
  const [step, setStep] = useState<"network" | "details" | "pin" | "success">("network")
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [showReceipt, setShowReceipt] = useState(false)
  
  const confirmPrompts: Record<string, string> = {
    en: "Confirm details. Please review the information before proceeding.",
    yo: "Jẹ́ kó dájú nípa alaye. Ṣàyẹwo gbogbo àwọn alaye kí o tó tẹ̀síwájú.",
    ig: "Kwenye nkọwa. Biko lelee ozi niile tupu ịga n’ihu.",
    ha: "Tabbatar da bayanai. Duba bayanai kafin ci gaba.",
    sw: "Thibitisha maelezo. Tafadhali kagua kabla ya kuendelea.",
    pcm: "Confirm details. Abeg check your info before you proceed.",
  }

  const networks = [
    { name: "MTN", color: "bg-yellow-400" },
    { name: "Airtel", color: "bg-red-500" },
    { name: "Glo", color: "bg-green-500" },
    { name: "9mobile", color: "bg-emerald-600" },
  ]

  const handleNetworkSelect = (network: string) => {
    setSelectedNetwork(network)
    setStep("details")
    narrateAction(`selectedNetwork${network}`, language)
  }

  const handleContinue = () => {
    if (phoneNumber && amount) {
      // Before PIN, remind to confirm details
      const msg = confirmPrompts[language] || confirmPrompts.en
      narrator?.speak(msg, "high")
      setStep("pin")
      narrateAction("enteringPin", language)
    }
  }

  const handlePurchase = () => {
    if (pin.length === 4) {
      // Generate receipt
      const newReceipt = generateReceipt({
        type: "airtime",
        amount: Number.parseFloat(amount),
        network: selectedNetwork || "",
        phoneNumber,
        fee: 0,
        total: Number.parseFloat(amount),
        status: "success",
      })

      setReceipt(newReceipt)
      setStep("success")
      setShowReceipt(true)
      narrateAction("airtimePurchaseSuccess", language)

      setTimeout(() => {
        router.push("/home")
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        {step !== "success" && (
          <div className="flex items-center gap-4 mb-6">
            <Link href="/home">
              <Button variant="ghost" size="icon" className="rounded-full">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">{t("buyAirtime", language)}</h1>
          </div>
        )}

        {/* Network Selection */}
        {step === "network" && (
          <div className="grid grid-cols-2 gap-4">
            {networks.map((network) => (
              <Card
                key={network.name}
                className="hover:shadow-lg transition-all cursor-pointer hover:border-primary"
                onClick={() => handleNetworkSelect(network.name)}
              >
                <CardHeader>
                  <div className={`${network.color} w-12 h-12 rounded-xl flex items-center justify-center mb-2`}>
                    <span className="text-white font-bold text-lg">{network.name[0]}</span>
                  </div>
                  <CardTitle className="text-lg">{network.name}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Details Entry */}
        {step === "details" && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>
                {selectedNetwork ? `${selectedNetwork} ${t("buyAirtime", language)}` : t("buyAirtime", language)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone">{t("phoneNumber", language)}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="080XXXXXXXX"
                  value={phoneNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                  maxLength={11}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">{t("amountLabel", language)}</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold">₦</span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                    className="pl-10 text-xl font-bold h-14"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[100, 200, 500].map((preset) => (
                  <Button key={preset} variant="outline" onClick={() => setAmount(preset.toString())}>
                    ₦{preset}
                  </Button>
                ))}
              </div>

              <Button
                className="w-full h-12"
                onClick={handleContinue}
                disabled={!phoneNumber || !amount || Number.parseFloat(amount) <= 0}
              >
                {t("continue", language)}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* PIN Entry */}
        {step === "pin" && (
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle>Enter PIN</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center text-2xl font-bold ${
                      pin.length > index ? "border-primary bg-primary/10" : "border-border"
                    }`}
                  >
                    {pin.length > index ? "•" : ""}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"].map((num, index) => (
                  <Button
                    key={index}
                    variant={num === "" ? "ghost" : "outline"}
                    className="h-16 text-xl font-semibold"
                    disabled={num === ""}
                    onClick={() => {
                      if (num === "⌫") {
                        setPin(pin.slice(0, -1))
                      } else if (typeof num === "number" && pin.length < 4) {
                        setPin(pin + num)
                      }
                    }}
                  >
                    {num}
                  </Button>
                ))}
              </div>

              <Button className="w-full h-12" onClick={handlePurchase} disabled={pin.length !== 4}>
                {t("purchaseAirtime", language)}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Success */}
        {step === "success" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Purchase Successful!</h2>
              <p className="text-muted-foreground text-lg">
                ₦{Number.parseFloat(amount).toLocaleString()} {selectedNetwork} airtime sent to {phoneNumber}
              </p>
            </div>
          </div>
        )}
      </div>

      <ReceiptModal receipt={receipt} open={showReceipt} onClose={() => setShowReceipt(false)} />
    </div>
  )
}
