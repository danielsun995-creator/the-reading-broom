export const metadata = {
  title: 'Políticas de envío — The Reading Broom',
  description: 'Información sobre tiempos de entrega, costos y cobertura de envíos de The Reading Broom.',
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

export default function EnviosPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">

      <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
        Políticas de envío
      </h1>
      <p className="text-center text-sm mb-10" style={{ color: '#AAA' }}>
        Última actualización: mayo 2025
      </p>

      <Section title="📦 ¿Cómo enviamos?">
        <p>
          Todos los pedidos se envían desde la Ciudad de México a través de paqueterías de confianza:
          <strong style={{ color: '#3E2C20' }}> FedEx, DHL y Estafeta</strong>. Al finalizar tu compra,
          verás las opciones disponibles para tu código postal con el precio y tiempo estimado de entrega.
        </p>
      </Section>

      <Section title="🛡️ Seguro de envío">
        <p>
          Todos nuestros envíos incluyen <strong style={{ color: '#3E2C20' }}>seguro</strong> por el valor
          de tu pedido. El costo del seguro ya va incluido en el precio de envío que ves al pagar —
          no hay cargos adicionales.
        </p>
        <p>
          En caso de pérdida o daño imputable a la paquetería, el seguro cubre el valor de los productos.
        </p>
      </Section>

      <Section title="🕐 Tiempos de entrega">
        <p>
          Una vez confirmado tu pago, preparamos tu pedido con mucho cuidado. Los tiempos estimados son:
        </p>
        <ul className="list-none space-y-2 mt-2">
          <li className="flex gap-2">
            <span>🚚</span>
            <span><strong style={{ color: '#3E2C20' }}>Envío Estándar:</strong> 3 a 5 días hábiles</span>
          </li>
          <li className="flex gap-2">
            <span>⚡</span>
            <span><strong style={{ color: '#3E2C20' }}>Envío Express:</strong> 1 a 2 días hábiles</span>
          </li>
        </ul>
        <p className="mt-2">
          Los tiempos son estimados y pueden variar dependiendo de tu ubicación o circunstancias ajenas a nosotros.
        </p>
      </Section>

      <Section title="🎁 Envío gratis">
        <p>
          Ofrecemos <strong style={{ color: '#3E2C20' }}>envío gratis</strong> en pedidos mayores a
          <strong style={{ color: '#3E2C20' }}> $1,500 MXN</strong> cuando el costo de envío a tu
          destino sea menor a $60 MXN. Si tu código postal corresponde a una zona de costo mayor,
          el envío tendrá cargo independientemente del monto de tu pedido.
        </p>
      </Section>

      <Section title="📍 Cobertura">
        <p>
          Enviamos a toda la <strong style={{ color: '#3E2C20' }}>República Mexicana</strong>. Por el momento
          no realizamos envíos internacionales.
        </p>
        <p>
          Si tu código postal no aparece con opciones de envío al momento de pagar, escríbenos y buscamos
          la manera de hacértelo llegar:
        </p>
        <p>
          📸{' '}
          <a href="https://instagram.com/thereadingbroom" target="_blank" rel="noopener noreferrer"
            className="underline hover:opacity-70" style={{ color: '#8B6F47' }}>
            @thereadingbroom
          </a>
          {' '}en Instagram · ✉️{' '}
          <a href="mailto:begorreyes@gmail.com" className="underline hover:opacity-70" style={{ color: '#8B6F47' }}>
            begorreyes@gmail.com
          </a>
        </p>
      </Section>

      <Section title="🔢 Número de rastreo">
        <p>
          Una vez que tu pedido sea enviado, recibirás un correo con tu número de rastreo para que
          puedas seguir el recorrido de tu paquete directamente en el sitio de la paquetería.
        </p>
      </Section>

      <Section title="❌ Cancelaciones">
        <p>
          Una vez confirmado el pago, tu pedido entra en proceso de preparación y envío de inmediato.
          Por esa razón, <strong style={{ color: '#3E2C20' }}>no aceptamos cancelaciones</strong> después
          de que se ha realizado el pago.
        </p>
        <p>
          Si recibiste un producto dañado o incorrecto, consulta nuestra{' '}
          <a href="/devoluciones" className="underline hover:opacity-70" style={{ color: '#8B6F47' }}>
            política de devoluciones
          </a>.
        </p>
      </Section>

      {/* Contacto */}
      <div className="rounded-2xl p-6 mt-4" style={{ background: '#F5EDD8', border: '1.5px solid #D4AF8C' }}>
        <p className="text-sm font-bold mb-2" style={{ color: '#3E2C20' }}>¿Tienes dudas sobre tu envío?</p>
        <p className="text-sm" style={{ color: '#5C3D2E' }}>📞 +52 155 7413 9159</p>
        <p className="text-sm" style={{ color: '#5C3D2E' }}>✉️ begorreyes@gmail.com</p>
        <p className="text-sm" style={{ color: '#5C3D2E' }}>📸 @thereadingbroom en Instagram</p>
      </div>

    </div>
  )
}
