export const maxDuration = 30

const LANGUAGE_PROMPTS = {
  en: "You are a helpful financial assistant for African users. Help with transfers, bills, airtime, savings, and financial education. Be friendly, clear, supportive, and practical.",
  yo: "Iwo je oluranlowo owo to wulo fun awon olumulo Afrika. Ran lowo pelu gbigbe owo, sisanwo, airtime, ifowopamo, ati eko nipa owo. Jẹ ore, kedere, ati atilẹyin.",
  ig: "Ị bụ onye enyemaka ego bara uru maka ndị ọrụ Afrika. Nyere na mbufe ego, ịkwụ ụgwọ, airtime, nchekwa, na agụmakwụkwọ ego. Bụ enyi, doo anya, kwado.",
  ha: "Kai ne mataimaki na harkokin kudi ga masu amfani a Afirka. Taimaka da aika kudi, biyan kudade, airtime, ajiya, da ilimin kudi. Kasance aboki, a bayyane, mai tallafi.",
  sw: "Wewe ni msaidizi wa kifedha kwa watumiaji barani Afrika. Saidia uhamisho, bili, airtime, akiba, na elimu ya kifedha. Kuwa rafiki, wazi, na wa msaada.",
  pcm: "You be helpful money assistant for African people. Help with send money, pay bill, buy airtime, save money, and money education. Make am friendly, clear, and supportive.",
}

