import type { Metadata } from 'next'
import { Archivo, Inter } from 'next/font/google'
import { Providers } from '@/providers'
import './globals.css'

// UI text: navigation, tables, forms and buttons.
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

// Display text: wide, heavy and often italic headings, as in the mockups.
const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['wdth'],
})

export const metadata: Metadata = {
  title: {
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME ?? 'App'}`,
    default: process.env.NEXT_PUBLIC_APP_NAME ?? 'App',
  },
  description: 'Built on garage-boilerplate',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${archivo.variable} h-full antialiased`}>
      <body className="bg-asphalt-950 text-foreground flex min-h-full flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
