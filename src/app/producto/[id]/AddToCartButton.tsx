'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import type { Product } from '@/lib/data'

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, openCart } = useCartStore()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price, emoji: product.emoji })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    openCart()
  }

  return (
    <button
      onClick={handleAdd}
      className="w-full py-3.5 rounded-xl text-white font-bold text-base transition-all hover:opacity-90 active:scale-95"
      style={{ background: added ? '#2e7d32' : '#8B6F47' }}
    >
      {added ? '✅ ¡Agregado al carrito!' : '🛒 Agregar al Carrito'}
    </button>
  )
}
