import Image from 'next/image'
import Link from 'next/link'
import { getNewProducts } from '@/lib/authLogin'
import BuyNowButton from "../component/BuyNowButton"

const getImageUrl = (url: string) => {
    if (!url) return "/placeholder-image.jpg"
    return url
  }

export default async function ProductsPage() {
  const products = await getNewProducts()

  const colorMap: Record<string, string> = {
    white: '#ffffff',
    red: '#ef4444',
    black: '#000000',
    green: '#22c55e',
    purple: '#9333ea',
    pink: '#ec4899',
  }

  return (
    <div className="min-h-screen bg-black px-6 py-12">
      {/* Page Title */}
      <h1 className="text-white text-4xl font-bold mb-10">
        Men’s Jordan Shoes
      </h1>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product: any, index: number) => {
          const defaultColor = product.variation_colors?.[0]
          const bgColor =
            colorMap[defaultColor?.color_name?.toLowerCase()] || '#22c55e'

          return (
            <div
              key={product.id}
              className="relative bg-[#1c1c1c] rounded-2xl overflow-hidden p-6 h-[460px] flex flex-col justify-between"
            >
              {/* Background Semi Circle */}
              <div
                className="absolute -top-20 -left-20 w-72 h-72 rounded-full"
                style={{ backgroundColor: bgColor }}
              />

              {/* Shoe Image */}
              <div className="relative z-10 flex justify-center mt-10">
                <Image
                  src={
                    defaultColor?.color_images?.[0] ||
                    product.product_images?.[0]?.product_image
                  }
                  alt={product.name}
                  width={260}
                  height={160}
                  className="object-contain rotate-[-20deg]"
                />
                <img
                  src={getImageUrl(
                    defaultColor?.color_images?.[0] ||
                    product.product_images?.[0]?.product_image
          )}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  
                />
              </div>

              {/* Product Info */}
              <div className="relative z-10 mt-6 text-white">
                <h2 className="text-lg font-semibold uppercase">
                  {product.name}
                </h2>

                {/* Sizes */}
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-sm text-gray-300">Size:</span>
                  {defaultColor?.sizes?.map((size: any) => (
                    <span
                      key={size.size_id}
                      className={`w-7 h-7 flex items-center justify-center rounded-md text-sm font-semibold
                        ${
                          size.status
                            ? 'bg-white text-black'
                            : 'bg-gray-600 text-gray-400'
                        }`}
                    >
                      {size.size_name}
                    </span>
                  ))}
                </div>

                {/* Colors */}
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-sm text-gray-300">Color:</span>
                  {product.variation_colors.map((color: any) => (
                    <span
                      key={color.color_id}
                      className="w-4 h-4 rounded-full border border-white/40"
                      style={{
                        backgroundColor:
                          colorMap[color.color_name.toLowerCase()] ||
                          '#ffffff',
                      }}
                    />
                  ))}
                </div>

                {/* Buy Button */}
               <BuyNowButton
  product={product}
  productId={product.id}
  variationProductId={defaultColor?.variation_product_id}
/>


              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
