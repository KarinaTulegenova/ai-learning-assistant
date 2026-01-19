import { useState } from "react"
import { askAI } from "../../services/aiService"

export default function DocumentChat({ docId }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim() || !docId) return

    const userMessage = { role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await askAI(docId, input)
      const aiMessage = {
        role: "assistant",
        content: res.answer || "Жауап әзірге жоқ."
      }
      setMessages(prev => [...prev, aiMessage])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Қате шықты. Қайта көріңіз." }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[500px] border rounded-2xl bg-white/70">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 mt-20">
            <p className="mb-1 font-medium">Әңгіме бастаңыз</p>
            <p className="text-sm">Құжат туралы кез келген сұрақ қойыңыз</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[72%] p-3 rounded-2xl text-sm shadow-sm ${
              m.role === "user"
                ? "bg-emerald-500 text-white ml-auto"
                : "bg-slate-100 text-slate-800"
            }`}
          >
            {m.content}
          </div>
        ))}

        {loading && (
          <div className="text-sm text-slate-400">AI жазып жатыр...</div>
        )}
      </div>

      <div className="border-t p-3 flex gap-2 bg-white/60">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Сұрақ жазыңыз..."
          className="flex-1 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
        <button
          onClick={send}
          className="bg-emerald-500 text-white px-4 rounded-xl"
        >
          Жіберу
        </button>
      </div>
    </div>
  )
}
