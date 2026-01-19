import { generateFlashcards } from "../../services/flashcardService"

export default function FlashcardListPage({ docId, onGenerated }) {
  const generate = async () => {
    await generateFlashcards(docId)
    if (onGenerated) onGenerated()
  }

  return (
    <button
      onClick={generate}
      className="px-4 py-2 rounded-xl bg-emerald-500 text-white"
    >
      Флешкарталарды жасау
    </button>
  )
}
