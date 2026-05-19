export type ProductCategory = 'kit' | 'libro' | 'complemento'

export interface Product {
  id: string
  name: string
  category: ProductCategory
  price: number
  emoji: string
  description: string
  tag?: string
  items?: string[]
  author?: string
  publisher?: string
  isNew?: boolean
  isPopular?: boolean
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
    id: 'kit-primavera',
    name: 'Kit Primavera',
    category: 'kit',
    price: 450,
    emoji: '🌸',
    tag: 'Primavera',
    description: 'Celebra la primavera con este kit lleno de frescura y color. Incluye un libro de temporada y complementos que capturan la esencia de esta hermosa estación.',
    items: ['Libro sorpresa de primavera', 'Vela aromática floral', '3 Separadores exclusivos', 'Stickers de temporada', 'Tarjeta personalizada'],
    isNew: true,
    isPopular: false,
  },
  {
    id: 'kit-verano',
    name: 'Kit Verano',
    category: 'kit',
    price: 480,
    emoji: '☀️',
    tag: 'Verano',
    description: 'El compañero perfecto para tus lecturas de verano. Incluye un libro para disfrutar bajo el sol y complementos refrescantes.',
    items: ['Libro de verano', 'Vela aromática tropical', '3 Separadores de verano', 'Máscaras faciales', 'Tarjeta personalizada'],
    isNew: false,
    isPopular: true,
  },
  {
    id: 'kit-otono',
    name: 'Kit Otoño',
    category: 'kit',
    price: 500,
    emoji: '🍂',
    tag: 'Otoño',
    description: 'El kit ideal para las noches de otoño. Un libro perfecto para la temporada acompañado de los complementos más acogedores.',
    items: ['Libro de otoño', 'Vela aromática de canela', '3 Separadores otoñales', 'Calcetines de lectura', 'Tarjeta personalizada'],
    isNew: false,
    isPopular: true,
  },
  {
    id: 'kit-invierno',
    name: 'Kit Invierno',
    category: 'kit',
    price: 520,
    emoji: '❄️',
    tag: 'Invierno',
    description: 'Acompáñate de la magia del invierno con este kit pensado para las noches más frías.',
    items: ['Libro de invierno', 'Vela aromática de vainilla', '3 Separadores de invierno', 'Calcetines de lectura', 'Luz LED de lectura', 'Tarjeta personalizada'],
    isNew: true,
    isPopular: false,
  },
  {
    id: 'kit-romantico',
    name: 'Kit Romántico',
    category: 'kit',
    price: 550,
    emoji: '💕',
    tag: 'Romance',
    description: 'Para las amantes del romance. Un libro de amor junto con los complementos perfectos para una tarde de lectura romántica.',
    items: ['Libro romántico', 'Vela aromática de rosas', '3 Separadores de corazones', 'Máscaras faciales', 'Stickers de amor', 'Tarjeta personalizada'],
    isNew: false,
    isPopular: true,
  },
  {
    id: 'kit-misterio',
    name: 'Kit Misterio & Suspenso',
    category: 'kit',
    price: 490,
    emoji: '🔍',
    tag: 'Misterio',
    description: 'Para los amantes del suspenso y el misterio. Un libro que te tendrá al filo del asiento junto con complementos temáticos.',
    items: ['Libro de misterio', 'Vela aromática de cedro', '3 Separadores temáticos', 'Stickers de misterio', 'Tarjeta personalizada'],
    isNew: true,
    isPopular: false,
  },
  {
    id: 'libro-quijote',
    name: 'El Quijote',
    category: 'libro',
    price: 280,
    emoji: '📖',
    description: 'La obra cumbre de Miguel de Cervantes. Una aventura inmortal sobre los sueños, la locura y el idealismo.',
    author: 'Miguel de Cervantes',
    publisher: 'Editorial Planeta',
    isNew: false,
    isPopular: true,
  },
  {
    id: 'libro-cien-anos',
    name: 'Cien Años de Soledad',
    category: 'libro',
    price: 320,
    emoji: '📚',
    description: 'La obra maestra de Gabriel García Márquez que dio lugar al realismo mágico latinoamericano.',
    author: 'Gabriel García Márquez',
    publisher: 'Editorial Sudamericana',
    isNew: false,
    isPopular: true,
  },
  {
    id: 'comp-vela',
    name: 'Vela Aromática Personalizada',
    category: 'complemento',
    price: 150,
    emoji: '🕯️',
    description: 'Vela artesanal con aromas especialmente seleccionados para acompañar tus momentos de lectura.',
    isNew: true,
    isPopular: false,
  },
  {
    id: 'comp-separadores',
    name: 'Set de Separadores Elegantes',
    category: 'complemento',
    price: 80,
    emoji: '🔖',
    description: 'Set de 5 separadores artesanales con diseños exclusivos de The Reading Broom.',
    isNew: false,
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
