"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

export default function TeamPage() {
  const router = useRouter()

  const members = [
    {
      name: "Micheal ADEOLU OLATUNBOSUN",
      role: "CEO",
      email: "michealolatunbosun368@gmail.com",
      initials: "MO",
      color: "bg-emerald-600 text-emerald-50",
    },
    {
      name: "BASHAR ABDULSALAM",
      role: "CO FOUNDER",
      email: "salam@octaveanalytics.com",
      initials: "BA",
      color: "bg-blue-600 text-blue-50",
    },
    {
      name: "Ifeoluwa Bankole",
      role: "Technical Developer",
      email: "ifeoluwa.bankola@tech-u.edu.ng",
      initials: "IB",
      color: "bg-amber-600 text-amber-50",
    },
    {
      name: "Blessing Olaniyi",
      role: "Data Analyst",
      email: "blessing2@octaveanalytics.com",
      initials: "BO",
      color: "bg-purple-600 text-purple-50",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-background/65 to-accent/15 backdrop-blur-sm -z-10" />

      <div className="w-full max-w-4xl space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider animate-pulse mb-2">
            Beta Testing State
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
            Meet the{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
              Dynamite Team
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            The minds behind AfriVoicePay, bringing inclusive, voice-enabled financial banking to everyone across Africa.
          </p>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {members.map((member) => (
            <Card key={member.name} className="shadow-lg border-primary/5 hover:border-primary/20 bg-card/90 backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl">
              <CardHeader className="flex flex-row items-center gap-4 pb-3">
                <Avatar className={`h-14 w-14 rounded-full flex items-center justify-center font-bold text-xl ${member.color}`}>
                  <AvatarFallback className="bg-transparent">{member.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl font-bold">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-semibold text-sm tracking-wide mt-0.5">{member.role}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {member.email ? (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Contact Email</p>
                    <a href={`mailto:${member.email}`} className="text-sm font-medium text-primary hover:underline transition-colors block break-all">
                      {member.email}
                    </a>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Contact Email</p>
                    <span className="text-sm text-muted-foreground/60 italic">Not listed</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Back Actions */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={() => router.push("/")}
            size="lg"
            className="h-12 px-8 text-base font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
