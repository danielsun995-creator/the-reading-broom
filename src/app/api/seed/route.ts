import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { products } from '@/lib/data'

export async function GET() {
  const supabase = createAdminClient()

  const rows = products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    emoji: p.emoji,
    description: p.description,
    tag: p.tag ?? null,
    items: p.items ?? null,
    author: p.author ?? null,
    publisher: p.publisher ?? null,
    is_new: p.isNew ?? false,
    is_popular: p.isPopular ?? false,
    active: true,
  }))

  const { error } = await supabase
    .from('products')
    .upsert(rows, { onConflict: 'id' })

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, migrated: rows.length, products: rows.map((r) => r.name) })
}
