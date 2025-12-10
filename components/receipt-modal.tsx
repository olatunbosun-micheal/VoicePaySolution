"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Receipt } from "@/lib/receipt-generator"
import { downloadReceiptImage, formatReceiptText } from "@/lib/receipt-generator"
import { useLanguage } from "@/lib/language-context"
import { narrateAction } from "@/lib/voice-narrator"
import { useState } from "react"

interface ReceiptModalProps {
  receipt: Receipt | null
  open: boolean
  onClose: () => void
}

export function ReceiptModal({ receipt, open, onClose }: ReceiptModalProps) {
  const { language } = useLanguage()
  const [isDownloading, setIsDownloading] = useState(false)

  if (!receipt) return null

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      await downloadReceiptImage(receipt, language)
      narrateAction("downloadingReceipt", language)
    } catch (error) {
      console.error("Error downloading receipt:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleReadAloud = () => {
    const text = formatReceiptText(receipt, language)
    narrateAction("readingReceipt", language)

    // Read the receipt aloud
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang =
        language === "yo"
          ? "yo-NG"
          : language === "ig"
            ? "ig-NG"
            : language === "ha"
              ? "ha-NE"
              : language === "sw"
                ? "sw-KE"
                : language === "tw"
                  ? "tw-GH"
                  : language === "pcm"
                    ? "en-NG"
                    : "en-NG"
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {language === "en" && "Transaction Receipt"}
            {language === "yo" && "Ìwé-ẹ̀rí Ìdúnàdúrà"}
            {language === "ig" && "Akwụkwọ Azụmahịa"}
            {language === "ha" && "Takardar Ciniki"}
            {language === "sw" && "Risiti ya Muamala"}
            {language === "pcm" && "Transaction Receipt"}
          </DialogTitle>
        </DialogHeader>

        <Card className="p-6 space-y-4 bg-muted/30">
          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Receipt Details */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reference:</span>
              <span className="font-mono font-semibold">{receipt.reference}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span>{receipt.date.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-semibold capitalize">{receipt.type}</span>
            </div>

            {receipt.recipient && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recipient:</span>
                <span className="font-semibold">{receipt.recipient}</span>
              </div>
            )}

            {receipt.network && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network:</span>
                <span className="font-semibold">{receipt.network}</span>
              </div>
            )}

            {receipt.phoneNumber && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-semibold">{receipt.phoneNumber}</span>
              </div>
            )}

            <div className="border-t pt-3 flex justify-between text-lg">
              <span className="font-semibold">Amount:</span>
              <span className="font-bold text-primary">₦{receipt.amount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Fee:</span>
              <span>₦{receipt.fee.toLocaleString()}</span>
            </div>

            <div className="border-t pt-3 flex justify-between text-xl">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-primary">₦{receipt.total.toLocaleString()}</span>
            </div>

            <div className="flex justify-center pt-2">
              <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase">
                {receipt.status}
              </span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={handleReadAloud} className="w-full bg-transparent">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
            Read Aloud
          </Button>

          <Button onClick={handleDownload} className="w-full" disabled={isDownloading}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            {isDownloading ? "Downloading..." : "Download Image"}
          </Button>
        </div>

        <Button variant="ghost" onClick={onClose} className="w-full">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  )
}
