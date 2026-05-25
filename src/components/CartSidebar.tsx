'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart'

export default function CartSidebar() {
  const [mounted, setMounted] = useState(false)
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, itemCount } = useCartStore()
  const subtotal = total()

  useEffect(() => setMounted(true), [])

  const displayItems = mounted ? items : []
  const displayCount = mounted ? itemCount() : 0
  const displaySubtotal = mounted ? subtotal : 0
  const displayOpen = mounted ? isOpen : false

  return (
    <>
      {/* Backdrop */}
      {displayOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={closeCart}
        />
      )}

      {/* Sidebar */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col shadow-2xl transition-transform duration-300"
        style={{
          width: '360px',
          maxWidth: '100vw',
          background: '#fff',
          transform: displayOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#E5D5C0' }}>
          <span className="font-bold text-lg" style={{ color: '#8B6F47', fontFamily: 'Georgia, serif' }}>
            🛒 Tu Carrito
            {displayCount > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">({displayCount} {displayCount === 1 ? 'artículo' : 'artículos'})</span>
            )}
          </span>
          <button
            onClick={closeCart}
            className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {displayItems.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">🛒</div>
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            displayItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: '#E5D5C0', background: '#FDFAF6' }}>
                <span className="text-3xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: '#5C3D2E' }}>{item.name}</p>
                  <p className="text-sm font-bold" style={{ color: '#C9302C' }}>${(item.price * item.quantity).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded text-white text-sm font-bold flex items-center justify-center hover:opacity-80"
                    style={{ background: '#8B6F47' }}
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded text-white text-sm font-bold flex items-center justify-center hover:opacity-80"
                    style={{ background: '#8B6F47' }}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-300 hover:text-red-400 transition ml-1"
                >
                  🗑
                </button>
              </div>
            ))
          )}
        </div>

        {/* Summary & Checkout */}
        {displayItems.length > 0 && (
          <div className="px-4 py-4 border-t space-y-3" style={{ borderColor: '#E5D5C0' }}>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${displaySubtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2" style={{ borderColor: '#E5D5C0', color: '#C9302C' }}>
              <span style={{ color: '#3E3E3E' }}>Total</span>
              <span>${displaySubtotal.toLocaleString()}</span>
            </div>
            <a
              href="/checkout"
              className="block w-full text-center py-3 rounded-lg text-white font-bold text-base transition hover:opacity-90"
              style={{ background: '#C9302C' }}
            >
              Pagar Pedido →
            </a>
            <button
              onClick={closeCart}
              className="block w-full text-center py-2 text-sm"
              style={{ color: '#8B6F47' }}
            >
              ← Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}
