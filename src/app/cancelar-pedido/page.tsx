'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

type State = 'loading' | 'confirm' | 'cancelled' | 'expired' | 'shipped' | 'already' | 'error'

interface OrderInfo {
  id: string
  status: string
  total: number
  shipping_carrier: string
  shipping_service: string
}

function CancelContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')
  const token   = searchParams.get('token')

  const [state, setState]     = useState<State>('loading')
  const [order, setOrder]     = useState<OrderInfo | null>(null)
  const [hoursLeft, setHoursLeft] = useState(0)
  const [message, setMessage] = useState('')
  const [busy, setBusy]       = useState(false)

  useEffect(() => {
    if (!orderId || !token) { setState('error'); return }

    fetch(`/api/orders/cancel?order_id=${orderId}&token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setState('error'); setMessage(data.error); return }
        setOrder(data.order)
        setHoursLeft(data.hoursLeft)
        if (!data.canCancel) {
          if (data.order.status === 'cancelled') setState('already')
          else if (data.order.tracking_number || data.order.status === 'shipped') setState('shipped')
          else setState('expired')
        } else {
          setState('confirm')
        }
      })
      .catch(() => { setState('error'); setMessage('Error al cargar la información del pedido.') })
  }, [orderId, token])

  async function handleCancel() {
    if (!orderId || !token || busy) return
    setBusy(true)
    try {
      const res  = await fetch('/api/orders/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, token }),
      })
      const data = await res.json()
      if (data.ok) {
        setState('cancelled')
      } else {
        setMessage(data.error ?? 'Ocurrió un error. Contáctanos.')
        setState('error')
      }
    } catch {
      setMessage('Error de conexión. Intenta de nuevo.')
      setState('error')
    } finally {
      setBusy(false)
    }
  }

  /* ── Estados visuales ── */

  if (state === 'loading') {
    return (
      <div className="py-24 text-center text-gray-400 animate-pulse">Verificando pedido...</div>
    )
  }

  if (state === 'cancelled') {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
          Pedido cancelado
        </h1>
        <p className="text-sm mb-2" style={{ color: '#6B5438' }}>
          Tu pedido fue cancelado exitosamente.
        </p>
        <p className="text-sm mb-6" style={{ color: '#8B6F47' }}>
          El reembolso se verá reflejado en tu cuenta en <strong>5–10 días hábiles</strong>, dependiendo de tu banco.
        </p>
        <Link href="/"
          className="inline-block px-8 py-3 rounded-xl text-white font-bold hover:opacity-90 transition"
          style={{ background: '#8B6F47' }}>
          Volver a la tienda
        </Link>
      </div>
    )
  }

  if (state === 'already') {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="text-6xl mb-4">ℹ️</div>
        <h1 className="text-xl font-bold mb-3" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
          Este pedido ya fue cancelado
        </h1>
        <p className="text-sm mb-6" style={{ color: '#8B6F47' }}>
          Si no recibiste el reembolso, escríbenos.
        </p>
        <ContactInfo />
      </div>
    )
  }

  if (state === 'shipped') {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h1 className="text-xl font-bold mb-3" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
          Tu pedido ya fue enviado
        </h1>
        <p className="text-sm mb-6" style={{ color: '#8B6F47' }}>
          No es posible cancelar un pedido que ya tiene guía de envío. Si deseas devolverlo, contáctanos.
        </p>
        <ContactInfo />
      </div>
    )
  }

  if (state === 'expired') {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="text-6xl mb-4">⏰</div>
        <h1 className="text-xl font-bold mb-3" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
          El plazo de cancelación expiró
        </h1>
        <p className="text-sm mb-6" style={{ color: '#8B6F47' }}>
          Las cancelaciones solo están disponibles dentro de las primeras 12 horas. Si tienes algún problema, contáctanos.
        </p>
        <ContactInfo />
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-xl font-bold mb-3" style={{ color: '#C9302C', fontFamily: 'Georgia, serif' }}>
          {message || 'Algo salió mal'}
        </h1>
        <p className="text-sm mb-6" style={{ color: '#8B6F47' }}>
          Si necesitas ayuda, contáctanos directamente.
        </p>
        <ContactInfo />
      </div>
    )
  }

  /* ── Pantalla de confirmación ── */
  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="rounded-2xl border p-6 text-center" style={{ borderColor: '#E5D5C0', background: 'white' }}>
        <div className="text-5xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
          ¿Cancelar tu pedido?
        </h1>
        <p className="text-sm mb-1" style={{ color: '#8B6F47' }}>
          Esta acción no se puede deshacer.
        </p>
        <p className="text-xs mb-5" style={{ color: '#AAA' }}>
          Tiempo restante para cancelar: <strong style={{ color: '#856404' }}>{hoursLeft}h</strong>
        </p>

        {order && (
          <div className="rounded-xl p-4 mb-5 text-left" style={{ background: '#F5F1E8' }}>
            <p className="text-xs font-bold mb-1" style={{ color: '#8B6F47' }}>RESUMEN</p>
            <p className="text-sm" style={{ color: '#3E2C20' }}>Total: <strong>${order.total?.toLocaleString('es-MX')} MXN</strong></p>
            {order.shipping_carrier && (
              <p className="text-sm" style={{ color: '#6B5438' }}>
                Envío: {order.shipping_carrier.toUpperCase()} — {order.shipping_service}
              </p>
            )}
          </div>
        )}

        <p className="text-sm mb-6" style={{ color: '#6B5438' }}>
          El reembolso completo se procesará automáticamente y llegará a tu cuenta en <strong>5–10 días hábiles</strong>.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleCancel}
            disabled={busy}
            className="w-full py-3 rounded-xl font-bold text-white transition hover:opacity-90 disabled:opacity-50"
            style={{ background: '#C9302C' }}
          >
            {busy ? 'Cancelando...' : 'Sí, cancelar mi pedido'}
          </button>
          <Link
            href="/"
            className="w-full py-3 rounded-xl font-bold text-center transition hover:opacity-80"
            style={{ background: '#F5F1E8', color: '#3E2C20' }}
          >
            No, conservar mi pedido
          </Link>
        </div>
      </div>
    </div>
  )
}

function ContactInfo() {
  return (
    <div className="text-sm" style={{ color: '#6B5438' }}>
      <p className="font-bold">📞 +52 155 7413 9159</p>
      <p>✉️ begorreyes@gmail.com</p>
    </div>
  )
}

export default function CancelarPedidoPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-gray-400">Cargando...</div>}>
      <CancelContent />
    </Suspense>
  )
}
