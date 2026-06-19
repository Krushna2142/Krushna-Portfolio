import './globals.css'
import { Inter, Space_Grotesk } from 'next/font/google'
import ClientEffects from '@/components/efffects/ClientEffects'
import SmoothScroll from '@/components/layout/SmoothScroll'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' })

export const metadata = {
  title: 'Krushna Pokharkar | Full-Stack & AI Engineer',
  description: 'Building high-performance web applications and intelligent AI systems.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <SmoothScroll>
          <ClientEffects>{children}</ClientEffects>
        </SmoothScroll>
      </body>
    </html>
  )
}