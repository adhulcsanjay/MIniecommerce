
import { getNewProducts } from '@/lib/api'
import ProductCard from '../component/ProductCard'

// This function will be used inside the server component only
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
    <div className="min-h-screen bg-[#161616] px-12 py-12">
      {/* Page Title */}
      <h1 className="text-white text-4xl font-bold mb-10">
        Men's Jordan Shoes
      </h1>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product: any) => {
          const defaultColor = product.variation_colors?.[0]
          const imageUrl = getImageUrl(
            defaultColor?.color_images?.[0] ||
            product.product_images?.[0]?.product_image
          )
          
          return (
            <ProductCard
              key={product.id}
              product={product}
              colorMap={colorMap}
              imageUrl={imageUrl} 
            />
          )
        })}
      </div>
    </div>
  )
}