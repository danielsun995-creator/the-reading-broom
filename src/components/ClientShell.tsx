'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import SideMenu from './SideMenu'
import CartSidebar from './CartSidebar'

export default function ClientShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const { toggleCart, itemCount } = useCartStore()
  const count = itemCount()

  useEffect(() => {
    setMounted(true)
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const userName = user
    ? ((user.user_metadata?.name as string)?.split(' ')[0] || user.email?.split('@')[0] || 'Mi cuenta')
    : null

  return (
    <>
      <header className="sticky top-0 z-30 shadow-lg" style={{ background: '#2C1208' }}>
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Logo_TRB.webp"
              alt="The Reading Broom"
              style={{ height: '72px', width: 'auto', display: 'block' }}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {[
              { href: '/', label: 'Inicio' },
              { href: '/catalogo', label: 'Catálogo' },
              { href: '/crea-tu-kit', label: 'Crea tu Kit' },
              { href: '/club-de-lectura', label: 'Club de Lectura' },
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
            {/* Cuenta — solo visible después del mount */}
            {mounted && (
              <Link
                href="/cuenta"
                className="hidden sm:flex items-center gap-1.5 text-sm px-3 py-2 rounded-full transition-all hover:opacity-80"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}
              >
                {userName ? (
                  <>
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#D4AF8C', color: '#3E2C20' }}>
                      {userName[0].toUpperCase()}
                    </span>
                    <span>{userName}</span>
                  </>
                ) : (
                  <span>Entrar</span>
                )}
              </Link>
            )}

            {/* Carrito */}
            <button
              onClick={toggleCart}
              className="relative flex items-center gap-2 text-white px-4 py-2 rounded-full transition-all hover:opacity-80 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              🛒
              <span className="text-sm hidden sm:inline">Carrito</span>
              {mounted && count > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                  style={{ background: '#C9302C' }}
                >
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            {/* Menú hamburguesa */}
            <button
              onClick={() => setMenuOpen(true)}
              className="text-white text-xl w-10 h-10 flex items-center justify-center rounded-lg hover:opacity-80 transition"
              style={{ background: 'rgba(255,255,255,0.15)' }}
              aria-label="Abrir menú"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <CartSidebar />
    </>
  )
}
