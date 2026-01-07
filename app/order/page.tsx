"use client";

import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { getUserOrders } from "@/lib/api";
import { useEffect, useState } from "react";

interface Order {
  order_id: string;
  created_date: string;
  product_name: string;
  product_price: number;
  product_mrp: number;
  product_amount: number;
  quantity: number;
  product_image: string;
}

export default function OrdersPage() {
  const token = useAuthStore((s) => s.token);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getUserOrders(token!);
      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url: string) => {
    return url ? url : "/placeholder-image.jpg";
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <p className="text-white text-xl text-center">Please login to view your orders</p>
      </div>
    );
  }

  

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
        <p className="text-red-500 text-xl text-center">{error}</p>
        <button
          onClick={fetchOrders}
          className="mt-4 bg-white text-black py-2 px-4 rounded-lg font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
        <Image 
          src="/nike-logo.svg" 
          width={60} 
          height={60} 
          alt="logo" 
          className="w-12 h-12 md:w-16 md:h-16"
        />
        <h1 className="text-white text-2xl md:text-3xl font-bold mt-4">My Orders</h1>
        <p className="text-gray-400 mt-2">No orders found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161616] px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-8 lg:py-12">
      {/* HEADER */}
      <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-[3rem] font-medium mb-6 md:mb-8 lg:mb-10">
        My Orders
      </h1>

      {/* ORDERS LIST */}
      <div className="space-y-4 sm:space-y-6">
        {orders.map((order, index) => (
          <div
            key={index}
            className="bg-white/8 w-full xl:max-w-4xl rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row gap-4 sm:gap-6"
          >
            {/* Product Image */}
            <div className="w-full sm:w-32 h-48 sm:h-24 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={getImageUrl(order.product_image)}
                alt={order.product_name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col space-y-2 sm:space-y-3 flex-grow">
              <div>
                <h3 className="text-white font-thin text-lg sm:text-xl line-clamp-2">
                  {order.product_name}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                  {order.order_id}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <p className="text-gray-500 text-xs sm:text-sm">
                  {order.created_date}
                </p>
              </div>
            </div>

            {/* Price Section */}
            <div className="flex flex-col sm:items-end gap-1 sm:gap-2 mt-2 sm:mt-0">
              <div className="flex items-center gap-2">
                <p className="text-white font-thin text-lg sm:text-xl">
                  ₹{order.product_amount}
                </p>
                {order.product_price !== order.product_mrp && (
                  <p className="text-white line-through text-sm opacity-50">
                    ₹{order.product_mrp}
                  </p>
                )}
              </div>
              
              {/* For mobile: Show per item price */}
              <div className="block sm:hidden text-gray-400 text-xs">
                {order.quantity > 1 && (
                  <span>₹{(order.product_amount / order.quantity).toFixed(2)} each</span>
                )}
              </div>
              
              
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );
}