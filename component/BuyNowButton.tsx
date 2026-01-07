"use client"

import { useAuthStore } from "@/store/useAuthStore"
import { purchaseProduct } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function BuyNowButton({
  productId,
  variationProductId,
  product,
}: {
  productId: string
  variationProductId?: string
  product: any
}) {
  const token = useAuthStore((s) => s.token)
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleBuy = async () => {
    if (!token) {
      router.push("/login")
      return
    }

    try {
      setLoading(true)

      // Call the purchase API
      const response = await purchaseProduct(
        {
          product_id: productId,
          variation_product_id: variationProductId,
        },
        token
      )

      // Extract the first order detail from the response
      const orderDetail = response.order.order_details[0] || response.order_details[0]
      
      // Redirect to success with order details
       const params = new URLSearchParams({
    product_name: orderDetail.product_name || product.name,
    product_image: orderDetail.product_image || product.product_images?.[0]?.product_image,
    quantity: orderDetail.quantity?.toString() || "1",
    amount: orderDetail.amount?.toString() || product.price?.toString(),
    price: orderDetail.price?.toString() || product.price?.toString(),
  }).toString()

      router.push(`/success?${params.toString()}`)

    } catch (error) {
      console.error("Purchase failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleBuy}
      className="block mt-6 bg-white text-black p-[10px] w-[116px] h-[42px] text-[1rem] rounded-lg font-semibold"
      disabled={loading}
    >
      {loading ? "Processing..." : "Buy Now"}
    </button>
  )
}