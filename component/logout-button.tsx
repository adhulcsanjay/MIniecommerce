"use client"

import { useRouter } from "next/navigation"

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    // Remove cookie
    document.cookie = "access_token=; Max-Age=0; path=/;"

    // Force SSR re-check
    router.refresh()

    // Redirect to home
    router.push("/")
  }

  return (
    <button onClick={handleLogout} className="text-red-600 font-medium">
      Logout
    </button>
  )
}
