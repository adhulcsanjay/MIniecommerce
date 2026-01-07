"use client"

import { useEffect } from "react"
import { useAuthStore } from "../../store/useAuthStore"

export default function AuthHydration({ isAuth }: { isAuth: boolean }) {
  const setToken = useAuthStore((s) => s.setToken)
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    if (isAuth) {
      // Load the token from cookies on client
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1]

      if (token) setToken(token)
    } else {
      // Clear Zustand state
      logout()

      // Clear localStorage
      localStorage.removeItem("auth-storage")

      // Remove cookie
      document.cookie = "access_token=; Max-Age=0; path=/;"
    }
  }, [isAuth])

  return null
}
