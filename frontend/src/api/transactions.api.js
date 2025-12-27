import api from "./axios"
import { cleanParams } from "./utils"

export const fetchTransactions = (filter = {}) => {
  const params = {}

  if (filter.location_id) params.location_id = filter.location_id
  if (filter.product_id) params.product_id = filter.product_id
  return api.get("/transactions", {params: cleanParams(params)})
}

export const createTransaction = (data) => {
  return api.post("/transactions", cleanParams(data))
}

export const deleteTransaction = (id) => {
  return api.delete(`/transactions/${id}`)
}
