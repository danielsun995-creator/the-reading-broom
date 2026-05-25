'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'

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
  shipping_cost?: number | null
  created_at: string
  items: OrderItem[]
}

const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: 'Pendiente',  color: '#8B6F47', bg: '#FFF8EE' },
  paid:       { label: 'Pagado ✓',   color: '#2D7D32', bg: '#E8F5E9' },
  shipped:    { label: 'Enviado 🚚', color: '#1565C0', bg: '#E3F2FD' },
  delivered:  { label: 'Entregado ✓', color: '#2D7D32', bg: '#E8F5E9' },
  cancelled:  { label: 'Cancelado',  color: '#C62828', bg: '#FFEBEE' },
}

export default function CuentaClient({ user, orders }: { user: User; orders: Order[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()

  const userName = (user.user_metadata?.name as string) || user.email?.split('@')[0] || 'Lectora'

  async function handleLogout() {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
            Hola, {userName} 👋
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#8B6F47' }}>{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="text-sm px-4 py-2 rounded-lg border transition hover:opacity-70 disabled:opacity-50"
          style={{ borderColor: '#D4AF8C', color: '#8B6F47' }}
        >
          {loggingOut ? 'Saliendo...' : 'Cerrar sesión'}
        </button>
      </div>

      {/* Pedidos */}
      <h2 className="font-bold mb-4 text-sm uppercase tracking-wide" style={{ color: '#8B6F47' }}>
        Mis Pedidos
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border" style={{ borderColor: '#E5D5C0', background: 'white' }}>
          <div className="text-5xl mb-4">📦</div>
          <p className="font-semibold mb-1" style={{ color: '#3E2C20' }}>Aún no tienes pedidos</p>
          <p className="text-sm mb-5" style={{ color: '#8B6F47' }}>¡Explora el catálogo y encuentra tu kit perfecto!</p>
          <Link
            href="/catalogo"
            className="inline-block px-6 py-2.5 rounded-xl text-white font-bold text-sm transition hover:opacity-90"
            style={{ background: '#8B6F47' }}
          >
            Ver Catálogo
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedId === order.id
            const orderNumber = `TRB-${order.id.split('-')[0].toUpperCase()}`
            const fecha = new Date(order.created_at).toLocaleDateString('es-MX', {
              day: 'numeric', month: 'long', year: 'numeric',
            })
            const status = statusLabels[order.status] ?? statusLabels.pending

            return (
              <div
                key={order.id}
                className="rounded-2xl border overflow-hidden"
                style={{ borderColor: '#E5D5C0', background: 'white' }}
              >
                {/* Order header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left transition hover:bg-gray-50"
                >
                  <div>
                    <p className="font-bold text-sm" style={{ color: '#3E2C20' }}>{orderNumber}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#AAA' }}>{fecha}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ color: status.color, background: status.bg }}
                    >
                      {status.label}
                    </span>
                    <span className="font-bold text-sm" style={{ color: '#C9302C' }}>
                      ${order.total.toLocaleString()} MXN
                    </span>
                    <span className="text-gray-400 text-xs">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </button>

                {/* Order items */}
                {isExpanded && (
                  <div className="border-t px-5 py-4" style={{ borderColor: '#E5D5C0', background: '#FDFAF6' }}>
                    {order.items.length === 0 ? (
                      <p className="text-sm text-gray-400">Sin detalle disponible</p>
                    ) : (
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            {/* Foto del producto */}
                            <div
                              className="flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center relative"
                              style={{ width: 52, height: 52, background: '#F5F1E8', border: '1px solid #E5D5C0' }}
                            >
                              {item.image_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
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
                              <p className="text-sm font-medium leading-tight" style={{ color: '#3E2C20' }}>{item.name}</p>
                              {item.variant_name && (
                                <p className="text-xs mt-0.5" style={{ color: '#8B6F47' }}>
                                  🎨 {item.variant_name}
                                </p>
                              )}
                              {item.kit_config && item.kit_config.length > 0 && (
                                <p className="text-xs mt-0.5 truncate" style={{ color: '#9B7B5A' }}>
                                  {item.kit_config.slice(0, 2).join(' · ')}
                                </p>
                              )}
                              {item.quantity > 1 && (
                                <p className="text-xs" style={{ color: '#BBB' }}>x{item.quantity}</p>
                              )}
                            </div>
                            <p className="text-sm font-bold whitespace-nowrap flex-shrink-0" style={{ color: '#C9302C' }}>
                              ${(item.price * item.quantity).toLocaleString()} MXN
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Envío y total */}
                    <div className="mt-4 pt-3 border-t space-y-1.5" style={{ borderColor: '#E5D5C0' }}>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: '#8B6F47' }}>Envío</span>
                        <span style={{ color: '#3E2C20' }}>
                          {order.shipping_cost && order.shipping_cost > 0
                            ? `$${order.shipping_cost.toLocaleString()} MXN`
                            : 'Por definir'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-bold">
                        <span style={{ color: '#3E2C20' }}>Total pagado</span>
                        <span style={{ color: '#C9302C' }}>${order.total.toLocaleString()} MXN</span>
                      </div>
                    </div>

                    {/* Entrega estimada */}
                    <div className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: '#EFF7EE' }}>
                      <span className="text-lg">🚚</span>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: '#2D7D32' }}>Entrega estimada: 3 – 5 días hábiles</p>
                        <p className="text-xs" style={{ color: '#888' }}>CDMX y área metropolitana · Paquetería nacional</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
