import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe   = new Stripe(process.env.STRIPE_SECRET_KEY!)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  // Proteger con ADMIN_SECRET
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { order_id } = await req.json()
  if (!order_id) {
    return NextResponse.json({ error: 'Falta order_id' }, { status: 400 })
  }

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', order_id)
    .single()

  if (error || !order) {
    return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
  }

  if (!order.stripe_payment_intent) {
    return NextResponse.json({ error: 'Esta orden no tiene payment intent registrado' }, { status: 400 })
  }

  if (order.status === 'refunded') {
    return NextResponse.json({ error: 'Esta orden ya fue reembolsada' }, { status: 409 })
  }

  // Calcular monto a reembolsar: total del pedido MENOS costo de envío
  // El envío ya fue generado y no es reembolsable
  const productTotal  = Math.round((order.total ?? 0) - (order.shipping_cost ?? 0))
  const refundAmountCents = productTotal * 100

  if (refundAmountCents <= 0) {
    return NextResponse.json({ error: 'El monto a reembolsar calculado es cero' }, { status: 400 })
  }

  try {
    const refund = await stripe.refunds.create({
      payment_intent: order.stripe_payment_intent,
      amount: refundAmountCents,
    })

    // Marcar la orden como reembolsada
    await supabase
      .from('orders')
      .update({ status: 'refunded', refunded_at: new Date().toISOString() })
      .eq('id', order_id)

    return NextResponse.json({
      ok:             true,
      refund_id:      refund.id,
      amount_refunded: productTotal,
      shipping_kept:  order.shipping_cost ?? 0,
    })
  } catch (err: any) {
    console.error('Stripe partial refund error:', err)
    return NextResponse.json({ error: err.message ?? 'Error al procesar reembolso' }, { status: 500 })
  }
}

// GET — consultar cuánto se reembolsaría (preview antes de confirmar)
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const order_id = searchParams.get('order_id')
  if (!order_id) return NextResponse.json({ error: 'Falta order_id' }, { status: 400 })

  const { data: order } = await supabase
    .from('orders')
    .select('id, total, shipping_cost, status, email, shipping_name, stripe_payment_intent')
    .eq('id', order_id)
    .single()

  if (!order) return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })

  const { data: items } = await supabase
    .from('order_items')
    .select('name, quantity, price')
    .eq('order_id', order_id)

  const productTotal = Math.round((order.total ?? 0) - (order.shipping_cost ?? 0))

  return NextResponse.json({
    order_id:        order.id,
    customer:        order.shipping_name,
    email:           order.email,
    status:          order.status,
    total:           order.total,
    shipping_cost:   order.shipping_cost,
    product_total:   productTotal,
    items:           items ?? [],
  })
}
