import Image from "next/image"

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

  // Correct suffix logic
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
    <div className="min-h-screen bg-[#161616] flex flex-col items-center justify-center px-4">
      
      {/* Logo */}
      <div className="mb-6">
        <Image
          src="/Vector.png"
          width={120}
          height={120}
          alt="logo"
        />
      </div>

      {/* Title */}
      <h1 className="text-white text-[2.3rem] font-bold">Successfully Ordered!</h1>
      <p className="text-white/60 mt-2 text-[1rem]">
        {formatDate(new Date())}

      </p>

      {/* Order Card */}
      <div className="mt-10 bg-white/10 w-full max-w-xl rounded-2xl p-4 flex items-center gap-8">
        
        {/* Product Image */}
        <div className="w-34 h-26 rounded-xl overflow-hidden flex-shrink-0">
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
          <h3 className="text-white font-thin text-[1.3rem]">{product_name || "Product"}</h3>
          <p className="text-gray-400 text-[1rem]">QTY: {quantity || "1"}</p>
        </div>

        {/* Price Section */}
        <div className="flex gap-2 text-right">
  <p className="text-white font-thin text-[1.3rem]">₹{amount || "0"}</p>

  {price && (
    <p className="text-white line-through text-[1rem] mt-1 opacity-50">
      ₹{price}
    </p>
  )}
</div>
      </div>
    </div>
  )
}