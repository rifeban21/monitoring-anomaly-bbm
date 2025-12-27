import api from "./axios"

export const loginApi = (data) =>
  api.post("/auth/login", data)

export const refreshTokenApi = (refreshToken) =>
  api.post("/auth/refresh", { refresh_token: refreshToken })
