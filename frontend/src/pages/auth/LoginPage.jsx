import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginApi } from "../../api/auth.api"
import { useAuthStore } from "../../store/authStore"

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const [form, setForm] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    try {
      setLoading(true)
      const res = await loginApi(form)
      login(res.data)
      navigate("/dashboard")
    } catch (err) {
      setError("Username atau password salah")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded bg-white p-6 shadow">
        <h1 className="mb-4 text-center text-xl font-bold">
          Login BBM Monitoring
        </h1>

        {error && (
          <div className="mb-3 rounded bg-red-100 p-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="mb-3 w-full rounded border px-3 py-2"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="mb-4 w-full rounded border px-3 py-2"
        />

        <button
          onClick={submit}
          disabled={loading}
          className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </div>
    </div>
  )
}
