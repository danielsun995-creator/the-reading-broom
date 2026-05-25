'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { useCartStore } from '@/store/cart'
import type { Product } from '@/lib/data'
import RestockButton from '@/components/RestockButton'

const KIT_COMPONENTS: Record<string, string[]> = {
  'jane-austen-emma': [
    'Libro Emma de Jane Austen en pasta dura',
    'Totebag exclusiva Barnes & Noble',
    'Vela Sweet Cherry & Amber',
    '1 Separador magnético',
    'Stickers exclusivos',
  ],
  'jane-austen-pride': [
    'Libro Pride and Prejudice en pasta dura',
    'Tote bag exclusiva Pride and Prejudice',
    'Vela Moonflower',
    '1 Separador magnético',
    'Stickers exclusivos',
  ],
  'jane-austen-sense': [
    'Libro Sense and Sensibility en pasta dura',
    'Tote bag azul exclusiva B&N',
    'Vela Moonflower & Vetiver',
    '1 Separador magnético',
    'Stickers exclusivos',
  ],
  'little-women': [
    'Libro Little Women de Louisa May Alcott en pasta dura',
    'Totebag exclusiva Barnes & Noble',
    'Vela English Ivy & Clover',
    '1 Separador magnético',
    '2 Stickers',
  ],
}

const LIBROS = [
  { id: 'hc-emma', nombre: 'Emma', autor: 'Jane Austen', badge: 'Pasta dura', stock: 2, imagen: '/products/book-emma.png' },
  { id: 'hc-pride', nombre: 'Pride and Prejudice', autor: 'Jane Austen', badge: 'Pasta dura', stock: 2, imagen: '/products/book-pride-prejudice.png' },
  { id: 'hc-sense', nombre: 'Sense & Sensibility', autor: 'Jane Austen', badge: 'Pasta dura', stock: 2, imagen: '/products/book-sense-sensibility.png' },
  { id: 'hc-little', nombre: 'Little Women', autor: 'Louisa May Alcott', badge: 'Pasta dura', stock: 0, imagen: '/products/book-little-women_v2.jpg' },
  { id: 'LIB-022', nombre: 'Sense and Sensibility', autor: 'Jane Austen', badge: 'En español', stock: 1, imagen: '/products/sense-sensibility-espanol.jpg' },
  { id: 'LIB-023', nombre: 'Orgullo y Prejuicio', autor: 'Jane Austen', badge: 'En español', stock: 1, imagen: '/products/orgullo-y-prejuicio-espanol_v2.jpg' },
  { id: 'LIB-018', nombre: 'Un escaparate navideño', autor: 'Jenny Colgan', badge: '', stock: 1, imagen: '/products/escaparate-navideno.webp' },
  { id: 'LIB-019', nombre: 'Wreck the Halls', autor: 'Tessa Bailey', badge: '', stock: 1, imagen: '/products/wreck-the-halls.webp' },
  { id: 'LIB-020', nombre: 'The Christmas Bookshop', autor: 'Jenny Colgan', badge: '', stock: 1, imagen: '/products/christmas-bookshop.webp' },
  { id: 'LIB-021', nombre: 'Concédeme un deseo', autor: 'Rachael Lippincott', badge: '', stock: 1, imagen: '/products/concedeme-un-deseo_v2.avif' },
]

interface KitVariant { id: string; name: string; stock: number }
interface ExtraItem { id: string; nombre: string; tipo: string; emoji: string; stock: number; imagen: string; variants: KitVariant[] }

