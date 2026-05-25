'use client'

import { useState } from 'react'

// Página protegida — acceder con /admin/reembolsar?key=TU_ADMIN_SECRET

const label = 'block text-sm font-semibold mb-1'
const input = 'w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-[#D4AF8C]'

export default function AdminReembolsarPage() {
  const [key, setKey]           = useState('')
  const [orderId, setOrderId]   = useState('')
  const [preview, setPreview]   = useState<any>(null)
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [loadingRefund, setLoadingRefund]   = useState(false)
  const [result, setResult]     = useState<any>(null)
  const [error, setError]       = useState('')

  async function handlePreview() {
    if (!key || !orderId) return
    setLoadingPreview(true)
    setPreview(null)
    setResult(null)
    setError('')
    try {
      const res = await fetch(`/api/admin/refund?order_id=${orderId}`, {
        headers: { Authorization: `Bearer ${key}` },
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setPreview(data)
    } catch {
      setError('Error de conexión')
    } finally {
      setLoadingPreview(false)
    }
  }

  async function handleRefund() {
    if (!preview) return
    setLoadingRefund(true)
    setError('')
    try {
      const res = await fetch('/api/admin/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({ order_id: preview.order_id }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setResult(data)
      setPreview(null)
    } catch {
      setError('Error al procesar el reembolso')
    } finally {
      setLoadingRefund(false)
    }
  }

  const card = 'rounded-2xl border p-5 mb-4'
  const borderColor = { borderColor: '#E5D5C0' }

  return (
    <div className="max-w-lg mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-1" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
        🔒 Reembolso de producto
      </h1>
      <p className="text-sm mb-6" style={{ color: '#8B6F47' }}>
        Reembolsa el valor del producto. El costo de envío no se devuelve.
      </p>

      {/* Clave admin */}
      <div className={card} style={borderColor}>
        <label className={label} style={{ color: '#3E2C20' }}>Clave de acceso</label>
        <input
          className={input} style={{ borderColor: '#D4AF8C' }}
          type="password"
          placeholder="Tu ADMIN_SECRET"
          value={key}
          onChange={e => setKey(e.target.value)}
        />
      </div>

      {/* ID de orden */}
      <div className={card} style={borderColor}>
        <label className={label} style={{ color: '#3E2C20' }}>ID de la orden</label>
        <input
          className={input} style={{ borderColor: '#D4AF8C' }}
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
        />
        <button
          onClick={handlePreview}
          disabled={!key || !orderId || loadingPreview}
          className="mt-3 w-full py-2.5 rounded-xl text-white text-sm font-bold transition hover:opacity-90 disabled:opacity-50"
          style={{ background: '#8B6F47' }}
        >
          {loadingPreview ? 'Consultando...' : 'Ver detalles del reembolso'}
        </button>
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 mb-4 text-sm" style={{ background: '#FDECEA', color: '#C9302C', border: '1px solid #F5C6CB' }}>
          ❌ {error}
        </div>
      )}

      {/* Preview del reembolso */}
      {preview && (
        <div className={card} style={{ borderColor: '#C9302C', borderWidth: 2 }}>
          <p className="font-bold text-sm mb-3" style={{ color: '#3E2C20' }}>Resumen del reembolso</p>

          <div className="space-y-1 text-sm mb-4" style={{ color: '#6B5438' }}>
            <p><strong>Cliente:</strong> {preview.customer}</p>
            <p><strong>Correo:</strong> {preview.email}</p>
            <p><strong>Status actual:</strong> {preview.status}</p>
          </div>

          <table className="w-full text-sm mb-4" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              {(preview.items ?? []).map((item: any, i: number) => (
                <tr key={i}>
                  <td className="py-1" style={{ color: '#3E2C20' }}>{item.name} ×{item.quantity}</td>
                  <td className="py-1 text-right font-semibold" style={{ color: '#C9302C' }}>
                    ${(item.price * item.quantity).toLocaleString()} MXN
                  </td>
                </tr>
              ))}
              <tr style={{ borderTop: '1px solid #E5D5C0' }}>
                <td className="pt-2 text-xs" style={{ color: '#999' }}>Envío (no reembolsable)</td>
                <td className="pt-2 text-xs text-right" style={{ color: '#999' }}>
                  −${(preview.shipping_cost ?? 0).toLocaleString()} MXN
                </td>
              </tr>
            </tbody>
          </table>

          <div className="rounded-xl px-4 py-3 mb-4 text-center" style={{ background: '#E9F7EF' }}>
            <p className="text-xs" style={{ color: '#1E8449' }}>Se reembolsará</p>
            <p className="text-2xl font-bold" style={{ color: '#1E8449' }}>
              ${(preview.product_total ?? 0).toLocaleString()} MXN
            </p>
          </div>

          <button
            onClick={handleRefund}
            disabled={loadingRefund}
            className="w-full py-3 rounded-xl text-white font-bold transition hover:opacity-90 disabled:opacity-50"
            style={{ background: '#C9302C' }}
          >
            {loadingRefund ? 'Procesando...' : `Reembolsar $${(preview.product_total ?? 0).toLocaleString()} MXN`}
          </button>
          <p className="text-xs text-center mt-2" style={{ color: '#999' }}>Esta acción no se puede deshacer.</p>
        </div>
      )}

      {/* Resultado exitoso */}
      {result && (
        <div className={card} style={{ borderColor: '#27AE60', borderWidth: 2 }}>
          <div className="text-center">
            <div className="text-5xl mb-3">✅</div>
            <p className="font-bold text-lg" style={{ color: '#1E8449' }}>¡Reembolso procesado!</p>
            <p className="text-sm mt-2" style={{ color: '#6B5438' }}>
              Se reembolsaron <strong>${result.amount_refunded?.toLocaleString()} MXN</strong> al método de pago original.
            </p>
            <p className="text-xs mt-1" style={{ color: '#999' }}>
              El envío de ${result.shipping_kept?.toLocaleString()} MXN no fue reembolsado.
            </p>
            <p className="text-xs mt-2" style={{ color: '#999' }}>ID Stripe: {result.refund_id}</p>
          </div>
        </div>
      )}
    </div>
  )
}
