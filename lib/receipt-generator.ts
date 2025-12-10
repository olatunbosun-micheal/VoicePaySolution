export interface Receipt {
  id: string
  type: "transfer" | "airtime" | "bills" | "savings"
  amount: number
  recipient?: string
  recipientAccount?: string
  recipientBank?: string
  network?: string
  phoneNumber?: string
  savingsPlan?: string
  note?: string
  fee: number
  total: number
  date: Date
  status: "success" | "pending" | "failed"
  reference: string
}

export function generateReceipt(data: Omit<Receipt, "id" | "date" | "reference">): Receipt {
  const id = `RCP${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  const reference = `REF${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`

  return {
    ...data,
    id,
    date: new Date(),
    reference,
  }
}

export function formatReceiptText(receipt: Receipt, language: string): string {
  const dateStr = receipt.date.toLocaleString()

  let text = ""

  if (language === "en") {
    text = `Transaction Receipt\n\n`
    text += `Reference: ${receipt.reference}\n`
    text += `Date: ${dateStr}\n`
    text += `Type: ${receipt.type.toUpperCase()}\n`
    text += `Amount: ₦${receipt.amount.toLocaleString()}\n`

    if (receipt.recipient) text += `Recipient: ${receipt.recipient}\n`
    if (receipt.recipientAccount) text += `Account: ${receipt.recipientAccount}\n`
    if (receipt.recipientBank) text += `Bank: ${receipt.recipientBank}\n`
    if (receipt.network) text += `Network: ${receipt.network}\n`
    if (receipt.phoneNumber) text += `Phone: ${receipt.phoneNumber}\n`
    if (receipt.savingsPlan) text += `Plan: ${receipt.savingsPlan}\n`
    if (receipt.note) text += `Note: ${receipt.note}\n`

    text += `Fee: ₦${receipt.fee.toLocaleString()}\n`
    text += `Total: ₦${receipt.total.toLocaleString()}\n`
    text += `Status: ${receipt.status.toUpperCase()}\n`
  } else if (language === "yo") {
    text = `Ìwé-ẹ̀rí Ìdúnàdúrà\n\n`
    text += `Ìtọ́kasí: ${receipt.reference}\n`
    text += `Ọjọ́: ${dateStr}\n`
    text += `Irú: ${receipt.type.toUpperCase()}\n`
    text += `Owó: ₦${receipt.amount.toLocaleString()}\n`

    if (receipt.recipient) text += `Olùgbà: ${receipt.recipient}\n`
    if (receipt.network) text += `Nẹ́tíwọ̀ọ̀kì: ${receipt.network}\n`
    if (receipt.phoneNumber) text += `Fóònù: ${receipt.phoneNumber}\n`

    text += `Owó ìṣẹ́: ₦${receipt.fee.toLocaleString()}\n`
    text += `Àpapọ̀: ₦${receipt.total.toLocaleString()}\n`
    text += `Ipò: ${receipt.status.toUpperCase()}\n`
  } else if (language === "ig") {
    text = `Akwụkwọ Azụmahịa\n\n`
    text += `Ìtọ́kasí: ${receipt.reference}\n`
    text += `Ọjọ́: ${dateStr}\n`
    text += `Irú: ${receipt.type.toUpperCase()}\n`
    text += `Owó: ₦${receipt.amount.toLocaleString()}\n`

    if (receipt.recipient) text += `Olùgbà: ${receipt.recipient}\n`
    if (receipt.network) text += `Nẹ́tíwọ̀ọ̀kì: ${receipt.network}\n`
    if (receipt.phoneNumber) text += `Fóònù: ${receipt.phoneNumber}\n`

    text += `Owó ìṣẹ́: ₦${receipt.fee.toLocaleString()}\n`
    text += `Àpapọ̀: ₦${receipt.total.toLocaleString()}\n`
    text += `Ipò: ${receipt.status.toUpperCase()}\n`
  } else if (language === "ha") {
    text = `Takardar Ciniki\n\n`
    text += `Ìtọ́kasí: ${receipt.reference}\n`
    text += `Ọjọ́: ${dateStr}\n`
    text += `Irú: ${receipt.type.toUpperCase()}\n`
    text += `Owó: ₦${receipt.amount.toLocaleString()}\n`

    if (receipt.recipient) text += `Olùgbà: ${receipt.recipient}\n`
    if (receipt.network) text += `Nẹ́tíwọ̀ọ̀kì: ${receipt.network}\n`
    if (receipt.phoneNumber) text += `Fóònù: ${receipt.phoneNumber}\n`

    text += `Owó ìṣẹ́: ₦${receipt.fee.toLocaleString()}\n`
    text += `Àpapọ̀: ₦${receipt.total.toLocaleString()}\n`
    text += `Ipò: ${receipt.status.toUpperCase()}\n`
  } else if (language === "sw") {
    text = `Risiti ya Muamala\n\n`
    text += `Ìtọ́kasí: ${receipt.reference}\n`
    text += `Ọjọ́: ${dateStr}\n`
    text += `Irú: ${receipt.type.toUpperCase()}\n`
    text += `Owó: ₦${receipt.amount.toLocaleString()}\n`

    if (receipt.recipient) text += `Olùgbà: ${receipt.recipient}\n`
    if (receipt.network) text += `Nẹ́tíwọ̀ọ̀kì: ${receipt.network}\n`
    if (receipt.phoneNumber) text += `Fóònù: ${receipt.phoneNumber}\n`

    text += `Owó ìṣẹ́: ₦${receipt.fee.toLocaleString()}\n`
    text += `Àpapọ̀: ₦${receipt.total.toLocaleString()}\n`
    text += `Ipò: ${receipt.status.toUpperCase()}\n`
  } else if (language === "tw") {
    text = `Nkrataa Adwuma\n\n`
    text += `Ìtọ́kasí: ${receipt.reference}\n`
    text += `Ọjọ́: ${dateStr}\n`
    text += `Irú: ${receipt.type.toUpperCase()}\n`
    text += `Owó: ₦${receipt.amount.toLocaleString()}\n`

    if (receipt.recipient) text += `Olùgbà: ${receipt.recipient}\n`
    if (receipt.network) text += `Nẹ́tíwọ̀ọ̀kì: ${receipt.network}\n`
    if (receipt.phoneNumber) text += `Fóònù: ${receipt.phoneNumber}\n`

    text += `Owó ìṣẹ́: ₦${receipt.fee.toLocaleString()}\n`
    text += `Àpapọ̀: ₦${receipt.total.toLocaleString()}\n`
    text += `Ipò: ${receipt.status.toUpperCase()}\n`
  }
  // Add more languages as needed

  return text
}

export function downloadReceipt(receipt: Receipt, language: string) {
  const text = formatReceiptText(receipt, language)
  const blob = new Blob([text], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `receipt-${receipt.reference}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function generateReceiptImage(receipt: Receipt, language: string): Promise<string> {
  // Create a canvas element
  const canvas = document.createElement("canvas")
  canvas.width = 600
  canvas.height = 800
  const ctx = canvas.getContext("2d")

  if (!ctx) throw new Error("Could not get canvas context")

  // Background
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Header background
  ctx.fillStyle = "#16a34a"
  ctx.fillRect(0, 0, canvas.width, 120)

  // Title
  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 32px Arial"
  ctx.textAlign = "center"
  const title =
    language === "yo"
      ? "Ìwé-ẹ̀rí Ìdúnàdúrà"
      : language === "ig"
        ? "Akwụkwọ Azụmahịa"
        : language === "ha"
          ? "Takardar Ciniki"
          : language === "sw"
            ? "Risiti ya Muamala"
            : language === "tw"
              ? "Nkrataa Adwuma"
              : "Transaction Receipt"
  ctx.fillText(title, canvas.width / 2, 60)

  // Success icon
  ctx.beginPath()
  ctx.arc(canvas.width / 2, 100, 30, 0, Math.PI * 2)
  ctx.fillStyle = "#ffffff"
  ctx.fill()
  ctx.strokeStyle = "#16a34a"
  ctx.lineWidth = 3
  ctx.stroke()

  // Checkmark
  ctx.strokeStyle = "#16a34a"
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(canvas.width / 2 - 12, 100)
  ctx.lineTo(canvas.width / 2 - 4, 108)
  ctx.lineTo(canvas.width / 2 + 12, 92)
  ctx.stroke()

  // Receipt details
  ctx.fillStyle = "#000000"
  ctx.font = "16px Arial"
  ctx.textAlign = "left"

  let y = 180
  const lineHeight = 35

  const details = [
    { label: "Reference", value: receipt.reference },
    { label: "Date", value: receipt.date.toLocaleString() },
    { label: "Type", value: receipt.type.toUpperCase() },
  ]

  if (receipt.recipient) details.push({ label: "Recipient", value: receipt.recipient })
  if (receipt.recipientAccount) details.push({ label: "Account", value: receipt.recipientAccount })
  if (receipt.recipientBank) details.push({ label: "Bank", value: receipt.recipientBank })
  if (receipt.network) details.push({ label: "Network", value: receipt.network })
  if (receipt.phoneNumber) details.push({ label: "Phone", value: receipt.phoneNumber })
  if (receipt.savingsPlan) details.push({ label: "Plan", value: receipt.savingsPlan })
  if (receipt.note) details.push({ label: "Note", value: receipt.note })

  details.forEach((detail) => {
    ctx.fillStyle = "#666666"
    ctx.font = "14px Arial"
    ctx.fillText(detail.label + ":", 50, y)

    ctx.fillStyle = "#000000"
    ctx.font = "bold 14px Arial"
    ctx.textAlign = "right"
    ctx.fillText(detail.value, canvas.width - 50, y)
    ctx.textAlign = "left"

    y += lineHeight
  })

  // Divider
  y += 20
  ctx.strokeStyle = "#e5e7eb"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(50, y)
  ctx.lineTo(canvas.width - 50, y)
  ctx.stroke()
  y += 30

  // Amount
  ctx.fillStyle = "#666666"
  ctx.font = "18px Arial"
  ctx.fillText("Amount:", 50, y)

  ctx.fillStyle = "#16a34a"
  ctx.font = "bold 24px Arial"
  ctx.textAlign = "right"
  ctx.fillText(`₦${receipt.amount.toLocaleString()}`, canvas.width - 50, y)
  ctx.textAlign = "left"
  y += lineHeight + 10

  // Fee
  ctx.fillStyle = "#666666"
  ctx.font = "16px Arial"
  ctx.fillText("Fee:", 50, y)

  ctx.fillStyle = "#000000"
  ctx.font = "16px Arial"
  ctx.textAlign = "right"
  ctx.fillText(`₦${receipt.fee.toLocaleString()}`, canvas.width - 50, y)
  ctx.textAlign = "left"
  y += lineHeight + 10

  // Divider
  ctx.strokeStyle = "#16a34a"
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(50, y)
  ctx.lineTo(canvas.width - 50, y)
  ctx.stroke()
  y += 30

  // Total
  ctx.fillStyle = "#000000"
  ctx.font = "bold 20px Arial"
  ctx.fillText("Total:", 50, y)

  ctx.fillStyle = "#16a34a"
  ctx.font = "bold 28px Arial"
  ctx.textAlign = "right"
  ctx.fillText(`₦${receipt.total.toLocaleString()}`, canvas.width - 50, y)
  ctx.textAlign = "left"
  y += lineHeight + 20

  // Status badge
  ctx.fillStyle = "#dcfce7"
  ctx.fillRect(canvas.width / 2 - 60, y, 120, 35)
  ctx.fillStyle = "#16a34a"
  ctx.font = "bold 14px Arial"
  ctx.textAlign = "center"
  ctx.fillText(receipt.status.toUpperCase(), canvas.width / 2, y + 23)

  // Footer
  y = canvas.height - 60
  ctx.fillStyle = "#999999"
  ctx.font = "12px Arial"
  ctx.textAlign = "center"
  ctx.fillText("VoicePay - Voice Banking for Everyone", canvas.width / 2, y)
  ctx.fillText("Built by Dynamites", canvas.width / 2, y + 20)

  // Convert canvas to data URL
  return canvas.toDataURL("image/png")
}

export async function downloadReceiptImage(receipt: Receipt, language: string) {
  const imageDataUrl = await generateReceiptImage(receipt, language)
  const a = document.createElement("a")
  a.href = imageDataUrl
  a.download = `receipt-${receipt.reference}.png`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