const EXTRAS: ExtraItem[] = [
  { id: 'VEL-018', nombre: 'Vela Monk Fruit Vainilla',   tipo: 'Vela', emoji: '🕯️', stock: 6, imagen: '/products/VEL-018.jpeg', variants: [] },
  { id: 'VEL-019', nombre: 'Vela Sweet Cherry',          tipo: 'Vela', emoji: '🕯️', stock: 6, imagen: '/products/VEL-019.jpeg', variants: [] },
  { id: 'VEL-020', nombre: 'Vela English Ivy',           tipo: 'Vela', emoji: '🕯️', stock: 6, imagen: '/products/VEL-020.jpeg', variants: [] },
  { id: 'VEL-021', nombre: 'Vela MoonFlower',            tipo: 'Vela', emoji: '🕯️', stock: 6, imagen: '/products/VEL-021.jpeg', variants: [] },
  { id: 'ACC-026', nombre: 'Vaso Just One More Chapter', tipo: 'Vaso', emoji: '🥤', stock: 2, imagen: '/products/ACC-026.jpeg', variants: [] },
  { id: 'ACC-027', nombre: 'Vaso Books & Flowers',       tipo: 'Vaso', emoji: '🥤', stock: 2, imagen: '/products/ACC-027.jpeg', variants: [] },
  { id: 'ACC-028', nombre: 'Taza Floral',                 tipo: 'Taza', emoji: '☕', stock: 5, imagen: '/products/ACC-028.png',
    variants: [
      { id: 'ACC-028-rosa',    name: 'Rosa',    stock: 1 },
      { id: 'ACC-028-azul',    name: 'Azul',    stock: 1 },
      { id: 'ACC-028-lila',    name: 'Lila',    stock: 1 },
      { id: 'ACC-028-verde',   name: 'Verde',   stock: 1 },
      { id: 'ACC-028-naranja', name: 'Naranja', stock: 1 },
    ],
  },
]

const KIT_PRICE = 999

const TOOLTIP_W = 320
const TOOLTIP_H = 440

function KitCard({ kit }: { kit: Product }) {
  const { addItem, openCart } = useCartStore()
  const outOfStock = (kit.stock ?? 0) <= 0
  const components = KIT_COMPONENTS[kit.id] ?? []
  const [tooltip, setTooltip] = useState<{ showLeft: boolean; topOffset: number } | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  function handleImageMouseEnter(e: React.MouseEvent<HTMLDivElement>) {
    if (!kit.imageUrl || !wrapperRef.current) return
    const imageRect = e.currentTarget.getBoundingClientRect()
    const wrapperRect = wrapperRef.current.getBoundingClientRect()
    const showLeft = imageRect.right + TOOLTIP_W + 12 > window.innerWidth
    let absTop = imageRect.top + (imageRect.height - TOOLTIP_H) / 2
    absTop = Math.max(8, Math.min(window.innerHeight - TOOLTIP_H - 8, absTop))
    setTooltip({ showLeft, topOffset: absTop - wrapperRect.top })
  }

  const handleAdd = () => {
    if (outOfStock) return
    addItem({
      id: kit.id,
      name: kit.name,
      price: kit.promotionalPrice ?? kit.price,
      emoji: kit.emoji,
    })
    openCart()
  }

  return (
    <div ref={wrapperRef} className="relative" onMouseLeave={() => setTooltip(null)}>
      <div
        className="rounded-2xl overflow-hidden flex flex-col"
        style={{ background: 'white', border: '2px solid #E5D5C0', boxShadow: '0 2px 12px rgba(139,111,71,0.08)' }}
      >
        {/* Image */}
        <div
          className="relative overflow-hidden"
          style={{ height: 200 }}
          onMouseEnter={handleImageMouseEnter}
        >
          {kit.imageUrl ? (
            <Image src={kit.imageUrl} alt={kit.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 300px" />
          ) : (
            <div className="flex items-center justify-center h-full text-6xl" style={{ background: '#F5F1E8' }}>
              {kit.emoji}
            </div>
          )}
          {outOfStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-sm font-bold px-4 py-1.5 rounded-full bg-white shadow" style={{ color: '#C9302C' }}>
                Sin stock
              </span>
            </div>
          )}
        </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {kit.tag && (
          <span className="text-xs px-2.5 py-0.5 rounded-full mb-2 w-fit" style={{ background: '#F5F1E8', color: '#8B6F47' }}>
            {kit.tag}
          </span>
        )}
        <h3 className="font-bold text-sm leading-snug mb-3" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
          {kit.name}
        </h3>

        {/* Components */}
        <ul className="space-y-1.5 mb-4 flex-1">
          {components.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs" style={{ color: '#555' }}>
              <span className="mt-0.5 flex-shrink-0" style={{ color: '#8B6F47' }}>✦</span>
              {item}
            </li>
          ))}
        </ul>

        {/* Price + Button */}
        <div className="pt-3 border-t" style={{ borderColor: '#E5D5C0' }}>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold" style={{ color: '#C9302C' }}>
              ${(kit.promotionalPrice ?? kit.price).toLocaleString()}
            </span>
            {kit.promotionalPrice && (
              <span className="text-sm line-through" style={{ color: '#bbb' }}>
                ${kit.price.toLocaleString()}
              </span>
            )}
          </div>
          {outOfStock ? (
            <RestockButton productId={kit.id} productName={kit.name} size="small" />
          ) : (
            <button
              onClick={handleAdd}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition active:scale-95"
              style={{ background: '#8B6F47' }}
            >
              Agregar al carrito
            </button>
          )}
        </div>
      </div>
      </div>

      {/* Tooltip — fuera del overflow-hidden */}
      {tooltip && kit.imageUrl && (
        <div
          className="absolute z-50 pointer-events-none flex items-center"
          style={{
            top: tooltip.topOffset,
            ...(tooltip.showLeft
              ? { right: 'calc(100% + 12px)', flexDirection: 'row-reverse' as const }
              : { left: 'calc(100% + 12px)' }),
          }}
        >
          <div style={{
            width: 0, height: 0, flexShrink: 0,
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
            ...(tooltip.showLeft ? { borderLeft: '10px solid white' } : { borderRight: '10px solid white' }),
          }} />
          <div
            className="rounded-2xl overflow-hidden relative"
            style={{ width: TOOLTIP_W, height: TOOLTIP_H, boxShadow: '0 24px 48px rgba(0,0,0,0.35)', border: '3px solid white', flexShrink: 0 }}
          >
            <Image src={kit.imageUrl} alt={kit.name} fill className="object-cover" sizes="320px" />
          </div>
        </div>
      )}
    </div>
  )
}

