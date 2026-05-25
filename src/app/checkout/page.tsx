'use client'

import { useState, useEffect, useCallback } from 'react'
import { useCartStore } from '@/store/cart'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

interface Rate {
  id: string
  carrier: string
  service: string
  label: 'Estándar' | 'Express'
  price: number
  originalPrice: number
  days: number | null
  isFree: boolean
}

interface Address {
  name: string
  street: string
  colonia: string
  city: string
  state: string
  cp: string
  phone: string
}

const RATE_ICON: Record<string, string> = { Estándar: '🚚', Express: '⚡' }

const inputBase =
  'w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-[#D4AF8C]'
const inputStyle = { borderColor: '#D4AF8C', background: 'white' }

function CheckoutContent() {
  const { items, total } = useCartStore()
  const searchParams  = useSearchParams()
  const cancelado     = searchParams.get('cancelado')

  const [mounted, setMounted]         = useState(false)
  const [email, setEmail]             = useState('')
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')

  const [address, setAddress] = useState<Address>({
    name: '', street: '', colonia: '', city: '', state: '', cp: '', phone: '',
  })
  const [rates, setRates]             = useState<Rate[]>([])
  const [selectedRate, setSelectedRate] = useState<Rate | null>(null)
  const [ratesLoading, setRatesLoading] = useState(false)
  const [ratesError, setRatesError]   = useState('')
  const [isFreeShipping, setIsFreeShipping] = useState(false)

  useEffect(() => setMounted(true), [])

  const displayItems = mounted ? items : []
  const subtotal     = mounted ? total() : 0
  const shippingCost = selectedRate?.price ?? 0
  const grandTotal   = subtotal + shippingCost

  /* ── Fetch rates when CP is complete ── */
  const fetchRates = useCallback(async (cp: string, sub: number) => {
    setRatesLoading(true)
    setRatesError('')
    try {
      const res  = await fetch('/api/shipping/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zip_to: cp, subtotal: sub }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setRatesError(data.error || 'No hay envíos disponibles para ese CP')
        setRates([])
        setSelectedRate(null)
      } else {
        setRates(data.rates ?? [])
        setIsFreeShipping(data.isFree ?? false)
        // Auto-seleccionar el más barato cuando el envío es gratis
        if (data.isFree && data.rates?.length > 0) setSelectedRate(data.rates[0])
        else setSelectedRate(null)
      }
    } catch {
      setRatesError('Error de conexión al cotizar envío')
    } finally {
      setRatesLoading(false)
    }
  }, [])

  useEffect(() => {
    if (address.cp.length === 5) {
      fetchRates(address.cp, subtotal)
    } else {
      setRates([])
      setSelectedRate(null)
      setRatesError('')
    }
  }, [address.cp, subtotal, fetchRates])

  function setField(field: keyof Address, value: string) {
    setAddress(prev => ({ ...prev, [field]: value }))
  }

  /* ── Submit ── */
  async function handleCheckout() {
    setError('')
    if (!address.name.trim() || !address.street.trim() || !address.city.trim() ||
        !address.state.trim() || !address.cp || !address.phone.trim()) {
      setError('Por favor completa todos los campos obligatorios de dirección.')
      return
    }
    if (!/^\d{5}$/.test(address.cp)) {
      setError('El código postal debe tener exactamente 5 dígitos.')
      return
    }
    if (!selectedRate) {
      setError('Por favor selecciona una opción de envío.')
      return
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Ingresa un correo electrónico válido.')
      return
    }
    if (!displayItems.length) return

    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          email,
          shipping: {
            rate_id:       selectedRate.id,
            carrier:       selectedRate.carrier,
            service:       selectedRate.service,
            cost:          shippingCost,
            original_cost: selectedRate.originalPrice,
            is_free:       isFreeShipping,
            name:          address.name,
            street:        address.street,
            colonia:       address.colonia,
            city:          address.city,
            state:         address.state,
            cp:            address.cp,
            phone:         address.phone,
          },
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Hubo un error al procesar el pago. Intenta de nuevo.')
      }
    } catch {
      setError('Error de conexión. Verifica tu internet e intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Empty state ── */
  if (!mounted) return <div className="py-20 text-center text-gray-400">Cargando...</div>

  if (displayItems.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="text-7xl mb-5">🛒</div>
        <h2 className="text-2xl font-bold mb-3" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
          Tu carrito está vacío
        </h2>
        <p className="text-sm mb-6" style={{ color: '#8B6F47' }}>Agrega productos desde el catálogo para continuar.</p>
        <Link href="/catalogo" className="inline-block px-8 py-3 rounded-xl text-white font-bold hover:opacity-90 transition" style={{ background: '#8B6F47' }}>
          Ver Catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-2">
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
        Finalizar Pedido
      </h1>

      {cancelado && (
        <div className="rounded-xl px-4 py-3 mb-5 text-sm" style={{ background: '#FFF3CD', color: '#856404', border: '1px solid #FFEAA7' }}>
          ✋ Cancelaste el pago. Tu carrito sigue intacto, puedes intentarlo cuando quieras.
        </div>
      )}

      {/* ── 1. Resumen ── */}
      <div className="rounded-2xl border p-5 mb-4" style={{ borderColor: '#E5D5C0', background: 'white' }}>
        <h2 className="font-bold mb-4 text-sm uppercase tracking-wide" style={{ color: '#8B6F47' }}>
          Resumen del pedido
        </h2>
        <div className="space-y-3">
          {displayItems.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <span className="text-xl mt-0.5">{item.emoji}</span>
                <div>
                  <p className="font-semibold text-sm leading-tight" style={{ color: '#3E2C20' }}>{item.name}</p>
                  {item.kitConfig && item.kitConfig.length > 0 && (
                    <p className="text-xs mt-0.5" style={{ color: '#9B7B5A' }}>{item.kitConfig.slice(0, 3).join(' · ')}</p>
                  )}
                  {item.quantity > 1 && <p className="text-xs mt-0.5" style={{ color: '#AAA' }}>×{item.quantity}</p>}
                </div>
              </div>
              <p className="font-bold text-sm whitespace-nowrap" style={{ color: '#C9302C' }}>
                ${(item.price * item.quantity).toLocaleString()} MXN
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. Dirección + Envío ── */}
      <div className="rounded-2xl border p-5 mb-4" style={{ borderColor: '#E5D5C0', background: 'white' }}>
        <h2 className="font-bold mb-4 text-sm uppercase tracking-wide" style={{ color: '#8B6F47' }}>
          Dirección de envío
        </h2>
        <div className="space-y-3">
          <input
            className={inputBase} style={inputStyle}
            placeholder="Nombre completo *"
            value={address.name}
            onChange={e => setField('name', e.target.value)}
          />
          <input
            className={inputBase} style={inputStyle}
            placeholder="Calle y número *"
            value={address.street}
            onChange={e => setField('street', e.target.value)}
          />
          <input
            className={inputBase} style={inputStyle}
            placeholder="Colonia"
            value={address.colonia}
            onChange={e => setField('colonia', e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              className={inputBase} style={inputStyle}
              placeholder="Ciudad *"
              value={address.city}
              onChange={e => setField('city', e.target.value)}
            />
            <input
              className={inputBase} style={inputStyle}
              placeholder="Estado *"
              value={address.state}
              onChange={e => setField('state', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              className={inputBase} style={inputStyle}
              placeholder="Código postal *"
              maxLength={5}
              value={address.cp}
              onChange={e => setField('cp', e.target.value.replace(/\D/g, ''))}
            />
            <input
              className={inputBase} style={inputStyle}
              placeholder="Teléfono (10 dígitos) *"
              maxLength={10}
              value={address.phone}
              onChange={e => setField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
            />
          </div>
        </div>

        {/* Opciones de envío (aparecen cuando CP tiene 5 dígitos) */}
        {address.cp.length === 5 && (
          <div className="mt-5 pt-4 border-t" style={{ borderColor: '#E5D5C0' }}>
            <p className="text-sm font-semibold mb-3" style={{ color: '#5C3D2E' }}>Opciones de envío</p>

            {ratesLoading && (
              <p className="text-sm text-gray-400 animate-pulse">⏳ Cotizando opciones de envío...</p>
            )}

            {!ratesLoading && ratesError && (
              <div className="rounded-xl px-4 py-3 text-sm" style={{ background: '#FFF3F3', color: '#C9302C', border: '1px solid #F5C6CB' }}>
                ⚠️ {ratesError}
              </div>
            )}

            {!ratesLoading && rates.length > 0 && (
              <div className="space-y-2">
                {isFreeShipping && (
                  <p className="text-xs font-bold px-1 mb-1" style={{ color: '#155724' }}>
                    🎉 ¡Envío gratis en tu pedido!
                  </p>
                )}
                {rates.map(rate => (
                  <label
                    key={rate.id}
                    className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:shadow-sm"
                    style={{
                      borderColor: selectedRate?.id === rate.id ? '#8B6F47' : '#E5D5C0',
                      background:  selectedRate?.id === rate.id ? '#F5EDD8' : 'white',
                    }}
                  >
                    <input
                      type="radio"
                      name="rate"
                      value={rate.id}
                      checked={selectedRate?.id === rate.id}
                      onChange={() => setSelectedRate(rate)}
                      className="accent-[#8B6F47]"
                    />
                    <span className="text-xl">{RATE_ICON[rate.label]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: '#3E2C20' }}>
                        Envío {rate.label}
                      </p>
                      {rate.days !== null && (
                        <p className="text-xs" style={{ color: '#999' }}>
                          {rate.days} {rate.days === 1 ? 'día hábil' : 'días hábiles'}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      {rate.isFree ? (
                        <div>
                          <p className="text-sm font-bold" style={{ color: '#155724' }}>GRATIS</p>
                          <p className="text-xs line-through" style={{ color: '#bbb' }}>
                            ${rate.originalPrice.toLocaleString()}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm font-bold" style={{ color: '#C9302C' }}>
                          ${rate.price.toLocaleString()} MXN
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 3. Correo ── */}
      <div className="rounded-2xl border p-5 mb-4" style={{ borderColor: '#E5D5C0', background: 'white' }}>
        <h2 className="font-bold mb-1 text-sm uppercase tracking-wide" style={{ color: '#8B6F47' }}>
          Correo de confirmación
        </h2>
        <p className="text-xs mb-3" style={{ color: '#AAA' }}>
          Te enviaremos los detalles de tu pedido y el número de rastreo.
        </p>
        <input
          type="email"
          className={inputBase} style={inputStyle}
          placeholder="tu@correo.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCheckout()}
        />
      </div>

      {/* ── 4. Total con envío ── */}
      {selectedRate && (
        <div className="rounded-2xl border p-5 mb-4" style={{ borderColor: '#E5D5C0', background: 'white' }}>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between" style={{ color: '#666' }}>
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString()} MXN</span>
            </div>
            <div className="flex justify-between" style={{ color: isFreeShipping ? '#155724' : '#666' }}>
              <span>Envío {selectedRate.label}</span>
              <span className="font-medium">
                {isFreeShipping ? '¡GRATIS!' : `$${shippingCost.toLocaleString()} MXN`}
              </span>
            </div>
            <div
              className="flex justify-between font-bold text-base pt-3 border-t"
              style={{ borderColor: '#E5D5C0', color: '#3E2C20' }}
            >
              <span>Total</span>
              <span style={{ color: '#C9302C' }}>${grandTotal.toLocaleString()} MXN</span>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-sm mb-4 px-1" style={{ color: '#C9302C' }}>{error}</p>}

      {/* ── Botón pagar ── */}
      <button
        onClick={handleCheckout}
        disabled={loading || !selectedRate}
        className="w-full py-4 rounded-xl text-white font-bold text-base transition hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: '#C9302C' }}
      >
        {loading
          ? '⏳ Redirigiendo al pago...'
          : !selectedRate
            ? 'Elige una opción de envío para continuar'
            : `Pagar $${grandTotal.toLocaleString()} MXN →`}
      </button>

      <p className="text-center text-xs mt-3" style={{ color: '#BBB' }}>
        🔒 Pago 100% seguro con Stripe · No guardamos datos de tarjetas
      </p>

      <div className="text-center mt-5">
        <Link href="/catalogo" className="text-sm transition hover:opacity-70" style={{ color: '#8B6F47' }}>
          ← Seguir comprando
        </Link>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400">Cargando...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
