import { useState } from "react"
import { Link } from "react-router-dom"
import { register } from "../../services/authService"

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", password: "" })

  const submit = async () => {
    try {
      await register(form)
      window.location.href = "/auth/login"
    } catch {
      alert("Тіркелу сәтсіз аяқталды")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/80 p-8 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.45)] backdrop-blur">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-amber-400 text-white flex items-center justify-center text-lg font-semibold">
            ++
          </div>
          <h1 className="text-2xl font-semibold">Жаңа аккаунт</h1>
          <p className="text-sm text-slate-500">
            ONIM платформасына тіркеліп, оқу жоспарын бастаңыз
          </p>
        </div>

        <div className="space-y-4">
          <input
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-200"
            placeholder="Эл. пошта"
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-200"
            type="password"
            placeholder="Құпиясөз"
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <button
            className="w-full rounded-xl bg-slate-900 text-white py-2.5 font-medium hover:bg-slate-800"
            onClick={submit}
          >
            Тіркелу
          </button>
        </div>

        <p className="text-sm text-center text-slate-500 mt-6">
          Аккаунт бар ма?{" "}
          <Link to="/auth/login" className="text-slate-900 font-medium">
            Кіру
          </Link>
        </p>
      </div>
    </div>
  )
}
