import { Navigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

export default function OperatorRoute({ children }) {
  const { user } = useAuthStore()

  if (!user || user.role !== "operator") {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
