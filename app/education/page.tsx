"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { narrator } from "@/lib/voice-narrator"
import { useLanguage } from "@/lib/language-context"

export default function EducationPage() {
  const { language } = useLanguage()
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  const topicsMap: Record<string, { title: string; icon: string; color: string; content: string }[]> = {
    en: [
      { title: "Saving Money", icon: "💰", color: "bg-green-500", content: "Learn how to save money effectively. Start small, save regularly, and watch your money grow. Set goals and track your progress." },
      { title: "Budgeting", icon: "📊", color: "bg-blue-500", content: "Create a budget to manage your income and expenses. Track where your money goes and make better financial decisions." },
      { title: "Investing Basics", icon: "📈", color: "bg-purple-500", content: "Learn about different investment options. Understand risk and return. Start investing early for long-term growth." },
      { title: "Avoiding Debt", icon: "🚫", color: "bg-red-500", content: "Learn how to avoid unnecessary debt. Understand interest rates and only borrow what you can repay." },
      { title: "Mobile Banking", icon: "📱", color: "bg-yellow-500", content: "Use mobile banking safely. Protect your PIN, check transactions regularly, and report suspicious activity." },
      { title: "Business Tips", icon: "💼", color: "bg-orange-500", content: "Start and grow your business. Keep records, separate business and personal money, and reinvest profits." },
      { title: "Emergency Fund", icon: "🧰", color: "bg-teal-500", content: "Build an emergency fund with 1–3 months of expenses. Deposit a small amount weekly or monthly in a separate account." },
      { title: "Fraud Awareness", icon: "🛑", color: "bg-rose-500", content: "Be alert for scams. Never share OTP, PIN, or full card details. Verify sender identity and use official channels only." },
      { title: "Remittances & Fees", icon: "🌍", color: "bg-cyan-500", content: "Compare transfer fees and exchange rates. Use trusted services. Confirm recipient details before sending money." },
      { title: "Credit & Loans", icon: "🏦", color: "bg-indigo-500", content: "Borrow only what you can repay. Understand interest, tenor, and penalties. Pay on time to build a good credit record." },
      { title: "Insurance Basics", icon: "🩺", color: "bg-lime-600", content: "Health, crop, and device insurance reduce risk. Compare premiums and coverage. Read terms before buying." },
    ],
    yo: [
      { title: "Fipamọ́ Owó", icon: "💰", color: "bg-green-500", content: "Kọ́ bí o ṣe lè fipamọ́ owó dáadáa. Bẹ̀rẹ̀ kékeré, fipamọ́ lóòótọ́, kí owó rẹ dàgbà díẹ̀díẹ̀. Ṣètò ibi-afẹ́ àti tọ́pa ìgbésẹ̀." },
      { title: "Ìṣètò Ináwó", icon: "📊", color: "bg-blue-500", content: "Ṣẹ̀dá ìṣètò owó kí o mọ ibi tí owó ń lọ. Yọ owó fún ohun tí ó ṣe pàtàkì kí o lè ṣe ìpinnu tó dáa." },
      { title: "Ìpilẹ̀ Ìdókòwò", icon: "📈", color: "bg-purple-500", content: "Kọ́ nípa ọ̀nà ìdókòwò. Lóye ewu àti èrè. Bẹ̀rẹ̀ kíákíá fún ìdagbasoke pípẹ́." },
      { title: "Ìyẹ̀wò Gbèsè", icon: "🚫", color: "bg-red-500", content: "Yago fún gbèsè tí kò ṣe dandan. Lóye ìní-ríni àti san owó tí o lè san padà nìkan." },
      { title: "Bánkì Alágbèéká", icon: "📱", color: "bg-yellow-500", content: "Lo báníìkì alágbèéká ní ààbò. Dá PIN bó, ṣàyẹ̀wò ìdúnàdúrà, kí o sì jùbọ̀ fún ohun tó ṣàníyàn." },
      { title: "Àmọ̀ràn Ọ̀fíìsì", icon: "💼", color: "bg-orange-500", content: "Bẹ̀rẹ̀ kí o sì dàgbà níṣòwò. Pa ìkọ̀wé mọ́, yà owó ilé àti ọ̀fíìsì, kí o tún fi èrè ṣe agbega." },
      { title: "Owó Pajawiri", icon: "🧰", color: "bg-teal-500", content: "Kọ́ owó pajawiri (osu 1–3). Fipamọ́ díẹ̀díẹ̀ lórí ọ̀sẹ̀ tàbí oṣù sí àkọọ́lẹ̀ míì." },
      { title: "Ìjìnlẹ̀ Nítorí Ijàlù", icon: "🛑", color: "bg-rose-500", content: "Ṣọ́ra fún ìtànjẹ. Má fi OTP, PIN tàbí kárìdì kúnlẹ̀. Ṣàyẹ̀wò ẹni tó ránṣẹ́, lo ọ̀nà ìjọba pátápátá." },
      { title: "Ránsẹ́ Owó & Owó Ọya", icon: "🌍", color: "bg-cyan-500", content: "Fífi owó ránṣẹ́: fi owó ọya àti oṣuwọn paṣipaarọ̀ wé ara wọn. Lo iṣẹ́ tó dájú. Ṣàyẹ̀wò orúkọ ẹni tí o ń fún." },
      { title: "Gbèsè & Ilérí", icon: "🏦", color: "bg-indigo-500", content: "Ya owó tó lè san padà nìkan. Lóye ìní-ríni, àkókò, ìtanran. San nígbà tó yẹ kí ìwé-gbèsè rẹ dáa." },
      { title: "Ìníṣọ́ọ̀rà", icon: "🩺", color: "bg-lime-600", content: "Ìníṣọ́ọ̀rà ìlera, ọkà, ẹrọ dín ewu kù. Fi owó ìníṣọ́ọ̀rà wé ara wọn, kí o ka ìlànà kí o tó rà." },
    ],
    ig: [
      { title: "Ịchekwa Ego", icon: "💰", color: "bg-green-500", content: "Mụta ịchekwa ego nke ọma. Bido ntakịrị, chekwaa mgbe niile, ka ego gị na-eto. Tọọgo ma toochaa mmepe." },
      { title: "Ịme Ọnwa", icon: "📊", color: "bg-blue-500", content: "Mepụta usoro mmefu ego. Chọpụta ebe ego na-aga ka i mee ikpe kasịnụ." },
      { title: "Isi Ụzọ Ịdọkwa", icon: "📈", color: "bg-purple-500", content: "Mụta ụzọ dị iche iche iji dọkwa ego. Ghọta ihe ize ndụ na uru. Malite ngwa ngwa maka uto ogologo oge." },
      { title: "Zere Oru Ugwo", icon: "🚫", color: "bg-red-500", content: "Zere ịkwọ ụgwọ na-adịghị mkpa. Ghọta ọnụ ọgụgụ pasent na kwụọ naanị ihe i nwere ike kwụọ." },
      { title: "Mgbasa Ozi Mobile", icon: "📱", color: "bg-yellow-500", content: "Jiri banking ekwentị nke ọma. Chekwaa PIN, nyochaa mmegharị, kụpụta ihe ọ bụla na-acha ọbara ọbara." },
      { title: "Ndụmọdụ Ụlọ Ọrụ", icon: "💼", color: "bg-orange-500", content: "Bido ma too azụmahịa gị. Debe ndekọ, kewaa ego onwe na azụmahịa, tinye uru azụmahịa ọzọ." },
      { title: "Ego Mberede", icon: "🧰", color: "bg-teal-500", content: "Wulite ego mberede nke ọnwa 1–3. Tinye obere ego kwa izu/ọnwa n’akaụntụ dị iche." },
      { title: "Cheta Ụgha", icon: "🛑", color: "bg-rose-500", content: "Kwachaa anya na ndi aghụghọ. Ejila OTP, PIN, ma ọ bụ data kaadị zuru ezu kesaa. Jide n'aka onye zitere.", },
      { title: "Ịzipu Ego & Ụgwọ", icon: "🌍", color: "bg-cyan-500", content: "Tụnyere ụgwọ ọrụ na ọnụego ahịa. Jiri ọrụ kwụsiri ike. Jide n'aka onye nnata tupu zipu." },
      { title: "Nkwụsị ụgwọ & Ebe Mgbaru ọsọ", icon: "🏦", color: "bg-indigo-500", content: "Were ego naanị nke ị nwere ike kwụọ. Ghọta mmasị, oge, na ntaramahụhụ. Kwụọ n’oge." },
      { title: "Nchekwa Ahụike", icon: "🩺", color: "bg-lime-600", content: "Nchekwa ahụike/ọhịa/ ngwaọrụ na-ebelata ihe ize ndụ. Tụnyere ụgwọ na mkpuchi. Gụọ nkọwa tupu ịzụta." },
    ],
    ha: [
      { title: "Ajiya", icon: "💰", color: "bg-green-500", content: "Koyi yadda zaka ajiye kudi da kyau. Fara da kadan, ka rika ajiye akai-akai. Saita buri, ka rika bin diddigin cigaba." },
      { title: "Kasafin Kudi", icon: "📊", color: "bg-blue-500", content: "Kirkiri kasafi don kula da kudaden shiga da fice. San inda kudi suke tafiya, ka yanke shawara mai kyau." },
      { title: "Fara Zuba Jari", icon: "📈", color: "bg-purple-500", content: "Koyi zabin zuba jari. Fahimci hadari da riba. Fara da wuri don ci gaba na dogon lokaci." },
      { title: "Guje wa Bashi", icon: "🚫", color: "bg-red-500", content: "Guji bashi marar amfani. Fahimci kudin ruwa; rika aro abin da zaka iya biya kadai." },
      { title: "Bankin Salula", icon: "📱", color: "bg-yellow-500", content: "Yi amfani da bankin waya cikin tsaro. Kare PIN, duba ma'amaloli, kai rahoton abin shakka." },
      { title: "Shawarar Kasuwanci", icon: "💼", color: "bg-orange-500", content: "Fara kuma habbaka kasuwanci. Ajiye rubutu, raba kudin kasuwanci da na gida, ka mayar da riba." },
      { title: "Kudin Gaggawa", icon: "🧰", color: "bg-teal-500", content: "Gina kudin gaggawa na watanni 1–3. Ajiye kadan-kadan a kowanne mako/ wata." },
      { title: "Hankali kan Zamba", icon: "🛑", color: "bg-rose-500", content: "Ka yi hattara da yaudara. Kada ka raba OTP/PIN ko bayanan kati. Tabbatar da wanda ya aiko." },
      { title: "Kudin Canji & Kuɗin Aiki", icon: "🌍", color: "bg-cyan-500", content: "Kwatanta kuɗin canja wuri da ragin kudi. Yi amfani da sabis masu aminci. Tabbatar da bayanan mai karɓa." },
      { title: "Bashi & Kiredit", icon: "🏦", color: "bg-indigo-500", content: "Ara abin da zaka iya biya. Fahimci riba, lokaci, tara. Biyan a kan lokaci yana gina tarihin kiredit." },
      { title: "Inshora", icon: "🩺", color: "bg-lime-600", content: "Inshorar lafiya, amfanin gona, da na’ura na rage hadari. Kwatanta kudade da murfi; karanta sharudda." },
    ],
    sw: [
      { title: "Akiba", icon: "💰", color: "bg-green-500", content: "Jifunze kuweka akiba kwa ufanisi. Anza kidogo, weka mara kwa mara, na uone fedha zikikua. Weka malengo na fuatilia maendeleo." },
      { title: "Bajeti", icon: "📊", color: "bg-blue-500", content: "Tengeneza bajeti kudhibiti mapato na matumizi. Jua fedha zinaenda wapi na ufanye maamuzi bora." },
      { title: "Msingi wa Uwekezaji", icon: "📈", color: "bg-purple-500", content: "Jifunze njia za uwekezaji. Elewa hatari na faida. Anza mapema kwa ukuaji wa muda mrefu." },
      { title: "Kuepuka Deni", icon: "🚫", color: "bg-red-500", content: "Epuka madeni yasiyo ya lazima. Elewa riba; kopa unachoweza kurejesha tu." },
      { title: "Benki kwa Simu", icon: "📱", color: "bg-yellow-500", content: "Tumia benki ya simu salama. Linda PIN, kagua miamala, ripoti shughuli za kutia shaka." },
      { title: "Ushauri wa Biashara", icon: "💼", color: "bg-orange-500", content: "Anzisha na kukuza biashara. Hifadhi kumbukumbu, tenganisha pesa za biashara na binafsi, wekeza faida upya." },
      { title: "Dharura", icon: "🧰", color: "bg-teal-500", content: "Tengeneza mfuko wa dharura wa miezi 1–3. Weka kiasi kidogo kila wiki/ mwezi." },
      { title: "Utapeli", icon: "🛑", color: "bg-rose-500", content: "Kuwa macho na utapeli. Usishiriki OTP/PIN au maelezo yote ya kadi. Thibitisha utambulisho wa mtumaji." },
      { title: "Havale na Ada", icon: "🌍", color: "bg-cyan-500", content: "Linganisha ada na viwango vya kubadilisha. Tumia huduma zinazoaminika. Thibitisha mpokeaji kabla ya kutuma." },
      { title: "Mikopo & Deni", icon: "🏦", color: "bg-indigo-500", content: "Kopa unachoweza kurejesha. Elewa riba, muda, adhabu. Lipa kwa wakati kuboresha historia ya mkopo." },
      { title: "Bima", icon: "🩺", color: "bg-lime-600", content: "Bima ya afya, mazao, na vifaa hupunguza hatari. Linganisha bima, soma masharti kabla ya kununua." },
    ],
    pcm: [
      { title: "How to Save", icon: "💰", color: "bg-green-500", content: "Learn how to dey save money well. Start small, save steady, make your money grow. Set goal and track am." },
      { title: "Budget", icon: "📊", color: "bg-blue-500", content: "Make budget to manage your money. Know where money dey go and make better decisions." },
      { title: "Invest Basics", icon: "📈", color: "bg-purple-500", content: "Learn different invest ways. Understand risk and return. Start early for better growth." },
      { title: "Avoid Debt", icon: "🚫", color: "bg-red-500", content: "No carry debt wey no necessary. Understand interest and borrow only wetin you fit pay back." },
      { title: "Mobile Banking", icon: "📱", color: "bg-yellow-500", content: "Use mobile banking well. Protect your PIN, check transactions, report any suspicious thing." },
      { title: "Business Tips", icon: "💼", color: "bg-orange-500", content: "Start and grow your business. Keep records, separate business from personal money, reinvest profit." },
      { title: "Emergency Fund", icon: "🧰", color: "bg-teal-500", content: "Build emergency fund with 1–3 months expenses. Put small small every week or month." },
      { title: "Fraud Awareness", icon: "🛑", color: "bg-rose-500", content: "Shine eye for scam. No share OTP/PIN or full card details. Confirm who send message." },
      { title: "Remittance & Fees", icon: "🌍", color: "bg-cyan-500", content: "Compare transfer fees and rates. Use trusted service. Confirm recipient before you send." },
      { title: "Credit & Loan", icon: "🏦", color: "bg-indigo-500", content: "Borrow only wetin you fit pay. Understand interest, time, penalty. Pay on time to build credit." },
      { title: "Insurance Basics", icon: "🩺", color: "bg-lime-600", content: "Health, crop, device insurance dey reduce risk. Compare price and coverage. Read terms before you buy." },
    ],
    tw: [
      { title: "Sikasie", icon: "💰", color: "bg-green-500", content: "Sua sɛn na wobɛtumi asie sika yie. Fi ketewa so, sie mpɛn pii, na sika no bɛkɔ so ayɛ kɛse. Hyɛ botae na di n'akyi." },
      { title: "Budget", icon: "📊", color: "bg-blue-500", content: "Yɛ budget fa w'egyinabea ho na woahu sika kɔ he. Fa no yɛ adwuma ma wo gyinae pa." },
      { title: "Sika Adwuma", icon: "📈", color: "bg-purple-500", content: "Sua adwumadi a wobetumi de sika to mu. Hu risk ne mfaso. Fi ntɛm so ma nkɔsoɔ tenten." },
      { title: "Kɔkɔɔmɔ", icon: "🚫", color: "bg-red-500", content: "Yɛ den na mpɛn pii na w'anka wɔde kɔkɔɔmɔ. Hu ka ho ka; fa nea wobetumi twa na woayi." },
      { title: "Fon Bank", icon: "📱", color: "bg-yellow-500", content: "Fa fon bank no yɛ adwuma wɔ nkwantanan mu. Bɔ PIN ho ban, hwɛ transactions, ka amumɔyɛ ho amaneɛ." },
      { title: "Adwuma Nkyerɛkyerɛ", icon: "💼", color: "bg-orange-500", content: "Fi ase na ma wo dwuma no nyin. Kyerɛw nsɛm, fa sika adwuma ne fie yiyi, fa mfaso no to mu bio." },
      { title: "Ohyew Bere Sika", icon: "🧰", color: "bg-teal-500", content: "Sie sika a ɛbɛtɔ wo mmeranteɛ 1–3 bosome. Fa kakra kakra to mu wɔ nnawɔtwe anaa bosome biara." },
      { title: "Nkɔmmɔhu Amumɔyɛ", icon: "🛑", color: "bg-rose-500", content: "Hwɛ wo ani yie na mfɛfoɔ no nnaadaa wo. Mma OTP/PIN ne kaad no nkyerɛw de nyinaa. Fa obi a ɔde krataa no baa no ho adanseɛ." },
      { title: "Sika Tua ne Ka", icon: "🌍", color: "bg-cyan-500", content: "Fa sika tua ka ne rate no to nsa. Fa adwumayɛfoɔ pa di dwuma. Sɔ obi a wobɛtua no sika no din mu." },
      { title: "Ka ne Sika Kwansrafo", icon: "🏦", color: "bg-indigo-500", content: "Fa nea wobetumi atua nko ara gye. Hu ka ho ka, bere ne akatua. Tua bere so ma w'ahenkan yie." },
      { title: "Ahokyɛn", icon: "🩺", color: "bg-lime-600", content: "Ahokyɛn te sɛ ahoɔden, nnɔbaeɛ, akɔmputa ahokyɛn boa ma ahodwiri. Fa ka ne biribiara to nsa. Kenkan nkitahodie no ansa na wotɔ." },
    ],
  }

  const topics = topicsMap[language] || topicsMap.en

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
            <h1 className="text-2xl font-bold">Financial Education</h1>
            <p className="text-sm text-muted-foreground">Learn to manage your money better</p>
          </div>
        </div>

        {!selectedTopic ? (
          <div className="grid grid-cols-2 gap-4">
            {topics.map((topic) => (
              <Card
                key={topic.title}
                className="hover:shadow-lg transition-all cursor-pointer"
                onClick={() => {
                  setSelectedTopic(topic.title)
                  narrator?.speak(`Learning about ${topic.title}`, "high")
                }}
              >
                <CardHeader>
                  <div className={`${topic.color} w-12 h-12 rounded-xl flex items-center justify-center mb-2 text-2xl`}>
                    {topic.icon}
                  </div>
                  <CardTitle className="text-lg">{topic.title}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`${topics.find((t) => t.title === selectedTopic)?.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl`}
                >
                  {topics.find((t) => t.title === selectedTopic)?.icon}
                </div>
                <CardTitle>{selectedTopic}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg leading-relaxed">{topics.find((t) => t.title === selectedTopic)?.content}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setSelectedTopic(null)
                    narrator?.speak("Going back to topics", "high")
                  }}
                >
                  Back to Topics
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    const content = topics.find((t) => t.title === selectedTopic)?.content || ""
                    narrator?.speak(content, "high")
                  }}
                >
                  Read Aloud
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
