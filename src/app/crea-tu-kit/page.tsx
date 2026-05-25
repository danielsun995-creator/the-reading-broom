import { createServerClient } from '@/lib/supabase/server'
import { products as fallbackProducts } from '@/lib/data'
import type { Product } from '@/lib/data'
import KitBuilderClient from './KitBuilderClient'

async function getKits(): Promise<Product[]> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .eq('category', 'kit')
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      return fallbackProducts.filter((p) => p.category === 'kit')
    }

    return data.map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      price: row.price,
      promotionalPrice: row.promotional_price ?? undefined,
      emoji: row.emoji ?? '📦',
      description: row.description ?? '',
      imageUrl: row.image_url ?? undefined,
      tag: row.tag ?? undefined,
      isNew: row.is_new ?? false,
      isPopular: row.is_popular ?? false,
      stock: row.stock ?? 0,
    }))
  } catch {
    return fallbackProducts.filter((p) => p.category === 'kit')
  }
}

export default async function CreatuKitPage() {
  const kits = await getKits()
  return <KitBuilderClient kits={kits} />
}
