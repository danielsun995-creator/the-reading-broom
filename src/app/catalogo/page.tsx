import { createServerClient } from '@/lib/supabase/server'
import { products as fallbackProducts } from '@/lib/data'
import CatalogoClient from './CatalogoClient'
import type { Product } from '@/lib/data'

async function getProducts(): Promise<Product[]> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) return fallbackProducts

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
      tags: Array.isArray(row.tags) ? row.tags : undefined,
      items: row.items ?? undefined,
      author: row.author ?? undefined,
      publisher: row.publisher ?? undefined,
      isNew: row.is_new ?? false,
      isPopular: row.is_popular ?? false,
      stock: row.stock ?? 99,
      variants: row.variants
        ? (row.variants as Array<{ id: string; name: string; stock: number; image_url?: string }>).map((v) => ({
            id: v.id, name: v.name, stock: v.stock, imageUrl: v.image_url ?? undefined,
          }))
        : undefined,
    }))
  } catch {
    return fallbackProducts
  }
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>
}) {
  const products = await getProducts()
  const { categoria } = await searchParams

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#5C3D2E', fontFamily: 'Georgia, serif' }}>
          🛍️ Catálogo
        </h1>
        <p className="text-sm" style={{ color: '#999' }}>
          Todos nuestros productos
        </p>
      </div>
      <CatalogoClient products={products} initialCategory={categoria} />
    </>
  )
}
