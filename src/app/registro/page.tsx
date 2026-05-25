'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function RegistroContent() {
  const searchParams = useSearchParams()
  const [name, setName] = useState('')
  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleRegister() {
    if (!name || !email || !password) {
      setError('Completa todos los campos')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="text-6xl mb-4">📬</div>
        <h2 className="text-2xl font-bold mb-3" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
          ¡Revisa tu correo!
        </h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: '#6B5438' }}>
          Enviamos un link de confirmación a <strong>{email}</strong>. Da click en él para activar tu cuenta y ver tu historial de pedidos.
        </p>
        <Link
          href="/catalogo"
          className="inline-block px-6 py-3 rounded-xl text-white font-bold transition hover:opacity-90"
          style={{ background: '#8B6F47' }}
        >
          Seguir comprando
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">✨</div>
        <h1 className="text-2xl font-bold" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
          Crea tu Cuenta
        </h1>
        <p className="text-sm mt-1" style={{ color: '#8B6F47' }}>
          Guarda tus pedidos y accede a tu historial
        </p>
      </div>

      <div className="rounded-2xl border p-6" style={{ borderColor: '#E5D5C0', background: 'white' }}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#5C3D2E' }}>Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
              style={{ borderColor: '#D4AF8C' }}
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#5C3D2E' }}>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
              style={{ borderColor: '#D4AF8C' }}
              placeholder="tu@correo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#5C3D2E' }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
              style={{ borderColor: '#D4AF8C' }}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-3 rounded-xl text-white font-bold mt-5 transition hover:opacity-90 disabled:opacity-60"
          style={{ background: '#8B6F47' }}
        >
          {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>

        <p className="text-center text-sm mt-4" style={{ color: '#8B6F47' }}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-semibold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>

      <div className="text-center mt-6">
        <Link href="/catalogo" className="text-sm transition hover:opacity-70" style={{ color: '#8B6F47' }}>
          ← Continuar sin cuenta
        </Link>
      </div>
    </div>
  )
}

export default function RegistroPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400">Cargando...</div>}>
      <RegistroContent />
    </Suspense>
  )
}
