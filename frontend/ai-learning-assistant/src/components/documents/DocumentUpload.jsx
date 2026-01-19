import { uploadDocument } from "../../services/documentService"

export default function DocumentUpload({ onUploaded }) {
  const upload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    await uploadDocument(file, file.name)
    onUploaded()
  }

  return (
    <label className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-600 cursor-pointer">
      <span>Құжат жүктеу</span>
      <input
        type="file"
        onChange={upload}
        accept=".pdf,.txt,.docx"
        className="hidden"
      />
    </label>
  )
}
