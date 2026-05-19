import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="text-white mt-16 pt-10 pb-6 px-4" style={{ background: '#3E2C20' }}>
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div>
          <h4 className="font-bold mb-3 text-base" style={{ color: '#D4AF8C', fontFamily: 'Georgia, serif' }}>
            🧹 The Reading Broom
          </h4>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Kits de lectura hechos con amor. Transformamos cada historia en una experiencia completa.
          </p>
          <div className="flex flex-wrap gap-2">
            {['💳 Visa', '💳 MC', 'PayPal', 'Stripe'].map((m) => (
              <span key={m} className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.12)', color: 'white' }}>
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Tienda */}
        <div>
          <h4 className="font-bold mb-3 text-sm" style={{ color: '#D4AF8C' }}>Tienda</h4>
          <div className="space-y-2">
            {[
              { href: '/catalogo', label: 'Catálogo Completo' },
              { href: '/catalogo?categoria=kit', label: 'Kits de Lectura' },
              { href: '/catalogo?categoria=libro', label: 'Libros' },
              { href: '/catalogo?categoria=complemento', label: 'Complementos' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="block text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Información */}
        <div>
          <h4 className="font-bold mb-3 text-sm" style={{ color: '#D4AF8C' }}>Información</h4>
          <div className="space-y-2">
            {[
              { href: '/acerca', label: 'Acerca de Mí' },
              { href: '/club', label: 'Club de Lectura' },
              { href: '/envios', label: 'Política de Envío' },
              { href: '/devoluciones', label: 'Devoluciones' },
              { href: '/terminos', label: 'Términos y Condiciones' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="block text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="font-bold mb-3 text-sm" style={{ color: '#D4AF8C' }}>Contacto</h4>
          <div className="space-y-2">
            <a
              href="https://instagram.com/thereadingbroom"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm hover:text-white transition-colors"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              📸 @thereadingbroom
            </a>
            <a
              href="mailto:contacto@thereadingbroom.com"
              className="block text-sm hover:text-white transition-colors"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              📧 contacto@thereadingbroom.com
            </a>
            <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Pedidos procesados en 2-5 días hábiles.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 pt-5 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          © 2025 The Reading Broom. Todos los derechos reservados.
        </span>
        <div className="flex gap-4">
          {[
            { href: '/privacidad', label: 'Privacidad' },
            { href: '/terminos', label: 'Términos' },
            { href: '/envios', label: 'Envíos' },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="text-xs hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
