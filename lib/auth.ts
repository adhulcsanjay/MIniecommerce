import 'server-only'
import { cookies } from 'next/headers'

export async function isServerAuthenticated() {
  const cookieStore = await cookies()
  return cookieStore.has('access_token')
}
