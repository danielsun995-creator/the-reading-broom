import HeroSlider from '@/components/HeroSlider'
import NuevosTitulosCarousel from '@/components/NuevosTitulosCarousel'
import Testimonials from '@/components/Testimonials'
import Newsletter from '@/components/Newsletter'
import DestacadosSection from '@/components/DestacadosSection'
import PopularCarousel from '@/components/PopularCarousel'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import type { Product } from '@/lib/data'

async function getProducts(): Promise<Product[]> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })

    if (!data || data.length === 0) return []

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
      items: row.items ?? undefined,
      author: row.author ?? undefined,
      publisher: row.publisher ?? undefined,
      isNew: row.is_new ?? false,
      isPopular: row.is_popular ?? false,
      isFeatured: row.is_featured ?? false,
      stock: row.stock ?? 99,
      tags: row.tags ?? [],
      variants: row.variants
        ? (row.variants as Array<{ id: string; name: string; stock: number; image_url?: string }>).map((v) => ({
            id: v.id, name: v.name, stock: v.stock, imageUrl: v.image_url ?? undefined,
          }))
        : undefined,
    }))
  } catch {
    return []
  }
}

export default async function Home() {
  const allProducts = await getProducts()
  const newProducts = allProducts.filter((p) => p.isNew)
  const popularProducts = allProducts.filter((p) => p.isPopular)
  const featuredProducts = allProducts.filter((p) => p.isFeatured)

  return (
    <>
      {/* Hero */}
      <HeroSlider />

      {/* Nuevos Títulos */}
      {newProducts.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold" style={{ color: '#5C3D2E', fontFamily: 'Georgia, serif' }}>
              🆕 Nuevos Títulos
            </h2>
            <Link href="/catalogo" className="text-sm font-medium hover:underline" style={{ color: '#8B6F47' }}>
              Ver todo →
            </Link>
          </div>
          <NuevosTitulosCarousel products={newProducts} />
        </section>
      )}

      {/* Testimonios */}
      <Testimonials />

      {/* Destacados */}
      <DestacadosSection products={featuredProducts} />

      {/* Lo Más Popular */}
      {popularProducts.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: '#5C3D2E', fontFamily: 'Georgia, serif' }}>
              ⭐ Lo Más Popular
            </h2>
            <Link href="/catalogo" className="text-sm font-medium hover:underline" style={{ color: '#8B6F47' }}>
              Ver catálogo completo →
            </Link>
          </div>
          <PopularCarousel products={popularProducts} />
        </section>
      )}

      {/* Newsletter */}
      <Newsletter />
    </>
  )
}
