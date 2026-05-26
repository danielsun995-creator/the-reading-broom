'use client'

import Link from 'next/link'
import Image from 'next/image'

interface SideMenuProps {
  isOpen: boolean
  onClose: () => void
}

const navLinks = [
  { href: '/', label: 'Inicio', icon: '🏠' },
  { href: '/catalogo', label: 'Catálogo', icon: '🛍️' },
  { href: '/crea-tu-kit', label: 'Crea tu Kit', icon: '🎁' },
  { href: '/club-de-lectura', label: 'Club de Lectura', icon: '📖' },
  { href: '/acerca', label: 'Acerca de Mí', icon: '✨' },
]

const categoryLinks = [
  { href: '/catalogo?categoria=kit', label: 'Kits de Lectura', icon: '📦' },
  { href: '/catalogo?categoria=libro', label: 'Libros', icon: '📚' },
  { href: '/catalogo?categoria=complemento', label: 'Complementos', icon: '🕯️' },
]

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={onClose}
        />
      )}

      {/* Menu panel */}
      <div
        className="fixed top-0 left-0 h-full z-50 flex flex-col shadow-2xl transition-transform duration-300"
        style={{
          width: '280px',
          background: '#fff',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3" style={{ background: '#3E2C20' }}>
          <Image
            src="/Logo_Nuevo_TRB.png"
            alt="The Reading Broom"
            width={140}
            height={48}
            style={{ objectFit: 'contain', height: '48px', width: 'auto' }}
            priority
          />
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-xl w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-3">
          <ul className="space-y-0.5 px-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:text-white"
                  style={{ color: '#5C3D2E' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#8B6F47'; e.currentTarget.style.color = 'white' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#5C3D2E' }}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mx-4 my-3 border-t" style={{ borderColor: '#E5D5C0' }} />
          <p className="px-7 text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#B89060' }}>
            Categorías
          </p>
          <ul className="space-y-0.5 px-3">
            {categoryLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors"
                  style={{ color: '#6B5438' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#F5F1E8' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t" style={{ borderColor: '#E5D5C0' }}>
          <a
            href="https://instagram.com/thereadingbroom"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm mb-2"
            style={{ color: '#8B6F47' }}
          >
            📸 @thereadingbroom
          </a>
          <p className="text-xs" style={{ color: '#B89060' }}>© 2025 The Reading Broom</p>
        </div>
      </div>
    </>
  )
}
