"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { narrator } from "@/lib/voice-narrator"

export default function GovernmentPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [referenceNumber, setReferenceNumber] = useState("")

  const services = [
    { title: "Tax Payment", icon: "🏛️", color: "bg-blue-500", description: "Pay your taxes online" },
    { title: "License Renewal", icon: "📜", color: "bg-green-500", description: "Renew driver's license" },
    { title: "Land Registry", icon: "🏘️", color: "bg-purple-500", description: "Land registration fees" },
    { title: "Court Fees", icon: "⚖️", color: "bg-red-500", description: "Pay court-related fees" },
    { title: "Health Insurance", icon: "🏥", color: "bg-yellow-500", description: "NHIS contributions" },
    { title: "Pension", icon: "👴", color: "bg-orange-500", description: "Pension contributions" },
  ]

  const handlePayment = () => {
    if (narrator) {
      narrator.speak(`Processing payment for ${selectedService}`, "high")
    }
    setTimeout(() => {
      if (narrator) {
        narrator.speak("Payment successful!", "high")
      }
      alert("Payment successful!")
      setSelectedService(null)
      setReferenceNumber("")
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
            <h1 className="text-2xl font-bold">Government Services</h1>
            <p className="text-sm text-muted-foreground">Pay for government services</p>
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
              <CardDescription>Enter your reference number</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reference">Reference Number</Label>
                <Input
                  id="reference"
                  type="text"
                  placeholder="Enter reference number"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                />
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Amount will be calculated based on your reference number
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setSelectedService(null)
                    setReferenceNumber("")
                    narrator?.speak("Cancelled", "high")
                  }}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handlePayment} disabled={!referenceNumber}>
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
