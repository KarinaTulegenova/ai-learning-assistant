import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import QuizQuestion from "../../components/quizzes/QuizQuestion"
import { generateQuiz, submitQuiz, getQuizHistory } from "../../services/quizService"

export default function QuizTakePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [history, setHistory] = useState([])

  useEffect(() => {
    load()
  }, [id])

  const load = async () => {
    setLoading(true)
    try {
      const data = await generateQuiz(id)
      setQuiz(data)
      const historyData = await getQuizHistory(id)
      setHistory(historyData.attempts || [])
    } catch {
      setQuiz(null)
    } finally {
      setLoading(false)
    }
  }

  const selectAnswer = (qId, answer) => {
    setAnswers({ ...answers, [qId]: answer })
  }

  const submit = async () => {
    if (!quiz?.id) return
    setSubmitting(true)
    try {
      const result = await submitQuiz(
        quiz.id,
        Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          answer
        }))
      )
      navigate("/quiz-result", { state: result })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p>Тест жүктелуде...</p>
  if (!quiz) return <p>Тест табылмады</p>

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Тест</h1>
          <p className="text-sm text-slate-500">
            Барлық сұрақтарға жауап беріп, нәтижені жіберіңіз.
          </p>
        </div>
        <button
          onClick={load}
          className="px-4 py-2 rounded-xl border"
        >
          Қайта жасау
        </button>
      </header>

      <div className="bg-white/80 border border-white/80 rounded-2xl p-6 shadow-[0_16px_32px_-28px_rgba(15,23,42,0.35)]">
        {quiz.questions.map(q => (
          <QuizQuestion
            key={q.id}
            question={q}
            selected={answers[q.id]}
            onAnswer={ans => selectAnswer(q.id, ans)}
          />
        ))}

        <button
          onClick={submit}
          disabled={submitting}
          className="mt-6 bg-emerald-500 text-white px-6 py-3 rounded-xl disabled:opacity-60"
        >
          {submitting ? "Жіберілуде..." : "Тесті тапсыру"}
        </button>
      </div>

      <section className="bg-white/80 border border-white/80 rounded-2xl p-6 shadow-[0_16px_32px_-28px_rgba(15,23,42,0.35)]">
        <h2 className="font-semibold mb-4">Соңғы нәтижелер</h2>
        {history.length === 0 ? (
          <p className="text-sm text-slate-500">Әзірге нәтиже жоқ.</p>
        ) : (
          <ul className="space-y-3 text-sm">
            {history.map(item => (
              <li key={item.id} className="flex items-center justify-between">
                <span className="text-slate-700">
                  Нәтиже {item.score} / {item.total}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
