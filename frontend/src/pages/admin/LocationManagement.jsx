import { useEffect, useState } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"
import {
  fetchLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../../api/locations.api"

export default function LocationManagement() {
  const [locations, setLocations] = useState([])
  const [form, setForm] = useState({
    name: "",
    type: "SPBU",
    region: "",
  })
  const [editId, setEditId] = useState(null)

  const load = async () => {
    const res = await fetchLocations()
    setLocations(res.data)
  }

  useEffect(() => {
    load()
  }, [])

  const submit = async () => {
    if (editId) {
      await updateLocation(editId, form)
    } else {
      await createLocation(form)
    }
    setForm({ name: "", type: "SPBU", region: "" })
    setEditId(null)
    load()
  }

  const edit = (l) => {
    setEditId(l.id)
    setForm({ name: l.name, type: l.type, region: l.region })
  }

  return (
    <DashboardLayout>
      <h2 className="mb-4 text-xl font-bold">Master Lokasi</h2>

      {/* Form */}
      <div className="mb-6 flex gap-2">
        <input
          placeholder="Nama Lokasi"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          placeholder="Wilayah"
          value={form.region}
          onChange={(e) => setForm({ ...form, region: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <button
          onClick={submit}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          {editId ? "Update" : "Tambah"}
        </button>
      </div>

      {/* Table */}
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Nama</th>
            <th className="p-2">Tipe</th>
            <th className="p-2">Wilayah</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((l) => (
            <tr key={l.id} className="border-t">
              <td className="p-2">{l.name}</td>
              <td className="p-2">{l.type}</td>
              <td className="p-2">{l.region}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => edit(l)} className="text-blue-600">
                  Edit
                </button>
                <button
                  onClick={() => deleteLocation(l.id).then(load)}
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
