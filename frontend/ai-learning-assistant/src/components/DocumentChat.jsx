import { useState } from "react"
import axios from "../utils/axiosInstance"

export default function DocumentChat({ documentId }) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")

  const ask = async () => {
    if (!question.trim() || !documentId) return
    const res = await axios.post(`/documents/${documentId}/chat`, {
      message: question
    })
    setAnswer(res.data.answer)
  }

  return (
    <div className="space-y-4">
      <textarea
        className="w-full border rounded-xl p-3"
        placeholder="Құжат бойынша сұрақ қойыңыз..."
        value={question}
        onChange={e => setQuestion(e.target.value)}
      />
      <button
        onClick={ask}
        className="bg-emerald-500 text-white px-4 py-2 rounded-xl"
      >
        Сұрау
      </button>

      {answer && (
        <div className="border p-3 rounded-xl bg-white/80">{answer}</div>
      )}
    </div>
  )
}
