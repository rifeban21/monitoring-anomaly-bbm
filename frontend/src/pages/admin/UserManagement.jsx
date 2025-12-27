import { useEffect, useState } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { fetchUsers, createUser, deleteUser } from "../../api/users.api"

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const loadUsers = async () => {
    const res = await fetchUsers()
    setUsers(res.data)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleCreate = async () => {
    await createUser({
      username,
      password,
      role: "operator",
    })
    setUsername("")
    setPassword("")
    loadUsers()
  }

  return (
    <DashboardLayout>
      <h2 className="mb-4 text-xl font-bold">User Management</h2>

      {/* Form */}
      <div className="mb-6 flex gap-2">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="rounded border px-3 py-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="rounded border px-3 py-2"
        />
        <button
          onClick={handleCreate}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Tambah Operator
        </button>
      </div>

      {/* Table */}
      <table className="w-full rounded bg-white shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Username</th>
            <th className="p-2">Role</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.username}</td>
              <td className="p-2 text-center">{u.role}</td>
              <td className="p-2 text-center">
                <button
                  onClick={() => deleteUser(u.id).then(loadUsers)}
                  className="text-red-600"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  )
}
