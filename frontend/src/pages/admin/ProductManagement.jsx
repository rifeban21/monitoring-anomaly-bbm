import { useEffect, useState } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/products.api"

export default function ProductManagement() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ name: "", unit: "liter" })
  const [editId, setEditId] = useState(null)

  const load = async () => {
    const res = await fetchProducts()
    setProducts(res.data)
  }

  useEffect(() => {
    load()
  }, [])

  const submit = async () => {
    if (editId) {
      await updateProduct(editId, form)
    } else {
      await createProduct(form)
    }
    setForm({ name: "", unit: "liter" })
    setEditId(null)
    load()
  }

  return (
    <DashboardLayout>
      <h2 className="mb-4 text-xl font-bold">Master Produk</h2>

      {/* Form */}
      <div className="mb-6 flex gap-2">
        <input
          placeholder="Nama Produk"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <select
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
          className="border rounded px-3 py-2"
        >
          <option value="liter">Liter</option>
          <option value="kg">Kg</option>
        </select>

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
            <th className="p-2">Satuan</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.unit}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => setEditId(p.id) || setForm(p)} className="text-blue-600">
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(p.id).then(load)}
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
