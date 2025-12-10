"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { narrator } from "@/lib/voice-narrator"
import { useLanguage } from "@/lib/language-context"
import { formatCurrency, numberToWords } from "@/lib/number-formatter"

export default function BillsPage() {
  const { language } = useLanguage()
  const [selectedBill, setSelectedBill] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [billDetails, setBillDetails] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const speech = {
    en: {
      analyzing: "Analyzing your bill. Please wait.",
      analyzed: (amt: string, prov: string, due: string) => `Bill analyzed. You owe ${amt} to ${prov}. Due date is ${due}.`,
      back: "Going back to home",
      selectUpload: "Select a bill image to upload",
      selected: (t: string) => `You selected ${t} bill`,
      cancelled: "Bill cancelled",
      processing: "Processing payment. Please wait.",
      success: "Payment successful!",
    },
    yo: {
      analyzing: "Ìtọ́nisọ́nà ìwé-owó. Jọ̀wọ́ dúró díẹ̀.",
      analyzed: (amt: string, prov: string, due: string) => `A ti ṣe àyẹ̀wò. O jẹ́gbese ${amt} sí ${prov}. Ọjọ́ ìparí ni ${due}.`,
      back: "Padà sí ilé",
      selectUpload: "Yan àwòrán ìwé-owó láti gbé sórí",
      selected: (t: string) => `O yan ìwé-owó ${t}`,
      cancelled: "A fagilé ìsanwó",
      processing: "N ṣe ìsanwó. Jọ̀wọ́ dúró díẹ̀.",
      success: "Ìsanwó ṣàṣeyọrí!",
    },
    ig: {
      analyzing: "Na-enyocha ụgwọ gị. Biko chere ntakịrị.",
      analyzed: (amt: string, prov: string, due: string) => `Enyochaala. Ị ga-akwụ ${amt} nye ${prov}. Ụbọchị ngwụcha bụ ${due}.`,
      back: "Laghachi n’ụlọ",
      selectUpload: "Họrọ onyonyo ụgwọ ka ebunye",
      selected: (t: string) => `Họrọ ụgwọ ${t}`,
      cancelled: "E kagburu",
      processing: "Na-eme nhazi ịkwụ ụgwọ. Biko chere ntakịrị.",
      success: "Ịkwụ ụgwọ gara nke ọma!",
    },
    ha: {
      analyzing: "Ana a nazari takardun kuɗi. Da fatan a jira ɗan kaɗan.",
      analyzed: (amt: string, prov: string, due: string) => `An gama nazari. Kana bin bashin ${amt} ga ${prov}. Ranar ƙarshe ita ce ${due}.`,
      back: "Komawa gida",
      selectUpload: "Zaɓi hoto na biya da za a ɗora",
      selected: (t: string) => `Ka zaɓi ${t}`,
      cancelled: "An soke",
      processing: "Ana aiwatar da biyan kuɗi. Da fatan a jira ɗan kaɗan.",
      success: "Biyan kuɗi ya yi nasara!",
    },
    sw: {
      analyzing: "Inachambua bili yako. Tafadhali subiri.",
      analyzed: (amt: string, prov: string, due: string) => `Imechambua. Unadaiwa ${amt} kwa ${prov}. Tarehe ya mwisho ni ${due}.`,
      back: "Rudi nyumbani",
      selectUpload: "Chagua picha ya bili upakie",
      selected: (t: string) => `Umechagua bili ya ${t}`,
      cancelled: "Imebatilishwa",
      processing: "Inachakata malipo. Tafadhali subiri.",
      success: "Malipo yamefanikiwa!",
    },
    pcm: {
      analyzing: "We dey check your bill. Abeg wait small.",
      analyzed: (amt: string, prov: string, due: string) => `We don check am. You dey owe ${amt} to ${prov}. Due date na ${due}.`,
      back: "Go back house",
      selectUpload: "Choose bill image to upload",
      selected: (t: string) => `You choose ${t} bill`,
      cancelled: "Cancel am",
      processing: "We dey process payment. Abeg wait small.",
      success: "Payment don go!",
    },
    tw: {
      analyzing: "Yɛresɔ bill no mu. Me srɛ wo twɛn kakra.",
      analyzed: (amt: string, prov: string, due: string) => `Yɛasɔ no mu. Wo wɔ ka ${amt} ma ${prov}. Ɛda kɔne no ne ${due}.`,
      back: "San kɔ fie",
      selectUpload: "Paw bill mfonini na tow so",
      selected: (t: string) => `Wo apaw ${t} bill`,
      cancelled: "Wɔee no",
      processing: "Yɛrehyehyɛ sika tua no. Me srɛ wo twɛn kakra.",
      success: "Sika tua no so yiye!",
    },
  } as const
  const L = speech[language] || speech.en
  const confirmPrompts: Record<string, string> = {
    en: "Confirm details. Please review the information before proceeding.",
    yo: "Jẹ́ kó dájú nípa alaye. Ṣàyẹwo gbogbo àwọn alaye kí o tó tẹ̀síwájú.",
    ig: "Kwenye nkọwa. Biko lelee ozi niile tupu ịga n’ihu.",
    ha: "Tabbatar da bayanai. Duba bayanai kafin ci gaba.",
    sw: "Thibitisha maelezo. Tafadhali kagua kabla ya kuendelea.",
    pcm: "Confirm details. Abeg check your info before you proceed.",
    tw: "Kyerɛw nsɛm no mu. Yɛsrɛ wo hwɛ nsɛm no yie ansa na w’etoa so.",
  }

  const billTypes = [
    { title: "Electricity", icon: "⚡", color: "bg-yellow-500" },
    { title: "Water", icon: "💧", color: "bg-blue-500" },
    { title: "Internet", icon: "📡", color: "bg-purple-500" },
    { title: "Cable TV", icon: "📺", color: "bg-red-500" },
    { title: "Upload Bill", icon: "📄", color: "bg-green-500" },
  ]

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    narrator?.speak(L.analyzing, "high")

    const reader = new FileReader()
    reader.onload = async (e) => {
      const imageData = e.target?.result as string
      setUploadedImage(imageData)
      setAnalyzing(true)

      // Simulate bill analysis
      setTimeout(() => {
        const amountNumber = 15750
        const mockBillDetails = {
          provider: "EKEDC",
          accountNumber: "1234567890",
          amountNumber,
          amountText: formatCurrency(amountNumber, language),
          amountWords: numberToWords(amountNumber, language),
          dueDate: "Dec 31, 2024",
          billType: "Electricity",
        }
        setBillDetails(mockBillDetails)
        setAnalyzing(false)

        narrator?.speak(L.analyzed(mockBillDetails.amountText, mockBillDetails.provider, mockBillDetails.dueDate), "high")
        // Prompt user to confirm details before paying
        const confirmMsg = confirmPrompts[language] || confirmPrompts.en
        setTimeout(() => narrator?.speak(confirmMsg, "high"), 400)
      }, 2000)
    }
    reader.readAsDataURL(file)
  }

  const handlePayBill = () => {
    narrator?.speak(L.processing, "high")
    setTimeout(() => {
      narrator?.speak(L.success, "high")
      alert(L.success)
      setUploadedImage(null)
      setBillDetails(null)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/home">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => narrator?.speak(L.back, "high")}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Pay Bills</h1>
        </div>

        {!uploadedImage ? (
          <div className="grid grid-cols-2 gap-4">
            {billTypes.map((bill) => (
              <Card
                key={bill.title}
                className="hover:shadow-lg transition-all cursor-pointer"
                onClick={() => {
                  if (bill.title === "Upload Bill") {
                    fileInputRef.current?.click()
                    narrator?.speak(L.selectUpload, "high")
                  } else {
                    setSelectedBill(bill.title)
                    narrator?.speak(L.selected(bill.title), "high")
                  }
                }}
              >
                <CardHeader>
                  <div className={`${bill.color} w-12 h-12 rounded-xl flex items-center justify-center mb-2 text-2xl`}>
                    {bill.icon}
                  </div>
                  <CardTitle className="text-lg">{bill.title}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Bill Analysis</CardTitle>
              <CardDescription>Review your bill details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Uploaded bill"
                  className="w-full h-full object-contain"
                />
              </div>

              {analyzing ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
                  <p className="mt-4 text-muted-foreground">Analyzing bill...</p>
                </div>
              ) : billDetails ? (
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Provider</span>
                      <span className="font-semibold">{billDetails.provider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Number</span>
                      <span className="font-semibold">{billDetails.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bill Type</span>
                      <span className="font-semibold">{billDetails.billType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Due Date</span>
                      <span className="font-semibold">{billDetails.dueDate}</span>
                    </div>
                    <div className="border-t-2 border-border pt-3 flex justify-between items-center">
                      <span className="font-semibold text-lg">Amount Due</span>
                      <span className="text-2xl font-bold text-primary">{billDetails.amountText}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{billDetails.amountWords}</div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => {
                        setUploadedImage(null)
                        setBillDetails(null)
                        narrator?.speak(L.cancelled, "high")
                      }}
                    >
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={handlePayBill}>
                      Pay Now
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
      </div>
    </div>
  )
}
