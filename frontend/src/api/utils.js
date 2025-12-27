export const cleanParams = (params = {}) => {
  const cleaned = {}
  Object.entries(params).forEach(([k, v]) => {
    if (v !== "" && v !== null && v !== undefined) {
      cleaned[k] = v
    }
  })
  return cleaned
}
