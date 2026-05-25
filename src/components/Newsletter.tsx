'use client'

import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'already' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (data.message === 'already_subscribed') {
        setStatus('already')
      } else if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      className="my-10 rounded-2xl text-white text-center px-6 py-10"
      style={{ background: 'linear-gradient(135deg, #5C3D2E, #8B6F47)' }}
    >
      <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
        📧 Recibe nuestras novedades
      </h2>
      <p className="opacity-85 mb-6 text-sm">
        Sé la primera en enterarte de nuevas colecciones y ofertas exclusivas.
      </p>

      {status === 'success' ? (
        <div
          className="max-w-md mx-auto rounded-2xl px-6 py-5 text-left flex gap-4 items-start"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          <span className="text-3xl">🎉</span>
          <div>
            <p className="font-bold text-lg mb-1">¡Bienvenida al club!</p>
            <p className="text-sm leading-relaxed opacity-90">
              Gracias por suscribirte a The Reading Broom. Muy pronto recibirás en tu correo
              las mejores novedades, lanzamientos exclusivos y recomendaciones seleccionadas
              especialmente para ti. ¡Prepárate para una experiencia mágica de lectura! 📚✨
            </p>
          </div>
        </div>
      ) : status === 'already' ? (
        <div
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          📬 ¡Ya estás en nuestra lista! Pronto tendrás novedades.
        </div>
      ) : (
        <>
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
              disabled={status === 'loading'}
              className="flex-1 px-4 py-3 rounded-full text-sm outline-none disabled:opacity-60"
              style={{ color: '#3E2C20', background: 'rgba(255,255,255,0.95)' }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 rounded-full font-semibold text-sm transition hover:opacity-90 active:scale-95 whitespace-nowrap disabled:opacity-60"
              style={{ background: '#FF7F50', color: 'white' }}
            >
              {status === 'loading' ? 'Enviando...' : 'Suscribirme'}
            </button>
          </form>
          {status === 'error' && (
            <p className="text-sm mt-3 opacity-80">⚠️ Hubo un error. Por favor intenta de nuevo.</p>
          )}
        </>
      )}
    </section>
  )
}
