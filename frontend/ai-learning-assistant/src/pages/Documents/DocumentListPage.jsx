import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getDocuments } from "../../services/documentService"
import DocumentUpload from "../../components/documents/DocumentUpload"

export default function DocumentListPage() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      const data = await getDocuments()
      setDocs(data.documents || [])
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p>Құжаттар жүктелуде...</p>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Құжаттар</h1>
          <p className="text-sm text-slate-500">
            Жүктелген файлдарыңыздың тізімі
          </p>
        </div>
        <DocumentUpload onUploaded={load} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map(doc => (
          <Link
            key={doc.id}
            to={`/documents/${doc.id}`}
            className="block rounded-2xl border border-white/80 bg-white/80 p-5 shadow-[0_16px_32px_-28px_rgba(15,23,42,0.35)] transition hover:-translate-y-1 hover:shadow-[0_24px_45px_-30px_rgba(15,23,42,0.4)]"
          >
            <h3 className="font-semibold mb-2 text-slate-900">{doc.title}</h3>
            <p className="text-sm text-slate-500">{doc.size} байт</p>

            <div className="flex gap-4 mt-4 text-xs font-medium">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                Флешкарталар
              </span>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-700">
                Тесттер
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
