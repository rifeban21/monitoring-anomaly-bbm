import { Link } from "react-router-dom"

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white">
      <div className="p-4 text-xl font-bold">
        BBM Monitor
      </div>

      <nav className="space-y-2 px-4">
        <Link to="/dashboard" className="block rounded px-3 py-2 hover:bg-slate-800">
          Dashboard
        </Link>

        <Link to="/admin/users" className="block rounded px-3 py-2 hover:bg-slate-800">
          User Management
        </Link>

        <Link to="/admin/locations" className="block rounded px-3 py-2 hover:bg-slate-800">
          Master Lokasi
        </Link>

        <Link to="/admin/products" className="block rounded px-3 py-2 hover:bg-slate-800">
          Master Produk
        </Link>

        <Link to="/transactions" className="block rounded px-3 py-2 hover:bg-slate-800">
          Input Transaksi
        </Link>

        <Link to="/anomalies" className="block rounded px-3 py-2 hover:bg-slate-800">
          Monitoring Anomali
        </Link>

      </nav>
    </aside>
  )
}
