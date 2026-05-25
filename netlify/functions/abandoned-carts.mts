import type { Config } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)

// Corre cada 2 horas — busca carritos abandonados hace más de 1 hora
export const config: Config = {
  schedule: '0 */2 * * *',
}

export default async function handler() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('status', 'pending')
    .is('abandoned_email_sent_at', null)
    .lt('created_at', oneHourAgo)

  if (error) {
    console.error('Error buscando carritos abandonados:', error)
    return
  }

  console.log(`Carritos abandonados encontrados: ${orders?.length ?? 0}`)

  for (const order of (orders ?? [])) {
    try {
      // Obtener productos del carrito
      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id)

      if (!items?.length) continue

      // Revisar si algún producto tiene stock bajo (≤ 5 unidades)
      let hasLowStock = false
      for (const item of items) {
        if (!item.product_id) continue
        const { data: prod } = await supabase
          .from('products')
          .select('stock, variants')
          .eq('id', item.product_id)
          .single()
        if (!prod) continue
        const stock = item.variant_id
          ? ((prod.variants as any[]) ?? []).find((v: any) => v.id === item.variant_id)?.stock ?? 99
          : prod.stock ?? 99
        if (stock > 0 && stock <= 5) hasLowStock = true
      }

      const firstName = (order.shipping_name as string)?.split(' ')[0] ?? 'amig@'

      const { error: emailError } = await resend.emails.send({
        from: 'The Reading Broom <onboarding@resend.dev>',
        to:   order.email,
        subject: '¡Olvidaste algo en tu carrito! 📚🧹',
        html: buildEmail(items, order, firstName, hasLowStock),
      })

      if (emailError) {
        console.error(`Email error (orden ${order.id}):`, emailError)
        continue
      }

      await supabase
        .from('orders')
        .update({ abandoned_email_sent_at: new Date().toISOString() })
        .eq('id', order.id)

      console.log(`Correo de carrito abandonado enviado → ${order.email} (orden ${order.id})`)
    } catch (err) {
      console.error(`Error procesando carrito abandonado ${order.id}:`, err)
    }
  }
}

// ── Plantilla del correo ─────────────────────────────────────────────────────
interface OrderItem { name: string; quantity: number; price: number; image_url?: string }

function buildEmail(
  items: OrderItem[],
  order: Record<string, any>,
  firstName: string,
  hasLowStock: boolean,
): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const igDmUrl = 'https://ig.me/m/thereadingbroom'

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding:10px 8px;border-bottom:1px solid #E5D5C0;color:#3E2C20;">${item.name}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #E5D5C0;text-align:center;color:#6B5438;">${item.quantity}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #E5D5C0;text-align:right;font-weight:bold;color:#C9302C;">
        $${(item.price * item.quantity).toLocaleString('es-MX')} MXN
      </td>
    </tr>`).join('')

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const lowStockBanner = hasLowStock
    ? `<div style="background:#FFF3CD;border:1px solid #FFEAA7;border-radius:12px;padding:14px 16px;margin:20px 0;text-align:center;">
        <p style="color:#856404;margin:0;font-size:13px;">
          ⚠️ <strong>¡Hay pocas piezas disponibles!</strong> No garantizamos que sigan en stock si esperas mucho.
        </p>
      </div>`
    : ''

  return `<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:20px;background:#F5F1E8;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background:#3E2C20;padding:36px;text-align:center;">
      <p style="color:#D4AF8C;margin:0;font-size:28px;font-weight:bold;">🧹 The Reading Broom</p>
      <p style="color:rgba(255,255,255,0.75);margin:10px 0 0;font-size:15px;">¡Olvidaste algo aquí!</p>
    </div>

    <!-- Cuerpo -->
    <div style="padding:36px;">

      <h2 style="color:#3E2C20;margin-top:0;">Hola, ${firstName} 👋</h2>
      <p style="color:#6B5438;line-height:1.7;font-size:14px;">
        Notamos que te quedaste a un paso de completar tu pedido. ¡Los libros que elegiste te están esperando!
        Puedes retomar tu compra exactamente donde lo dejaste.
      </p>

      ${lowStockBanner}

      <!-- Tabla de productos -->
      <table style="width:100%;border-collapse:collapse;margin:24px 0;">
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
            <td colspan="2" style="padding:12px 8px;font-weight:bold;color:#3E2C20;font-size:15px;">Subtotal</td>
            <td style="padding:12px 8px;font-weight:bold;color:#C9302C;text-align:right;font-size:15px;">
              $${subtotal.toLocaleString('es-MX')} MXN
            </td>
          </tr>
        </tfoot>
      </table>

      <!-- Botón principal -->
      <div style="text-align:center;margin:28px 0 20px;">
        <a href="${siteUrl}/checkout"
           style="display:inline-block;padding:14px 36px;background:#C9302C;color:white;
                  text-decoration:none;border-radius:12px;font-size:15px;font-weight:bold;
                  font-family:Georgia,serif;">
          Retomar mi pedido →
        </a>
      </div>

      <!-- Separador -->
      <div style="border-top:1px solid #E5D5C0;margin:24px 0;"></div>

      <!-- Instagram DM -->
      <div style="text-align:center;">
        <p style="color:#6B5438;font-size:13px;margin:0 0 12px;">
          ¿Tienes alguna duda antes de comprar? Escríbenos por Instagram y te respondemos al momento 💬
        </p>
        <a href="${igDmUrl}"
           style="display:inline-block;padding:11px 28px;background:#3E2C20;color:#D4AF8C;
                  text-decoration:none;border-radius:12px;font-size:13px;font-weight:bold;
                  font-family:Georgia,serif;">
          📸 Escribirnos por Instagram
        </a>
        <p style="color:#BBB;font-size:11px;margin:10px 0 0;">@thereadingbroom</p>
      </div>

    </div>

    <!-- Footer -->
    <div style="background:#3E2C20;padding:20px;text-align:center;">
      <p style="color:rgba(255,255,255,0.4);margin:0;font-size:11px;">
        © 2025 The Reading Broom · CDMX<br>
        <span style="font-size:10px;">Recibiste este correo porque dejaste productos en tu carrito. Si ya completaste tu compra, ignora este mensaje.</span>
      </p>
    </div>

  </div>
</body>
</html>`
}
