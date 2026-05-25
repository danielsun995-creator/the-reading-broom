import { NextRequest, NextResponse } from 'next/server'

const SKY_BASE         = 'https://api-pro.skydropx.com/api/v1'
const FREE_THRESHOLD   = 1500
const FREE_MAX_COST    = 60    // solo ofrecer envío gratis si el costo real es ≤ $60
const PKG              = { length: 33, width: 24, height: 9, weight: 0.7 }
const TRUSTED_CARRIERS = ['fedex', 'dhl', 'estafeta']
const INSURANCE_RATE   = 0.02  // 2% del subtotal del pedido
const INSURANCE_MIN    = 20    // mínimo $20 MXN

const ORIGIN = {
  country_code: 'MX',
  postal_code:  '05240',
  area_level1:  'Ciudad de Mexico',
  area_level2:  'Cuajimalpa de Morelos',
  area_level3:  'El Molino',
}

async function getSkyToken(): Promise<string> {
  const res = await fetch(`${SKY_BASE}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id:     process.env.SKYDROPX_CLIENT_KEY,
      client_secret: process.env.SKYDROPX_SECRET_KEY,
      grant_type:    'client_credentials',
    }),
  })
  if (!res.ok) throw new Error(`Skydropx token error ${res.status}`)
  const { access_token } = await res.json()
  return access_token as string
}

export async function POST(req: NextRequest) {
  try {
    const { zip_to, subtotal } = await req.json()

    if (!zip_to || !/^\d{5}$/.test(zip_to)) {
      return NextResponse.json({ error: 'CP inválido' }, { status: 400 })
    }

    // ── 1. OAuth token ──────────────────────────────────────────────
    let token: string
    try {
      token = await getSkyToken()
    } catch {
      return NextResponse.json({ error: 'No se pudo conectar con el servicio de envío.' }, { status: 502 })
    }

    // ── 2. Crear cotización ─────────────────────────────────────────
    const quotRes = await fetch(`${SKY_BASE}/quotations`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quotation: {
          address_from: ORIGIN,
          address_to: {
            country_code: 'MX',
            postal_code:  zip_to,
            area_level1:  'Mexico',
            area_level2:  'Mexico',
            area_level3:  'Centro',
          },
          parcel: {
            weight: PKG.weight,
            length: PKG.length,
            width:  PKG.width,
            height: PKG.height,
          },
        },
      }),
    })

    if (!quotRes.ok) {
      return NextResponse.json(
        { error: 'No hay servicio de envío disponible para ese CP. Intenta con otro código postal.' },
        { status: 422 }
      )
    }

    let quotation = await quotRes.json()
    const quotId  = quotation.id as string

    // ── 3. Polling hasta is_completed ──────────────────────────────
    if (!quotation.is_completed) {
      for (let i = 0; i < 5; i++) {
        await new Promise((r) => setTimeout(r, 2000))
        const poll = await fetch(`${SKY_BASE}/quotations/${quotId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (poll.ok) {
          quotation = await poll.json()
          if (quotation.is_completed) break
        }
      }
    }

    // ── 4. Filtrar solo paqueterías de confianza ────────────────────
    const trusted = (quotation.rates ?? []).filter((r: any) => {
      const provider = (r.provider_name ?? '').toLowerCase()
      const code     = (r.provider_service_code ?? '').toLowerCase()
      return (
        r.success &&
        r.total != null &&
        TRUSTED_CARRIERS.includes(provider) &&
        !code.includes('ltl')          // excluir servicios de carga
      )
    })

    if (trusted.length === 0) {
      return NextResponse.json(
        { error: 'No encontramos opciones de envío para ese código postal.' },
        { status: 422 }
      )
    }

    // ── 5. Elegir la más barata y la más rápida ────────────────────
    const byPrice = [...trusted].sort((a, b) => parseFloat(a.total) - parseFloat(b.total))
    const byDays  = [...trusted].filter(r => r.days != null).sort((a, b) => a.days - b.days)

    const cheapest = byPrice[0]
    const fastest  = byDays[0]

    // Seguro de envío — incluido siempre en el costo (absorbido si el envío es gratis)
    const insuranceCost = Math.max(INSURANCE_MIN, Math.round((subtotal ?? 0) * INSURANCE_RATE))

    // Determinar envío gratis: subtotal ≥ $1500 Y la opción más barata cuesta ≤ $60
    const cheapestPrice = parseFloat(cheapest.total)
    const isFree = (subtotal ?? 0) >= FREE_THRESHOLD && cheapestPrice <= FREE_MAX_COST

    const toRate = (r: any, label: 'Estándar' | 'Express') => {
      const carrierCost = parseFloat(r.total)
      const totalWithInsurance = carrierCost + insuranceCost
      return {
        id:            r.id as string,
        carrier:       (r.provider_name ?? '').toLowerCase(),
        service:       r.provider_service_name ?? '',
        label,
        price:         isFree ? 0 : totalWithInsurance,
        originalPrice: isFree ? totalWithInsurance : totalWithInsurance,
        days:          r.days ?? null,
        isFree,
        insuranceCost: isFree ? 0 : insuranceCost,
      }
    }

    const rates: ReturnType<typeof toRate>[] = []

    rates.push(toRate(cheapest, 'Estándar'))

    // Agregar express solo si es distinta opción y llega más rápido
    if (
      fastest &&
      fastest.id !== cheapest.id &&
      (fastest.days ?? 99) < (cheapest.days ?? 99)
    ) {
      rates.push(toRate(fastest, 'Express'))
    }

    return NextResponse.json({ rates, isFree })
  } catch (err) {
    console.error('Shipping rates error:', err)
    return NextResponse.json({ error: 'Error al cotizar envío' }, { status: 500 })
  }
}
