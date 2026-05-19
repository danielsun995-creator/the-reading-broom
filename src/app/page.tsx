import HeroSlider from '@/components/HeroSlider'
import ProductCard from '@/components/ProductCard'
import Testimonials from '@/components/Testimonials'
import Newsletter from '@/components/Newsletter'
import Link from 'next/link'
import { categories } from '@/lib/data'
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
      stock: row.stock ?? 99,
    }))
  } catch {
    return []
  }
}

export default async function Home() {
  const allProducts = await getProducts()
  const newProducts = allProducts.filter((p) => p.isNew)
  const popularProducts = allProducts.filter((p) => p.isPopular)

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
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </section>
      )}

      {/* Testimonios */}
      <Testimonials />

      {/* Categorías */}
      <section className="my-10">
        <h2 className="text-xl font-bold text-center mb-1" style={{ color: '#5C3D2E', fontFamily: 'Georgia, serif' }}>
          📂 Explora por Categoría
        </h2>
        <p className="text-center text-sm mb-6" style={{ color: '#999' }}>
          Encuentra el libro perfecto para cada ocasión
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalogo?categoria=${cat.id}`}
              className="rounded-xl p-5 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group"
              style={{ background: 'white', border: '1px solid #E5D5C0' }}
            >
              <div className="text-4xl mb-2">{cat.emoji}</div>
              <h3 className="font-semibold text-sm mb-1 group-hover:underline" style={{ color: '#5C3D2E', fontFamily: 'Georgia, serif' }}>
                {cat.name}
              </h3>
              <p className="text-xs" style={{ color: '#999' }}>{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Lo Más Popular */}
      {popularProducts.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold" style={{ color: '#5C3D2E', fontFamily: 'Georgia, serif' }}>
              ⭐ Lo Más Popular
            </h2>
            <Link href="/catalogo" className="text-sm font-medium hover:underline" style={{ color: '#8B6F47' }}>
              Ver catálogo completo →
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </section>
      )}

      {/* Brand Section */}
      <section
        className="rounded-2xl p-8 md:p-10 grid md:grid-cols-[auto_1fr] gap-6 items-center my-10 shadow-sm"
        style={{ background: 'white', border: '1px solid #E5D5C0' }}
      >
        <div className="text-7xl md:text-8xl text-center md:text-left">🧹📚</div>
        <div>
          <h2 className="text-xl font-bold mb-3" style={{ color: '#5C3D2E', fontFamily: 'Georgia, serif' }}>
            The Reading Broom: Tu experiencia mágica de lectura
          </h2>
          <p className="text-sm leading-relaxed mb-2" style={{ color: '#666' }}>
            ¿Buscas más que solo un libro? The Reading Broom es tu lugar ideal. Creamos kits de lectura que transforman cada historia en una experiencia completa.
          </p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#666' }}>
            Encontrarás kits para cada temporada, complementos premium y una comunidad de lectores apasionados.
          </p>
          <Link
            href="/catalogo"
            className="inline-block px-6 py-2.5 rounded-lg text-sm text-white font-medium hover:opacity-90 transition"
            style={{ background: '#8B6F47' }}
          >
            Explorar
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </>
  )
}
