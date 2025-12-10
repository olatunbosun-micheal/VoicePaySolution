export class VoiceNarrator {
  private synth: SpeechSynthesis | null = null
  private enabled = true
  private language = "en-US"
  private currentLang = "en"

  constructor() {
    if (typeof window !== "undefined") {
      this.synth = window.speechSynthesis
    }
  }

  setLanguage(lang: string) {
    this.currentLang = lang
    const langMap: Record<string, string> = {
      en: "en-US",
      yo: "en-NG",
      ig: "en-NG",
      ha: "en-NG",
      sw: "sw-KE",
      pcm: "en-NG",
    }
    this.language = langMap[lang] || "en-US"
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
    if (!enabled && this.synth) {
      this.synth.cancel()
    }
  }

  private numberToWords(num: number, lang: string): string {
    const numberWords: Record<string, Record<number, string>> = {
      en: {
        0: "zero",
        1: "one",
        2: "two",
        3: "three",
        4: "four",
        5: "five",
        6: "six",
        7: "seven",
        8: "eight",
        9: "nine",
        10: "ten",
      },
      yo: {
        0: "òdo",
        1: "ọ̀kan",
        2: "èjì",
        3: "ẹ̀ta",
        4: "ẹ̀rin",
        5: "àrùn",
        6: "ẹ̀fà",
        7: "èje",
        8: "ẹ̀jọ",
        9: "ẹ̀sán",
        10: "ẹ̀wá",
      },
      ig: {
        0: "efu",
        1: "otu",
        2: "abụọ",
        3: "atọ",
        4: "anọ",
        5: "ise",
        6: "isii",
        7: "asaa",
        8: "asatọ",
        9: "itoolu",
        10: "iri",
      },
      ha: {
        0: "sifili",
        1: "ɗaya",
        2: "biyu",
        3: "uku",
        4: "huɗu",
        5: "biyar",
        6: "shida",
        7: "bakwai",
        8: "takwas",
        9: "tara",
        10: "goma",
      },
      sw: {
        0: "sifuri",
        1: "moja",
        2: "mbili",
        3: "tatu",
        4: "nne",
        5: "tano",
        6: "sita",
        7: "saba",
        8: "nane",
        9: "tisa",
        10: "kumi",
      },
      pcm: {
        0: "zero",
        1: "one",
        2: "two",
        3: "three",
        4: "four",
        5: "five",
        6: "six",
        7: "seven",
        8: "eight",
        9: "nine",
        10: "ten",
      },
    }

    const words = numberWords[lang] || numberWords.en
    return words[num] || num.toString()
  }

  private processText(text: string): string {
    // Convert standalone numbers to words
    return text.replace(/\b\d+\b/g, (match) => {
      const num = Number.parseInt(match)
      if (num <= 10) {
        return this.numberToWords(num, this.currentLang)
      }
      return match
    })
  }

  speak(text: string, priority: "high" | "normal" = "normal") {
    if (!this.enabled || !this.synth || !text) return

    if (priority === "high") {
      this.synth.cancel()
    }

    const processedText = this.processText(text)

    const utterance = new SpeechSynthesisUtterance(processedText)
    utterance.lang = this.language
    utterance.rate = 0.85 // Slightly slower for better pronunciation
    utterance.pitch = 1.0
    utterance.volume = 1.0

    const voices = this.synth.getVoices()
    let voice = voices.find((v) => v.lang === this.language)

    if (!voice) {
      const langPrefix = this.language.split("-")[0]
      voice = voices.find((v) => v.lang.startsWith(langPrefix))
    }

    if (!voice && this.language.includes("NG")) {
      voice = voices.find((v) => v.lang.startsWith("en") && v.name.includes("Female"))
    }

    if (voice) {
      utterance.voice = voice
    }

    this.synth.speak(utterance)
  }

  stop() {
    if (this.synth) {
      this.synth.cancel()
    }
  }
}

