// navbar.tsx
import Link from "next/link"
import { cookies } from "next/headers"
import AuthHydration from "../authhydration/authhydration"
import LogoutButton from "../logout-button"

export default async function Navbar() {
  const cookieStore = await cookies()
  const isAuth = cookieStore.has("access_token")

  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b">
      <Link href="/" className="font-bold text-lg">MiniShop</Link>

      <div className="flex items-center gap-4">
        {isAuth ? (
          <LogoutButton /> 
        ) : (
          <Link href="/login" className="text-blue-600">Login</Link>
        )}

        <AuthHydration isAuth={isAuth} />
      </div>
    </nav>
  )
}
