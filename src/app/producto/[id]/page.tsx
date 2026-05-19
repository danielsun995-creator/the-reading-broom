import { products as fallbackProducts } from '@/lib/data'
import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import AddToCartButton from './AddToCartButton'
import type { Product } from '@/lib/data'

async function getProduct(id: string): Promise<Product | null> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase.from('products').select('*').eq('id', id).single()
    if (!data) return fallbackProducts.find((p) => p.id === id) ?? null
    return {
      id: data.id, name: data.name, category: data.category, price: data.price,
      promotionalPrice: data.promotional_price ?? undefined,
      emoji: data.emoji ?? '📦', description: data.description ?? '',
      imageUrl: data.image_url ?? undefined,
      tag: data.tag ?? undefined, items: data.items ?? undefined,
      author: data.author ?? undefined, publisher: data.publisher ?? undefined,
      isNew: data.is_new ?? false, isPopular: data.is_popular ?? false,
      stock: data.stock ?? 99,
    }
  } catch {
    return fallbackProducts.find((p) => p.id === id) ?? null
  }
}

async function getRelated(category: string, excludeId: string): Promise<Product[]> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase.from('products').select('*')
      .eq('category', category).eq('active', true).neq('id', excludeId).limit(3)
    if (!data || data.length === 0) {
      return fallbackProducts.filter((p) => p.category === category && p.id !== excludeId).slice(0, 3)
    }
    return data.map((row) => ({
      id: row.id, name: row.name, category: row.category, price: row.price,
      emoji: row.emoji ?? '📦', description: row.description ?? '',
    })) as Product[]
  } catch {
    return fallbackProducts.filter((p) => p.category === category && p.id !== excludeId).slice(0, 3)
  }
}

export function generateStaticParams() {
  return fallbackProducts.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) return {}
  return {
    title: `${product.name} — The Reading Broom`,
    description: product.description,
  }
}

export default async function ProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()

  const related = await getRelated(product.category, id)

  return (
    <>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: '#B89060' }}>
        <Link href="/" className="hover:underline">Inicio</Link>
        <span>/</span>
        <Link href="/catalogo" className="hover:underline">Catálogo</Link>
        <span>/</span>
        <span style={{ color: '#5C3D2E' }}>{product.name}</span>
      </nav>

      {/* Main product */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Image */}
        <div
          className="rounded-2xl overflow-hidden shadow-sm relative"
          style={{ height: '400px', background: '#F5F1E8', border: '2px solid #E5D5C0' }}
        >
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-9xl">{product.emoji}</div>
          )}
          {product.stock !== undefined && product.stock <= 0 && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="text-lg font-bold px-4 py-2 rounded-full bg-white shadow" style={{ color: '#C9302C' }}>Sin stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          {product.tag && (
            <span
              className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 w-fit"
              style={{ background: '#F5F1E8', color: '#8B6F47' }}
            >
              {product.tag}
            </span>
          )}

          <h1 className="text-3xl font-bold mb-2" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
            {product.name}
          </h1>

          {product.author && (
            <p className="text-sm mb-3" style={{ color: '#999' }}>
              por <span className="font-medium" style={{ color: '#666' }}>{product.author}</span>
              {product.publisher && ` · ${product.publisher}`}
            </p>
          )}

          <div className="flex items-baseline gap-3 mb-4 flex-wrap">
            <span className="text-3xl font-bold" style={{ color: '#C9302C' }}>
              ${(product.promotionalPrice ?? product.price).toLocaleString()}
              <span className="text-base font-normal ml-1" style={{ color: '#999' }}>MXN</span>
            </span>
            {product.promotionalPrice && (
              <span className="text-xl line-through" style={{ color: '#bbb' }}>
                ${product.price.toLocaleString()}
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed mb-5" style={{ color: '#555' }}>
            {product.description}
          </p>

          {product.items && product.items.length > 0 && (
            <div className="mb-5">
              <h3 className="text-sm font-bold mb-2 pb-2 border-b" style={{ color: '#5C3D2E', borderColor: '#E5D5C0' }}>
                Incluye:
              </h3>
              <ul className="space-y-1.5">
                {product.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm" style={{ color: '#555' }}>
                    <span style={{ color: '#8B6F47' }}>✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <AddToCartButton product={product} />

          {/* Shipping note */}
          <p className="text-xs mt-4 text-center" style={{ color: '#B89060' }}>
            🚚 Envío a toda la República Mexicana · Procesamos en 2-5 días hábiles
          </p>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4" style={{ color: '#5C3D2E', fontFamily: 'Georgia, serif' }}>
            También te puede gustar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/producto/${p.id}`}
                className="flex items-center gap-3 p-4 rounded-xl border hover:shadow-md transition"
                style={{ background: 'white', borderColor: '#E5D5C0' }}
              >
                <span className="text-4xl">{p.emoji}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#5C3D2E' }}>{p.name}</p>
                  <p className="text-sm font-bold" style={{ color: '#C9302C' }}>${p.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
