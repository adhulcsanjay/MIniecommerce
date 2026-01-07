"use client"

import Image from "next/image"
import { useAuthStore } from "@/store/useAuthStore"
import { getUserOrders } from "@/lib/authLogin"
import { useEffect, useState } from "react"

interface Order {
  order_id: string
  created_date: string
  product_name: string
  product_price: number
  product_mrp: number
  product_amount: number
  quantity: number
  product_image: string
}

export default function OrdersPage() {
  const token = useAuthStore((s) => s.token)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (token) fetchOrders()
  }, [token])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await getUserOrders(token!)
      setOrders(data.orders || [])
    } catch (err: any) {
      setError(err.message || "Failed to load orders")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

   const getImageUrl = (url: string) => {
    if (!url) return "/placeholder-image.jpg"
    return url
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Please login to view your orders</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Loading orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500 text-xl">{error}</p>
        <button
          onClick={fetchOrders}
          className="mt-4 bg-white text-black py-2 px-4 rounded-lg font-semibold"
        >
          Retry
        </button>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Image src="/nike-logo.svg" width={60} height={60} alt="logo" />
        <h1 className="text-white text-3xl font-bold mt-4">My Orders</h1>
        <p className="text-gray-400 mt-2">No orders found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black px-6 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
        
          <h1 className="text-white text-3xl font-bold mt-4">My Orders</h1>
        </div>

       
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order, index) => (
          <div key={index} className="bg-[#1c1c1c] rounded-xl p-6">
            
            

            {/* Single Item Row */}
            <div className="flex items-center gap-4 p-3 bg-[#1c1c1c] rounded-lg">
              
              {/* Product Image */}
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img
                  src={getImageUrl(order.product_image)}
                  alt={order.product_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23222222'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' fill='%23666' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"
                  }}
                />
              </div>

              {/* Item Details */}
              <div className="flex flex-col flex-grow">
                <h3 className="text-white font-semibold text-xl">{order.product_name}</h3>
                <h2 className=" text-white font-semibold">{order.order_id}</h2>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-gray-400 text-sm mt-10">{order.created_date}</p>
                </div>
              </div>

              {/* Item Amount */}
              <div className="text-right">
                <p className="text-white font-bold">₹{order.product_amount}</p>
                {order.product_price !== order.product_mrp && (
                  <p className="text-gray-500 line-through text-sm mt-1">
                    ₹{order.product_mrp}
                  </p>
                )}
              </div>
            </div>

           

          </div>
        ))}
      </div>

    
    </div>
  )
}
