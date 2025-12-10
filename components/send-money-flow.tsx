"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Check, User, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { narrateAction, narrator } from "@/lib/voice-narrator"
import { useLanguage } from "@/lib/language-context"
import { generateReceipt, type Receipt } from "@/lib/receipt-generator"
import { ReceiptModal } from "@/components/receipt-modal"
import { numberToWords } from "@/lib/number-formatter"
import { t } from "@/lib/i18n"

const LOCALE_MAP: Record<string, string> = {
  en: "en-NG",
  yo: "yo-NG",
  ig: "ig-NG",
  ha: "ha-NG",
  sw: "sw-KE",
  tw: "ak-GH",  // Twi/Akan fallback
  pcm: "en-NG",
}
type Step = "recipient" | "amount" | "confirm" | "pin" | "success"
type Recipient = { id: number; name: string; account: string; bank: string }

const BANKS = [
  "Access Bank",
  "Citibank",
  "Ecobank",
  "FCMB",
  "Fidelity Bank",
  "First Bank",
  "GTBank",
  "Keystone Bank",
  "Polaris Bank",
  "Stanbic IBTC",
  "Sterling Bank",
  "UBA",
  "Union Bank",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
]

export function SendMoneyFlow() {
  const router = useRouter()
  const { language } = useLanguage()
  const [step, setStep] = useState<Step>("recipient")

  // ✅ recipients now in state so we can add new ones
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: 1, name: "Adebayo Okon", account: "0123456789", bank: "GTBank" },
    { id: 2, name: "Chioma Nwankwo", account: "9876543210", bank: "Access Bank" },
    { id: 3, name: "Emeka Okafor", account: "5555555555", bank: "Zenith Bank" },
    { id: 4, name: "Fatima Bello", account: "1111222233", bank: "First Bank" },
  ])

  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null)
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [pin, setPin] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [showReceipt, setShowReceipt] = useState(false)

  // 🔧 New recipient form controls
  const [showNewForm, setShowNewForm] = useState(false)
  const [newName, setNewName] = useState("")
  const [newAccount, setNewAccount] = useState("")
  const [newBank, setNewBank] = useState("")
  const [formError, setFormError] = useState<string | null>(null)

  const filteredRecipients = useMemo(
    () =>
      recipients.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.account.includes(searchQuery) ||
          r.bank.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [recipients, searchQuery],
  )

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

  const handleRecipientSelect = (recipient: Recipient) => {
    setSelectedRecipient(recipient)
    setStep("amount")
  }

  // Speak a single localized prompt when entering the PIN step (do not read digits)
  useEffect(() => {
    if (step === "pin") {
      const prompts: Record<string, string> = {
        en: "Please enter your 4-digit PIN",
        yo: "Jọ̀wọ́ tẹ PIN ìṣòwò rẹ díjììtì mẹ́rin",
        ig: "Biko tinye PIN gị nke akwụkwọ anọ",
        ha: "Don Allah shigar da lambar PIN ɗinka mai lamba huɗu",
        sw: "Tafadhali ingiza PIN yako ya tarakimu nne",
        pcm: "Abeg enter your 4-digit PIN",
        tw: "Me srɛ wo, hyɛ wo 4-nom PIN no",
      }
      narrator?.speak(prompts[language] || prompts.en, "high")
    }
  }, [step, language])

  const handleAmountSubmit = () => {
    if (amount && Number.parseFloat(amount) > 0) {
      setStep("confirm")
    }
  }

  const handleConfirm = () => setStep("pin")

  // Speak when entering confirm step
  useEffect(() => {
    if (step === "confirm") {
      const prompts: Record<string, string> = {
        en: "Confirm details. Please review the information before proceeding.",
        yo: "Jẹ́ kó dájú nípa alaye. Ṣàyẹwo gbogbo àwọn alaye kí o tó tẹ̀síwájú.",
        ig: "Kwenye nkọwa. Biko lelee ozi niile tupu ịga n’ihu.",
        ha: "Tabbatar da bayanai. Duba bayanai kafin ci gaba.",
        sw: "Thibitisha maelezo. Tafadhali kagua kabla ya kuendelea.",
        pcm: "Confirm details. Abeg check your info before you proceed.",
        tw: "Kyerɛw nsɛm no mu. Yɛsrɛ wo hwɛ nsɛm no yie ansa na w’etoa so.",
      }
      narrator?.speak(prompts[language] || prompts.en, "high")
    }
  }, [step, language])

  const handlePinSubmit = () => {
    if (pin.length === 4) {
      const newReceipt = generateReceipt({
        type: "transfer",
        amount: Number.parseFloat(amount),
        recipient: selectedRecipient?.name,
        recipientAccount: selectedRecipient?.account,
        recipientBank: selectedRecipient?.bank,
        note,
        fee: 0,
        total: Number.parseFloat(amount),
        status: "success",
      })

      setReceipt(newReceipt)
      setStep("success")
      setShowReceipt(true)
      narrateAction("transferSuccess", language)

      setTimeout(() => {
        router.push("/home")
      }, 3000)
    }
  }

  const handleBack = () => {
    if (step === "amount") setStep("recipient")
    else if (step === "confirm") setStep("amount")
    else if (step === "pin") setStep("confirm")
    else router.push("/home")
  }

  // ✅ Save new recipient
  const validateNewRecipient = () => {
    if (!newName.trim()) return "Please enter recipient name."
    if (!/^\d{10}$/.test(newAccount.trim())) return "Account number must be 10 digits."
    if (!newBank.trim()) return "Please select a bank."
    return null
  }

  const handleSaveNewRecipient = () => {
    const err = validateNewRecipient()
    if (err) {
      setFormError(err)
      return
    }
    const next: Recipient = {
      id: recipients.length ? Math.max(...recipients.map((r) => r.id)) + 1 : 1,
      name: newName.trim(),
      account: newAccount.trim(),
      bank: newBank.trim(),
    }
    setRecipients((prev) => [next, ...prev])
    setShowNewForm(false)
    setNewName("")
    setNewAccount("")
    setNewBank("")
    setFormError(null)

    // Auto-select and move forward to amount
    setSelectedRecipient(next)
    setStep("amount")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        {step !== "success" && (
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Send Money</h1>
              <p className="text-sm text-muted-foreground">
                {step === "recipient" && "Select recipient"}
                {step === "amount" && "Enter amount"}
                {step === "confirm" && "Confirm details"}
                {step === "pin" && "Enter PIN"}
              </p>
            </div>
          </div>
        )}

        {/* Step Indicator */}
        {step !== "success" && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {["recipient", "amount", "confirm", "pin"].map((s, index) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    step === s
                      ? "bg-primary text-primary-foreground"
                      : ["recipient", "amount", "confirm", "pin"].indexOf(step) >
                        ["recipient", "amount", "confirm", "pin"].indexOf(s)
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {["recipient", "amount", "confirm", "pin"].indexOf(step) >
                  ["recipient", "amount", "confirm", "pin"].indexOf(s) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 3 && (
                  <div
                    className={`w-12 h-1 mx-1 rounded transition-colors ${
                      ["recipient", "amount", "confirm", "pin"].indexOf(step) > index ? "bg-primary/20" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Recipient Selection */}
        {step === "recipient" && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Select Recipient</CardTitle>
              <CardDescription>Choose from recent recipients or add new</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, account, or bank"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2">
                {filteredRecipients.map((recipient) => (
                  <button
                    key={recipient.id}
                    onClick={() => handleRecipientSelect(recipient)}
                    className="w-full flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
                  >
                    <Avatar className="w-12 h-12 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(recipient.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{recipient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {recipient.account} • {recipient.bank}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Add New Recipient toggle */}
              {!showNewForm ? (
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setShowNewForm(true)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Add New Recipient
                </Button>
              ) : null}

              {/* Inline New Recipient Form */}
              {showNewForm && (
                <div className="rounded-lg border border-dashed p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newName">Full Name</Label>
                      <Input
                        id="newName"
                        placeholder="e.g., Aisha Yusuf"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newAccount">Account Number</Label>
                      <Input
                        id="newAccount"
                        placeholder="10-digit account"
                        inputMode="numeric"
                        maxLength={10}
                        value={newAccount}
                        onChange={(e) => setNewAccount(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="newBank">Bank</Label>
                      {/* simple select using Input + datalist for minimal deps */}
                      <Input
                        id="newBank"
                        list="bank-list"
                        placeholder="Select bank"
                        value={newBank}
                        onChange={(e) => setNewBank(e.target.value)}
                      />
                      <datalist id="bank-list">
                        {BANKS.map((b) => (
                          <option key={b} value={b} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  {formError ? <p className="text-sm text-red-600">{formError}</p> : null}

                  <div className="flex gap-2">
                    <Button onClick={handleSaveNewRecipient} className="flex-1">
                      Save & Continue
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowNewForm(false)
                        setFormError(null)
                        setNewName("")
                        setNewAccount("")
                        setNewBank("")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Amount Entry */}
        {step === "amount" && selectedRecipient && (
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="w-12 h-12 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getInitials(selectedRecipient.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{selectedRecipient.name}</CardTitle>
                  <CardDescription>
                    {selectedRecipient.account} • {selectedRecipient.bank}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-base">
                  Amount
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">
                    ₦
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10 text-3xl font-bold h-16 text-center"
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">Available balance: ₦245,680.50</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Note (Optional)</Label>
                <Input
                  id="note"
                  placeholder="What's this for?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[1000, 5000, 10000].map((preset) => (
                  <Button key={preset} variant="outline" onClick={() => setAmount(preset.toString())} className="h-12">
                    ₦{preset.toLocaleString()}
                  </Button>
                ))}
              </div>

              <Button
                className="w-full h-12 text-base font-semibold"
                onClick={handleAmountSubmit}
                disabled={!amount || Number.parseFloat(amount) <= 0}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Confirmation */}
        {step === "confirm" && selectedRecipient && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Confirm Transaction</CardTitle>
              <CardDescription>Please review the details before proceeding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Recipient</span>
                  <div className="text-right">
                    <p className="font-semibold">{selectedRecipient.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedRecipient.account} • {selectedRecipient.bank}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-4 flex justify-between items-center">
                  <span className="text-muted-foreground">Amount</span>
                  <p className="text-2xl font-bold text-primary">₦{Number.parseFloat(amount).toLocaleString()}</p>
                </div>

                {note && (
                  <div className="border-t border-border pt-4 flex justify-between items-start">
                    <span className="text-muted-foreground">Note</span>
                    <p className="text-right max-w-[200px]">{note}</p>
                  </div>
                )}

                <div className="border-t border-border pt-4 flex justify-between items-center">
                  <span className="text-muted-foreground">Fee</span>
                  <p className="font-semibold">₦0.00</p>
                </div>

                <div className="border-t-2 border-border pt-4 flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <p className="text-2xl font-bold">₦{Number.parseFloat(amount).toLocaleString()}</p>
                </div>
              </div>

              <Button className="w-full h-12 text-base font-semibold" onClick={handleConfirm}>
                Proceed to Payment
              </Button>
            </CardContent>
          </Card>
        )}

        {/* PIN Entry */}
        {step === "pin" && (
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle>Enter PIN</CardTitle>
              <CardDescription>Enter your 4-digit transaction PIN</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                      pin.length > index
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground"
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

              <Button
                className="w-full h-12 text-base font-semibold"
                onClick={handlePinSubmit}
                disabled={pin.length !== 4}
              >
                Send Money
              </Button>

              <p className="text-xs text-center text-muted-foreground">Your PIN is encrypted and secure</p>
            </CardContent>
          </Card>
        )}

        {/* Success */}
        {step === "success" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center animate-scale-in">
              <Check className="w-12 h-12 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-balance">Transfer Successful!</h2>
              <p className="text-muted-foreground text-lg">
                ₦{Number.parseFloat(amount).toLocaleString()} sent to {selectedRecipient?.name}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">Redirecting to home...</p>
          </div>
        )}
      </div>
      <ReceiptModal receipt={receipt} open={showReceipt} onClose={() => setShowReceipt(false)} />
    </div>
  )
}
