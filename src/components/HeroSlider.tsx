'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const slides = [
  {
    id: 1,
    background: 'linear-gradient(135deg, #3E2C20 0%, #5C3D2E 50%, #8B6F47 100%)',
    badge: '✨ NUEVA COLECCIÓN',
    title: 'Kits de lectura hechos con amor',
    text: 'Descubre una nueva forma de disfrutar tus libros favoritos. Cada kit incluye un libro, complementos y una experiencia mágica.',
    deco: '📚',
    cta: { label: 'Ver Catálogo', href: '/catalogo' },
    center: false,
  },
  {
    id: 2,
    background: 'linear-gradient(135deg, #5C3D2E, #8B6F47)',
    badge: null,
    title: '📸 Síguenos en Instagram',
    text: '@thereadingbroom · Novedades, recomendaciones, unboxings y más. Únete a nuestra comunidad de lectoras.',
    deco: '📸',
    cta: { label: 'Ir a Instagram', href: 'https://instagram.com/thereadingbroom', external: true },
    center: true,
  },
  {
    id: 3,
    background: 'linear-gradient(135deg, #4A3728, #6B5438, #8B6F47)',
    badge: '📖 CLUB DE LECTURA',
    title: 'Únete al Club de Lectura',
    text: 'Cada mes seleccionamos un libro especial. Lee con nosotros y comparte la experiencia con otras lectoras.',
    deco: '📖',
    cta: { label: 'Ver Club', href: '/club' },
    center: false,
  },
  {
    id: 4,
    background: 'linear-gradient(135deg, #3E2C20, #5C3D2E)',
    badge: '🆕 RECIÉN LLEGADOS',
    title: 'Nuevos Lanzamientos',
    text: 'Explora las últimas incorporaciones a nuestro catálogo. Kits y libros que no te puedes perder.',
    deco: '🆕',
    cta: { label: 'Ver Novedades', href: '/catalogo' },
    center: true,
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
      style={{ minHeight: '400px' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{ background: slide.background }}
      />

      {/* Decorative emoji */}
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2 text-8xl opacity-20 pointer-events-none select-none hidden md:block"
        aria-hidden
      >
        {slide.deco}
      </div>

      {/* Content */}
      <div
        className={`relative z-10 flex items-center h-full px-8 py-16 md:px-16 ${slide.center ? 'justify-center text-center' : ''}`}
        style={{ minHeight: '400px' }}
      >
        <div className={`text-white max-w-xl ${slide.center ? 'mx-auto' : ''}`}>
          {slide.badge && (
            <div className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4 text-white/90" style={{ background: 'rgba(255,255,255,0.15)' }}>
              {slide.badge}
            </div>
          )}
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif', textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>
            {slide.title}
          </h2>
          <p className="text-base md:text-lg opacity-90 mb-7 leading-relaxed">
            {slide.text}
          </p>
          <div className={`flex gap-3 ${slide.center ? 'justify-center' : ''}`}>
            {slide.cta.external ? (
              <a
                href={slide.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full font-semibold text-sm transition hover:scale-105"
                style={{ background: 'white', color: '#6B5438' }}
              >
                {slide.cta.label}
              </a>
            ) : (
              <Link
                href={slide.cta.href}
                className="px-6 py-3 rounded-full font-semibold text-sm transition hover:scale-105 inline-block"
                style={{ background: 'white', color: '#6B5438' }}
              >
                {slide.cta.label}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition"
        aria-label="Slide anterior"
      >
        ❮
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition"
        aria-label="Siguiente slide"
      >
        ❯
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="rounded-full transition-all"
            style={{
              width: i === current ? '24px' : '8px',
              height: '8px',
              background: i === current ? 'white' : 'rgba(255,255,255,0.5)',
            }}
            aria-label={`Ir al slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
