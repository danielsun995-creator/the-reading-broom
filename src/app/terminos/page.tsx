export const metadata = {
  title: 'Términos y condiciones — The Reading Broom',
  description: 'Términos y condiciones de uso y compra en la tienda The Reading Broom.',
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

export default function TerminosPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">

      <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#3E2C20', fontFamily: 'Georgia, serif' }}>
        Términos y condiciones
      </h1>
      <p className="text-center text-sm mb-10" style={{ color: '#AAA' }}>
        Última actualización: mayo 2025
      </p>

      <Section title="1. Información general">
        <p>
          Este sitio web es operado por <strong style={{ color: '#3E2C20' }}>Bego Reyes</strong> bajo
          la marca <strong style={{ color: '#3E2C20' }}>The Reading Broom</strong>, con sede en la
          Ciudad de México, México. Al realizar una compra en este sitio, aceptas los presentes
          términos y condiciones en su totalidad.
        </p>
      </Section>

      <Section title="2. Productos">
        <p>
          Todos los productos que se muestran en este sitio están sujetos a disponibilidad. Nos
          reservamos el derecho de limitar las cantidades de cualquier artículo y de descontinuar
          productos sin previo aviso.
        </p>
        <p>
          Las fotografías de los productos son representativas. Pueden existir ligeras variaciones
          en color o presentación respecto a lo mostrado en pantalla, especialmente en kits y
          artículos artesanales.
        </p>
      </Section>

      <Section title="3. Precios y pagos">
        <p>
          Todos los precios están expresados en <strong style={{ color: '#3E2C20' }}>pesos mexicanos (MXN)</strong> e
          incluyen IVA cuando aplica. Los precios pueden cambiar sin previo aviso; el precio vigente
          es el que aparece al momento de realizar tu compra.
        </p>
        <p>
          Los pagos se procesan de forma segura a través de <strong style={{ color: '#3E2C20' }}>Stripe</strong>.
          No almacenamos datos de tarjetas de crédito o débito en ningún momento.
        </p>
      </Section>

      <Section title="4. Envíos">
        <p>
          Las condiciones de envío, tiempos de entrega y costos se describen en nuestra{' '}
          <a href="/envios" className="underline hover:opacity-70" style={{ color: '#8B6F47' }}>
            política de envíos
          </a>. Al completar tu compra, aceptas dichas condiciones.
        </p>
        <p>
          Todos los envíos incluyen seguro por el valor del pedido. El costo del seguro está
          incluido en el precio de envío mostrado al momento de pagar.
        </p>
      </Section>

      <Section title="5. Cancelaciones y devoluciones">
        <p>
          Los pedidos no pueden cancelarse una vez procesado el pago, ya que la preparación
          comienza de inmediato. Si recibiste un producto dañado o incorrecto, consulta nuestra{' '}
          <a href="/devoluciones" className="underline hover:opacity-70" style={{ color: '#8B6F47' }}>
            política de devoluciones
          </a>.
        </p>
      </Section>

      <Section title="6. Uso del sitio">
        <p>
          Este sitio es para uso personal. Queda prohibido usar el contenido, imágenes o textos de
          este sitio con fines comerciales sin autorización previa por escrito.
        </p>
        <p>
          Nos reservamos el derecho de cancelar pedidos que consideremos fraudulentos o que violen
          estos términos, con reembolso total al cliente.
        </p>
      </Section>

      <Section title="7. Privacidad">
        <p>
          Los datos que nos proporcionas (nombre, dirección, correo electrónico y teléfono) se usan
          únicamente para procesar y entregar tu pedido, y para enviarte la confirmación de compra.
          No compartimos tu información con terceros ajenos al proceso de envío.
        </p>
      </Section>

      <Section title="8. Modificaciones">
        <p>
          Nos reservamos el derecho de actualizar estos términos en cualquier momento. La versión
          vigente siempre estará disponible en esta página con la fecha de última actualización.
        </p>
      </Section>

      <Section title="9. Contacto">
        <p>
          Si tienes preguntas sobre estos términos, puedes contactarnos en:
        </p>
        <p className="mt-1">
          ✉️{' '}
          <a href="mailto:begorreyes@gmail.com" className="underline hover:opacity-70" style={{ color: '#8B6F47' }}>
            begorreyes@gmail.com
          </a>
        </p>
        <p>📞 +52 155 7413 9159</p>
      </Section>

    </div>
  )
}
