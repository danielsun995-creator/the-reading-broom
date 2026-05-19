'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import type { Product } from '@/lib/data'

interface ProductCardProps {
  product: Product
  compact?: boolean
}

function PriceDisplay({ price, promotionalPrice, size = 'normal' }: { price: number; promotionalPrice?: number; size?: 'small' | 'normal' | 'large' }) {
  const textSize = size === 'small' ? 'text-sm' : size === 'large' ? 'text-2xl' : 'text-base'
  const strikeSize = size === 'small' ? 'text-xs' : 'text-sm'

  if (promotionalPrice) {
    return (
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className={`font-bold ${textSize}`} style={{ color: '#C9302C' }}>
          ${promotionalPrice.toLocaleString()}
        </span>
        <span className={`line-through ${strikeSize}`} style={{ color: '#bbb' }}>
          ${price.toLocaleString()}
        </span>
      </div>
    )
  }
  return (
    <span className={`font-bold ${textSize}`} style={{ color: '#C9302C' }}>
      ${price.toLocaleString()}
    </span>
  )
}

function ProductImage({ product, height }: { product: Product; height: number }) {
  if (product.imageUrl) {
    return (
      <div className="relative overflow-hidden" style={{ height }}>
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 300px"
        />
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center" style={{ height, background: '#F5F1E8', fontSize: height * 0.35 }}>
      {product.emoji}
    </div>
  )
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addItem, openCart } = useCartStore()
  const outOfStock = product.stock !== undefined && product.stock <= 0

  const handleAdd = () => {
    if (outOfStock) return
    addItem({
      id: product.id,
      name: product.name,
      price: product.promotionalPrice ?? product.price,
      emoji: product.emoji,
    })
    openCart()
  }

  if (compact) {
    return (
      <div
        className="flex-shrink-0 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        style={{ width: '200px', background: 'white', border: '1px solid #E5D5C0' }}
      >
        <Link href={`/producto/${product.id}`}>
          <ProductImage product={product} height={120} />
        </Link>
        <div className="p-3">
          {product.tag && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#F5F1E8', color: '#8B6F47' }}>
              {product.tag}
            </span>
          )}
          <Link href={`/producto/${product.id}`}>
            <h3 className="font-semibold text-sm mt-1 leading-tight hover:underline" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
              {product.name}
            </h3>
          </Link>
          <div className="mt-1 mb-2">
            <PriceDisplay price={product.price} promotionalPrice={product.promotionalPrice} size="small" />
          </div>
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className="w-full py-2 text-xs text-white rounded-lg font-medium transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: outOfStock ? '#ccc' : '#8B6F47' }}
          >
            {outOfStock ? 'Sin stock' : '+ Agregar'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col"
      style={{ background: 'white', border: '2px solid #E5D5C0' }}
    >
      <Link href={`/producto/${product.id}`} className="relative">
        <ProductImage product={product} height={220} />
        {product.isNew && (
          <span className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full text-white" style={{ background: '#FF7F50' }}>
            NUEVO
          </span>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-sm font-bold px-3 py-1 rounded-full bg-white shadow" style={{ color: '#C9302C' }}>
              Sin stock
            </span>
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        {product.tag && (
          <span className="text-xs px-2 py-0.5 rounded-full mb-2 w-fit" style={{ background: '#F5F1E8', color: '#8B6F47' }}>
            {product.tag}
          </span>
        )}
        <Link href={`/producto/${product.id}`}>
          <h3 className="font-bold text-base mb-1 hover:underline leading-snug" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
            {product.name}
          </h3>
        </Link>
        {product.author && (
          <p className="text-xs mb-2" style={{ color: '#888' }}>{product.author}</p>
        )}
        <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: '#666' }}>
          {product.description.slice(0, 90)}{product.description.length > 90 ? '...' : ''}
        </p>
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: '#E5D5C0' }}>
          <PriceDisplay price={product.price} promotionalPrice={product.promotionalPrice} />
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className="px-4 py-2 text-sm text-white rounded-lg font-medium transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: outOfStock ? '#ccc' : '#8B6F47' }}
          >
            {outOfStock ? 'Sin stock' : '+ Agregar'}
          </button>
        </div>
      </div>
    </div>
  )
}
