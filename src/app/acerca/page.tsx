import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Acerca de mí — The Reading Broom',
  description: 'Un pequeño rincón creado para quienes encuentran magia entre páginas, café y momentos tranquilos.',
}

export default function AcercaPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">

      {/* Título */}
      <h1
        className="text-3xl font-bold text-center mb-10"
        style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}
      >
        Acerca de mí ♡
      </h1>

      {/* Layout: foto + texto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-12">

        {/* Foto */}
        <div className="relative rounded-2xl overflow-hidden shadow-md" style={{ aspectRatio: '3/4' }}>
          <Image
            src="/About_Me.jpeg"
            alt="The Reading Broom"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Texto */}
        <div className="flex flex-col gap-5 py-2">
          <p className="text-base leading-relaxed" style={{ color: '#3E2C20' }}>
            Hola, soy <strong>The Reading Broom</strong> ✨
          </p>
          <p className="text-base leading-relaxed" style={{ color: '#555' }}>
            Un pequeño rincón creado para quienes encuentran magia entre páginas, café y momentos tranquilos al final del día.
          </p>
          <p className="text-base leading-relaxed" style={{ color: '#555' }}>
            Comparto recomendaciones de libros, pequeños momentos para leer y detalles que hacen de la lectura una experiencia especial. Creo que no hay mejor plan que perderse en una buena historia y convertir los días cotidianos en algo un poco más mágico.
          </p>
          <p className="text-base leading-relaxed" style={{ color: '#555' }}>
            Además, creo{' '}
            <Link href="/crea-tu-kit" className="font-bold underline hover:opacity-70 transition" style={{ color: '#8B6F47' }}>
              cajas literarias
            </Link>{' '}
            pensadas para amantes de los libros, llenas de detalles cuidadosamente seleccionados para acompañar cada lectura.
          </p>
          <p className="text-base leading-relaxed" style={{ color: '#555' }}>
            Desde <strong>CDMX</strong>, este espacio nació para compartir el amor por los libros, las historias que nos marcan y esos momentos acogedores que solo la lectura puede dar. 🤎
          </p>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/thereadingbroom"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full w-fit transition hover:opacity-85"
            style={{ background: '#8B6F47', color: 'white' }}
          >
            📸 Síguenos en Instagram
          </a>
        </div>
      </div>

      {/* Contacto */}
      <div
        className="rounded-2xl p-8 flex flex-col sm:flex-row gap-6 items-center justify-center text-center sm:text-left"
        style={{ background: '#F5EDD8', border: '1.5px solid #D4AF8C' }}
      >
        <div className="text-5xl">💌</div>
        <div>
          <h2
            className="text-lg font-bold mb-3"
            style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}
          >
            Contacto
          </h2>
          <div className="flex flex-col gap-2">
            <a
              href="tel:5215574139159"
              className="flex items-center gap-2 text-sm hover:underline justify-center sm:justify-start"
              style={{ color: '#5C3D2E' }}
            >
              📞 <span>+52 155 7413 9159</span>
            </a>
            <a
              href="mailto:begorreyes@gmail.com"
              className="flex items-center gap-2 text-sm hover:underline justify-center sm:justify-start"
              style={{ color: '#5C3D2E' }}
            >
              ✉️ <span>begorreyes@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}
