'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import SideMenu from './SideMenu'
import CartSidebar from './CartSidebar'

export default function ClientShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { toggleCart, itemCount } = useCartStore()
  const count = itemCount()

  return (
    <>
      {/* Announcement Bar */}
      <div
        className="text-center text-sm py-2 px-4 text-white"
        style={{ background: '#5C3D2E' }}
      >
        🚚 ¡Envío gratis en compras mayores a $1,100! · Pedidos procesados en 2-5 días hábiles
      </div>

      {/* Header */}
      <header
        className="sticky top-0 z-30 shadow-md"
        style={{ background: '#8B6F47' }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white text-xl font-bold hover:opacity-80 transition-opacity"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            🧹 The Reading Broom
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {[
              { href: '/', label: 'Inicio' },
              { href: '/catalogo', label: 'Catálogo' },
              { href: '/club', label: 'Club de Lectura' },
              { href: '/acerca', label: 'Acerca de Mí' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/85 hover:text-white transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Cart button */}
            <button
              onClick={toggleCart}
              className="relative flex items-center gap-2 text-white px-4 py-2 rounded-full transition-all hover:opacity-80 active:scale-95"
              style={{ background: '#6B5438' }}
            >
              🛒
              <span className="text-sm hidden sm:inline">Carrito</span>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold" style={{ background: '#C9302C' }}>
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            {/* Menu toggle */}
            <button
              onClick={() => setMenuOpen(true)}
              className="text-white text-xl w-10 h-10 flex items-center justify-center rounded-lg hover:opacity-80 transition"
              style={{ background: '#6B5438' }}
              aria-label="Abrir menú"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Side menu */}
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Cart sidebar */}
      <CartSidebar />
    </>
  )
}
