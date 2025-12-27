import { useEffect, useState } from "react"
import DashboardLayout from "../../components/layout/DashboardLayout"
import { fetchAnomalies } from "../../api/anomaly.api"
import { fetchLocations } from "../../api/locations.api"
import { fetchProducts } from "../../api/products.api"

export default function AnomalyMonitoring() {
  const [data, setData] = useState([])
  const [locations, setLocations] = useState([])
  const [products, setProducts] = useState([])

  const [filter, setFilter] = useState({
    location_id: "",
    product_id: "",
    min_risk: 0,
  })

  const load = async () => {
    try {
      const res = await fetchAnomalies(filter)
      setData(res.data)
    } catch (err) {
      console.error("Gagal load anomaly:", err)
      alert("Gagal memuat data anomali")
    }
  }


  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  // load locations and products once on mount
  useEffect(() => {
    fetchLocations().then((r) => setLocations(r.data))
    fetchProducts().then((r) => setProducts(r.data))
  }, [])

  const badgeColor = (status) => {
    if (status === "ANOMALI") return "bg-red-100 text-red-700"
    if (status === "WASPADA") return "bg-yellow-100 text-yellow-700"
    return "bg-green-100 text-green-700"
  }

  return (
    <DashboardLayout>
      <h2 className="mb-4 text-xl font-bold">Monitoring Anomali Konsumsi</h2>

      {/* FILTER */}
      <div className="mb-6 flex gap-2">
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

        <select
          value={filter.min_risk}
          onChange={(e) => setFilter({ ...filter, min_risk: Number(e.target.value) })}
          className="border rounded px-3 py-2"
        >
          <option value="0">Semua Risiko</option>
          <option value="50">≥ 50</option>
          <option value="70">≥ 70</option>
          <option value="85">≥ 85</option>
        </select>

        <button
          onClick={() => {
            console.log("filter:", filter)
            load()
          }}
          className="rounded bg-gray-800 px-4 py-2 text-white"
        >
          Terapkan
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
            <th className="p-2">Baseline</th>
            <th className="p-2">Risk</th>
            <th className="p-2">Status</th>
            <th className="p-2">Alasan</th>
          </tr>
        </thead>
        <tbody>
          {data.map((a) => (
            <tr key={a.transaction_id} className="border-t">
              <td className="p-2">{a.date}</td>
              <td className="p-2">{a.location_name}</td>
              <td className="p-2">{a.product_name}</td>
              <td className="p-2 font-semibold">{a.volume}</td>
              <td className="p-2 text-gray-600">{a.baseline}</td>
              <td className="p-2 font-bold">{a.risk_score}</td>
              <td className="p-2">
                <span className={`rounded px-2 py-1 text-xs ${badgeColor(a.status)}`}>
                  {a.status}
                </span>
              </td>
              <td className="p-2 text-sm">
                <ul className="list-disc pl-4">
                  {a.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  )
}