export function narrateAction(action: string, language: string) {
  if (!window.speechSynthesis) return

  const actionTexts: Record<string, Record<string, string>> = {
    selectedNetworkMTN: {
      en: "You selected MTN network",
      yo: "O ti yan nẹ́tíwọ̀ọ̀kì MTN",
      ig: "Ị họrọla netwọk MTN",
      ha: "Ka zaɓi hanyar sadarwa ta MTN",
      sw: "Umechagua mtandao wa MTN",
      pcm: "You don select MTN network",
    },
    selectedNetworkAirtel: {
      en: "You selected Airtel network",
      yo: "O ti yan nẹ́tíwọ̀ọ̀kì Airtel",
      ig: "Ị họrọla netwọk Airtel",
      ha: "Ka zaɓi hanyar sadarwa ta Airtel",
      sw: "Umechagua mtandao wa Airtel",
      pcm: "You don select Airtel network",
    },
    selectedNetworkGlo: {
      en: "You selected Glo network",
      yo: "O ti yan nẹ́tíwọ̀ọ̀kì Glo",
      ig: "Ị họrọla netwọk Glo",
      ha: "Ka zaɓi hanyar sadarwa ta Glo",
      sw: "Umechagua mtandao wa Glo",
      pcm: "You don select Glo network",
    },
    selectedNetwork9mobile: {
      en: "You selected 9mobile network",
      yo: "O ti yan nẹ́tíwọ̀ọ̀kì 9mobile",
      ig: "Ị họrọla netwọk 9mobile",
      ha: "Ka zaɓi hanyar sadarwa ta 9mobile",
      sw: "Umechagua mtandao wa 9mobile",
      pcm: "You don select 9mobile network",
    },
    enteringPin: {
      en: "Please enter your transaction PIN",
      yo: "Jọ̀wọ́ tẹ PIN ìdúnàdúrà rẹ",
      ig: "Biko tinye PIN azụmahịa gị",
      ha: "Don Allah shigar da PIN cinikinku",
      sw: "Tafadhali ingiza PIN yako ya muamala",
      pcm: "Abeg enter your transaction PIN",
    },
    airtimePurchaseSuccess: {
      en: "Airtime purchase successful! Receipt is ready",
      yo: "Rírà káàdì fóònù ṣe àṣeyọrí! Ìwé-ẹ̀rí ti ṣetán",
      ig: "Ịzụta kaadị ekwentị gara nke ọma! Akwụkwọ dị njikere",
      ha: "An sami nasarar siyan katin waya! Takardar tana nan",
      sw: "Ununuzi wa muda umefanikiwa! Risiti iko tayari",
      pcm: "Airtime purchase successful! Receipt don ready",
    },
    savingsSuccess: {
      en: "Money saved successfully! Receipt is ready",
      yo: "A ti fipamọ́ owó ní ìṣẹ́gun! Ìwé-ẹ̀rí ti ṣetán",
      ig: "Echekwara ego nke ọma! Akwụkwọ dị njikere",
      ha: "An ajiye kuɗi cikin nasara! Takardar tana nan",
      sw: "Pesa imehifadhiwa! Risiti iko tayari",
      pcm: "Money don save well! Receipt don ready",
    },
    transferSuccess: {
      en: "Transfer successful! Receipt is ready",
      yo: "Gbígbé owó ṣe àṣeyọrí! Ìwé-ẹ̀rí ti ṣetán",
      ig: "Mbufe gara nke ọma! Akwụkwọ dị njikere",
      ha: "Canja kuɗi ya yi nasara! Takardar tana nan",
      sw: "Uhamishaji umefanikiwa! Risiti iko tayari",
      pcm: "Transfer successful! Receipt don ready",
    },
    downloadingReceipt: {
      en: "Downloading your receipt",
      yo: "Ń ṣe ìgbàsílẹ̀ ìwé-ẹ̀rí rẹ",
      ig: "Na-ebudata akwụkwọ gị",
      ha: "Ana zazzage takardar ku",
      sw: "Inapakua risiti yako",
      pcm: "Dey download your receipt",
    },
    readingReceipt: {
      en: "Reading your receipt aloud",
      yo: "Ń ka ìwé-ẹ̀rí rẹ sókè",
      ig: "Na-agụ akwụkwọ gị n'olu dara ụda",
      ha: "Ana karanta takardar ku da babbar murya",
      sw: "Inasoma risiti yako kwa sauti",
      pcm: "Dey read your receipt loud",
    },
    selectedSavingsPlan: {
      en: "You selected a savings plan",
      yo: "O ti yan ètò ìfipamọ́",
      ig: "Ị họrọla atụmatụ nchekwa",
      ha: "Ka zaɓi tsarin ajiyar kuɗi",
      sw: "Umechagua mpango wa akiba",
      pcm: "You don select savings plan",
    },
  }

  const text = actionTexts[action]?.[language] || actionTexts[action]?.en || action
  const narratorInstance = typeof window !== "undefined" ? new VoiceNarrator() : null
  if (narratorInstance) {
    narratorInstance.speak(text, "normal")
  }
}

export const narrator = typeof window !== "undefined" ? new VoiceNarrator() : null
