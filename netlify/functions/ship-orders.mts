import type { Config } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

// Se ejecuta cada hora — genera guías para órdenes pagadas sin tracking

const SKY_BASE = 'https://api-pro.skydropx.com/api/v1'
const PKG      = { length: 33, width: 24, height: 9, weight: 0.7 }

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

export default async function () {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('status', 'paid')
    .is('tracking_number', null)
    .not('skydropx_rate_id', 'is', null)

  if (error) { console.error('DB error:', error); return }
  if (!orders?.length) { console.log('No hay órdenes pendientes'); return }

  console.log(`Procesando ${orders.length} órdenes...`)

  const token = await getSkyToken()

  for (const order of orders) {
    try {
      const res = await fetch(`${SKY_BASE}/shipments`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipment: {
            rate_id: order.skydropx_rate_id,
            address_from: {
              name: 'The Reading Broom', company: 'The Reading Broom',
              street: 'Constituyente Jesús Romero Flores 40', street2: 'El Molino',
              postal_code: '05240', city: 'Ciudad de México', province: 'Ciudad de México',
              country_code: 'MX', phone: '5574139159', email: 'begorreyes@gmail.com',
            },
            address_to: {
              name: order.shipping_name, street: order.shipping_street,
              street2: order.shipping_colonia ?? '', postal_code: order.shipping_cp,
              city: order.shipping_city, province: order.shipping_state,
              country_code: 'MX', phone: order.shipping_phone, email: order.email,
            },
            parcel: { length: PKG.length, width: PKG.width, height: PKG.height, weight: PKG.weight },
            // Valor declarado para seguro = total del pedido sin costo de envío
            insured_amount: Math.round((order.total ?? 0) - (order.shipping_cost ?? 0)),
          },
        }),
      })

      if (!res.ok) throw new Error(`Skydropx ${res.status}: ${(await res.text()).slice(0, 200)}`)

      const data = await res.json()
      await supabase.from('orders').update({
        status:               'shipped',
        tracking_number:      data.tracking_number ?? data.data?.attributes?.tracking_number ?? null,
        label_url:            data.label_url ?? data.data?.attributes?.label_url ?? null,
        skydropx_shipment_id: data.id ?? data.data?.id ?? null,
      }).eq('id', order.id)

      console.log(`✅ Guía creada — orden ${order.id}`)
    } catch (err: any) {
      console.error(`❌ Error orden ${order.id}:`, err.message)
    }
  }
}

export const config: Config = {
  schedule: '0 * * * *',   // cada hora en punto
}
