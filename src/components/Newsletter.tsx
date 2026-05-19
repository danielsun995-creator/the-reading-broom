'use client'

import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setEmail('')
  }

  return (
    <section
      className="my-10 rounded-2xl text-white text-center px-6 py-10"
      style={{ background: 'linear-gradient(135deg, #5C3D2E, #8B6F47)' }}
    >
      <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
        📧 Recibe nuestras novedades
      </h2>
      <p className="opacity-85 mb-6 text-sm">Sé la primera en enterarte de nuevas colecciones y ofertas exclusivas.</p>

      {submitted ? (
        <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-6 py-3 font-medium">
          ✅ ¡Gracias por suscribirte!
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu correo electrónico"
            required
            className="flex-1 px-4 py-3 rounded-full text-sm outline-none"
            style={{ color: '#3E2C20', background: 'rgba(255,255,255,0.95)' }}
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-full font-semibold text-sm transition hover:opacity-90 active:scale-95 whitespace-nowrap"
            style={{ background: '#FF7F50', color: 'white' }}
          >
            Suscribirme
          </button>
        </form>
      )}
    </section>
  )
}
