'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const slides = [
  {
    id: 1,
    image: '/banners/Banner_Home.png',
    alt: 'Kits de lectura hechos con amor',
    href: '/crea-tu-kit',
    external: false,
  },
  {
    id: 2,
    image: '/banners/Banner_Club_Lectura.png',
    alt: 'Club de Lectura',
    href: '/club-de-lectura',
    external: false,
  },
  {
    id: 3,
    image: '/banners/Banner_Nuevos_Lanzamientos.png',
    alt: 'Nuevos Lanzamientos',
    href: '/catalogo',
    external: false,
  },
  {
    id: 4,
    image: '/banners/Banner_Siguenos_En_Instagram.png',
    alt: 'Síguenos en Instagram @thereadingbroom',
    href: 'https://www.instagram.com/thereadingbroom',
    external: true,
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [paused, next])

  const slide = slides[current]

  return (
    <div
      className="relative overflow-hidden rounded-xl mb-8 select-none"
      style={{ aspectRatio: '1717/916' }}   /* ratio fijo = flechas siempre al mismo lugar */
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Imagen ocupa todo el contenedor */}
      {slide.external ? (
        <a
          href={slide.href}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            className="object-contain transition-opacity duration-500"
            sizes="100vw"
            priority={slide.id === 1}
          />
        </a>
      ) : (
        <Link
          href={slide.href}
          className="absolute inset-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            className="object-contain transition-opacity duration-500"
            sizes="100vw"
            priority={slide.id === 1}
          />
        </Link>
      )}

      {/* Flecha izquierda */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); prev() }}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition hover:scale-110"
        style={{ background: 'rgba(0,0,0,0.4)', color: 'white' }}
        aria-label="Slide anterior"
      >
        ❮
      </button>

      {/* Flecha derecha */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); next() }}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition hover:scale-110"
        style={{ background: 'rgba(0,0,0,0.4)', color: 'white' }}
        aria-label="Siguiente slide"
      >
        ❯
      </button>

      {/* Puntos indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
            className="rounded-full transition-all"
            style={{
              width: i === current ? '24px' : '8px',
              height: '8px',
              background: i === current ? 'white' : 'rgba(255,255,255,0.6)',
            }}
            aria-label={`Ir al slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
