import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe   = new Stripe(process.env.STRIPE_SECRET_KEY!)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CANCEL_WINDOW_HOURS = 12

export async function POST(req: NextRequest) {
  try {
    const { order_id, token } = await req.json()

    if (!order_id || !token) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
    }

    // 1. Buscar la orden
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
    }

    // 2. Verificar token
    if (order.cancel_token !== token) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 403 })
    }

    // 3. Verificar que no esté ya cancelada o enviada
    if (order.status === 'cancelled') {
      return NextResponse.json({ error: 'Este pedido ya fue cancelado.' }, { status: 409 })
    }
    if (order.status === 'shipped' || order.tracking_number) {
      return NextResponse.json({ error: 'Tu pedido ya fue enviado — no es posible cancelarlo.' }, { status: 409 })
    }

    // 4. Verificar ventana de 12 horas
    const createdAt  = new Date(order.created_at)
    const hoursElapsed = (Date.now() - createdAt.getTime()) / 1000 / 3600
    if (hoursElapsed > CANCEL_WINDOW_HOURS) {
      return NextResponse.json(
        { error: `El plazo de cancelación de ${CANCEL_WINDOW_HOURS} horas ha expirado.` },
        { status: 410 }
      )
    }

    // 5. Reembolso en Stripe
    if (order.stripe_payment_intent) {
      try {
        await stripe.refunds.create({ payment_intent: order.stripe_payment_intent })
      } catch (err: any) {
        console.error('Stripe refund error:', err)
        // Si ya fue reembolsada previamente, Stripe lanza un error — ignorarlo
        if (!err?.message?.includes('already been refunded')) {
          return NextResponse.json({ error: 'Error al procesar el reembolso. Contáctanos.' }, { status: 500 })
        }
      }
    }

    // 6. Restaurar stock por cada producto
    const { data: items } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order_id)

    for (const item of (items ?? [])) {
      try {
        if (item.variant_id) {
          const { data: prod } = await supabase
            .from('products').select('variants').eq('id', item.product_id).single()
          if (prod?.variants) {
            const updated = (prod.variants as any[]).map((v: any) =>
              v.id === item.variant_id
                ? { ...v, stock: (v.stock ?? 0) + item.quantity }
                : v
            )
            await supabase.from('products').update({ variants: updated }).eq('id', item.product_id)
          }
        } else {
          const { data: prod } = await supabase
            .from('products').select('stock').eq('id', item.product_id).single()
          if (prod != null) {
            await supabase.from('products')
              .update({ stock: (prod.stock ?? 0) + item.quantity })
              .eq('id', item.product_id)
          }
        }
      } catch (err) {
        console.error('Error restaurando stock para', item.product_id, err)
      }
    }

    // 7. Marcar orden como cancelada
    await supabase
      .from('orders')
      .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
      .eq('id', order_id)

    return NextResponse.json({ ok: true, message: 'Pedido cancelado y reembolso procesado.' })
  } catch (err) {
    console.error('Cancel order error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// GET — verificar si una orden es cancelable (para la página de confirmación)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const order_id = searchParams.get('order_id')
  const token    = searchParams.get('token')

  if (!order_id || !token) {
    return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
  }

  const { data: order } = await supabase
    .from('orders')
    .select('id, status, created_at, cancel_token, tracking_number, total, shipping_carrier, shipping_service')
    .eq('id', order_id)
    .single()

  if (!order || order.cancel_token !== token) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }

  const hoursElapsed = (Date.now() - new Date(order.created_at).getTime()) / 1000 / 3600
  const canCancel    = order.status === 'paid' && hoursElapsed <= CANCEL_WINDOW_HOURS && !order.tracking_number
  const hoursLeft    = Math.max(0, CANCEL_WINDOW_HOURS - hoursElapsed)

  return NextResponse.json({ order, canCancel, hoursLeft: Math.round(hoursLeft * 10) / 10 })
}