function CheckRow({ label, filled }: { label: string; filled: boolean }) {
  return (
    <div className="flex items-start gap-2.5 py-1.5">
      <span
        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold transition-all"
        style={{
          background: filled ? '#8B6F47' : 'transparent',
          border: `2px solid ${filled ? '#8B6F47' : '#D4AF8C'}`,
          color: 'white',
        }}
      >
        {filled ? '✓' : ''}
      </span>
      <span className="text-sm" style={{ color: filled ? '#3E2C20' : '#aaa' }}>
        {label}
      </span>
    </div>
  )
}

export default function KitBuilderClient({ kits }: { kits: Product[] }) {
  const [selectedBook, setSelectedBook] = useState<string | null>(null)
  const [selectedExtra, setSelectedExtra] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const [tooltip, setTooltip] = useState<{ id: string; showLeft: boolean; topOffset: number } | null>(null)

  function handleBookMouseEnter(e: React.MouseEvent<HTMLDivElement>, id: string) {
    const rect = e.currentTarget.getBoundingClientRect()
    const showLeft = rect.right + TOOLTIP_W + 12 > window.innerWidth
    let absTop = rect.top + (rect.height - TOOLTIP_H) / 2
    absTop = Math.max(8, Math.min(window.innerHeight - TOOLTIP_H - 8, absTop))
    setTooltip({ id, showLeft, topOffset: absTop - rect.top })
  }
  const { addItem, openCart } = useCartStore()

  const selectedExtraData = EXTRAS.find((v) => v.id === selectedExtra)
  const selectedBookData = LIBROS.find((l) => l.id === selectedBook)
  const extraHasVariants = !!(selectedExtraData?.variants && selectedExtraData.variants.length > 0)
  const canAdd = selectedBook !== null && selectedExtra !== null && (!extraHasVariants || selectedVariant !== null)

  function handleAddToCart() {
    if (!canAdd) return
    const book = LIBROS.find((l) => l.id === selectedBook)!
    const extra = EXTRAS.find((v) => v.id === selectedExtra)!
    const variantData = extraHasVariants ? extra.variants.find((v) => v.id === selectedVariant) : null
    const extraDisplayName = variantData ? `${extra.nombre} — ${variantData.name}` : extra.nombre
    addItem({
      id: `custom-kit-${selectedBook}-${selectedExtra}${selectedVariant ? `-${selectedVariant}` : ''}`,
      name: `Kit Personalizado: ${book.nombre}`,
      price: KIT_PRICE,
      emoji: '🎁',
      imageUrl: book.imagen,
      kitConfig: [book.nombre, extraDisplayName, '1 Separador magnético', 'Stickers exclusivos', 'Sorpresa especial'],
    })
    openCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <div>
      {/* Hero banner */}
      <div className="relative w-full rounded-2xl overflow-hidden mb-10" style={{ aspectRatio: '3 / 1' }}>
        <Image
          src="/banners/Crea_Tu_Kit.jpeg"
          alt="Crea Tu Kit de Lectura"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1152px"
          priority
        />
      </div>

      {/* Pre-assembled kits */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
            📦 Kits Prearmados
          </h2>
          <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: '#F5F1E8', color: '#8B6F47' }}>
            Curados con amor
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {kits.map((kit) => (
            <KitCard key={kit.id} kit={kit} />
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-12">
        <div className="flex-1 h-px" style={{ background: '#E5D5C0' }} />
        <span className="text-sm font-semibold px-4" style={{ color: '#8B6F47', fontFamily: 'Georgia, serif', whiteSpace: 'nowrap' }}>
          ✦ O arma el tuyo ✦
        </span>
        <div className="flex-1 h-px" style={{ background: '#E5D5C0' }} />
      </div>

      {/* Custom kit builder */}
      <section className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Left: selections */}
        <div className="flex-1 space-y-10">

          {/* Step 1: Book */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: '#8B6F47' }}
              >
                1
              </span>
              <h3 className="text-lg font-bold" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
                Elige tu libro
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {LIBROS.map((libro) => {
                const selected = selectedBook === libro.id
                const agotado = libro.stock === 0
                return (
                  <div
                    key={libro.id}
                    className="relative"
                    onMouseEnter={(e) => libro.imagen && handleBookMouseEnter(e, libro.id)}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    <button
                      onClick={() => !agotado && setSelectedBook(selected ? null : libro.id)}
                      disabled={agotado}
                      className="text-left rounded-xl transition-all relative overflow-hidden flex flex-col w-full"
                      style={{
                        background: selected ? '#F5EFE6' : 'white',
                        border: `2px solid ${selected ? '#8B6F47' : '#E5D5C0'}`,
                        opacity: agotado ? 0.5 : 1,
                        cursor: agotado ? 'not-allowed' : 'pointer',
                        boxShadow: selected ? '0 0 0 3px rgba(139,111,71,0.15)' : 'none',
                      }}
                    >
                      {selected && (
                        <span
                          className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold shadow"
                          style={{ background: '#8B6F47' }}
                        >
                          ✓
                        </span>
                      )}
                      {agotado && (
                        <span
                          className="absolute top-2 left-2 z-10 text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ background: 'white', color: '#C9302C' }}
                        >
                          Agotado
                        </span>
                      )}
                      <div className="relative w-full overflow-hidden" style={{ height: 120 }}>
                        {libro.imagen ? (
                          <Image
                            src={libro.imagen}
                            alt={libro.nombre}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 200px"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-4xl"
                            style={{ background: '#F5F1E8' }}
                          >
                            📚
                          </div>
                        )}
                      </div>
                      <div className="p-2.5">
                        <p className="font-semibold text-xs leading-tight mb-0.5" style={{ color: '#3E2C20' }}>
                          {libro.nombre}
                        </p>
                        {libro.autor && (
                          <p className="text-xs" style={{ color: '#999' }}>
                            {libro.autor}
                          </p>
                        )}
                        {libro.badge && (
                          <span
                            className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full"
                            style={{ background: '#F5F1E8', color: '#8B6F47' }}
                          >
                            {libro.badge}
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Aviso de restock para libros agotados */}
                    {agotado && (
                      <div className="mt-1.5">
                        <RestockButton productId={libro.id} productName={`Libro: ${libro.nombre}`} size="small" />
                      </div>
                    )}

                    {/* Hover preview */}
                    {libro.imagen && tooltip?.id === libro.id && (
                      <div
                        className="absolute z-50 pointer-events-none flex items-center"
                        style={{
                          top: tooltip.topOffset,
                          ...(tooltip.showLeft
                            ? { right: 'calc(100% + 12px)', flexDirection: 'row-reverse' as const }
                            : { left: 'calc(100% + 12px)' }),
                        }}
                      >
                        {/* Arrow pointing toward the card */}
                        <div style={{
                          width: 0,
                          height: 0,
                          borderTop: '10px solid transparent',
                          borderBottom: '10px solid transparent',
                          flexShrink: 0,
                          ...(tooltip.showLeft
                            ? { borderLeft: '10px solid white' }
                            : { borderRight: '10px solid white' }),
                        }} />
                        <div
                          className="rounded-2xl overflow-hidden relative"
                          style={{
                            width: 320,
                            height: 440,
                            boxShadow: '0 24px 48px rgba(0,0,0,0.35)',
                            border: '3px solid white',
                            flexShrink: 0,
                          }}
                        >
                          <Image src={libro.imagen} alt={libro.nombre} fill className="object-cover" sizes="320px" />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Step 2: Vela / Taza */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: '#8B6F47' }}
              >
                2
              </span>
              <h3 className="text-lg font-bold" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
                Elige una vela, taza o vaso
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {EXTRAS.map((item) => {
                const selected = selectedExtra === item.id
                const agotado = item.stock === 0
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={(e) => item.imagen && handleBookMouseEnter(e, item.id)}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    <button
                      onClick={() => {
                        if (agotado) return
                        const newId = selected ? null : item.id
                        setSelectedExtra(newId)
                        setSelectedVariant(null)
                      }}
                      disabled={agotado}
                      className="text-left rounded-xl transition-all relative overflow-hidden flex flex-col w-full"
                      style={{
                        background: selected ? '#F5EFE6' : 'white',
                        border: `2px solid ${selected ? '#8B6F47' : '#E5D5C0'}`,
                        opacity: agotado ? 0.5 : 1,
                        cursor: agotado ? 'not-allowed' : 'pointer',
                        boxShadow: selected ? '0 0 0 3px rgba(139,111,71,0.15)' : 'none',
                      }}
                    >
                      {selected && (
                        <span className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold shadow" style={{ background: '#8B6F47' }}>
                          ✓
                        </span>
                      )}
                      {agotado && (
                        <span className="absolute top-2 left-2 z-10 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'white', color: '#C9302C' }}>
                          Agotado
                        </span>
                      )}
                      {/* Imagen */}
                      <div className="relative w-full overflow-hidden" style={{ height: 110 }}>
                        {item.imagen ? (
                          <Image src={item.imagen} alt={item.nombre} fill className="object-cover" sizes="(max-width: 640px) 50vw, 200px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl" style={{ background: '#F5F1E8' }}>
                            {item.emoji}
                          </div>
                        )}
                      </div>
                      {/* Texto */}
                      <div className="p-2.5">
                        <p className="font-semibold text-xs leading-tight mb-1" style={{ color: '#3E2C20' }}>
                          {item.nombre}
                        </p>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#F5F1E8', color: '#8B6F47' }}>
                          {item.tipo}
                        </span>
                      </div>
                    </button>

                    {/* Tooltip hover */}
                    {item.imagen && tooltip?.id === item.id && (
                      <div
                        className="absolute z-50 pointer-events-none flex items-center"
                        style={{
                          top: tooltip.topOffset,
                          ...(tooltip.showLeft
                            ? { right: 'calc(100% + 12px)', flexDirection: 'row-reverse' as const }
                            : { left: 'calc(100% + 12px)' }),
                        }}
                      >
                        <div style={{ width: 0, height: 0, flexShrink: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', ...(tooltip.showLeft ? { borderLeft: '10px solid white' } : { borderRight: '10px solid white' }) }} />
                        <div className="rounded-2xl overflow-hidden relative" style={{ width: 320, height: 440, boxShadow: '0 24px 48px rgba(0,0,0,0.35)', border: '3px solid white', flexShrink: 0 }}>
                          <Image src={item.imagen} alt={item.nombre} fill className="object-cover" sizes="320px" />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Selector de color — aparece cuando el extra elegido tiene variantes */}
          {selectedExtraData && extraHasVariants && (
            <div className="rounded-xl p-4" style={{ background: '#F5EFE6', border: '1.5px solid #D4AF8C' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8B6F47' }}>
                🎨 Elige el color de tu {selectedExtraData.tipo.toLowerCase()}:
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedExtraData.variants.map((v) => {
                  const isSelected = selectedVariant === v.id
                  const agotado = v.stock <= 0
                  return (
                    <button
                      key={v.id}
                      onClick={() => !agotado && setSelectedVariant(isSelected ? null : v.id)}
                      disabled={agotado}
                      className="text-sm px-4 py-2 rounded-full font-medium transition-all"
                      style={{
                        background: isSelected ? '#8B6F47' : 'white',
                        color: isSelected ? 'white' : agotado ? '#bbb' : '#5C3D2E',
                        border: `1.5px solid ${isSelected ? '#8B6F47' : agotado ? '#E5D5C0' : '#D4C4AD'}`,
                        cursor: agotado ? 'not-allowed' : 'pointer',
                        textDecoration: agotado ? 'line-through' : 'none',
                        boxShadow: isSelected ? '0 0 0 3px rgba(139,111,71,0.15)' : 'none',
                      }}
                    >
                      {v.name}{agotado ? ' (agotado)' : ''}
                    </button>
                  )
                })}
              </div>
              {!selectedVariant && (
                <p className="text-xs mt-2" style={{ color: '#C9302C' }}>
                  Selecciona un color para continuar
                </p>
              )}
            </div>
          )}

          {/* Included always */}
          <div
            className="rounded-xl p-5"
            style={{ background: '#F5F1E8', border: '1px dashed #D4AF8C' }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8B6F47' }}>
              Tu kit siempre incluye
            </p>
            <div className="space-y-1">
              {[
                { emoji: '🔖', label: '1 Separador magnético' },
                { emoji: '⭐', label: 'Stickers exclusivos' },
                { emoji: '🎁', label: 'Sorpresa especial' },
              ].map(({ emoji, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm" style={{ color: '#5C3D2E' }}>
                  <span>{emoji}</span>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Summary card (sticky) */}
        <div className="w-full lg:w-72 lg:sticky lg:top-24 flex-shrink-0">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '2px solid #E5D5C0', boxShadow: '0 4px 20px rgba(139,111,71,0.12)' }}
          >
            {/* Card header */}
            <div className="px-5 py-4" style={{ background: '#3E2C20' }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#D4AF8C' }}>
                Tu Kit Personalizado
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">
                  ${KIT_PRICE.toLocaleString()}
                </span>
                <span className="text-xs" style={{ color: '#D4AF8C' }}>MXN</span>
              </div>
            </div>

            {/* Card body */}
            <div className="px-5 py-4" style={{ background: 'white' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#B89060' }}>
                Contenido
              </p>
              <div className="divide-y" style={{ borderColor: '#F5F1E8' }}>
                <CheckRow
                  label={selectedBookData ? selectedBookData.nombre : 'Elige un libro...'}
                  filled={!!selectedBook}
                />
                <CheckRow
                  label={
                    selectedExtraData
                      ? extraHasVariants && selectedVariant
                        ? `${selectedExtraData.nombre} — ${selectedExtraData.variants.find((v) => v.id === selectedVariant)?.name}`
                        : selectedExtraData.nombre
                      : 'Elige una vela, taza o vaso...'
                  }
                  filled={!!selectedExtra && (!extraHasVariants || !!selectedVariant)}
                />
                <CheckRow label="1 Separador magnético" filled />
                <CheckRow label="Stickers exclusivos" filled />
                <CheckRow label="Sorpresa especial 🎁" filled />
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!canAdd}
                className="w-full mt-5 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
                style={{
                  background: canAdd ? '#8B6F47' : '#D4C4AD',
                  cursor: canAdd ? 'pointer' : 'not-allowed',
                }}
              >
                {added ? '¡Agregado! ✓' : canAdd ? 'Agregar al carrito' : 'Completa tu kit'}
              </button>

              {!canAdd && (
                <p className="text-center text-xs mt-2" style={{ color: '#aaa' }}>
                  {!selectedBook && !selectedExtra
                    ? 'Elige un libro y una vela o taza'
                    : !selectedBook
                    ? 'Falta elegir el libro'
                    : !selectedExtra
                    ? 'Falta elegir la vela o taza'
                    : extraHasVariants && !selectedVariant
                    ? '🎨 Elige el color de tu taza'
                    : ''}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