export async function POST(req: Request) {
  // Hoist parsing so 'reqLanguage' is available in catch
  let reqLanguage: string = "en"
  let messages: any[] = []
  let userName: string | undefined
  let route: string = "/"
  try {
    const body = await req.json()
    messages = body.messages || []
    reqLanguage = body.language || "en"
    userName = body.userName
    route = body.route || "/"

    const systemPrompt = LANGUAGE_PROMPTS[reqLanguage as keyof typeof LANGUAGE_PROMPTS] || LANGUAGE_PROMPTS.en

    const languageMap: Record<string, string> = {
      yo: "Yoruba",
      ig: "Igbo",
      ha: "Hausa",
      sw: "Swahili",
      pcm: "Nigerian Pidgin",
      tw: "Twi",
    }

    const nameInstruction = userName ? `\n\nUser's name: ${userName}. Address them politely using their name when appropriate.` : ""

    // Route-aware guidance
    const routeInstruction = (() => {
      if (String(route).startsWith("/bills")) {
        return "\n\nContext: The user is on the Bills page. Provide step-by-step guidance to: select bill type or upload a bill, extract key info (provider, amount, account), confirm details, and proceed to pay. Keep steps short, ask clarifying questions, and summarize next action."
      }
      if (String(route).startsWith("/airtime")) {
        return "\n\nContext: The user is on the Airtime page. Guide them to enter phone number, select network, choose amount, and confirm purchase."
      }
      if (String(route).startsWith("/send")) {
        return "\n\nContext: The user is on the Send Money page. Guide them to enter recipient, amount, description, and confirm transfer."
      }
      if (String(route).startsWith("/save")) {
        return "\n\nContext: The user is on the Savings page. Help them set a goal, amount, frequency, and confirm."
      }
      return ""
    })()

    const languageInstruction =
      reqLanguage !== "en"
        ? `\n\nIMPORTANT: Respond in ${languageMap[reqLanguage]} language. Use natural, conversational ${languageMap[reqLanguage]} that everyday people understand.`
        : ""

    const apiKey = process.env.GEMINI_API_KEY

    // Early fallback if no API key configured
    if (!apiKey) {
      const fallbackResponses: Record<string, string> = {
        en: "I'm here to help! I can assist you with sending money, paying bills, buying airtime, and managing your savings. What would you like to do?",
        yo: "Mo wa nibi lati ran ọ lọwọ! Mo le ran ọ lọwọ pẹlu fifiranṣẹ owo, sisanwo awọn owo, rira airtime, ati iṣakoso awọn ifowopamọ rẹ. Kini o fẹ ṣe?",
        ig: "Anọ m ebe a inyere aka! Enwere m ike inyere gị aka izipu ego, ịkwụ ụgwọ, ịzụta airtime, na ijikwa ego gị. Gịnị ka ịchọrọ ime?",
        ha: "Ina nan don taimaka! Zan iya taimaka maka aika kudi, biyan kudade, siyan airtime, da kula da ajiyar ku. Me kuke so ku yi?",
        sw: "Niko hapa kusaidia! Ninaweza kukusaidia kutuma pesa, kulipa bili, kununua airtime, na kusimamia akiba yako. Ungependa kufanya nini?",
        pcm: "I dey here to help! I fit help you send money, pay bill, buy airtime, and manage your savings. Wetin you wan do?",
      }
      return new Response(
        JSON.stringify({ text: fallbackResponses[language] || fallbackResponses.en }),
        { headers: { "Content-Type": "application/json" } },
      )
    }

    // Use a valid Gemini model for v1beta generateContent
    const model = "gemini-1.5-flash"
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

    const geminiMessages = messages.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content || msg.parts?.[0]?.text || "" }],
    }))

    // Helper: timeout + retry (network transient)
    const fetchWithTimeout = async (url: string, options: RequestInit, ms = 12000, retries = 2): Promise<Response> => {
      for (let attempt = 0; attempt <= retries; attempt++) {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), ms)
        try {
          const res = await fetch(url, { ...options, signal: controller.signal })
          clearTimeout(timeout)
          return res
        } catch (err) {
          clearTimeout(timeout)
          if (attempt === retries) throw err
          // backoff
          await new Promise((r) => setTimeout(r, 500 * (attempt + 1)))
        }
      }
      // should never reach
      throw new Error("Network failed")
    }

    const response = await fetchWithTimeout(
      apiUrl,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: systemPrompt + nameInstruction + languageInstruction + routeInstruction }] },
            ...geminiMessages,
          ],
          generationConfig: { temperature: 0.8, maxOutputTokens: 1000 },
        }),
      },
      12000,
      2,
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] Gemini API error:", errorData)

      const fallbackResponses: Record<string, string> = {
        en: "I'm here to help! I can assist you with sending money, paying bills, buying airtime, and managing your savings. What would you like to do?",
        yo: "Mo wa nibi lati ran ọ lọwọ! Mo le ran ọ lọwọ pẹlu fifiranṣẹ owo, sisanwo awọn owo, rira airtime, ati iṣakoso awọn ifowopamọ rẹ. Kini o fẹ ṣe?",
        ig: "Anọ m ebe a inyere aka! Enwere m ike inyere gị aka izipu ego, ịkwụ ụgwọ, ịzụta airtime, na ijikwa ego gị. Gịnị ka ịchọrọ ime?",
        ha: "Ina nan don taimaka! Zan iya taimaka maka aika kudi, biyan kudade, siyan airtime, da kula da ajiyar ku. Me kuke so ku yi?",
        sw: "Niko hapa kusaidia! Ninaweza kukusaidia kutuma pesa, kulipa bili, kununua airtime, na kusimamia akiba yako. Ungependa kufanya nini?",
        pcm: "I dey here to help! I fit help you send money, pay bill, buy airtime, and manage your savings. Wetin you wan do?",
      }

      return new Response(
        JSON.stringify({
          text: fallbackResponses[language] || fallbackResponses.en,
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here to help you with your financial needs!"

    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    const fallbackResponses: Record<string, string> = {
      en: "I'm having trouble reaching the assistant right now. I can still help: tell me if you want to send money, pay a bill, buy airtime, or save.",
      yo: "Ìṣòro ló wà pẹ̀lú asopọ báyìí. Ṣùgbọ́n mo lè ràn ọ́ lọ́wọ́: sọ bóyá o fẹ́ fi owó ránṣẹ́, san ìwé-owó, ra airtime, tàbí pamọ́.",
      ig: "Enwere nsogbu njikọ ugbu a, mana m ka nwere ike inyere gị: gwa m ma ịchọrọ izipu ego, kwụọ ụgwọ, zụta airtime, ma ọ bụ chekwaa.",
      ha: "Akwai matsala da haɗi yanzu. Amma zan iya taimaka: kana so aika kudi, biyan kudi, siyan airtime, ko ajiya?",
      sw: "Kuna tatizo la muunganisho sasa. Bado naweza kusaidia: unataka kutuma pesa, kulipa bili, kununua airtime, au kuokoa?",
      pcm: "Network get wahala now. I still fit help: you wan send money, pay bill, buy airtime, or save?",
    }
    return new Response(
      JSON.stringify({ text: fallbackResponses[reqLanguage as string] || fallbackResponses.en }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    )
  }
}
