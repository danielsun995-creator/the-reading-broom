import type { Metadata } from 'next'
import './globals.css'
import ClientShell from '@/components/ClientShell'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'The Reading Broom — Kits de lectura hechos con amor',
  description: 'Descubre kits de lectura únicos: libro + vela + complementos para una experiencia mágica. Envíos a toda la República Mexicana.',
  keywords: 'kits de lectura, libros, velas aromaticas, regalo lectora, CDMX',
  openGraph: {
    title: 'The Reading Broom',
    description: 'Kits de lectura hechos con amor',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col" style={{ background: '#F5F1E8' }}>
        <ClientShell />
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
