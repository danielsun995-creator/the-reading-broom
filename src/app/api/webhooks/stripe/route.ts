import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const stripe   = new Stripe(process.env.STRIPE_SECRET_KEY!)
const resend   = new Resend(process.env.RESEND_API_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ── Webhook handler ──────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')

  if (!sig) return NextResponse.json({ error: 'Sin firma' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Firma inválida' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.metadata?.order_id
    const email   = session.customer_email || session.metadata?.email

    if (!orderId) {
      console.warn('⚠️ Sin order_id en metadata — session:', session.id)
      return NextResponse.json({ received: true })
    }

    // 1. Marcar orden como pagada y guardar payment_intent
    await supabase
      .from('orders')
      .update({
        status:                  'paid',
        stripe_session_id:       session.id,
        stripe_payment_intent:   session.payment_intent as string ?? null,
      })
      .eq('id', orderId)

    // 2. Leer orden completa (incluye cancel_token)
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    // 3. Obtener items
    const { data: items } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)

    // 4. Descontar stock por cada producto comprado
    for (const item of (items ?? [])) {
      try {
        if (item.variant_id) {
          // Producto con variante — actualizar el stock dentro del JSON de variantes
          const { data: prod } = await supabase
            .from('products').select('variants').eq('id', item.product_id).single()
          if (prod?.variants) {
            const updated = (prod.variants as any[]).map((v: any) =>
              v.id === item.variant_id
                ? { ...v, stock: Math.max(0, (v.stock ?? 0) - item.quantity) }
                : v
            )
            await supabase.from('products').update({ variants: updated }).eq('id', item.product_id)
          }
        } else {
          // Producto simple — descontar columna stock
          const { data: prod } = await supabase
            .from('products').select('stock').eq('id', item.product_id).single()
          if (prod != null) {
            await supabase.from('products')
              .update({ stock: Math.max(0, (prod.stock ?? 0) - item.quantity) })
              .eq('id', item.product_id)
          }
        }
      } catch (err) {
        console.error('Error descontando stock para', item.product_id, err)
      }
    }

    // 5. Enviar correo de confirmación
    if (email && items?.length) {
      const { error: emailError } = await resend.emails.send({
        from:    'The Reading Broom <onboarding@resend.dev>',
        to:      email,
        subject: '¡Tu pedido está confirmado! 📚🧹',
        html:    buildEmailHtml(items, session.amount_total! / 100, order),
      })
      if (emailError) console.error('Email error:', emailError)
    }
  }

  return NextResponse.json({ received: true })
}

// ── Email HTML ───────────────────────────────────────────────────
interface OrderItem { name: string; quantity: number; price: number }

function buildEmailHtml(
  items: OrderItem[],
  total: number,
  order: Record<string, any> | null,
): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 8px;border-bottom:1px solid #E5D5C0;color:#3E2C20;">${item.name}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #E5D5C0;text-align:center;color:#6B5438;">${item.quantity}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #E5D5C0;text-align:right;font-weight:bold;color:#C9302C;">
          $${(item.price * item.quantity).toLocaleString('es-MX')}
        </td>
      </tr>`
    )
    .join('')

  const addressBlock = order?.shipping_name
    ? `<div style="background:#F5F1E8;border-radius:12px;padding:16px;margin:16px 0;">
        <p style="color:#8B6F47;margin:0 0 8px;font-size:13px;font-weight:bold;">📍 Dirección de entrega</p>
        <p style="color:#3E2C20;margin:2px 0;font-size:13px;">${order.shipping_name}</p>
        <p style="color:#3E2C20;margin:2px 0;font-size:13px;">${order.shipping_street}${order.shipping_colonia ? `, ${order.shipping_colonia}` : ''}</p>
        <p style="color:#3E2C20;margin:2px 0;font-size:13px;">${order.shipping_city}, ${order.shipping_state} CP ${order.shipping_cp}</p>
      </div>`
    : ''


  return `<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:20px;background:#F5F1E8;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.1);">

    <div style="background:#3E2C20;padding:36px;text-align:center;">
      <p style="color:#D4AF8C;margin:0;font-size:28px;font-weight:bold;">🧹 The Reading Broom</p>
      <p style="color:rgba(255,255,255,0.75);margin:10px 0 0;font-size:15px;">¡Tu pedido está confirmado!</p>
    </div>

    <div style="padding:36px;">
      <h2 style="color:#3E2C20;margin-top:0;">Gracias por tu compra 📚</h2>
      <p style="color:#6B5438;line-height:1.6;">Hemos recibido tu pedido y lo estamos preparando con mucho amor.</p>

      <div style="background:#FFF3CD;border-radius:12px;padding:16px;margin:20px 0;">
        <p style="color:#856404;margin:0;font-size:13px;">📦 Tu guía de envío será generada en breve. Te llegará un correo con tu número de rastreo.</p>
      </div>

      ${addressBlock}

      <table style="width:100%;border-collapse:collapse;margin:28px 0;">
        <thead>
          <tr style="background:#F5F1E8;">
            <th style="padding:10px 8px;text-align:left;color:#8B6F47;font-size:13px;">Producto</th>
            <th style="padding:10px 8px;text-align:center;color:#8B6F47;font-size:13px;">Cant.</th>
            <th style="padding:10px 8px;text-align:right;color:#8B6F47;font-size:13px;">Precio</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:14px 8px;font-weight:bold;color:#3E2C20;font-size:16px;">Total</td>
            <td style="padding:14px 8px;font-weight:bold;color:#C9302C;text-align:right;font-size:16px;">
              $${total.toLocaleString('es-MX')} MXN
            </td>
          </tr>
        </tfoot>
      </table>

      <div style="background:#F5F1E8;border-radius:12px;padding:20px;margin-top:8px;">
        <p style="color:#8B6F47;margin:0 0 8px;font-size:14px;">¿Tienes alguna duda sobre tu pedido?</p>
        <p style="color:#3E2C20;margin:4px 0;font-weight:bold;">📞 +52 155 7413 9159</p>
        <p style="color:#3E2C20;margin:4px 0;">✉️ <a href="mailto:begorreyes@gmail.com" style="color:#8B6F47;">begorreyes@gmail.com</a></p>
      </div>
    </div>

    <div style="background:#3E2C20;padding:20px;text-align:center;">
      <a href="https://instagram.com/thereadingbroom" style="color:#D4AF8C;text-decoration:none;font-size:14px;">📸 @thereadingbroom</a>
      <p style="color:rgba(255,255,255,0.4);margin:8px 0 0;font-size:11px;">© 2025 The Reading Broom · CDMX</p>
    </div>

  </div>
</body>
</html>`
}
