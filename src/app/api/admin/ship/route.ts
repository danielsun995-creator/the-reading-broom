import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SKY_BASE = 'https://api-pro.skydropx.com/api/v1'
const PKG      = { length: 33, width: 24, height: 9, weight: 0.7 }
const CANCEL_WINDOW_HOURS = 12

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
  if (!res.ok) throw new Error(`Token error ${res.status}`)
  const { access_token } = await res.json()
  return access_token as string
}

async function createShipment(order: Record<string, any>, token: string) {
  const res = await fetch(`${SKY_BASE}/shipments`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      shipment: {
        rate_id: order.skydropx_rate_id,
        address_from: {
          name:         'The Reading Broom',
          company:      'The Reading Broom',
          street:       'Constituyente Jesús Romero Flores 40',
          street2:      'El Molino',
          postal_code:  '05240',
          city:         'Ciudad de México',
          province:     'Ciudad de México',
          country_code: 'MX',
          phone:        '5574139159',
          email:        'begorreyes@gmail.com',
        },
        address_to: {
          name:         order.shipping_name,
          street:       order.shipping_street,
          street2:      order.shipping_colonia ?? '',
          postal_code:  order.shipping_cp,
          city:         order.shipping_city,
          province:     order.shipping_state,
          country_code: 'MX',
          phone:        order.shipping_phone,
          email:        order.email,
        },
        parcel: { length: PKG.length, width: PKG.width, height: PKG.height, weight: PKG.weight },
      },
    }),
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Skydropx ${res.status}: ${txt.slice(0, 200)}`)
  }

  const data = await res.json()
  return {
    shipmentId:     data.id ?? data.data?.id ?? null,
    trackingNumber: data.tracking_number ?? data.data?.attributes?.tracking_number ?? null,
    labelUrl:       data.label_url ?? data.data?.attributes?.label_url ?? null,
  }
}

// POST /api/admin/ship — genera guías para órdenes listas (>12h, no canceladas, sin guía)
export async function POST(req: NextRequest) {
  // Autenticación simple con ADMIN_SECRET
  const authHeader = req.headers.get('authorization')
  if (!process.env.ADMIN_SECRET || authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // Buscar órdenes pagadas sin guía y fuera del window de cancelación
  const cutoff = new Date(Date.now() - CANCEL_WINDOW_HOURS * 60 * 60 * 1000).toISOString()

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('status', 'paid')
    .is('tracking_number', null)
    .not('skydropx_rate_id', 'is', null)
    .lt('created_at', cutoff)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!orders?.length) return NextResponse.json({ message: 'No hay órdenes pendientes de guía.', processed: 0 })

  const results: any[] = []
  let skyToken: string

  try {
    skyToken = await getSkyToken()
  } catch (err) {
    return NextResponse.json({ error: 'No se pudo conectar con Skydropx.' }, { status: 502 })
  }

  for (const order of orders) {
    try {
      const shipment = await createShipment(order, skyToken)

      await supabase
        .from('orders')
        .update({
          status:               'shipped',
          tracking_number:      shipment.trackingNumber,
          label_url:            shipment.labelUrl,
          skydropx_shipment_id: shipment.shipmentId,
        })
        .eq('id', order.id)

      results.push({ order_id: order.id, status: 'ok', tracking: shipment.trackingNumber })
      console.log(`✅ Guía creada para orden ${order.id} — tracking: ${shipment.trackingNumber}`)
    } catch (err: any) {
      results.push({ order_id: order.id, status: 'error', message: err.message })
      console.error(`❌ Error en orden ${order.id}:`, err.message)
    }
  }

  return NextResponse.json({ processed: results.length, results })
}

// GET — ver órdenes pendientes de guía (sin crearlas)
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!process.env.ADMIN_SECRET || authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const cutoff = new Date(Date.now() - CANCEL_WINDOW_HOURS * 60 * 60 * 1000).toISOString()

  const { data: orders } = await supabase
    .from('orders')
    .select('id, email, total, shipping_carrier, created_at, status')
    .eq('status', 'paid')
    .is('tracking_number', null)
    .not('skydropx_rate_id', 'is', null)
    .lt('created_at', cutoff)
    .order('created_at', { ascending: true })

  return NextResponse.json({ pending: orders?.length ?? 0, orders })
}
