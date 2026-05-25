import { redirect } from 'next/navigation'
import { createAuthServerClient, createAdminClient } from '@/lib/supabase/server'
import CuentaClient from './CuentaClient'
import { products as fallbackProducts } from '@/lib/data'

export default async function CuentaPage() {
  const supabase = await createAuthServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/cuenta')
  }

  // Usamos el admin client para leer órdenes sin restricciones de RLS
  const admin = createAdminClient()

  const { data: orders } = await admin
    .from('orders')
    .select('*')
    .eq('email', user.email)
    .order('created_at', { ascending: false })

  const orderIds = (orders ?? []).map((o) => o.id)

  const { data: allItems } = orderIds.length
    ? await admin.from('order_items').select('*').in('order_id', orderIds)
    : { data: [] }

  // Obtener imágenes de productos para todos los items del pedido
  const productIds = [...new Set((allItems ?? []).map((i) => i.product_id).filter(Boolean))]
  let productImageMap: Record<string, string> = {}

  if (productIds.length > 0) {
    const { data: productRows } = await admin
      .from('products')
      .select('id, image_url')
      .in('id', productIds)

    // Primero usar Supabase, luego fallback a data.ts
    const fallbackMap = Object.fromEntries(
      fallbackProducts.map((p) => [p.id, p.imageUrl ?? ''])
    )
    const supabaseMap = Object.fromEntries(
      (productRows ?? [])
        .filter((p) => p.image_url)
        .map((p) => [p.id, p.image_url as string])
    )
    productImageMap = { ...fallbackMap, ...supabaseMap }
  }

  const ordersWithItems = (orders ?? []).map((order) => ({
    ...order,
    items: (allItems ?? []).filter((item) => item.order_id === order.id).map((item) => ({
      ...item,
      // Usar image_url guardado, o buscarlo en products, en ese orden
      image_url: item.image_url || productImageMap[item.product_id] || null,
    })),
  }))

  return <CuentaClient user={user} orders={ordersWithItems} />
}
