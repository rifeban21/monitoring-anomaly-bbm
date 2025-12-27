import api from "./axios"
import { cleanParams } from "./utils"

export const fetchAnomalies = (filter = {}) => {
  const params = {}

  if (filter.location_id) params.location_id = filter.location_id
  if (filter.product_id) params.product_id = filter.product_id
  return api.get("/anomalies", {params: cleanParams(params)})
}

export const createAnomalyManual = (data) => {
  return api.post("/anomalies", cleanParams(data))
}


