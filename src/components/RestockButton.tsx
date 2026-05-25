'use client'

import { useState } from 'react'

interface Props {
  productId: string
  productName: string
  size?: 'small' | 'normal' | 'large'
}

export default function RestockButton({ productId, productName, size = 'normal' }: Props) {
  const [step, setStep] = useState<'idle' | 'form' | 'sent'>('idle')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await fetch('/api/restock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, productId, productName }),
      })
    } catch { /* silencioso */ }
    setLoading(false)
    setStep('sent')
  }

  if (step === 'sent') {
    return (
      <div
        className="w-full text-center rounded-lg font-medium"
        style={{
          background: '#F5F1E8',
          color: '#8B6F47',
          padding: size === 'small' ? '6px 8px' : '10px 16px',
          fontSize: size === 'small' ? '11px' : '13px',
        }}
      >
        ✨ ¡Te avisamos cuando regrese!
      </div>
    )
  }

  if (step === 'form') {
    return (
      <form
        onSubmit={handleSubmit}
        className={size === 'small' ? 'flex flex-col gap-1.5' : 'flex gap-2'}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Tu correo"
          required
          disabled={loading}
          className="flex-1 rounded-lg border outline-none disabled:opacity-60"
          style={{
            borderColor: '#D4AF8C',
            color: '#3E2C20',
            padding: size === 'small' ? '5px 8px' : '8px 12px',
            fontSize: size === 'small' ? '11px' : '13px',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg font-bold text-white transition active:scale-95 disabled:opacity-60 whitespace-nowrap"
          style={{
            background: '#8B6F47',
            padding: size === 'small' ? '5px 8px' : '8px 14px',
            fontSize: size === 'small' ? '11px' : '13px',
          }}
        >
          {loading ? '...' : 'Avisar'}
        </button>
      </form>
    )
  }

  return (
    <button
      onClick={() => setStep('form')}
      className="w-full rounded-lg font-medium text-white transition-all active:scale-95"
      style={{
        background: '#B89060',
        padding: size === 'small' ? '6px 8px' : size === 'large' ? '14px 24px' : '8px 16px',
        fontSize: size === 'small' ? '11px' : size === 'large' ? '15px' : '13px',
      }}
    >
      🔔 {size === 'small' ? 'Avisarme' : 'Avisarme cuando haya stock'}
    </button>
  )
}
