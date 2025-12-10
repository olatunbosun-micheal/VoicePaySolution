"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { narrator } from "@/lib/voice-narrator"

export default function AgriculturePage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [amount, setAmount] = useState("")

  const services = [
    { title: "Buy Seeds", icon: "🌱", color: "bg-green-500", description: "Purchase quality seeds for farming" },
    { title: "Buy Fertilizer", icon: "🧪", color: "bg-blue-500", description: "Get fertilizer for better yields" },
    { title: "Equipment Rental", icon: "🚜", color: "bg-yellow-500", description: "Rent farming equipment" },
    { title: "Crop Insurance", icon: "🛡️", color: "bg-purple-500", description: "Protect your crops" },
    { title: "Market Prices", icon: "📊", color: "bg-orange-500", description: "Check current market prices" },
    { title: "Farm Loans", icon: "💵", color: "bg-red-500", description: "Apply for agricultural loans" },
  ]

  const handlePayment = () => {
    if (narrator) {
      narrator.speak(`Processing payment of ${amount} Naira for ${selectedService}`, "high")
    }
    setTimeout(() => {
      if (narrator) {
        narrator.speak("Payment successful!", "high")
      }
      alert("Payment successful!")
      setSelectedService(null)
      setAmount("")
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
              onClick={() => narrator?.speak("Going back to home", "high")}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Agriculture Services</h1>
            <p className="text-sm text-muted-foreground">Support for farmers</p>
          </div>
        </div>

        {!selectedService ? (
          <div className="grid grid-cols-2 gap-4">
            {services.map((service) => (
              <Card
                key={service.title}
                className="hover:shadow-lg transition-all cursor-pointer"
                onClick={() => {
                  setSelectedService(service.title)
                  narrator?.speak(`You selected ${service.title}`, "high")
                }}
              >
                <CardHeader>
                  <div
                    className={`${service.color} w-12 h-12 rounded-xl flex items-center justify-center mb-2 text-2xl`}
                  >
                    {service.icon}
                  </div>
                  <CardTitle className="text-base">{service.title}</CardTitle>
                  <CardDescription className="text-xs">{service.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{selectedService}</CardTitle>
              <CardDescription>Enter payment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-xl font-semibold"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setSelectedService(null)
                    setAmount("")
                    narrator?.speak("Cancelled", "high")
                  }}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handlePayment} disabled={!amount || Number.parseFloat(amount) <= 0}>
                  Pay Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
