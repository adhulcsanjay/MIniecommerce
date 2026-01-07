import Image from "next/image"
import Link from "next/link"

const getImageUrl = (url: string) => {
  if (!url) return "/placeholder-image.jpg"
  return url
}

function formatDate(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  return `${hour12}:${minutes} ${ampm}, ${day}${suffix} ${month} ${year}`;
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
  const order_id = params.order_id as string | undefined

  return (
    <div className="min-h-screen bg-[#161616] flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-10">

       <div className="mb-6">
        <Image
          src="/Vector.png"
          width={120}
          height={120}
          alt="logo"
        />
      </div>

      {/* Title */}
      <h1 className="text-white text-2xl sm:text-3xl md:text-4xl xl:text-[2.3rem] font-bold text-center">
        Successfully Ordered!
      </h1>
      
      <p className="text-white/60 mt-2 text-sm sm:text-base xl:text-[1rem] text-center">
        {formatDate(new Date())}
      </p>

      {/* Order Card */}
      <div className="mt-6 sm:mt-8 md:mt-10 bg-white/10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8">
        
        {/* Product Image */}
        <div className="w-full sm:w-28 md:w-32 xl:w-34 h-40 sm:h-24 md:h-26 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0">
          {product_image ? (
            <img
              src={getImageUrl(product_image)}
              alt={product_name || ""}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}
        </div>

        {/* Product Details & Price Container */}
        <div className="flex-1 w-full flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 sm:gap-0">
          
          {/* Product Details */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h3 className="text-white font-thin text-lg sm:text-xl xl:text-[1.3rem] line-clamp-2">
              {product_name || "Product"}
            </h3>
            <p className="text-gray-400 text-sm sm:text-base xl:text-[1rem] mt-1">
              QTY: {quantity || "1"}
            </p>
            
            {/* Order ID - show on mobile only */}
            {order_id && (
              <p className="text-gray-500 text-xs mt-1 sm:hidden">
                Order: {order_id}
              </p>
            )}
          </div>

          {/* Price Section */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-2">
              <p className="text-white font-thin text-lg sm:text-xl xl:text-[1.3rem]">
                ₹{amount || "0"}
              </p>
              
              {price && (
                <p className="text-white line-through text-sm sm:text-base xl:text-[1rem] opacity-50">
                  ₹{price}
                </p>
              )}
            </div>
            
            {/* Per item price for multiple quantities */}
            {quantity && parseInt(quantity) > 1 && (
              <p className="text-gray-400 text-xs mt-1 sm:mt-0 sm:ml-2">
                (₹{(parseInt(amount || "0") / parseInt(quantity)).toFixed(2)} each)
              </p>
            )}
          </div>
        </div>

        {/* Order ID - show on desktop only */}
        {order_id && (
          <div className="hidden sm:block absolute top-4 right-4">
            <p className="text-gray-500 text-xs">
              Order: {order_id}
            </p>
          </div>
        )}
      </div>

      {/* Order ID for tablet and above */}
      {order_id && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white/5 rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <p className="text-white text-sm sm:text-base text-center">
            Order ID: <span className="font-mono text-gray-300">{order_id}</span>
          </p>
          <p className="text-gray-400 text-xs sm:text-sm text-center mt-1">
            Keep this for reference
          </p>
        </div>
      )}

      {/* Action Buttons - Using Link components */}
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
       
        
        <Link
          href="/order"
          className="bg-transparent border border-white text-white py-2 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base hover:bg-white/10 transition-colors text-center"
        >
          View All Orders
        </Link>
      </div>
    </div>
  )
}