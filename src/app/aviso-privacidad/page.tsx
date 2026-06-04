export default function AvisoPrivacidadPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2" style={{ color: '#5C3D2E', fontFamily: 'Georgia, serif' }}>
        Aviso de Privacidad
      </h1>
      <p className="text-sm mb-8" style={{ color: '#999' }}>Última actualización: mayo 2025</p>

      <div className="space-y-6 text-sm leading-relaxed" style={{ color: '#4A3728' }}>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: '#5C3D2E' }}>1. Identidad y domicilio del Responsable</h2>
          <p>
            <strong>The Reading Broom</strong>, con domicilio en Constituyente Jesús Romero Flores 40,
            colonia El Molino, C.P. 05240, Ciudad de México, y correo electrónico{' '}
            <a href="mailto:begorreyes@gmail.com" style={{ color: '#8B6F47' }}>begorreyes@gmail.com</a>,
            es responsable del tratamiento de sus datos personales, de conformidad con lo establecido
            en la Ley Federal de Protección de Datos Personales en Posesión de Particulares (LFPDPPP)
            y su Reglamento.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: '#5C3D2E' }}>2. Datos personales que recabamos</h2>
          <p>Para llevar a cabo las finalidades descritas en el presente aviso, recabamos los siguientes datos personales:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Nombre completo</li>
            <li>Correo electrónico</li>
            <li>Número de teléfono</li>
            <li>Dirección de envío (calle, colonia, ciudad, estado, código postal)</li>
            <li>Información de pago (procesada directamente por Stripe; The Reading Broom no almacena datos de tarjetas)</li>
          </ul>
          <p className="mt-2">No recabamos datos personales sensibles.</p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: '#5C3D2E' }}>3. Finalidades del tratamiento</h2>
          <p><strong>Finalidades primarias (necesarias para la relación contractual):</strong></p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Procesar y gestionar sus pedidos</li>
            <li>Coordinar el envío de sus productos a través de paquetería</li>
            <li>Enviarle confirmación de compra y actualizaciones de su pedido</li>
            <li>Atender aclaraciones, devoluciones o cancelaciones</li>
          </ul>
          <p className="mt-3"><strong>Finalidades secundarias (puede oponerse a estas):</strong></p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Enviarle información sobre nuevos productos, promociones y actividades del Club de Lectura</li>
            <li>Realizar encuestas de satisfacción</li>
          </ul>
          <p className="mt-2">
            Si no desea que sus datos sean tratados para las finalidades secundarias, envíe un correo a{' '}
            <a href="mailto:begorreyes@gmail.com" style={{ color: '#8B6F47' }}>begorreyes@gmail.com</a>{' '}
            indicando su oposición.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: '#5C3D2E' }}>4. Transferencia de datos a terceros</h2>
          <p>Sus datos personales podrán ser compartidos con las siguientes empresas para cumplir con las finalidades primarias:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Stripe Inc.</strong> — procesamiento de pagos</li>
            <li><strong>Skydropx</strong> — generación de guías y coordinación de envíos</li>
            <li><strong>Resend</strong> — envío de correos transaccionales (confirmaciones de pedido)</li>
          </ul>
          <p className="mt-2">
            Estas transferencias son necesarias para la prestación del servicio. Dichos terceros están
            sujetos a sus propias políticas de privacidad y actúan como encargados del tratamiento.
            No realizamos transferencias de datos con fines comerciales a terceros no relacionados con su pedido.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: '#5C3D2E' }}>5. Derechos ARCO</h2>
          <p>
            Usted tiene derecho a <strong>Acceder, Rectificar, Cancelar u Oponerse</strong> al
            tratamiento de sus datos personales (derechos ARCO). Para ejercerlos, envíe una solicitud a{' '}
            <a href="mailto:begorreyes@gmail.com" style={{ color: '#8B6F47' }}>begorreyes@gmail.com</a>{' '}
            indicando:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Nombre completo y correo con el que realizó su compra</li>
            <li>Derecho que desea ejercer</li>
            <li>Descripción clara de los datos sobre los que ejerce su derecho</li>
          </ul>
          <p className="mt-2">
            Responderemos en un plazo máximo de 20 días hábiles a partir de la recepción de su solicitud.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: '#5C3D2E' }}>6. Uso de cookies y tecnologías de rastreo</h2>
          <p>
            Nuestro sitio web utiliza cookies estrictamente necesarias para el funcionamiento de la
            sesión y el carrito de compras. No utilizamos cookies de rastreo publicitario ni compartimos
            datos de navegación con terceros para fines de marketing.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: '#5C3D2E' }}>7. Cambios al Aviso de Privacidad</h2>
          <p>
            The Reading Broom se reserva el derecho de modificar el presente Aviso de Privacidad en
            cualquier momento. Cualquier cambio será publicado en esta página con la fecha de
            actualización correspondiente. Le recomendamos revisarlo periódicamente.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: '#5C3D2E' }}>8. Contacto</h2>
          <p>Para cualquier duda relacionada con el tratamiento de sus datos personales:</p>
          <div className="mt-2 space-y-1">
            <p>📧 <a href="mailto:begorreyes@gmail.com" style={{ color: '#8B6F47' }}>begorreyes@gmail.com</a></p>
            <p>📞 +52 155 7413 9159</p>
            <p>📸 <a href="https://instagram.com/thereadingbroom" target="_blank" rel="noopener noreferrer" style={{ color: '#8B6F47' }}>@thereadingbroom</a></p>
          </div>
        </section>

      </div>
    </div>
  )
}
