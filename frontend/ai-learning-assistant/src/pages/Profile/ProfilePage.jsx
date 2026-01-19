import { useAuth } from "../../context/AuthContext"

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Профиль</h1>
      <div className="rounded-2xl border border-white/80 bg-white/80 p-6 shadow-[0_16px_32px_-28px_rgba(15,23,42,0.35)]">
        <p className="text-sm text-slate-500">Эл. пошта</p>
        <p className="text-lg font-medium text-slate-900">{user?.email}</p>
      </div>
    </div>
  )
}
