'use client'

import { useEffect, useState, Suspense } from 'react'
import { useCartStore } from '@/store/cart'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  image_url?: string | null
  kit_config?: string[]
  variant_name?: string | null
}

interface Order {
  id: string
  email: string
  total: number
  status: string
  created_at: string
}

function ConfirmacionContent() {
  const { clearCart } = useCartStore()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    clearCart()
    if (sessionId) fetchOrder(sessionId)
    else setLoading(false)
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
    })
  }, [sessionId, clearCart])

  async function fetchOrder(sid: string) {
    try {
      const res = await fetch(`/api/order?session_id=${sid}`)
      const data = await res.json()
      if (data.order) {
        setOrder(data.order)
        setItems(data.items ?? [])
      }
    } finally {
      setLoading(false)
    }
  }

  const orderNumber = order
    ? `TRB-${order.id.split('-')[0].toUpperCase()}`
    : null

  const orderDate = order
    ? new Date(order.created_at).toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  if (loading) {
    return (
      <div className="py-24 text-center" style={{ color: '#8B6F47' }}>
        <div className="text-5xl mb-4 animate-pulse">📦</div>
        <p>Cargando tu pedido...</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-7xl mb-4">🎉</div>
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}
        >
          ¡Pedido Confirmado!
        </h1>
        <p className="text-sm" style={{ color: '#8B6F47' }}>
          Gracias por tu compra. Te estamos preparando algo especial. 📚✨
        </p>
      </div>

      {/* Número de orden — para screenshot */}
      {orderNumber && (
        <div
          className="rounded-2xl p-5 mb-5 text-center border-2"
          style={{ borderColor: '#D4AF8C', background: '#FFFDF8' }}
        >
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#B89060' }}>
            Número de orden
          </p>
          <p
            className="text-2xl font-bold tracking-wider"
            style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}
          >
            {orderNumber}
          </p>
          {orderDate && (
            <p className="text-xs mt-1" style={{ color: '#AAA' }}>
              {orderDate}
            </p>
          )}
          <p className="text-xs mt-2" style={{ color: '#B89060' }}>
            Guarda este número para cualquier consulta 📸
          </p>
        </div>
      )}

      {/* Tabla de productos */}
      {items.length > 0 && (
        <div
          className="rounded-2xl border p-5 mb-5"
          style={{ borderColor: '#E5D5C0', background: 'white' }}
        >
          <h2
            className="font-bold mb-4 text-sm uppercase tracking-wide"
            style={{ color: '#8B6F47' }}
          >
            Detalle del pedido
          </h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                {/* Foto */}
                <div
                  className="flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center relative"
                  style={{ width: 52, height: 52, background: '#F5F1E8', border: '1px solid #E5D5C0' }}
                >
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">📚</span>
                  )}
                  {item.kit_config && item.kit_config.length > 0 && (
                    <span
                      className="absolute bottom-0 left-0 right-0 text-center text-white font-bold"
                      style={{ fontSize: 9, background: 'rgba(139,111,71,0.85)', lineHeight: '16px' }}
                    >
                      KIT
                    </span>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-tight" style={{ color: '#3E2C20' }}>
                    {item.name}
                  </p>
                  {item.variant_name && (
                    <p className="text-xs mt-0.5" style={{ color: '#8B6F47' }}>
                      🎨 {item.variant_name}
                    </p>
                  )}
                  {item.kit_config && item.kit_config.length > 0 && (
                    <p className="text-xs mt-0.5 truncate" style={{ color: '#9B7B5A' }}>
                      {item.kit_config.slice(0, 3).join(' · ')}
                    </p>
                  )}
                  {item.quantity > 1 && (
                    <p className="text-xs" style={{ color: '#BBB' }}>
                      x{item.quantity}
                    </p>
                  )}
                </div>
                <p className="font-bold text-sm whitespace-nowrap flex-shrink-0" style={{ color: '#C9302C' }}>
                  ${(item.price * item.quantity).toLocaleString()} MXN
                </p>
              </div>
            ))}
          </div>

          <div
            className="flex justify-between font-bold text-base pt-4 mt-4 border-t"
            style={{ borderColor: '#E5D5C0' }}
          >
            <span style={{ color: '#3E2C20' }}>Total pagado</span>
            <span style={{ color: '#C9302C' }}>
              ${order ? order.total.toLocaleString() : 0} MXN
            </span>
          </div>
        </div>
      )}

      {/* Envío estimado */}
      <div
        className="rounded-2xl border p-5 mb-5"
        style={{ borderColor: '#E5D5C0', background: 'white' }}
      >
        <h2
          className="font-bold mb-3 text-sm uppercase tracking-wide"
          style={{ color: '#8B6F47' }}
        >
          Envío estimado
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🚚</span>
          <div>
            <p className="font-semibold text-sm" style={{ color: '#3E2C20' }}>
              3 – 5 días hábiles
            </p>
            <p className="text-xs" style={{ color: '#AAA' }}>
              CDMX y área metropolitana · Paquetería nacional
            </p>
          </div>
        </div>
      </div>

      {/* Contacto */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ background: '#F5F1E8', border: '1px solid #E5D5C0' }}
      >
        <p className="font-bold text-sm mb-2" style={{ color: '#8B6F47' }}>
          ¿Tienes dudas sobre tu pedido?
        </p>
        <p className="font-semibold text-sm" style={{ color: '#3E2C20' }}>
          📞 +52 155 7413 9159
        </p>
        <a
          href="mailto:begorreyes@gmail.com"
          className="block text-sm mt-1 transition hover:opacity-70"
          style={{ color: '#8B6F47' }}
        >
          ✉️ begorreyes@gmail.com
        </a>
        <a
          href="https://instagram.com/thereadingbroom"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm mt-1 transition hover:opacity-70"
          style={{ color: '#8B6F47' }}
        >
          📸 @thereadingbroom
        </a>
      </div>

      {/* Oferta de crear cuenta */}
      {!isLoggedIn && order?.email && (
        <div
          className="rounded-2xl border p-5 mb-5 text-center"
          style={{ borderColor: '#D4AF8C', background: '#FFFDF8' }}
        >
          <p className="font-bold mb-1" style={{ color: '#3E2C20' }}>
            ¿Quieres ver tus pedidos en un solo lugar?
          </p>
          <p className="text-sm mb-4" style={{ color: '#8B6F47' }}>
            Crea tu cuenta con <strong>{order.email}</strong> y accede a tu historial cuando quieras.
          </p>
          <Link
            href={`/registro?email=${encodeURIComponent(order.email)}`}
            className="inline-block px-6 py-2.5 rounded-xl text-white font-bold text-sm transition hover:opacity-90"
            style={{ background: '#8B6F47' }}
          >
            Crear mi cuenta gratis →
          </Link>
          <p className="text-xs mt-2" style={{ color: '#BBB' }}>
            También puedes hacerlo después desde "Entrar" en el menú
          </p>
        </div>
      )}

      <Link
        href="/catalogo"
        className="block w-full text-center px-8 py-3 rounded-xl text-white font-bold transition hover:opacity-90"
        style={{ background: '#8B6F47' }}
      >
        Seguir explorando 📚
      </Link>
    </div>
  )
}

export default function OrdenConfirmadaPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400">Cargando...</div>}>
      <ConfirmacionContent />
    </Suspense>
  )
}
