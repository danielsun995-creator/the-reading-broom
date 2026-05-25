'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { useCartStore } from '@/store/cart'
import type { Product } from '@/lib/data'
import RestockButton from './RestockButton'

interface ProductCardProps {
  product: Product
  compact?: boolean
}

const TOOLTIP_W = 300
const TOOLTIP_H = 400

function PriceDisplay({ price, promotionalPrice, size = 'normal' }: {
  price: number; promotionalPrice?: number; size?: 'small' | 'normal' | 'large'
}) {
  const textSize = size === 'small' ? 'text-sm' : size === 'large' ? 'text-2xl' : 'text-base'
  const strikeSize = size === 'small' ? 'text-xs' : 'text-sm'
  if (promotionalPrice) {
    return (
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className={`font-bold ${textSize}`} style={{ color: '#C9302C' }}>${promotionalPrice.toLocaleString()}</span>
        <span className={`line-through ${strikeSize}`} style={{ color: '#bbb' }}>${price.toLocaleString()}</span>
      </div>
    )
  }
  return <span className={`font-bold ${textSize}`} style={{ color: '#C9302C' }}>${price.toLocaleString()}</span>
}

function ProductImage({ product, height }: { product: Product; height: number }) {
  if (product.imageUrl) {
    return (
      <div className="relative overflow-hidden" style={{ height }}>
        <Image src={product.imageUrl} alt={product.name} fill className="object-cover"
          sizes="(max-width: 768px) 50vw, 300px" />
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center" style={{ height, background: '#F5F1E8', fontSize: height * 0.35 }}>
      {product.emoji}
    </div>
  )
}

function VariantPills({
  product,
  selectedId,
  onSelect,
  small = false,
}: {
  product: Product
  selectedId: string | null
  onSelect: (id: string | null) => void
  small?: boolean
}) {
  if (!product.variants || product.variants.length === 0) return null
  return (
    <div className={`flex flex-wrap gap-1 ${small ? 'mb-1.5' : 'mb-2'}`}>
      {product.variants.map((v) => {
        const isSelected = selectedId === v.id
        const unavailable = v.stock <= 0
        return (
          <button
            key={v.id}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (!unavailable) onSelect(isSelected ? null : v.id)
            }}
            disabled={unavailable}
            className="transition-all"
            style={{
              fontSize: small ? 10 : 11,
              padding: small ? '1px 8px' : '2px 10px',
              borderRadius: 999,
              background: isSelected ? '#8B6F47' : 'white',
              color: isSelected ? 'white' : unavailable ? '#bbb' : '#8B6F47',
              border: `1px solid ${isSelected ? '#8B6F47' : unavailable ? '#ddd' : '#D4AF8C'}`,
              cursor: unavailable ? 'not-allowed' : 'pointer',
              textDecoration: unavailable ? 'line-through' : 'none',
              opacity: unavailable ? 0.5 : 1,
              boxShadow: isSelected ? '0 0 0 2px rgba(139,111,71,0.2)' : 'none',
            }}
          >
            {v.name}
          </button>
        )
      })}
    </div>
  )
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addItem, openCart } = useCartStore()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [tooltipPos, setTooltipPos] = useState<{
    showLeft: boolean
    top: number
    fixed: boolean
    leftPx?: number   // viewport X (fixed only, showing right)
    rightPx?: number  // distance from right edge (fixed only, showing left)
  } | null>(null)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)

  const hasVariants = !!(product.variants && product.variants.length > 0)
  const selectedVariant = hasVariants
    ? (product.variants!.find((v) => v.id === selectedVariantId) ?? null)
    : null
  const allVariantsOutOfStock = hasVariants && product.variants!.every((v) => v.stock <= 0)
  const selectedVariantOutOfStock = selectedVariant !== null && selectedVariant.stock <= 0
  const baseOutOfStock = !hasVariants && product.stock !== undefined && product.stock <= 0
  const outOfStock = hasVariants
    ? allVariantsOutOfStock || selectedVariantOutOfStock
    : baseOutOfStock

  const needsVariantSelection = hasVariants && !selectedVariantId

  const handleAdd = () => {
    if (needsVariantSelection || outOfStock) return
    const cartId = selectedVariantId ? `${product.id}::${selectedVariantId}` : product.id
    const displayName = selectedVariant ? `${product.name} — ${selectedVariant.name}` : product.name
    addItem({
      id: cartId,
      productId: selectedVariantId ? product.id : undefined,
      name: displayName,
      price: product.promotionalPrice ?? product.price,
      emoji: product.emoji,
      imageUrl: product.imageUrl ?? undefined,
      variantId: selectedVariantId ?? undefined,
      variantName: selectedVariant?.name ?? undefined,
    })
    openCart()
  }

  function handleImageEnter(e: React.MouseEvent<HTMLElement>) {
    if (!product.imageUrl || !wrapperRef.current) return
    const imageRect = e.currentTarget.getBoundingClientRect()
    const showLeft = imageRect.right + TOOLTIP_W + 16 > window.innerWidth
    let top = imageRect.top + (imageRect.height - TOOLTIP_H) / 2
    top = Math.max(8, Math.min(window.innerHeight - TOOLTIP_H - 8, top))

    if (compact) {
      // position:fixed para escapar el contenedor overflow-x-auto
      setTooltipPos({
        showLeft, top, fixed: true,
        leftPx: showLeft ? undefined : imageRect.right + 12,
        rightPx: showLeft ? window.innerWidth - imageRect.left + 12 : undefined,
      })
    } else {
      // position:absolute relativo al wrapper
      const wrapperRect = wrapperRef.current.getBoundingClientRect()
      setTooltipPos({ showLeft, top: top - wrapperRect.top, fixed: false })
    }
  }

  const tooltip = tooltipPos && product.imageUrl && (
    <div
      className="pointer-events-none flex items-center"
      style={{
        position: tooltipPos.fixed ? 'fixed' : 'absolute',
        zIndex: 9999,
        top: tooltipPos.top,
        ...(tooltipPos.fixed
          ? tooltipPos.showLeft
            ? { right: tooltipPos.rightPx, flexDirection: 'row-reverse' as const }
            : { left: tooltipPos.leftPx }
          : tooltipPos.showLeft
            ? { right: 'calc(100% + 12px)', flexDirection: 'row-reverse' as const }
            : { left: 'calc(100% + 12px)' }
        ),
      }}
    >
      <div style={{
        width: 0, height: 0, flexShrink: 0,
        borderTop: '10px solid transparent', borderBottom: '10px solid transparent',
        ...(tooltipPos.showLeft ? { borderLeft: '10px solid white' } : { borderRight: '10px solid white' }),
      }} />
      <div className="rounded-2xl overflow-hidden relative"
        style={{ width: TOOLTIP_W, height: TOOLTIP_H, boxShadow: '0 24px 48px rgba(0,0,0,0.35)', border: '3px solid white', flexShrink: 0 }}>
        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="300px" />
      </div>
    </div>
  )

  // ── Tarjeta compacta (Nuevos Títulos en home) ──
  if (compact) {
    const showRestockBtn = allVariantsOutOfStock || (!hasVariants && baseOutOfStock) || selectedVariantOutOfStock
    return (
      <div
        ref={wrapperRef}
        className="relative flex-1 flex flex-col"
        style={{ width: '200px' }}
        onMouseLeave={() => setTooltipPos(null)}
      >
        <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col flex-1"
          style={{ background: 'white', border: '1px solid #E5D5C0' }}>
          <Link href={`/producto/${product.id}`}>
            <div onMouseEnter={handleImageEnter}>
              <ProductImage product={product} height={120} />
            </div>
          </Link>
          <div className="p-3 flex flex-col flex-1">
            <div className="flex-1">
              {product.tag && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#F5F1E8', color: '#8B6F47' }}>
                  {product.tag}
                </span>
              )}
              <Link href={`/producto/${product.id}`}>
                <h3 className="font-semibold text-sm mt-1 leading-tight hover:underline"
                  style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
                  {product.name}
                </h3>
              </Link>
            </div>
            <div className="mt-2">
              <VariantPills product={product} selectedId={selectedVariantId} onSelect={setSelectedVariantId} small />
              <div className="mb-2">
                <PriceDisplay price={product.price} promotionalPrice={product.promotionalPrice} size="small" />
              </div>
              {showRestockBtn
                ? <RestockButton productId={product.id} productName={product.name} size="small" />
                : needsVariantSelection
                  ? <button
                      onClick={() => {}}
                      disabled
                      className="w-full py-2 text-xs rounded-lg font-medium"
                      style={{ background: '#F5F1E8', color: '#8B6F47', cursor: 'default' }}
                    >
                      Elige color ↑
                    </button>
                  : <button onClick={handleAdd} className="w-full py-2 text-xs text-white rounded-lg font-medium transition active:scale-95" style={{ background: '#8B6F47' }}>+ Agregar</button>
              }
            </div>
          </div>
        </div>
        {tooltip}
      </div>
    )
  }

  // ── Tarjeta completa (catálogo, también te puede gustar) ──
  const showRestockBtn = allVariantsOutOfStock || (!hasVariants && baseOutOfStock) || selectedVariantOutOfStock
  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseLeave={() => setTooltipPos(null)}
    >
      <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col"
        style={{ background: 'white', border: '2px solid #E5D5C0' }}>
        <Link href={`/producto/${product.id}`} onMouseEnter={handleImageEnter}>
          <ProductImage product={product} height={220} />
          {product.isNew && (
            <span className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full text-white" style={{ background: '#FF7F50' }}>
              NUEVO
            </span>
          )}
          {!hasVariants && baseOutOfStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center" style={{ top: 0, height: 220 }}>
              <span className="text-sm font-bold px-3 py-1 rounded-full bg-white shadow" style={{ color: '#C9302C' }}>Sin stock</span>
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
          {product.author && <p className="text-xs mb-2" style={{ color: '#888' }}>{product.author}</p>}
          <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: '#666' }}>
            {product.description.slice(0, 90)}{product.description.length > 90 ? '...' : ''}
          </p>
          <VariantPills product={product} selectedId={selectedVariantId} onSelect={setSelectedVariantId} />
          {needsVariantSelection && (
            <p className="text-xs mb-2" style={{ color: '#8B6F47' }}>↑ Elige un color</p>
          )}
          <div className="flex items-center justify-between pt-3 border-t gap-3" style={{ borderColor: '#E5D5C0' }}>
            <PriceDisplay price={product.price} promotionalPrice={product.promotionalPrice} />
            {showRestockBtn
              ? <RestockButton productId={product.id} productName={product.name} size="small" />
              : needsVariantSelection
                ? <button
                    disabled
                    className="px-4 py-2 text-sm rounded-lg font-medium"
                    style={{ background: '#F5F1E8', color: '#8B6F47', cursor: 'default' }}
                  >
                    Elige color
                  </button>
                : <button onClick={handleAdd} className="px-4 py-2 text-sm text-white rounded-lg font-medium transition active:scale-95" style={{ background: '#8B6F47' }}>+ Agregar</button>
            }
          </div>
        </div>
      </div>
      {tooltip}
    </div>
  )
}
