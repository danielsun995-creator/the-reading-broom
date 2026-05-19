import Link from 'next/link'
import { products } from '@/lib/data'

export default function AdminPage() {
  const kits = products.filter((p) => p.category === 'kit').length
  const libros = products.filter((p) => p.category === 'libro').length
  const complementos = products.filter((p) => p.category === 'complemento').length

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#5C3D2E', fontFamily: 'Georgia, serif' }}>
          🧹 Panel de Administración
        </h1>
        <p className="text-sm" style={{ color: '#999' }}>The Reading Broom</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Productos', value: products.length, icon: '📦' },
          { label: 'Kits', value: kits, icon: '🎁' },
          { label: 'Libros', value: libros, icon: '📚' },
          { label: 'Complementos', value: complementos, icon: '🕯️' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-5 text-center shadow-sm"
            style={{ background: 'white', border: '1px solid #E5D5C0' }}
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold mb-1" style={{ color: '#5C3D2E' }}>{stat.value}</div>
            <div className="text-xs" style={{ color: '#999' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl p-6 shadow-sm" style={{ background: 'white', border: '1px solid #E5D5C0' }}>
          <h2 className="font-bold mb-4" style={{ color: '#5C3D2E', fontFamily: 'Georgia, serif' }}>
            🚀 Accesos Rápidos
          </h2>
          <div className="space-y-3">
            {[
              { href: '/catalogo', label: 'Ver Tienda', icon: '🛍️' },
              { href: '/admin/pedidos', label: 'Ver Pedidos', icon: '📋' },
              { href: '/admin/productos/nuevo', label: 'Agregar Producto', icon: '➕' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition hover:opacity-80"
                style={{ background: '#F5F1E8', color: '#5C3D2E' }}
              >
                <span>{link.icon}</span> {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-6 shadow-sm" style={{ background: 'white', border: '1px solid #E5D5C0' }}>
          <h2 className="font-bold mb-4" style={{ color: '#5C3D2E', fontFamily: 'Georgia, serif' }}>
            📋 Próximos Pasos
          </h2>
          <ul className="space-y-2 text-sm" style={{ color: '#666' }}>
            {[
              { done: true, label: 'Proyecto creado en Next.js' },
              { done: true, label: 'Diseño convertido a componentes' },
              { done: true, label: 'Catálogo con filtros' },
              { done: false, label: 'Conectar Supabase (base de datos)' },
              { done: false, label: 'Integrar pagos con Stripe' },
              { done: false, label: 'Envíos con Skydropx' },
              { done: false, label: 'Subir a Vercel (en vivo)' },
            ].map((item) => (
              <li key={item.label} className="flex items-center gap-2">
                <span>{item.done ? '✅' : '⏳'}</span>
                <span style={{ color: item.done ? '#2e7d32' : '#666' }}>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Products table */}
      <div className="rounded-xl shadow-sm overflow-hidden" style={{ background: 'white', border: '1px solid #E5D5C0' }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#E5D5C0' }}>
          <h2 className="font-bold" style={{ color: '#5C3D2E', fontFamily: 'Georgia, serif' }}>
            📦 Productos actuales
          </h2>
          <span className="text-xs px-3 py-1 rounded-full" style={{ background: '#F5F1E8', color: '#8B6F47' }}>
            {products.length} productos
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#FDFAF6' }}>
                {['', 'Nombre', 'Categoría', 'Precio', 'Estado', 'Acciones'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#B89060' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <tr
                  key={product.id}
                  className="border-t"
                  style={{ borderColor: '#F0E8DC', background: i % 2 === 0 ? 'white' : '#FDFAF6' }}
                >
                  <td className="px-5 py-3 text-2xl">{product.emoji}</td>
                  <td className="px-5 py-3 font-medium" style={{ color: '#3E2C20' }}>{product.name}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: '#F5F1E8', color: '#8B6F47' }}>
                      {product.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-bold" style={{ color: '#C9302C' }}>
                    ${product.price.toLocaleString()}
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: '#e8f5e9', color: '#2e7d32' }}>
                      Activo
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/producto/${product.id}`}
                      className="text-xs hover:underline"
                      style={{ color: '#8B6F47' }}
                    >
                      Ver →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
