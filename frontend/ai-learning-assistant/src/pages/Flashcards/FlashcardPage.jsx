import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Flashcard from "../../components/flashcards/Flashcard"
import {
  getFlashcardsByDocument,
  generateFlashcards
} from "../../services/flashcardService"

export default function FlashcardPage() {
  const { id } = useParams()

  const [cards, setCards] = useState([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)
  const [generatedAt, setGeneratedAt] = useState(null)

  useEffect(() => {
    load()
  }, [id])

  const load = async () => {
    try {
      const data = await getFlashcardsByDocument(id)
      setCards(data.flashcards || [])
      setGeneratedAt(data.createdAt || null)
      setIndex(0)
      setFlipped(false)
    } finally {
      setLoading(false)
    }
  }

  const regenerate = async () => {
    setRegenerating(true)
    try {
      const data = await generateFlashcards(id)
      setCards(data.flashcards || [])
      setGeneratedAt(data.createdAt || new Date().toISOString())
      setIndex(0)
      setFlipped(false)
    } finally {
      setRegenerating(false)
    }
  }

  if (loading) {
    return <p>Флешкарталар жүктелуде...</p>
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Флешкарталар</h1>
          <p className="text-sm text-slate-500">
            {generatedAt
              ? `Соңғы генерация: ${new Date(generatedAt).toLocaleString()}`
              : "Құжаттан флешкарталар жасаңыз."}
          </p>
        </div>
        <button
          onClick={regenerate}
          disabled={regenerating}
          className="bg-emerald-500 text-white px-4 py-2 rounded-xl disabled:opacity-60"
        >
          {regenerating ? "Қайта жасалуда..." : "Қайта жасау"}
        </button>
      </header>

      {cards.length === 0 ? (
        <div className="border rounded-2xl p-10 text-center bg-white/80">
          <p className="text-slate-500 mb-4">Әзірге флешкарталар жоқ.</p>
          <button
            onClick={regenerate}
            disabled={regenerating}
            className="bg-emerald-500 text-white px-5 py-2 rounded-xl disabled:opacity-60"
          >
            Флешкарталарды жасау
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Карточка {index + 1} / {cards.length}
            </p>
            <div className="h-2 flex-1 mx-4 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-emerald-500"
                style={{ width: `${((index + 1) / cards.length) * 100}%` }}
              />
            </div>
          </div>

          <Flashcard
            front={cards[index].question}
            back={cards[index].answer}
            flipped={flipped}
            onFlip={() => setFlipped(!flipped)}
          />

          <div className="flex justify-between items-center">
            <button
              disabled={index === 0}
              onClick={() => {
                setIndex(index - 1)
                setFlipped(false)
              }}
              className="px-4 py-2 border rounded-xl disabled:opacity-40"
            >
              Алдыңғы
            </button>

            <button
              disabled={index === cards.length - 1}
              onClick={() => {
                setIndex(index + 1)
                setFlipped(false)
              }}
              className="px-4 py-2 border rounded-xl disabled:opacity-40"
            >
              Келесі
            </button>
          </div>
        </>
      )}
    </div>
  )
}
