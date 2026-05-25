'use client'

import { useState, useMemo } from 'react'
import ProductCard from '@/components/ProductCard'
import type { Product, ProductCategory } from '@/lib/data'

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name'

const categoryLabels: Record<string, string> = {
  kit:         '📦 Kits',
  libro:       '📚 Libros',
  complemento: '🕯️ Complementos',
}

const subcategoryMap: Record<ProductCategory, { label: string; value: string }[]> = {
  kit: [
    { label: 'Clásicos', value: 'Clásicos' },
    { label: 'Romance',  value: 'Romance'  },
  ],
  libro: [
    { label: 'Clásicos',  value: 'Clásicos'  },
    { label: 'Misterio',  value: 'Misterio'  },
    { label: 'Novelas',   value: 'Novelas'   },
    { label: 'Terror',    value: 'Terror'    },
    { label: 'Navideños', value: 'Navideños' },
    { label: 'Romance',   value: 'Romance'   },
  ],
  complemento: [
    { label: 'Velas',      value: 'Vela'      },
    { label: 'Accesorios', value: 'Accesorio' },
    { label: 'Stationary', value: 'Stationary'},
    { label: 'Tote Bags',  value: 'Tote Bag'  },
  ],
}

export default function CatalogoClient({ products }: { products: Product[] }) {
  const [activeFilters, setActiveFilters]       = useState<Set<ProductCategory>>(new Set())
  const [activeSubFilters, setActiveSubFilters] = useState<Set<string>>(new Set())
  const [sort, setSort]   = useState<SortOption>('default')
  const [search, setSearch] = useState('')

  const toggleFilter = (cat: ProductCategory) => {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) {
        next.delete(cat)
        // Limpiar subcategorías de esta categoría
        const subValues = subcategoryMap[cat].map((s) => s.value)
        setActiveSubFilters((prevSub) => {
          const nextSub = new Set(prevSub)
          subValues.forEach((v) => nextSub.delete(v))
          return nextSub
        })
      } else {
        next.add(cat)
      }
      return next
    })
  }

  const toggleSubFilter = (value: string) => {
    setActiveSubFilters((prev) => {
      const next = new Set(prev)
      next.has(value) ? next.delete(value) : next.add(value)
      return next
    })
  }

  const clearAll = () => {
    setActiveFilters(new Set())
    setActiveSubFilters(new Set())
    setSearch('')
  }

  const filtered = useMemo(() => {
    let list = [...products]

    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      )
    }

    if (activeFilters.size > 0) {
      list = list.filter((p) => activeFilters.has(p.category))
    }

    if (activeSubFilters.size > 0) {
      list = list.filter((p) => {
        const productTags = [
          ...(p.tags ?? []),
          ...(p.tag ? [p.tag] : []),
        ]
        return Array.from(activeSubFilters).some((sub) => productTags.includes(sub))
      })
    }

    switch (sort) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break
      case 'price-desc': list.sort((a, b) => b.price - a.price); break
      case 'name':       list.sort((a, b) => a.name.localeCompare(b.name)); break
    }

    list.sort((a, b) => {
      const aOut = (a.stock ?? 1) <= 0 ? 1 : 0
      const bOut = (b.stock ?? 1) <= 0 ? 1 : 0
      return aOut - bOut
    })

    return list
  }, [products, activeFilters, activeSubFilters, sort, search])

  const hasSubcategories = (Object.keys(subcategoryMap) as ProductCategory[]).some(
    (cat) => activeFilters.has(cat) && subcategoryMap[cat].length > 0
  )

  return (
    <>
      {/* Buscador + Ordenar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="🔍 Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none"
          style={{ borderColor: '#D4AF8C', background: 'white', fontFamily: 'Georgia, serif' }}
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="px-4 py-2.5 rounded-xl border text-sm outline-none cursor-pointer"
          style={{ borderColor: '#D4AF8C', background: 'white', color: '#5C3D2E' }}
        >
          <option value="default">Ordenar: Relevancia</option>
          <option value="name">A - Z</option>
          <option value="price-asc">Precio: Menor a Mayor</option>
          <option value="price-desc">Precio: Mayor a Menor</option>
        </select>
      </div>

      {/* Categorías principales */}
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(categoryLabels) as ProductCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => toggleFilter(cat)}
            className="px-4 py-1.5 rounded-full text-sm font-medium border transition-all"
            style={{
              background:   activeFilters.has(cat) ? '#8B6F47' : 'white',
              color:        activeFilters.has(cat) ? 'white'   : '#8B6F47',
              borderColor:  '#8B6F47',
            }}
          >
            {categoryLabels[cat]}
            {activeFilters.has(cat) && subcategoryMap[cat].length > 0 && (
              <span className="ml-1 opacity-70">▾</span>
            )}
          </button>
        ))}
        {(activeFilters.size > 0 || activeSubFilters.size > 0 || search) && (
          <button
            onClick={clearAll}
            className="px-4 py-1.5 rounded-full text-sm border"
            style={{ borderColor: '#ccc', color: '#999' }}
          >
            ✕ Limpiar
          </button>
        )}
      </div>

      {/* Subcategorías — aparecen debajo cuando hay una categoría activa */}
      {hasSubcategories && (
        <div className="mt-3 space-y-2">
          {(Object.keys(subcategoryMap) as ProductCategory[]).map((cat) => {
            if (!activeFilters.has(cat) || subcategoryMap[cat].length === 0) return null
            return (
              <div key={cat} className="flex gap-2 flex-wrap items-center pl-3"
                style={{ borderLeft: '2px solid #D4AF8C' }}>
                <span className="text-xs font-semibold" style={{ color: '#B89060' }}>
                  {cat === 'libro' ? 'Género' : 'Tipo'}:
                </span>
                {subcategoryMap[cat].map((sub) => (
                  <button
                    key={sub.value}
                    onClick={() => toggleSubFilter(sub.value)}
                    className="px-3 py-1 rounded-full text-xs font-medium border transition-all"
                    style={{
                      background:  activeSubFilters.has(sub.value) ? '#5C3D2E' : '#FDFAF6',
                      color:       activeSubFilters.has(sub.value) ? 'white'   : '#5C3D2E',
                      borderColor: activeSubFilters.has(sub.value) ? '#5C3D2E' : '#D4AF8C',
                    }}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      )}

      {/* Contador */}
      <p className="text-sm mt-4 mb-4" style={{ color: '#999' }}>
        {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20" style={{ color: '#999' }}>
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg">No encontramos productos con ese criterio.</p>
          <button
            onClick={clearAll}
            className="mt-4 px-5 py-2 rounded-lg text-sm text-white"
            style={{ background: '#8B6F47' }}
          >
            Ver todos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  )
}
