"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { narrateAction, narrator } from "@/lib/voice-narrator"
import { useLanguage } from "@/lib/language-context"
import { generateReceipt, type Receipt } from "@/lib/receipt-generator"
import { ReceiptModal } from "@/components/receipt-modal"

export default function SavePage() {
  const router = useRouter()
  const { language } = useLanguage()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [amount, setAmount] = useState("")
  const [goalName, setGoalName] = useState("")
  const [pin, setPin] = useState("")
  const [step, setStep] = useState<"plan" | "details" | "pin" | "success">("plan")
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [showReceipt, setShowReceipt] = useState(false)

  const savingsPlans = [
    {
      title: "Target Savings",
      description: "Save towards a specific goal",
      color: "bg-primary",
    },
    {
      title: "Fixed Savings",
      description: "Lock funds for better returns",
      color: "bg-accent",
    },
    {
      title: "Flexible Savings",
      description: "Save and withdraw anytime",
      color: "bg-chart-3",
    },
  ]

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan)
    setStep("details")
    narrateAction(`selectedSavingsPlan`, language)
  }

  const handleContinue = () => {
    if (amount && goalName) {
      // Announce confirm details before PIN
      const confirmPrompts: Record<string, string> = {
        en: "Confirm details. Please review the information before proceeding.",
        yo: "Jẹ́ kó dájú nípa alaye. Ṣàyẹwo gbogbo àwọn alaye kí o tó tẹ̀síwájú.",
        ig: "Kwenye nkọwa. Biko lelee ozi niile tupu ịga n’ihu.",
        ha: "Tabbatar da bayanai. Duba bayanai kafin ci gaba.",
        sw: "Thibitisha maelezo. Tafadhali kagua kabla ya kuendelea.",
        pcm: "Confirm details. Abeg check your info before you proceed.",
      }
      narrator?.speak(confirmPrompts[language] || confirmPrompts.en, "high")
      setStep("pin")
      narrateAction("enteringPin", language)
    }
  }

  const handleSave = () => {
    if (pin.length === 4) {
      const newReceipt = generateReceipt({
        type: "savings",
        amount: Number.parseFloat(amount),
        savingsPlan: selectedPlan || "",
        note: goalName,
        fee: 0,
        total: Number.parseFloat(amount),
        status: "success",
      })

      setReceipt(newReceipt)
      setStep("success")
      setShowReceipt(true)
      narrateAction("savingsSuccess", language)

      setTimeout(() => {
        router.push("/home")
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="max-w-2xl mx-auto py-8">
        {step !== "success" && (
          <div className="flex items-center gap-4 mb-6">
            <Link href="/home">
              <Button variant="ghost" size="icon" className="rounded-full">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Savings Plans</h1>
          </div>
        )}

        {/* Plan Selection */}
        {step === "plan" && (
          <div className="space-y-4">
            {savingsPlans.map((plan) => (
              <Card
                key={plan.title}
                className="hover:shadow-lg transition-all cursor-pointer hover:border-primary"
                onClick={() => handlePlanSelect(plan.title)}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`${plan.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{plan.title}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Details Entry */}
        {step === "details" && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{selectedPlan}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="goalName">Goal Name</Label>
                <Input
                  id="goalName"
                  placeholder="e.g., New Phone, School Fees"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount to Save</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold">₦</span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10 text-xl font-bold h-14"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[1000, 5000, 10000].map((preset) => (
                  <Button key={preset} variant="outline" onClick={() => setAmount(preset.toString())}>
                    ₦{preset.toLocaleString()}
                  </Button>
                ))}
              </div>

              <Button
                className="w-full h-12"
                onClick={handleContinue}
                disabled={!amount || !goalName || Number.parseFloat(amount) <= 0}
              >
                Continue
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

              <Button className="w-full h-12" onClick={handleSave} disabled={pin.length !== 4}>
                Save Money
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
              <h2 className="text-3xl font-bold">Savings Successful!</h2>
              <p className="text-muted-foreground text-lg">
                ₦{Number.parseFloat(amount).toLocaleString()} saved to {goalName}
              </p>
            </div>
          </div>
        )}
      </div>

      <ReceiptModal receipt={receipt} open={showReceipt} onClose={() => setShowReceipt(false)} />
    </div>
  )
}
