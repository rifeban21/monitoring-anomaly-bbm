import { useAuthStore } from "../../store/authStore"

export default function Topbar() {
  const { user, logout } = useAuthStore()

  return (
    <header className="flex items-center justify-between bg-white px-6 py-3 shadow">
      <h1 className="text-lg font-semibold">Dashboard</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {user?.username} ({user?.role})
        </span>

        <button
          onClick={logout}
          className="rounded bg-red-500 px-3 py-1 text-sm text-white"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
