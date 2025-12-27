import { useEffect, useState } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { fetchTransactions, createTransaction, deleteTransaction } from "../../api/transactions.api"
import { fetchLocations } from "../../api/locations.api"
import { fetchProducts } from "../../api/products.api"

export default function TransactionPage() {
  const [transactions, setTransactions] = useState([])
  const [locations, setLocations] = useState([])
  const [products, setProducts] = useState([])

  const [form, setForm] = useState({
    date: "",
    location_id: "",
    product_id: "",
    volume: "",
    note: "",
  })

  const [filter, setFilter] = useState({
    location_id: "",
    product_id: "",
  })

  const loadData = async () => {
    const [trx, loc, prod] = await Promise.all([
      fetchTransactions(filter),
      fetchLocations(),
      fetchProducts(),
    ])

    setTransactions(trx.data)
    setLocations(loc.data)
    setProducts(prod.data)
  }

  useEffect(() => {
    loadData()
  }, [filter])

  const submit = async () => {
    if (
      !form.date ||
      !form.location_id ||
      !form.product_id ||
      !form.volume
    ) {
      alert("Semua field wajib diisi")
      return
    }

    await createTransaction({
      date: form.date,
      location_id: parseInt(form.location_id),
      product_id: parseInt(form.product_id),
      volume: parseFloat(form.volume),
      note: form.note || null,
    })
    setForm({ date: "", location_id: "", product_id: "", volume: "", note: "" })
    loadData()
  }

  return (
    <DashboardLayout>
      <h2 className="mb-4 text-xl font-bold">Input Transaksi Konsumsi</h2>

      {/* FORM */}
      <div className="mb-6 grid grid-cols-5 gap-2">
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="border rounded px-3 py-2"
        />

        <select
          value={form.location_id}
          onChange={(e) => setForm({ ...form, location_id: e.target.value })}
          className="border rounded px-3 py-2"
        >
          <option value="">Pilih Lokasi</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>

        <select
          value={form.product_id}
          onChange={(e) => setForm({ ...form, product_id: e.target.value })}
          className="border rounded px-3 py-2"
        >
          <option value="">Pilih Produk</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Volume"
          value={form.volume}
          onChange={(e) => setForm({ ...form, volume: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Catatan (opsional)"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className="border rounded px-3 py-2"
        />

        <button
          onClick={submit}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Simpan
        </button>
      </div>

      {/* FILTER */}
      <div className="mb-4 flex gap-2">
        <select
          value={filter.location_id}
          onChange={(e) => setFilter({ ...filter, location_id: e.target.value })}
          className="border rounded px-3 py-2"
        >
          <option value="">Semua Lokasi</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>

        <select
          value={filter.product_id}
          onChange={(e) => setFilter({ ...filter, product_id: e.target.value })}
          className="border rounded px-3 py-2"
        >
          <option value="">Semua Produk</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <button
          onClick={loadData}
          className="rounded bg-gray-700 px-4 py-2 text-white"
        >
          Filter
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Tanggal</th>
            <th className="p-2">Lokasi</th>
            <th className="p-2">Produk</th>
            <th className="p-2">Volume</th>
            <th className="p-2">Catatan</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-t">
              <td className="p-2">{t.date}</td>
              <td className="p-2">{t.location_name}</td>
              <td className="p-2">{t.product_name}</td>
              <td className="p-2">{t.volume}</td>
              <td className="p-2">{t.note}</td>
              <td className="p-2">
                <button
                  onClick={() => deleteTransaction(t.id).then(loadData)}
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
