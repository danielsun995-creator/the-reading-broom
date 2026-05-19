import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

const realProducts = [
  {
    id: 'jane-austen-sense',
    name: "The Jane Austen Collector's Box — Sense and Sensibility",
    category: 'kit',
    price: 1699,
    promotional_price: 1499,
    stock: 1,
    emoji: '📚',
    image_url: '/products/jane-austen-sense.jpeg',
    description: 'Una caja coleccionista inspirada en Sense and Sensibility de Jane Austen. Incluye el libro y complementos exclusivos para vivir la historia de las hermanas Dashwood.',
    tag: 'Jane Austen',
    is_new: false,
    is_popular: true,
    active: true,
  },
  {
    id: 'jane-austen-pride',
    name: "The Jane Austen Collector's Box — Pride and Prejudice",
    category: 'kit',
    price: 1699,
    promotional_price: 1499,
    stock: 1,
    emoji: '📚',
    image_url: '/products/jane-austen-pride.jpeg',
    description: 'Una caja coleccionista inspirada en Pride and Prejudice de Jane Austen. Revive la historia de Elizabeth Bennet y Mr. Darcy con este kit lleno de detalles exclusivos.',
    tag: 'Jane Austen',
    is_new: false,
    is_popular: true,
    active: true,
  },
  {
    id: 'jane-austen-emma',
    name: "The Jane Austen Collector's Box — Emma",
    category: 'kit',
    price: 1699,
    promotional_price: 1499,
    stock: 0,
    emoji: '📚',
    image_url: '/products/jane-austen-emma.jpeg',
    description: 'Una caja coleccionista inspirada en Emma de Jane Austen. Acompaña a Emma Woodhouse en sus aventuras con complementos únicos y cuidadosamente seleccionados.',
    tag: 'Jane Austen',
    is_new: false,
    is_popular: false,
    active: true,
  },
  {
    id: 'little-women',
    name: "Collector's Box — Little Women",
    category: 'kit',
    price: 1699,
    promotional_price: 1499,
    stock: 0,
    emoji: '📚',
    image_url: '/products/little-women.jpeg',
    description: 'Una caja coleccionista inspirada en Little Women de Louisa May Alcott. Vive la historia de las hermanas March con complementos exclusivos y llenos de calidez.',
    tag: 'Clásicos',
    is_new: false,
    is_popular: false,
    active: true,
  },
  {
    id: 'christmas-bookshop',
    name: 'The Christmas Bookshop',
    category: 'libro',
    price: 350,
    promotional_price: 300,
    stock: 1,
    emoji: '🎄',
    image_url: '/products/christmas-bookshop.webp',
    description: 'Una encantadora historia navideña ambientada en una librería. El libro perfecto para disfrutar en las fiestas con una taza de chocolate caliente.',
    tag: 'Navidad',
    is_new: true,
    is_popular: true,
    active: true,
  },
  {
    id: 'escaparate-navideno',
    name: 'Un escaparate navideño',
    category: 'libro',
    price: 350,
    promotional_price: 300,
    stock: 1,
    emoji: '🎁',
    image_url: '/products/escaparate-navideno.webp',
    description: 'Una historia mágica de Navidad que te transportará a un mundo lleno de ilusión y esperanza. Ideal para regalar en estas fechas especiales.',
    tag: 'Navidad',
    is_new: true,
    is_popular: false,
    active: true,
  },
  {
    id: 'wreck-the-halls',
    name: 'Wreck de Halls',
    category: 'libro',
    price: 350,
    promotional_price: 300,
    stock: 1,
    emoji: '🎅',
    image_url: '/products/wreck-the-halls.webp',
    description: 'Una comedia romántica navideña perfecta para las fiestas. Llena de humor, amor y la magia de la Navidad.',
    tag: 'Navidad',
    is_new: true,
    is_popular: true,
    active: true,
  },
]

export async function GET() {
  const supabase = createAdminClient()

  // Borrar productos de prueba
  const placeholderIds = [
    'kit-primavera', 'kit-verano', 'kit-otono', 'kit-invierno',
    'kit-romantico', 'kit-misterio', 'libro-quijote', 'libro-cien-anos',
    'comp-vela', 'comp-separadores',
  ]
  await supabase.from('products').delete().in('id', placeholderIds)

  // Insertar productos reales
  const { error } = await supabase
    .from('products')
    .upsert(realProducts, { onConflict: 'id' })

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    message: 'Productos reales cargados correctamente',
    products: realProducts.map((p) => ({ name: p.name, price: p.price, promo: p.promotional_price, stock: p.stock })),
  })
}
