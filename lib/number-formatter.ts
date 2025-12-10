import type { Language } from "./language-context"

// Convert numbers to words in different languages
export function numberToWords(num: number, lang: Language): string {
  if (lang === "en") {
    return numberToEnglish(num)
  } else if (lang === "yo") {
    return numberToYoruba(num)
  } else if (lang === "ig") {
    return numberToIgbo(num)
  } else if (lang === "ha") {
    return numberToHausa(num)
  } else if (lang === "sw") {
    return numberToSwahili(num)
  } else if (lang === "tw") {
    return numberToTwi(num)
  } else if (lang === "pcm") {
    return numberToPidgin(num)
  }
  return num.toString()
}

function localeFor(lang: Language): string {
  switch (lang) {
    case "yo":
      return "yo-NG"
    case "ig":
      return "ig-NG"
    case "ha":
      return "ha-NG"
    case "sw":
      return "sw-KE"
    case "tw":
      return "ak-GH"
    case "pcm":
      // No official locale; fallback to en-NG
      return "en-NG"
    default:
      return "en-NG"
  }
}

export function formatNumber(value: number, lang: Language, options?: Intl.NumberFormatOptions): string {
  const loc = localeFor(lang)
  try {
    return new Intl.NumberFormat(loc, options).format(value)
  } catch {
    return value.toLocaleString("en-NG", options)
  }
}

