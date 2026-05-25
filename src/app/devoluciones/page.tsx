export const metadata = {
  title: 'Devoluciones — The Reading Broom',
  description: 'Política de devoluciones y productos dañados de The Reading Broom.',
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="text-lg font-bold mb-3" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
      {title}
    </h2>
    <div className="text-sm leading-relaxed space-y-2" style={{ color: '#555' }}>
      {children}
    </div>
  </div>
)

export default function DevolucionesPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">

      <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
        Devoluciones
      </h1>
      <p className="text-center text-sm mb-10" style={{ color: '#AAA' }}>
        Última actualización: mayo 2025
      </p>

      <Section title="📋 Política general">
        <p>
          Todos nuestros productos son revisados con cuidado antes de ser enviados. Por la naturaleza de
          los artículos que vendemos, <strong style={{ color: '#3E2C20' }}>no aceptamos devoluciones por
          cambio de opinión</strong> ni por razones distintas a las descritas en esta política.
        </p>
      </Section>

      <Section title="📦 Producto dañado o incorrecto">
        <p>
          Si tu pedido llegó con algún daño, o recibiste un producto distinto al que compraste,
          con gusto te ayudamos. Para proceder necesitamos que:
        </p>
        <ol className="list-decimal list-inside space-y-2 mt-2 pl-1">
          <li>Nos contactes dentro de las <strong style={{ color: '#3E2C20' }}>48 horas</strong> siguientes a recibir tu paquete.</li>
          <li>Nos envíes <strong style={{ color: '#3E2C20' }}>fotografías claras</strong> del producto dañado y del empaque.</li>
          <li>Incluyas tu número de pedido o el correo con el que compraste.</li>
        </ol>
        <p className="mt-3">
          Una vez que revisemos tu caso, te ofreceremos una solución: reposición del producto o
          reembolso completo, según lo que prefieras y la disponibilidad.
        </p>
      </Section>

      <Section title="⏰ Plazo importante">
        <p>
          Reportes recibidos después de <strong style={{ color: '#3E2C20' }}>48 horas</strong> de la
          entrega no podrán ser procesados. Te recomendamos revisar tu pedido en cuanto llegue.
        </p>
      </Section>

      <Section title="💳 Reembolsos">
        <p>
          En caso de proceder un reembolso, este se realiza al mismo método de pago que usaste.
          El tiempo en que se refleja depende de tu banco, generalmente entre
          <strong style={{ color: '#3E2C20' }}> 5 y 10 días hábiles</strong>.
        </p>
        <p>
          El reembolso aplica <strong style={{ color: '#3E2C20' }}>únicamente al valor del producto</strong>.
          El costo de envío (incluyendo el seguro) no es reembolsable, ya que la guía de envío
          fue generada y tiene un costo irrecuperable.
        </p>
      </Section>

      <Section title="❌ Cancelaciones">
        <p>
          Una vez procesado el pago, el pedido entra en preparación de inmediato y
          <strong style={{ color: '#3E2C20' }}> no es posible cancelarlo</strong>.
          Si tienes un problema con tu pedido, escríbenos y buscamos la mejor solución.
        </p>
      </Section>

      {/* Contacto */}
      <div className="rounded-2xl p-6 mt-4" style={{ background: '#F5EDD8', border: '1.5px solid #D4AF8C' }}>
        <p className="text-sm font-bold mb-3" style={{ color: '#3E2C20' }}>
          ¿Recibiste algo mal? Contáctanos de inmediato:
        </p>
        <p className="text-sm" style={{ color: '#5C3D2E' }}>📞 +52 155 7413 9159</p>
        <p className="text-sm" style={{ color: '#5C3D2E' }}>✉️ begorreyes@gmail.com</p>
        <p className="text-sm mt-2" style={{ color: '#8B6F47' }}>
          Incluye fotos del producto y tu número de pedido para agilizar el proceso.
        </p>
      </div>

    </div>
  )
}
