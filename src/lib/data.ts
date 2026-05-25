export type ProductCategory = 'kit' | 'libro' | 'complemento'

export interface ProductVariant {
  id: string
  name: string
  stock: number
  imageUrl?: string
}

export interface Product {
  id: string
  name: string
  category: ProductCategory
  price: number
  promotionalPrice?: number
  emoji: string
  description: string
  imageUrl?: string
  tag?: string
  items?: string[]
  author?: string
  publisher?: string
  isNew?: boolean
  isPopular?: boolean
  isFeatured?: boolean
  stock?: number
  tags?: string[]
  variants?: ProductVariant[]
}

export interface KitItem {
  id: string
  name: string
  price: number
  emoji: string
}

export interface KitPreset {
  id: string
  name: string
  price: number
  items: string[]
}

export const products: Product[] = [
  {
    id: 'jane-austen-sense',
    name: "The Jane Austen Collector's Box — Sense and Sensibility",
    category: 'kit',
    price: 1699,
    promotionalPrice: 1499,
    stock: 1,
    emoji: '📚',
    imageUrl: '/products/jane-austen-sense.jpeg',
    tag: 'Jane Austen',
    description: 'Una caja coleccionista inspirada en Sense and Sensibility de Jane Austen. Complementos exclusivos para vivir la historia de las hermanas Dashwood.',
    isNew: false,
    isPopular: true,
  },
  {
    id: 'jane-austen-pride',
    name: "The Jane Austen Collector's Box — Pride and Prejudice",
    category: 'kit',
    price: 1699,
    promotionalPrice: 1499,
    stock: 1,
    emoji: '📚',
    imageUrl: '/products/jane-austen-pride.jpeg',
    tag: 'Jane Austen',
    description: 'Una caja coleccionista inspirada en Pride and Prejudice de Jane Austen. Revive la historia de Elizabeth Bennet y Mr. Darcy.',
    isNew: false,
    isPopular: true,
  },
  {
    id: 'jane-austen-emma',
    name: "The Jane Austen Collector's Box — Emma",
    category: 'kit',
    price: 1699,
    promotionalPrice: 1499,
    stock: 0,
    emoji: '📚',
    imageUrl: '/products/jane-austen-emma.jpeg',
    tag: 'Jane Austen',
    description: 'Una caja coleccionista inspirada en Emma de Jane Austen. Complementos únicos y cuidadosamente seleccionados.',
    isNew: false,
    isPopular: false,
  },
  {
    id: 'little-women',
    name: "Collector's Box — Little Women",
    category: 'kit',
    price: 1699,
    promotionalPrice: 1499,
    stock: 0,
    emoji: '📚',
    imageUrl: '/products/little-women.jpeg',
    tag: 'Clásicos',
    description: 'Una caja coleccionista inspirada en Little Women de Louisa May Alcott. Vive la historia de las hermanas March.',
    isNew: false,
    isPopular: false,
  },
  {
    id: 'christmas-bookshop',
    name: 'The Christmas Bookshop',
    category: 'libro',
    price: 350,
    promotionalPrice: 300,
    stock: 1,
    emoji: '🎄',
    imageUrl: '/products/christmas-bookshop.webp',
    tag: 'Navidad',
    description: 'Una encantadora historia navideña ambientada en una librería. El libro perfecto para disfrutar en las fiestas.',
    isNew: true,
    isPopular: true,
  },
  {
    id: 'escaparate-navideno',
    name: 'Un escaparate navideño',
    category: 'libro',
    price: 350,
    promotionalPrice: 300,
    stock: 1,
    emoji: '🎁',
    imageUrl: '/products/escaparate-navideno.webp',
    tag: 'Navidad',
    description: 'Una historia mágica de Navidad que te transportará a un mundo lleno de ilusión y esperanza.',
    isNew: true,
    isPopular: false,
  },
  {
    id: 'wreck-the-halls',
    name: 'Wreck de Halls',
    category: 'libro',
    price: 350,
    promotionalPrice: 300,
    stock: 1,
    emoji: '🎅',
    imageUrl: '/products/wreck-the-halls.webp',
    tag: 'Navidad',
    description: 'Una comedia romántica navideña perfecta para las fiestas. Llena de humor, amor y la magia de la Navidad.',
    isNew: true,
    isPopular: true,
  },
]

export const kitItems: KitItem[] = [
  { id: 'vela', name: 'Vela Aromática', price: 80, emoji: '🕯️' },
  { id: 'separadores', name: '3 Separadores', price: 50, emoji: '🔖' },
  { id: 'mascaras', name: '2 Máscaras Faciales', price: 60, emoji: '🧖' },
  { id: 'stickers', name: 'Stickers Exclusivos', price: 30, emoji: '⭐' },
  { id: 'caja', name: 'Caja de Regalo', price: 40, emoji: '🎁' },
  { id: 'luz', name: 'Luz LED Lectura', price: 70, emoji: '💡' },
  { id: 'calcetines', name: 'Calcetines de Lectura', price: 45, emoji: '🧦' },
  { id: 'marcapaginas', name: 'Marcapáginas Artesanal', price: 35, emoji: '📑' },
  { id: 'tarjeta', name: 'Tarjeta Personalizada', price: 25, emoji: '💌' },
]

export const kitPresets: KitPreset[] = [
  { id: 'clasico', name: 'Kit Clásico', price: 170, items: ['vela', 'separadores', 'stickers', 'caja', 'tarjeta'] },
  { id: 'premium', name: 'Kit Premium', price: 250, items: ['vela', 'separadores', 'mascaras', 'stickers', 'caja', 'luz', 'tarjeta'] },
  { id: 'regalo', name: 'Kit Regalo', price: 200, items: ['vela', 'separadores', 'mascaras', 'caja', 'tarjeta'] },
]

export const categories = [
  { id: 'kit', name: 'Kits Estacionales', emoji: '🎁', description: 'Experiencias completas de lectura' },
  { id: 'libro', name: 'Libros', emoji: '📚', description: 'Los mejores títulos seleccionados' },
  { id: 'complemento', name: 'Complementos', emoji: '✨', description: 'Accesorios para tu rincón de lectura' },
  { id: 'romantico', name: 'Romance', emoji: '💕', description: 'Para las amantes del romance' },
  { id: 'misterio', name: 'Misterio', emoji: '🔍', description: 'Suspenso y aventura' },
  { id: 'club', name: 'Club de Lectura', emoji: '📖', description: 'Lee con nuestra comunidad' },
]
