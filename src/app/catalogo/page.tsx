'use client'

import { useState, useMemo } from 'react'
import ProductCard from '@/components/ProductCard'
import { products, type ProductCategory } from '@/lib/data'

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name'

const categoryLabels: Record<string, string> = {
  kit: '📦 Kits',
  libro: '📚 Libros',
  complemento: '🕯️ Complementos',
}

export default function CatalogoPage() {
  const [activeFilters, setActiveFilters] = useState<Set<ProductCategory>>(new Set())
  const [sort, setSort] = useState<SortOption>('default')
  const [search, setSearch] = useState('')

  const toggleFilter = (cat: ProductCategory) => {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return next
    })
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

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return list
  }, [activeFilters, sort, search])

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#5C3D2E', fontFamily: 'Georgia, serif' }}>
          🛍️ Catálogo
        </h1>
        <p className="text-sm" style={{ color: '#999' }}>
          {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2"
          style={{ borderColor: '#D4AF8C', background: 'white', fontFamily: 'Georgia, serif' }}
        />

        {/* Sort */}
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

      {/* Filter chips */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(Object.keys(categoryLabels) as ProductCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => toggleFilter(cat)}
            className="px-4 py-1.5 rounded-full text-sm font-medium border transition-all"
            style={{
              background: activeFilters.has(cat) ? '#8B6F47' : 'white',
              color: activeFilters.has(cat) ? 'white' : '#8B6F47',
              borderColor: '#8B6F47',
            }}
          >
            {categoryLabels[cat]}
          </button>
        ))}
        {activeFilters.size > 0 && (
          <button
            onClick={() => setActiveFilters(new Set())}
            className="px-4 py-1.5 rounded-full text-sm border transition-all"
            style={{ borderColor: '#ccc', color: '#999' }}
          >
            ✕ Limpiar
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20" style={{ color: '#999' }}>
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg">No encontramos productos con ese criterio.</p>
          <button
            onClick={() => { setSearch(''); setActiveFilters(new Set()) }}
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
