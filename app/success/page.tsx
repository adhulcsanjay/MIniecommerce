import Image from "next/image"

const getImageUrl = (url: string) => {
  if (!url) return "/placeholder-image.jpg"
  return url
}

export default async function SuccessPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Await the searchParams promise
  const params = await searchParams
  
  const product_name = params.product_name as string | undefined
  const product_image = params.product_image as string | undefined
  const quantity = params.quantity as string | undefined
  const amount = params.amount as string | undefined
  const price = params.price as string | undefined

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      
      {/* Logo */}
      <div className="mb-6">
        <Image
          src="/nike-logo.svg"
          width={60}
          height={60}
          alt="logo"
        />
      </div>

      {/* Title */}
      <h1 className="text-white text-3xl font-bold">Successfully Ordered!</h1>
      <p className="text-gray-400 mt-2 text-sm">
        {new Date().toLocaleString()}
      </p>

      {/* Order Card */}
      <div className="mt-10 bg-[#1c1c1c] w-full max-w-xl rounded-xl p-4 flex items-center gap-4">
        
        {/* Product Image */}
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          {product_image && (
            <img
              src={getImageUrl(product_image)}
              alt={product_name || ""}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col flex-grow">
          <h3 className="text-white font-semibold">{product_name || "Product"}</h3>
          <p className="text-gray-400 text-sm">Qty: {quantity || "1"}</p>
        </div>

        {/* Price Section */}
        <div className="text-right">
          <p className="text-white font-bold text-lg">₹{amount || "0"}</p>

          {price && amount && price !== amount && (
            <p className="text-gray-500 line-through text-sm mt-1">
              ₹{price}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}