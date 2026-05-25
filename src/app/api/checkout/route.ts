import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface ShippingInput {
  rate_id: string
  carrier: string
  service: string
  cost: number
  original_cost: number
  is_free: boolean
  name: string
  street: string
  colonia: string
  city: string
  state: string
  cp: string
  phone: string
}

interface CartItemInput {
  id: string
  productId?: string
  name: string
  emoji?: string
  price: number
  quantity: number
  imageUrl?: string
  kitConfig?: string[]
  variantId?: string
  variantName?: string
}

export async function POST(req: NextRequest) {
  try {
    const { items, email, shipping } = await req.json() as {
      items: CartItemInput[]
      email: string
      shipping: ShippingInput
    }

    if (!items?.length || !email || !shipping) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const total    = subtotal + (shipping.cost ?? 0)

    // ── Line items de Stripe ──
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: item.name,
          ...(item.emoji ? { description: item.emoji } : {}),
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }))

    // Agregar envío como línea si tiene costo
    if (shipping.cost > 0) {
      lineItems.push({
        price_data: {
          currency: 'mxn',
          product_data: {
            name: `Envío — ${shipping.carrier.toUpperCase()} ${shipping.service}`,
          },
          unit_amount: shipping.cost * 100,
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      locale: 'es',
      line_items: lineItems,
      metadata: {},
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/orden-confirmada?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?cancelado=true`,
    })

    // ── Crear orden en Supabase ──
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        email,
        total,
        status:           'pending',
        stripe_session_id: session.id,
        // Dirección
        shipping_name:    shipping.name,
        shipping_street:  shipping.street,
        shipping_colonia: shipping.colonia,
        shipping_city:    shipping.city,
        shipping_state:   shipping.state,
        shipping_cp:      shipping.cp,
        shipping_phone:   shipping.phone,
        // Envío
        shipping_carrier: shipping.carrier,
        shipping_service: shipping.service,
        shipping_cost:    shipping.cost,
        skydropx_rate_id: shipping.rate_id,
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error('Order insert error:', orderError)
      return NextResponse.json({ error: 'Error creando orden' }, { status: 500 })
    }

    // ── Guardar items ──
    await supabase.from('order_items').insert(
      items.map((item) => ({
        order_id:    order.id,
        product_id:  item.productId ?? item.id,
        name:        item.name,
        quantity:    item.quantity,
        price:       item.price,
        image_url:   item.imageUrl ?? null,
        kit_config:  item.kitConfig ?? null,
        variant_id:  item.variantId ?? null,
        variant_name: item.variantName ?? null,
      }))
    )

    // ── Actualizar metadata de Stripe con el order_id ──
    await stripe.checkout.sessions.update(session.id, {
      metadata: { order_id: order.id },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
