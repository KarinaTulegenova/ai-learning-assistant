import { useEffect, useState } from "react"
import { getDashboard } from "../../services/dashboardService"

const activityLabels = {
  upload_document: "Құжат жүктеді",
  generated_quiz: "Тест жасалды",
  generated_flashcards: "Флешкарталар жасалды",
  completed_quiz: "Тест тапсырды",
  chat_question: "Сұрақ қойды"
}

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      const res = await getDashboard()
      setData(res)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p>Жүктелуде...</p>
  }

  if (!data) {
    return <p>Деректер қолжетімсіз</p>
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Бақылау тақтасы</h1>
        <p className="text-slate-500">
          Қош келдіңіз, <span className="font-medium">{data.user.email}</span>
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Құжаттар" value={data.stats.documents} tone="mint" />
        <StatCard title="Флешкарталар" value={data.stats.flashcards} tone="amber" />
        <StatCard title="Тесттер" value={data.stats.quizzes} tone="sky" />
      </div>

      <section className="bg-white rounded-2xl border border-white/80 p-6 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.4)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Соңғы әрекеттер</h2>
          <span className="text-xs text-slate-400">Соңғы 5 әрекет</span>
        </div>
        <ul className="space-y-3">
          {data.recentActivity.length === 0 && (
            <li className="text-sm text-slate-500">Әзірге әрекет жоқ.</li>
          )}
          {data.recentActivity.map(item => (
            <li
              key={item.id}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                  {iconFor(item.type)}
                </span>
                <div>
                  <p className="font-medium text-slate-800">
                    {activityLabels[item.type] || "Әрекет"}
                  </p>
                  {item.metadata?.title && (
                    <p className="text-slate-500">{item.metadata.title}</p>
                  )}
                  {item.type === "completed_quiz" &&
                    typeof item.metadata?.score === "number" && (
                      <p className="text-slate-500">
                        Нәтиже {item.metadata.score} / {item.metadata.total}
                      </p>
                    )}
                </div>
              </div>
              <span className="text-xs text-slate-400">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function StatCard({ title, value, tone }) {
  const tones = {
    mint: "from-emerald-50 to-white border-emerald-100",
    amber: "from-amber-50 to-white border-amber-100",
    sky: "from-sky-50 to-white border-sky-100"
  }

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br ${
        tones[tone]
      } p-6 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]`}
    >
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-3xl font-semibold mt-2">{value}</p>
    </div>
  )
}

function iconFor(type) {
  switch (type) {
    case "upload_document":
      return "📄"
    case "generated_quiz":
      return "🧩"
    case "generated_flashcards":
      return "🧠"
    case "completed_quiz":
      return "✅"
    case "chat_question":
      return "💬"
    default:
      return "✨"
  }
}
