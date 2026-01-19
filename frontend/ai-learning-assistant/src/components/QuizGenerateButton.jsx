import { useState } from "react"
import axios from "../utils/axiosInstance"

export default function QuizGenerateButton({ documentId }) {
  const [loading, setLoading] = useState(false)
  const [quiz, setQuiz] = useState(null)

  const generate = async () => {
    setLoading(true)
    try {
      const res = await axios.post(`/documents/${documentId}/quiz`)
      setQuiz(res.data.quiz)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={generate}
        disabled={loading}
        className="bg-slate-900 text-white px-4 py-2 rounded-xl disabled:opacity-60"
      >
        {loading ? "Жасалуда..." : "Тестті жасау"}
      </button>

      {quiz && (
        <pre className="bg-white/80 border rounded-2xl p-3 text-sm overflow-x-auto">
          {JSON.stringify(quiz, null, 2)}
        </pre>
      )}
    </div>
  )
}
