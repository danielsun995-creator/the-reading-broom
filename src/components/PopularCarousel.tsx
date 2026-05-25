'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import type { Product } from '@/lib/data'

interface Props {
  products: Product[]
}

export default function PopularCarousel({ products }: Props) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [added, setAdded] = useState(false)
  const [notifyStep, setNotifyStep] = useState<'idle' | 'form' | 'sent'>('idle')
  const [notifyEmail, setNotifyEmail] = useState('')
  const [notifyLoading, setNotifyLoading] = useState(false)
  const { addItem, openCart } = useCartStore()

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % products.length)
    setAdded(false)
    setNotifyStep('idle')
    setNotifyEmail('')
  }, [products.length])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + products.length) % products.length)
    setAdded(false)
    setNotifyStep('idle')
    setNotifyEmail('')
  }, [products.length])

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!notifyEmail) return
    setNotifyLoading(true)
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: notifyEmail }),
      })
    } catch { /* silencioso */ }
    setNotifyLoading(false)
    setNotifyStep('sent')
  }

  useEffect(() => {
    if (paused || products.length <= 1) return
    const timer = setInterval(next, 4500)
    return () => clearInterval(timer)
  }, [paused, next, products.length])

  if (products.length === 0) return null

  const product = products[current]
  const outOfStock = product.stock !== undefined && product.stock <= 0

  const handleAdd = () => {
    if (outOfStock) return
    addItem({
      id: product.id,
      name: product.name,
      price: product.promotionalPrice ?? product.price,
      emoji: product.emoji,
      imageUrl: product.imageUrl ?? undefined,
    })
    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 2500)
  }

  const handleNotify = () => {
    setNotifyStep('form')
  }

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-md"
      style={{ border: '1px solid #E5D5C0' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="grid grid-cols-1 md:grid-cols-[55%_45%]" style={{ minHeight: '400px' }}>

        {/* ── IZQUIERDA: foto a pantalla completa ── */}
        <div className="relative overflow-hidden" style={{ minHeight: '320px' }}>
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-500"
              sizes="(max-width: 768px) 100vw, 55vw"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: '#F5EDD8', fontSize: '120px' }}
            >
              {product.emoji}
            </div>
          )}

          {/* Badge nuevo */}
          {product.isNew && (
            <span
              className="absolute top-4 left-4 z-10 text-xs font-bold px-3 py-1 rounded-full text-white"
              style={{ background: '#FF7F50' }}
            >
              NUEVO
            </span>
          )}

          {/* Overlay sin stock */}
          {outOfStock && (
            <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
              <span className="text-white font-bold text-lg px-5 py-2 rounded-full" style={{ background: 'rgba(0,0,0,0.55)' }}>
                Sin stock
              </span>
            </div>
          )}
        </div>

        {/* ── DERECHA: información ── */}
        <div
          className="flex flex-col justify-center px-8 py-8 gap-4"
          style={{ background: '#FEFAF5' }}
        >
          {product.tag && (
            <span
              className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full w-fit"
              style={{ background: '#F5EDD8', color: '#8B6F47' }}
            >
              {product.tag}
            </span>
          )}

          <div>
            <h3
              className="text-2xl font-bold leading-snug mb-1"
              style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}
            >
              {product.name}
            </h3>
            {product.author && (
              <p className="text-sm" style={{ color: '#8B6F47' }}>por {product.author}</p>
            )}
          </div>

          {product.description && (
            <p className="text-sm leading-relaxed" style={{ color: '#666', maxWidth: '360px' }}>
              {product.description.slice(0, 140)}{product.description.length > 140 ? '...' : ''}
            </p>
          )}

          {/* Precio */}
          <div className="flex items-baseline gap-3">
            {product.promotionalPrice ? (
              <>
                <span className="text-3xl font-bold" style={{ color: '#C9302C' }}>
                  ${product.promotionalPrice.toLocaleString('es-MX')}
                </span>
                <span className="text-base line-through" style={{ color: '#bbb' }}>
                  ${product.price.toLocaleString('es-MX')}
                </span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: '#FEE2E2', color: '#C9302C' }}
                >
                  {Math.round((1 - product.promotionalPrice / product.price) * 100)}% OFF
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold" style={{ color: '#C9302C' }}>
                ${product.price.toLocaleString('es-MX')}
              </span>
            )}
          </div>

          {/* Botones */}
          <div className="flex flex-col gap-3 pt-1">
            {outOfStock ? (
              notifyStep === 'sent' ? (
                <div
                  className="py-3 px-6 rounded-xl text-sm font-semibold text-center"
                  style={{ background: '#F5EDD8', color: '#8B6F47' }}
                >
                  ✨ ¡Listo! Te avisamos en cuanto regrese
                </div>
              ) : notifyStep === 'form' ? (
                <form onSubmit={handleNotifySubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    placeholder="Tu correo electrónico"
                    required
                    disabled={notifyLoading}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none border disabled:opacity-60"
                    style={{ borderColor: '#D4AF8C', color: '#3E2C20' }}
                  />
                  <button
                    type="submit"
                    disabled={notifyLoading}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-white transition active:scale-95 disabled:opacity-60 whitespace-nowrap"
                    style={{ background: '#8B6F47' }}
                  >
                    {notifyLoading ? '...' : 'Avisar'}
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setNotifyStep('form')}
                  className="py-3 px-6 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
                  style={{ background: '#8B6F47' }}
                >
                  🔔 Sé la primera en saberlo
                </button>
              )
            ) : (
              <button
                onClick={handleAdd}
                className="py-3 px-6 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
                style={{ background: added ? '#5C3D2E' : '#8B6F47' }}
              >
                {added ? '✓ Agregado al carrito' : '🛒 Agregar al carrito'}
              </button>
            )}

            <Link
              href={`/producto/${product.id}`}
              className="py-3 px-6 rounded-xl text-sm font-bold text-center transition-all hover:opacity-90"
              style={{ background: '#F5EDD8', color: '#5C3D2E', border: '1.5px solid #D4AF8C' }}
            >
              Ver producto →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Navegación ── */}
      {products.length > 1 && (
        <div
          className="flex items-center justify-center gap-4 py-4"
          style={{ borderTop: '1px solid #E5D5C0', background: '#FEFAF5' }}
        >
          <button
            onClick={prev}
            className="w-8 h-8 rounded-full flex items-center justify-center transition hover:bg-black/5"
            style={{ color: '#8B6F47' }}
          >
            ❮
          </button>
          <div className="flex gap-2">
            {products.map((p, i) => (
              <button
                key={p.id}
                onClick={() => { setCurrent(i); setAdded(false); setNotifyStep('idle'); setNotifyEmail('') }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? '28px' : '8px',
                  height: '8px',
                  background: i === current ? '#8B6F47' : '#D4AF8C',
                }}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-8 h-8 rounded-full flex items-center justify-center transition hover:bg-black/5"
            style={{ color: '#8B6F47' }}
          >
            ❯
          </button>
        </div>
      )}
    </div>
  )
}
