import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { email, productId, productName } = await req.json()

    if (!email || !email.includes('@') || !productId) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    const supabase = createAdminClient()

    await supabase.from('restock_requests').upsert(
      {
        email: email.toLowerCase().trim(),
        product_id: productId,
        product_name: productName ?? '',
      },
      { onConflict: 'email,product_id', ignoreDuplicates: true }
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Restock error:', err)
    return NextResponse.json({ ok: true }) // No mostramos error al usuario
  }
}
