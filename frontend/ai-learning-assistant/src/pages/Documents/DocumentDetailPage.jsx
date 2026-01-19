import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import DocumentChat from "../../components/documents/DocumentChat"
import { getDocumentById } from "../../services/documentService"

export default function DocumentDetailPage() {
  const { id } = useParams()
  const [title, setTitle] = useState("Құжат")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [id])

  const load = async () => {
    try {
      const data = await getDocumentById(id)
      setTitle(data.document?.title || "Құжат")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">
          {loading ? "Құжат ашылуда..." : title}
        </h1>

        <div className="flex gap-4 text-sm">
          <Link
            to={`/documents/${id}/flashcards`}
            className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700"
          >
            Флешкарталар
          </Link>

          <Link
            to={`/documents/${id}/quiz`}
            className="rounded-full bg-sky-100 px-3 py-1 text-sky-700"
          >
            Тесттер
          </Link>
        </div>
      </div>

      <div className="bg-white/80 border border-white/80 rounded-2xl p-6 shadow-[0_16px_32px_-28px_rgba(15,23,42,0.35)]">
        <h2 className="font-semibold mb-4">Құжат бойынша чат</h2>
        <DocumentChat docId={id} />
      </div>
    </div>
  )
}
