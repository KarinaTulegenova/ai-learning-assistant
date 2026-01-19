export default function QuizQuestion({ question, onAnswer, selected }) {
  return (
    <div className="mb-6">
      <h3 className="font-medium mb-3 text-slate-900">{question.question}</h3>

      <div className="space-y-2">
        {question.options.map((opt) => (
          <button
            key={opt}
            onClick={() => onAnswer(opt)}
            className={`block w-full text-left border px-4 py-3 rounded-xl transition
              ${selected === opt
                ? "bg-emerald-100 border-emerald-400"
                : "bg-white hover:bg-slate-50"}
            `}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
