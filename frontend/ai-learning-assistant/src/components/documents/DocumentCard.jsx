import { Link } from "react-router-dom"

export default function DocumentCard({ doc }) {
  return (
    <div className="border p-4 rounded-2xl bg-white/80">
      <h3 className="font-medium">{doc.title}</h3>
      <Link to={`/documents/${doc._id}`} className="text-emerald-600">
        Ашу
      </Link>
    </div>
  )
}
