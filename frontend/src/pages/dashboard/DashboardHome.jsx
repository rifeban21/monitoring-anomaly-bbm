import DashboardLayout from "../../components/layout/DashboardLayout"
import { useEffect, useState } from "react"
import { fetchAnomalies } from "../../api/anomaly.api"
import { fetchLocations } from "../../api/locations.api"
import { fetchTransactions } from "../../api/transactions.api"

export default function DashboardHome() {
  const [locationsCount, setLocationsCount] = useState(0)
  const [transactionsToday, setTransactionsToday] = useState(0)
  const [anomaliesCount, setAnomaliesCount] = useState(0)
  const [topRisks, setTopRisks] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        // fetch locations
        const locRes = await fetchLocations()
        setLocationsCount(locRes.data?.length || 0)

        // fetch all transactions (date filter not supported by backend)
        const txnRes = await fetchTransactions()
        setTransactionsToday(txnRes.data?.length || 0)
        // fetch recent anomalies (no filters) and compute summary
        const anomRes = await fetchAnomalies({ min_risk: 0 })
        const items = anomRes.data || []
        setAnomaliesCount(items.length)
        const sorted = items.slice().sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0))
        setTopRisks(sorted.slice(0, 3))
      } catch (err) {
        // keep defaults on error
        console.error("Failed to load dashboard data:", err)
      }
    }
    load()
  }, [])
  return (
    <DashboardLayout>
      <h2 className="mb-4 text-xl font-bold">Ringkasan</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded bg-white p-4 shadow">
          <p className="text-sm text-gray-500">Total Lokasi</p>
          <p className="text-2xl font-bold">{locationsCount}</p>
        </div>

        <div className="rounded bg-white p-4 shadow">
          <p className="text-sm text-gray-500">Total Transaksi</p>
          <p className="text-2xl font-bold">{transactionsToday}</p>
        </div>

        <div className="rounded bg-white p-4 shadow">
          <p className="text-sm text-gray-500">Anomali</p>
          <p className="text-2xl font-bold text-red-500">{anomaliesCount}</p>
          {topRisks.length > 0 && (
            <ul className="mt-2 text-sm text-gray-700">
              {topRisks.map((t, i) => (
                <li key={i} className="truncate">
                  {t.product_name ?? '—'} @ {t.location_name ?? '—'} — {t.risk_score}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