// Format currency with localized number representation
export function formatCurrency(amount: number, lang: Language, showWords = false): string {
  const formatted = `₦${formatNumber(amount, lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  if (showWords && amount < 1000000) {
    const words = numberToWords(Math.floor(amount), lang)
    return `${formatted} (${words})`
  }

  return formatted
}

export function formatPercent(value: number, lang: Language): string {
  // value as 0.053 -> 5.3%
  return formatNumber(value, lang, { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

// English number to words
function numberToEnglish(num: number): string {
  if (num === 0) return "zero"

  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]
  const teens = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ]

  if (num < 10) return ones[num]
  if (num < 20) return teens[num - 10]
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "")
  if (num < 1000)
    return ones[Math.floor(num / 100)] + " hundred" + (num % 100 ? " and " + numberToEnglish(num % 100) : "")
  if (num < 1000000) {
    const thousands = Math.floor(num / 1000)
    const remainder = num % 1000
    return numberToEnglish(thousands) + " thousand" + (remainder ? " " + numberToEnglish(remainder) : "")
  }

  return num.toLocaleString()
}

// Yoruba number to words
function numberToYoruba(num: number): string {
  if (num === 0) return "òdo"

  const ones = ["", "ọkan", "èjì", "ẹta", "ẹrin", "àrún", "ẹfà", "èje", "ẹjọ", "ẹsán"]
  const tens = ["", "ẹwá", "ogún", "ọgbọn", "ogójì", "àádọta", "ọgọta", "àádọrin", "ọgọrin", "àádọrun"]

  if (num < 10) return ones[num]
  if (num < 100) {
    const ten = Math.floor(num / 10)
    const one = num % 10
    return tens[ten] + (one ? " " + ones[one] : "")
  }
  if (num < 1000) {
    const hundred = Math.floor(num / 100)
    const remainder = num % 100
    return ones[hundred] + " ọgọrun" + (remainder ? " " + numberToYoruba(remainder) : "")
  }
  if (num < 1000000) {
    const thousands = Math.floor(num / 1000)
    const remainder = num % 1000
    return numberToYoruba(thousands) + " ẹgbẹrun" + (remainder ? " " + numberToYoruba(remainder) : "")
  }

  return num.toLocaleString()
}

// Igbo number to words
function numberToIgbo(num: number): string {
  if (num === 0) return "efu"

  const ones = ["", "otu", "abụọ", "atọ", "anọ", "ise", "isii", "asaa", "asatọ", "itoolu"]
  const tens = [
    "",
    "iri",
    "iri abụọ",
    "iri atọ",
    "iri anọ",
    "iri ise",
    "iri isii",
    "iri asaa",
    "iri asatọ",
    "iri itoolu",
  ]

  if (num < 10) return ones[num]
  if (num < 100) {
    const ten = Math.floor(num / 10)
    const one = num % 10
    return tens[ten] + (one ? " na " + ones[one] : "")
  }
  if (num < 1000) {
    const hundred = Math.floor(num / 100)
    const remainder = num % 100
    return "narị " + ones[hundred] + (remainder ? " na " + numberToIgbo(remainder) : "")
  }
  if (num < 1000000) {
    const thousands = Math.floor(num / 1000)
    const remainder = num % 1000
    return "puku " + numberToIgbo(thousands) + (remainder ? " na " + numberToIgbo(remainder) : "")
  }

  return num.toLocaleString()
}

// Hausa number to words
function numberToHausa(num: number): string {
  if (num === 0) return "sifili"

  const ones = ["", "ɗaya", "biyu", "uku", "huɗu", "biyar", "shida", "bakwai", "takwas", "tara"]
  const tens = ["", "goma", "ashirin", "talatin", "arba'in", "hamsin", "sittin", "saba'in", "tamanin", "casa'in"]

  if (num < 10) return ones[num]
  if (num < 100) {
    const ten = Math.floor(num / 10)
    const one = num % 10
    return tens[ten] + (one ? " da " + ones[one] : "")
  }
  if (num < 1000) {
    const hundred = Math.floor(num / 100)
    const remainder = num % 100
    return ones[hundred] + " ɗari" + (remainder ? " da " + numberToHausa(remainder) : "")
  }
  if (num < 1000000) {
    const thousands = Math.floor(num / 1000)
    const remainder = num % 1000
    return numberToHausa(thousands) + " dubu" + (remainder ? " da " + numberToHausa(remainder) : "")
  }

  return num.toLocaleString()
}

// Swahili number to words
function numberToSwahili(num: number): string {
  if (num === 0) return "sifuri"

  const ones = ["", "moja", "mbili", "tatu", "nne", "tano", "sita", "saba", "nane", "tisa"]
  const tens = ["", "kumi", "ishirini", "thelathini", "arobaini", "hamsini", "sitini", "sabini", "themanini", "tisini"]

  if (num < 10) return ones[num]
  if (num < 100) {
    const ten = Math.floor(num / 10)
    const one = num % 10
    return tens[ten] + (one ? " na " + ones[one] : "")
  }
  if (num < 1000) {
    const hundred = Math.floor(num / 100)
    const remainder = num % 100
    return "mia " + ones[hundred] + (remainder ? " na " + numberToSwahili(remainder) : "")
  }
  if (num < 1000000) {
    const thousands = Math.floor(num / 1000)
    const remainder = num % 1000
    return "elfu " + numberToSwahili(thousands) + (remainder ? " na " + numberToSwahili(remainder) : "")
  }

  return num.toLocaleString()
}

// Pidgin number to words
function numberToPidgin(num: number): string {
  if (num === 0) return "zero"

  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]
  const teens = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ]

  if (num < 10) return ones[num]
  if (num < 20) return teens[num - 10]
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "")
  if (num < 1000)
    return ones[Math.floor(num / 100)] + " hundred" + (num % 100 ? " and " + numberToPidgin(num % 100) : "")
  if (num < 1000000) {
    const thousands = Math.floor(num / 1000)
    const remainder = num % 1000
    return numberToPidgin(thousands) + " thousand" + (remainder ? " " + numberToPidgin(remainder) : "")
  }

  return num.toLocaleString()
}

// Twi number to words
function numberToTwi(num: number): string {
  if (num === 0) return "hwee"

  const ones = ["", "baako", "mmienu", "mmiɛnsa", "ɛnan", "enum", "nsia", "nson", "nwɔtwe", "nkron"]
  const tens = ["", "du", "aduonu", "aduasa", "aduanan", "aduonum", "aduosia", "aduoson", "aduɔwɔtwe", "aduɔkron"]

  if (num < 10) return ones[num]
  if (num < 100) {
    const ten = Math.floor(num / 10)
    const one = num % 10
    return tens[ten] + (one ? " " + ones[one] : "")
  }
  if (num < 1000) {
    const hundred = Math.floor(num / 100)
    const remainder = num % 100
    return "ɔha " + ones[hundred] + (remainder ? " ne " + numberToTwi(remainder) : "")
  }
  if (num < 1000000) {
    const thousands = Math.floor(num / 1000)
    const remainder = num % 1000
    return "apem " + numberToTwi(thousands) + (remainder ? " ne " + numberToTwi(remainder) : "")
  }

  return num.toLocaleString()
}
