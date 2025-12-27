import { create } from "zustand"

export const useAuthStore = create((set) => ({
  token: localStorage.getItem("access_token") || null,
  refreshToken: localStorage.getItem("refresh_token") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,

  login: ({ access_token, refresh_token, user }) => {
    localStorage.setItem("access_token", access_token)
    localStorage.setItem("refresh_token", refresh_token)
    localStorage.setItem("user", JSON.stringify(user))
    set({ token: access_token, refreshToken: refresh_token, user })
  },

  logout: () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    set({ token: null, refreshToken: null, user: null })
  },

  setAccessToken: (token) => {
    localStorage.setItem("access_token", token)
    set({ token })
  },

  setRefreshToken: (refreshToken) => {
    localStorage.setItem("refresh_token", refreshToken)
    set({ refreshToken })
  },
}))
