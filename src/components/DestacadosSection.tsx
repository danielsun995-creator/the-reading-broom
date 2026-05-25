'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/data'

interface Props {
  products: Product[]
}

export default function DestacadosSection({ products }: Props) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (products.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % products.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [products.length])

  const product = products[current]

  return (
    <section className="my-10">
      <h2
        className="text-xl font-bold text-center mb-1"
        style={{ color: '#5C3D2E', fontFamily: 'Georgia, serif' }}
      >
        ✨ Destacados
      </h2>
      <p className="text-center text-sm mb-6" style={{ color: '#999' }}>
        Lo mejor de The Reading Broom en un solo lugar
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ minHeight: '340px' }}>

        {/* ── Tarjeta grande: Nuevos Lanzamientos (2 columnas) ── */}
        <Link
          href="/catalogo"
          className="md:col-span-2 rounded-2xl overflow-hidden relative flex flex-col justify-end group"
          style={{ minHeight: '340px' }}
        >
          {/* Imagen de fondo — llena todo el card */}
          {product?.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(145deg, #3E2C20, #8B6F47)' }}
            />
          )}

          {/* Gradiente oscuro en la parte inferior para leer el texto */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(20,8,2,0.88) 0%, rgba(20,8,2,0.2) 50%, transparent 100%)' }}
          />

          {/* Badge arriba */}
          <span
            className="absolute top-4 left-4 z-10 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', backdropFilter: 'blur(4px)' }}
          >
            🆕 Nuevos Lanzamientos
          </span>

          {/* Texto abajo */}
          <div className="relative z-10 p-6">
            {product ? (
              <>
                <h3
                  className="text-white text-xl font-bold leading-snug mb-2"
                  style={{ fontFamily: 'Georgia, serif', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}
                >
                  {product.name}
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  {product.promotionalPrice ? (
                    <>
                      <span className="text-2xl font-bold" style={{ color: '#FF7F50' }}>
                        ${product.promotionalPrice.toLocaleString('es-MX')}
                      </span>
                      <span className="text-sm line-through text-white/50">
                        ${product.price.toLocaleString('es-MX')}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      ${product.price.toLocaleString('es-MX')}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <p className="text-white/80 text-sm mb-4">Descubre nuestras últimas novedades</p>
            )}

            <span
              className="inline-block text-sm font-semibold px-5 py-2 rounded-full transition group-hover:scale-105"
              style={{ background: '#D4AF8C', color: '#3E2C20' }}
            >
              Ver novedades →
            </span>

            {/* Puntos de rotación */}
            {products.length > 1 && (
              <div className="flex gap-1.5 mt-4">
                {products.map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === current ? '20px' : '6px',
                      height: '6px',
                      background: i === current ? '#D4AF8C' : 'rgba(255,255,255,0.35)',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </Link>

        {/* ── Columna derecha ── */}
        <div className="flex flex-col gap-4">

          {/* Crea tu Kit */}
          <Link
            href="/crea-tu-kit"
            className="flex-1 rounded-2xl p-6 flex flex-col justify-between group transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: '#F5EDD8', border: '2px solid #D4AF8C', minHeight: '160px' }}
          >
            <div>
              <div className="text-4xl mb-2">🎁</div>
              <h3
                className="font-bold text-base mb-1 group-hover:underline"
                style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}
              >
                Crea tu Kit
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: '#7A5C3E' }}>
                Diseña tu experiencia de lectura perfecta
              </p>
            </div>
            <span className="text-xs font-semibold mt-3" style={{ color: '#8B6F47' }}>
              Personalizar →
            </span>
          </Link>

          {/* Club de Lectura */}
          <Link
            href="/club-de-lectura"
            className="flex-1 rounded-2xl p-6 flex flex-col justify-between group transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: '#3E2C20', minHeight: '160px' }}
          >
            <div>
              <div className="text-4xl mb-2">📖</div>
              <h3
                className="font-bold text-base mb-1 group-hover:underline text-white"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Club de Lectura
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: '#D4AF8C' }}>
                Lee con nuestra comunidad cada mes
              </p>
            </div>
            <span className="text-xs font-semibold mt-3" style={{ color: '#D4AF8C' }}>
              Unirme →
            </span>
          </Link>

        </div>
      </div>
    </section>
  )
}
