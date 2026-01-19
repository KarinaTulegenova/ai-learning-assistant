import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { login as loginRequest } from "../../services/authService"
import { useAuth } from "../../context/AuthContext"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { refreshMe } = useAuth()
  const navigate = useNavigate()

  const submit = async () => {
    try {
      await loginRequest({ email, password })
      await refreshMe()
      navigate("/")
    } catch {
      alert("Кіру сәтсіз аяқталды")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/80 p-8 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.45)] backdrop-blur">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-lg font-semibold">
            ON
          </div>
          <h1 className="text-2xl font-semibold">Қайта оралу</h1>
          <p className="text-sm text-slate-500">
            Оқу жолыңызды жалғастыру үшін кіріңіз
          </p>
        </div>

        <div className="space-y-4">
          <input
            placeholder="Эл. пошта"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />

          <input
            type="password"
            placeholder="Құпиясөз"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />

          <button
            onClick={submit}
            className="w-full rounded-xl bg-emerald-500 text-white py-2.5 font-medium shadow-sm hover:bg-emerald-600"
          >
            Кіру
          </button>
        </div>

        <p className="text-sm text-center text-slate-500 mt-6">
          Тіркелмегенсіз бе?{" "}
          <Link to="/auth/register" className="text-emerald-700 font-medium">
            Тіркелу
          </Link>
        </p>
      </div>
    </div>
  )
}
