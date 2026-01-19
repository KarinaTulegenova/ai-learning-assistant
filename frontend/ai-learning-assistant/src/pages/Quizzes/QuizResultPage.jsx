import { useLocation, useNavigate } from "react-router-dom"

export default function QuizResultPage() {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state) {
    return <p>Нәтиже табылмады</p>
  }

  const { score, total, answers } = state
  const percent = Math.round((score / total) * 100)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-semibold mb-2">Тест нәтижесі</h1>
        <p className="text-slate-500">Жауаптарды қарап шығыңыз.</p>
      </header>

      <div className="border border-white/80 rounded-2xl p-6 bg-white/80 shadow-[0_16px_32px_-28px_rgba(15,23,42,0.35)]">
        <div className="flex items-center justify-between">
          <p className="text-lg">
            Нәтиже: <b>{score}</b> / {total}
          </p>
          <span className="text-sm text-slate-500">{percent}%</span>
        </div>
        <div className="h-2 mt-4 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-emerald-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <section className="space-y-4">
        {answers.map((a, i) => (
          <div key={i} className="border border-white/80 p-4 rounded-2xl bg-white/80">
            <p className="font-medium mb-2">{a.question}</p>
            <p className="text-sm">Сіздің жауабыңыз: {a.userAnswer}</p>
            <p className={a.correct ? "text-emerald-600 text-sm" : "text-rose-600 text-sm"}>
              {a.correct ? "Дұрыс" : `Дұрыс жауап: ${a.correctAnswer}`}
            </p>
          </div>
        ))}
      </section>

      <button
        onClick={() => navigate("/documents")}
        className="px-4 py-2 border rounded-xl"
      >
        Құжаттарға оралу
      </button>
    </div>
  )
}
