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
      emoji: row.emoji ?? '📦',
      description: row.description ?? '',
      tag: row.tag ?? undefined,
      items: row.items ?? undefined,
      author: row.author ?? undefined,
      publisher: row.publisher ?? undefined,
      isNew: row.is_new ?? false,
      isPopular: row.is_popular ?? false,
    }))
  } catch {
    return fallbackProducts
  }
}

export default async function CatalogoPage() {
  const products = await getProducts()

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
      <CatalogoClient products={products} />
    </>
  )
}
