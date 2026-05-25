'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import type { Product } from '@/lib/data'
import RestockButton from '@/components/RestockButton'

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, openCart } = useCartStore()
  const [added, setAdded] = useState(false)
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)

  const hasVariants = !!(product.variants && product.variants.length > 0)
  const selectedVariant = hasVariants
    ? (product.variants!.find((v) => v.id === selectedVariantId) ?? null)
    : null
  const allVariantsOutOfStock = hasVariants && product.variants!.every((v) => v.stock <= 0)
  const selectedVariantOutOfStock = selectedVariant !== null && selectedVariant.stock <= 0
  const outOfStock = hasVariants
    ? allVariantsOutOfStock || selectedVariantOutOfStock
    : product.stock !== undefined && product.stock <= 0

  const handleAdd = () => {
    if (hasVariants && !selectedVariantId) return
    if (outOfStock) return
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
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    openCart()
  }

  return (
    <div>
      {/* Selector de variante */}
      {hasVariants && (
        <div className="mb-5">
          <p className="text-sm font-semibold mb-2.5" style={{ color: '#5C3D2E' }}>
            🎨 Color:
          </p>
          <div className="flex flex-wrap gap-2">
            {product.variants!.map((v) => {
              const isSelected = selectedVariantId === v.id
              const unavailable = v.stock <= 0
              return (
                <button
                  key={v.id}
                  onClick={() => !unavailable && setSelectedVariantId(isSelected ? null : v.id)}
                  disabled={unavailable}
                  className="text-sm px-4 py-2 rounded-full font-medium transition-all"
                  style={{
                    background: isSelected ? '#8B6F47' : 'white',
                    color: isSelected ? 'white' : unavailable ? '#bbb' : '#5C3D2E',
                    border: `1.5px solid ${isSelected ? '#8B6F47' : unavailable ? '#E5D5C0' : '#D4C4AD'}`,
                    cursor: unavailable ? 'not-allowed' : 'pointer',
                    textDecoration: unavailable ? 'line-through' : 'none',
                    boxShadow: isSelected ? '0 0 0 3px rgba(139,111,71,0.15)' : 'none',
                  }}
                >
                  {v.name}
                  {unavailable && <span className="ml-1 text-xs" style={{ color: '#C9302C' }}>(sin stock)</span>}
                </button>
              )
            })}
          </div>
          {!selectedVariantId && !allVariantsOutOfStock && (
            <p className="text-xs mt-2" style={{ color: '#C9302C' }}>
              ↑ Selecciona un color para agregar al carrito
            </p>
          )}
        </div>
      )}

      {/* Botón */}
      {allVariantsOutOfStock ? (
        <RestockButton productId={product.id} productName={product.name} size="large" />
      ) : selectedVariantOutOfStock && selectedVariant ? (
        <RestockButton
          productId={`${product.id}::${selectedVariantId}`}
          productName={`${product.name} — ${selectedVariant.name}`}
          size="large"
        />
      ) : (
        <button
          onClick={handleAdd}
          disabled={hasVariants && !selectedVariantId}
          className="w-full py-3.5 rounded-xl text-white font-bold text-base transition-all hover:opacity-90 active:scale-95"
          style={{
            background: added ? '#2e7d32' : hasVariants && !selectedVariantId ? '#D4C4AD' : '#8B6F47',
            cursor: hasVariants && !selectedVariantId ? 'not-allowed' : 'pointer',
          }}
        >
          {added
            ? '✅ ¡Agregado al carrito!'
            : hasVariants && !selectedVariantId
            ? '🎨 Selecciona un color primero'
            : '🛒 Agregar al Carrito'}
        </button>
      )}
    </div>
  )
}
