-- ============================================================
-- Complementos, velas, papelería y tote bags — The Reading Broom
-- Correr en Supabase > SQL Editor
-- ON CONFLICT: actualiza stock e imagen si ya existe el producto
-- ============================================================

insert into products (id, name, category, price, stock, emoji, image_url, description, tag, is_new, is_popular, active)
values

-- ── ACCESORIOS ──────────────────────────────────────────────
('ACC-029', 'Termo La Bella y la Bestia',       'complemento', 649, 1, '☕',  '/products/ACC-029.jpeg',       'Termo La Bella y la Bestia. Accesorio perfecto para tu rincón de lectura.',           'Accesorio',  false, false, true),
('ACC-003', 'Gorra I Love Sports',              'complemento', 649, 1, '🧢', '/products/ACC-003.jpeg',       'Gorra I Love Sports. Complemento para las lectoras que también aman moverse.',        'Accesorio',  true,  false, true),
('ACC-006', 'Book Cover',                       'complemento', 499, 2, '📖', '/products/ACC-006.jpeg',       'Funda protectora para tu libro. Mantén tus libros impecables a donde vayas.',          'Accesorio',  true,  false, true),
('ACC-007', 'Cobija con diseño de libros',      'complemento', 899, 1, '🛌', '/products/ACC-007_Front.jpeg', 'Cobija suave con diseño de libros. Ideal para tus sesiones de lectura más cómodas.',  'Accesorio',  true,  true,  true),
('ACC-024', 'Estuche / Cosmetiquera',           'complemento', 149, 2, '💄', '/products/ACC-024.jpeg',       'Estuche multipropósito con diseño literario. Úsala como neceser o porta lápices.',    'Accesorio',  true,  false, true),
('ACC-025', 'Cosmetiquera Coffee',                           'complemento', 149, 2, '💄', '/products/ACC-025.jpeg',  'Estuche / cosmetiquera con diseño Coffee. Lleva tus esenciales con estilo literario.',       'Accesorio', true, false, true),
('ACC-026', 'Vaso de cristal con popote Just One More Chapter','complemento', 399, 2, '🥤', '/products/ACC-026.jpeg',  'Vaso de cristal con popote con frase "Just One More Chapter". Ideal para leer sin parar.', 'Accesorio', true, false, true),
('ACC-027', 'Vaso de cristal con popote Books & Flowers',      'complemento', 399, 2, '🥤', '/products/ACC-027.jpeg',  'Vaso de cristal con popote con diseño Books & Flowers. Elegante y literario.',             'Accesorio', true, false, true),
('ACC-028', 'Taza Floral',                                  'complemento', 249, 5, '☕', '/products/ACC-028.png',  'Tazas con diseño floral. Para acompañar tus lecturas con tu bebida caliente favorita.',    'Accesorio', true, false, true),

-- ── VELAS ───────────────────────────────────────────────────
('VEL-008', 'Vela Orgullo y Prejuicio',         'complemento', 519, 0, '🕯️', null,                          'Vela aromática inspirada en Orgullo y Prejuicio de Jane Austen.',                     'Vela',       false, false, true),
('VEL-009', 'Vela Wuthering Heights',           'complemento', 519, 0, '🕯️', '/products/VEL-009.jpeg',      'Vela aromática inspirada en Cumbres Borrascosas de Emily Brontë.',                   'Vela',       false, false, true),
('VEL-017', 'Vela Harry Potter',                'complemento', 629, 1, '🕯️', '/products/VEL-017.jpeg',      'Vela inspirada en el universo de Harry Potter. Aroma mágico para tus sesiones de lectura.', 'Vela', false, false, true),
('VEL-018', 'Vela Aromática Monk Fruit Vainilla','complemento',249, 6, '🕯️', '/products/VEL-018.jpeg',      'Vela aromática con fragancia a Monk Fruit y Vainilla. Dulce y acogedora.',            'Vela',       true,  false, true),
('VEL-019', 'Vela Aromática Sweet Cherry',      'complemento', 249, 6, '🕯️', '/products/VEL-019.jpeg',      'Vela aromática con fragancia a Sweet Cherry. Fresca y delicada.',                    'Vela',       true,  false, true),
('VEL-020', 'Vela Aromática English Ivy',       'complemento', 249, 6, '🕯️', '/products/VEL-020.jpeg',      'Vela aromática con fragancia a English Ivy. Fresca y botánica.',                    'Vela',       true,  false, true),
('VEL-021', 'Vela Aromática MoonFlower',        'complemento', 249, 6, '🕯️', '/products/VEL-021.jpeg',      'Vela aromática con fragancia a MoonFlower. Floral y romántica.',                    'Vela',       true,  true,  true),

-- ── PAPELERÍA ───────────────────────────────────────────────
('PAP-004', 'Separador Magnético',              'complemento',  79, 4, '🔖', null,                          'Separador magnético exclusivo. Nunca pierdas tu página.',                           'Stationary', false, false, true),
('PAP-005', 'Reading Journal',                  'complemento', 799, 1, '📔', '/products/PAP-005.jpeg',       'Reading journal para llevar el registro de todos tus libros leídos y pendientes.',  'Stationary', true,  true,  true),
('PAP-009', 'Journal Bordado (verde)',           'complemento', 799, 1, '📓', '/products/PAP-009.jpeg',       'Journal con portada bordada en color verde. Para tus pensamientos y lecturas.',      'Stationary', true,  false, true),

-- ── TOTE BAGS ───────────────────────────────────────────────
('BAG-010', 'Tote Bag Orgullo y Prejuicio',     'complemento', 649, 1, '👜', null,                          'Tote bag con diseño de Orgullo y Prejuicio. Lleva tus libros con estilo.',            'Tote Bag',   false, false, true),
('BAG-011', 'Tote Bag Toni Morrison',           'complemento', 649, 1, '👜', null,                          'Tote bag con frase icónica de Toni Morrison. Para las lectoras que hacen declaraciones.', 'Tote Bag', false, true,  true),
('BAG-012', 'Tote Bag I Love Sports Romance',   'complemento', 519, 1, '👜', null,                          'Tote bag I Love Sports Romance. Para las que aman los romances deportivos.',           'Tote Bag',   false, false, true),
('BAG-013', 'Tote Bag La Bella y la Bestia',    'complemento', 649, 0, '👜', null,                          'Tote bag con diseño de La Bella y la Bestia.',                                       'Tote Bag',   false, false, true),
('BAG-014', 'Tote Bag Union Square',            'complemento', 649, 1, '👜', null,                          'Tote bag exclusiva Union Square Barnes & Noble.',                                    'Tote Bag',   false, false, true),
('BAG-015', 'Tote Bag Bag of Books B&N (verde)','complemento', 649, 0, '👜', null,                          'Tote bag ''Bag of Books'' Barnes & Noble en color verde.',                           'Tote Bag',   false, false, true),
('BAG-016', 'Tote Bag Bag of Books B&N (vino)', 'complemento', 649, 0, '👜', null,                          'Tote bag ''Bag of Books'' Barnes & Noble en color vino.',                            'Tote Bag',   false, false, true)

on conflict (id) do update set
  name        = excluded.name,
  price       = excluded.price,
  stock       = excluded.stock,
  image_url   = coalesce(excluded.image_url, products.image_url),
  description = excluded.description,
  tag         = excluded.tag,
  emoji       = excluded.emoji,
  is_new      = excluded.is_new,
  active      = excluded.active;
