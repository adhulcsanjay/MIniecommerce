// navbar.tsx
import Link from "next/link"
import Image from "next/image";
import { cookies } from "next/headers"
import AuthHydration from "../authhydration/authhydration"
import LogoutButton from "../logout-button"

export default async function Navbar() {
  const cookieStore = await cookies()
  const isAuth = cookieStore.has("access_token")

  return (
    <nav className="flex justify-between items-center py-6 bg-[#191919] px-16">
      
      <Link href="/" className="flex items-center">
                <Image src="/Vector.png" alt="logo" width={60} height={60}/>
       
      </Link>

      <div className="flex items-center gap-4">
        {isAuth ? (
          <LogoutButton /> 
        ) : (
          <Link href="/login" className="text-white font-bold">Login</Link>
        )}

        <AuthHydration isAuth={isAuth} />
      </div>
    </nav>
  )
}
