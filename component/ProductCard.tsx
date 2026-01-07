'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Image from 'next/image'
import BuyNowButton from "../component/BuyNowButton"

interface ProductCardProps {
  product: any
  colorMap: Record<string, string>
  imageUrl: string // Changed from getImageUrl function to imageUrl string
}

export default function ProductCard({ product, colorMap, imageUrl }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardRef.current || !imageRef.current || !infoRef.current) return

    // Set initial state
    gsap.set(infoRef.current, {
      y: 100,
      opacity: 0,
      display: 'none'
    })

    gsap.set(imageRef.current, {
      y: 0
    })

    // Create timeline for hover animation
    const tl = gsap.timeline({ paused: true })

    tl.to(imageRef.current, {
      y: -100,
      duration: 0.4,
      ease: "power2.out"
    })
      .to(infoRef.current, {
        display: 'block',
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.4")

    // Event listeners
    const handleMouseEnter = () => tl.play()
    const handleMouseLeave = () => tl.reverse()

    const card = cardRef.current
    card.addEventListener('mouseenter', handleMouseEnter)
    card.addEventListener('mouseleave', handleMouseLeave)

    // Cleanup
    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter)
      card.removeEventListener('mouseleave', handleMouseLeave)
      tl.kill()
    }
  }, [])

  const defaultColor = product.variation_colors?.[0]

  return (
    <div
      ref={cardRef}
      className="relative bg-[#232323] overflow-hidden p-6 h-[430px] flex flex-col cursor-pointer group"
    >

      <div
        ref={imageRef}
        className="absolute inset-0 flex items-center justify-center  z-10"
      >
        {/* Using regular img tag since we already have the full URL */}
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Info Block - Hidden initially */}
      <div
        ref={infoRef}
        className="relative z-20 mt-auto pt-4"
      >
      

        {/* Sizes - Centered */}
        <div className="mb-3">
          <div className="flex flex-col items-center gap-2">
            
            <div className="flex items-center justify-center gap-2">
              <div>
              <span className="text-md text-gray-300 mb-2">SIZE:</span>
              </div>
              {defaultColor?.sizes?.map((size: any) => (
                <span
                  key={size.size_id}
                  className={`
              w-9 h-9 flex items-center justify-center rounded-md text-sm font-semibold cursor-pointer
              transition-all duration-300
              ${size.status
                      ? "bg-[#2A1A1A] text-white"   // selected style
                      : "bg-white text-black"        // normal style
                    }
            `}
                >
                  {size.size_name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Colors - Centered */}
        <div>
          <div className="flex flex-col items-center gap-2">
            
            <div className="flex items-center justify-center gap-3">
              <div>
                <span className="text-md text-gray-300 mb-2">COLOR:</span>
              </div>
              
              {product.variation_colors.map((color: any) => {
                const isSelected = color.color_id === defaultColor?.color_id;
                return (
                  <span
                    key={color.color_id}
                    className={`
                w-5 h-5 rounded-full cursor-pointer
                transition-all duration-300
                ${isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-black" : ""}
              `}
                    style={{
                      backgroundColor:
                        colorMap[color.color_name.toLowerCase()] || "#ffffff",
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Buy Button - Centered */}
        <div className="flex justify-center">
          <BuyNowButton
            product={product}
            productId={product.id}
            variationProductId={defaultColor?.variation_product_id}
          />
        </div>
      </div>
    </div>
  )
}