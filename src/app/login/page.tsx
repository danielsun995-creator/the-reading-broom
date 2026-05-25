'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function LoginContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/cuenta'

  async function handleLogin() {
    if (!email || !password) {
      setError('Completa todos los campos')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Correo o contraseña incorrectos')
      setLoading(false)
    } else {
      router.push(next)
      router.refresh()
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">📚</div>
        <h1 className="text-2xl font-bold" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
          Inicia Sesión
        </h1>
        <p className="text-sm mt-1" style={{ color: '#8B6F47' }}>
          Accede a tu historial de pedidos
        </p>
      </div>

      <div className="rounded-2xl border p-6" style={{ borderColor: '#E5D5C0', background: 'white' }}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#5C3D2E' }}>
              Correo electrónico
            </label>
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
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#5C3D2E' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
              style={{ borderColor: '#D4AF8C' }}
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl text-white font-bold mt-5 transition hover:opacity-90 disabled:opacity-60"
          style={{ background: '#8B6F47' }}
        >
          {loading ? 'Entrando...' : 'Iniciar Sesión'}
        </button>

        <p className="text-center text-sm mt-4" style={{ color: '#8B6F47' }}>
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="font-semibold hover:underline">
            Regístrate
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400">Cargando...</div>}>
      <LoginContent />
    </Suspense>
  )
}
