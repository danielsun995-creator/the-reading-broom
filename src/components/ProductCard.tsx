'use client'

import { useCartStore } from '@/store/cart'
import type { Product } from '@/lib/data'

interface ProductCardProps {
  product: Product
  compact?: boolean
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addItem, openCart } = useCartStore()

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
    })
    openCart()
  }

  if (compact) {
    return (
      <div
        className="flex-shrink-0 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        style={{ width: '200px', background: 'white', border: '1px solid #E5D5C0' }}
      >
        {/* Image area */}
        <div
          className="flex items-center justify-center text-5xl"
          style={{ height: '120px', background: '#F5F1E8' }}
        >
          {product.emoji}
        </div>

        <div className="p-3">
          {product.tag && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#F5F1E8', color: '#8B6F47' }}>
              {product.tag}
            </span>
          )}
          <h3 className="font-semibold text-sm mt-1 leading-tight" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
            {product.name}
          </h3>
          <p className="font-bold text-sm mt-1 mb-2" style={{ color: '#C9302C' }}>
            ${product.price.toLocaleString()}
          </p>
          <button
            onClick={handleAdd}
            className="w-full py-2 text-xs text-white rounded-lg font-medium hover:opacity-90 transition active:scale-95"
            style={{ background: '#8B6F47' }}
          >
            + Agregar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
      style={{ background: 'white', border: '2px solid #E5D5C0' }}
    >
      {/* Image area */}
      <div
        className="flex items-center justify-center text-7xl relative"
        style={{ height: '180px', background: '#F5F1E8' }}
      >
        {product.emoji}
        {product.isNew && (
          <span
            className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full text-white"
            style={{ background: '#FF7F50' }}
          >
            NUEVO
          </span>
        )}
      </div>

      <div className="p-4">
        {product.tag && (
          <span className="text-xs px-2 py-0.5 rounded-full mb-2 inline-block" style={{ background: '#F5F1E8', color: '#8B6F47' }}>
            {product.tag}
          </span>
        )}
        <h3 className="font-bold text-base mb-1" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
          {product.name}
        </h3>
        {product.author && (
          <p className="text-xs mb-2" style={{ color: '#888' }}>{product.author}</p>
        )}
        <p className="text-xs leading-relaxed mb-3" style={{ color: '#666' }}>
          {product.description.slice(0, 80)}...
        </p>
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: '#E5D5C0' }}>
          <span className="font-bold text-lg" style={{ color: '#C9302C' }}>
            ${product.price.toLocaleString()}
          </span>
          <button
            onClick={handleAdd}
            className="px-4 py-2 text-sm text-white rounded-lg font-medium hover:opacity-90 transition active:scale-95"
            style={{ background: '#8B6F47' }}
          >
            + Agregar
          </button>
        </div>
      </div>
    </div>
  )
}
