import { Link, useLocation, useNavigate } from "react-router-dom"
import { logout } from "../../services/authService"
import { useAuth } from "../../context/AuthContext"

export default function AppLayout({ children }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { refreshMe } = useAuth()

  const handleLogout = async () => {
    await logout()
    await refreshMe()
    navigate("/auth/login")
  }

  const item = (path, label) => (
    <Link
      to={path}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition
        ${pathname === path
          ? "bg-emerald-200/70 text-emerald-900 shadow-sm"
          : "text-slate-600 hover:bg-white/70 hover:text-slate-900"}
      `}
    >
      {label}
    </Link>
  )

  return (
    <div className="min-h-screen flex">
      <aside className="w-72 border-r border-white/60 bg-white/70 backdrop-blur px-6 py-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-10 w-10 rounded-2xl bg-emerald-500/90 text-white flex items-center justify-center font-bold">
            ON
          </div>
          <div>
            <h1 className="text-xl font-semibold">ONIM</h1>
            <p className="text-xs text-slate-500">AI оқыту көмекшісі</p>
          </div>
        </div>

        <nav className="space-y-2">
          {item("/", "Бақылау тақтасы")}
          {item("/documents", "Құжаттар")}
          {item("/profile", "Профиль")}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-12 text-sm text-rose-500 hover:text-rose-600"
        >
          Шығу
        </button>
      </aside>

      <main className="flex-1 px-6 py-10 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  )
}
