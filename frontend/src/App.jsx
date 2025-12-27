import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import PrivateRoute from "./routes/PrivateRoute"
import AdminRoute from "./routes/AdminRoute"
import OperatorRoute from "./routes/OperatorRoute"

import DashboardHome from "./pages/dashboard/DashboardHome"
import TransactionPage from "./pages/transactions/TransactionPage"
import AnomalyMonitoring from "./pages/anomaly/AnomalyMonitoring"
import UserManagement from "./pages/admin/UserManagement"
import LocationManagement from "./pages/admin/LocationManagement"
import ProductManagement from "./pages/admin/ProductManagement"
import LoginPage from "./pages/auth/LoginPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />

        {/* PRIVATE */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardHome />
            </PrivateRoute>
          }
        />

        {/* OPERATOR */}
        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <OperatorRoute>
                <TransactionPage />
              </OperatorRoute>
            </PrivateRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/anomalies"
          element={
            <PrivateRoute>
              <AdminRoute>
                <AnomalyMonitoring />
              </AdminRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <PrivateRoute>
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/locations"
          element={
            <PrivateRoute>
              <AdminRoute>
                <LocationManagement />
              </AdminRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <PrivateRoute>
              <AdminRoute>
                <ProductManagement />
              </AdminRoute>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
