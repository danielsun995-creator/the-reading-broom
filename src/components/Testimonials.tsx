const testimonials = [
  {
    stars: 5,
    title: '¡Me encantó mi kit!',
    text: '"El kit de otoño superó mis expectativas. La vela huele increíble y el libro me atrapó desde la primera página."',
    author: 'María G.',
  },
  {
    stars: 5,
    title: 'Perfecto para regalar',
    text: '"Le regalé el kit romántico a mi mejor amiga y le encantó. La presentación es hermosa y todo viene cuidadosamente empacado."',
    author: 'Laura M.',
  },
  {
    stars: 5,
    title: 'Mi nueva tienda favorita',
    text: '"Por fin un lugar donde la experiencia de lectura es completa. Los complementos hacen toda la diferencia."',
    author: 'Ana P.',
  },
]

export default function Testimonials() {
  return (
    <section className="my-10">
      <h2 className="text-2xl font-bold text-center mb-2" style={{ color: '#5C3D2E', fontFamily: 'Georgia, serif' }}>
        💬 Lectoras Felices
      </h2>
      <p className="text-center text-sm mb-6" style={{ color: '#999' }}>Lo que dicen nuestras clientas</p>
      <div className="grid md:grid-cols-3 gap-5">
        {testimonials.map((t) => (
          <div
            key={t.title}
            className="rounded-xl p-5 shadow-sm"
            style={{ background: 'white', border: '1px solid #E5D5C0' }}
          >
            <div className="text-yellow-400 text-lg mb-2">{'★'.repeat(t.stars)}</div>
            <h3 className="font-bold mb-2 text-sm" style={{ color: '#5C3D2E' }}>{t.title}</h3>
            <p className="text-sm leading-relaxed mb-3" style={{ color: '#666' }}>{t.text}</p>
            <p className="text-xs font-medium" style={{ color: '#B89060' }}>— {t.author}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
