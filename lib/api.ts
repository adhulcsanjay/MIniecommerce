import { CONFIG } from './config'

// 1️⃣ Verify OTP
export async function verifyUser(phone_number: string) {
  const res = await fetch(`${CONFIG.API_BASE_URL}/api/verify/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone_number }),
  })
  if (!res.ok) throw new Error((await res.json()).message || 'Verify failed')
  return res.json()
}

// 2️⃣ Login/Register
export async function loginRegister(data: {
  name?: string
  phone_number: string
  unique_id?: string
}) {
  const res = await fetch(`${CONFIG.API_BASE_URL}/api/login-register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error((await res.json()).message || 'Login/Register failed')
  return res.json()
}

// 3️⃣ Purchase Product
export async function purchaseProduct(data: { product_id?: string; variation_product_id?: string }, token: string) {
  const res = await fetch(`${CONFIG.API_BASE_URL}/api/purchase-product/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error((await res.json()).message || 'Purchase failed')
  return res.json()
}

// 4️⃣ User Orders
export async function getUserOrders(token: string) {
  const res = await fetch(`${CONFIG.API_BASE_URL}/api/user-orders/`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error((await res.json()).message || 'Fetch orders failed')
  return res.json()
}

// 5️⃣ New Products
export async function getNewProducts() {
  const url = `${CONFIG.API_BASE_URL}/api/new-products/`;
  console.log('Fetching from URL:', url); // Add this line
  
  const res = await fetch(url, { method: 'GET' })
  if (!res.ok) throw new Error((await res.json()).message || 'Fetch products failed')
  return res.json()
}
