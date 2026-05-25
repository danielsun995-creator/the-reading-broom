'use client'

import { useRef } from 'react'
import ProductCard from './ProductCard'
import type { Product } from '@/lib/data'

export default function NuevosTitulosCarousel({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -440 : 440, behavior: 'smooth' })
  }

  if (products.length === 0) return null

  return (
    <div className="relative">
      {/* Flecha izquierda */}
      <button
        onClick={() => scroll('left')}
        aria-label="Anterior"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full shadow-md flex items-center justify-center transition hover:scale-110 active:scale-95"
        style={{
          background: 'white',
          border: '1.5px solid #E5D5C0',
          color: '#8B6F47',
          marginLeft: '-8px',
        }}
      >
        ❮
      </button>

      {/* Contenedor con scroll */}
      <div
        ref={scrollRef}
        className="flex gap-4 pb-3 px-2"
        style={{
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {products.map((product) => (
          <div key={product.id} className="flex flex-col" style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
            <ProductCard product={product} compact />
          </div>
        ))}
      </div>

      {/* Flecha derecha */}
      <button
        onClick={() => scroll('right')}
        aria-label="Siguiente"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full shadow-md flex items-center justify-center transition hover:scale-110 active:scale-95"
        style={{
          background: 'white',
          border: '1.5px solid #E5D5C0',
          color: '#8B6F47',
          marginRight: '-8px',
        }}
      >
        ❯
      </button>
    </div>
  )
}
