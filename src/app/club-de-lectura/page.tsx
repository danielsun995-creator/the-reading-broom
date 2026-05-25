import Image from 'next/image'

export const metadata = {
  title: 'Club de Lectura — The Reading Broom',
  description: 'Únete a la comunidad de @thereadingbroom. Cada mes elegimos una historia para leer juntos.',
}

export default function ClubDeLecturaPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">

      {/* Título */}
      <div className="text-center mb-10">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}
        >
          Club de Lectura
        </h1>
        <p className="text-base" style={{ color: '#8B6F47' }}>
          Únete a la comunidad de @thereadingbroom
        </p>
      </div>

      {/* Layout: foto + contenido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-12">

        {/* Foto del libro del mes */}
        <div className="relative rounded-2xl overflow-hidden shadow-md" style={{ aspectRatio: '3/4' }}>
          <Image
            src="/Club_Lectura_Mayo.png"
            alt="La Sospecha de Sofía — Lectura del mes"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Contenido */}
        <div className="flex flex-col gap-6 py-2">

          {/* Intro */}
          <p className="text-base leading-relaxed" style={{ color: '#555' }}>
            Cada mes elegimos una historia para leer juntos, compartir opiniones y descubrir nuevas perspectivas entre amantes de los libros. ✨
          </p>

          {/* Libro del mes */}
          <div
            className="rounded-2xl p-5"
            style={{ background: '#F5EDD8', border: '1.5px solid #D4AF8C' }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#8B6F47' }}>
              📖 Este mes estamos leyendo
            </p>
            <p className="text-lg font-bold leading-snug" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
              La sospecha de Sofía
            </p>
            <p className="text-sm mb-2" style={{ color: '#8B6F47' }}>de Paloma Sánchez-Garnica</p>
            <p className="text-sm leading-relaxed" style={{ color: '#666' }}>
              Una novela llena de misterio, emociones e historia que nos tiene completamente atrapados.
            </p>
          </div>

          {/* Qué encontrarás */}
          <div>
            <p className="text-sm font-bold mb-3" style={{ color: '#3E2C20' }}>Aquí encontrarás:</p>
            <ul className="flex flex-col gap-2">
              {[
                'Conversaciones y opiniones reales',
                'Reflexiones sobre cada lectura',
                'Un espacio cálido para lectores',
                'Recomendaciones y momentos literarios',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm" style={{ color: '#555' }}>
                  <span style={{ color: '#8B6F47' }}>✦</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Frase */}
          <p className="text-sm italic" style={{ color: '#8B6F47' }}>
            ☕ Libros, café y pequeñas pausas para leer al final del día.
          </p>

          {/* CTA Instagram */}
          <div className="flex flex-col gap-3">
            <a
              href="https://www.instagram.com/thereadingbroom"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm text-white transition hover:opacity-85"
              style={{ background: '#8B6F47' }}
            >
              📸 Síguenos en Instagram — @thereadingbroom
            </a>
          </div>

        </div>
      </div>

      {/* Footer del club */}
      <div className="text-center py-6" style={{ borderTop: '1px solid #E5D5C0' }}>
        <p
          className="text-base font-medium"
          style={{ color: '#8B6F47', fontFamily: 'Georgia, serif' }}
        >
          ♡ Vive la lectura en comunidad ♡
        </p>
      </div>

    </div>
  )
}
