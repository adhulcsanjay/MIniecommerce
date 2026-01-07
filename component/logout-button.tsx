"use client"
import Image from "next/image";
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
    <div className="flex gap-2">
    <Image src="/UserCircle.png" alt="logo" width={25} height={25}/>
    <button onClick={handleLogout} className="text-white font-bold">
      Log Out
    </button>
    </div>
  )
}
