import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'Krushna Pokharkar — Full-Stack Developer & AI Engineer',
  description:
    'Full-Stack Software Developer specializing in Agentic AI systems, MERN stack, Java Spring Boot. Building autonomous reasoning pipelines. Open to SDE/AI Intern roles.',
  keywords: [
    'Krushna Pokharkar', 'Full Stack Developer', 'AI Engineer',
    'MERN Stack', 'React', 'Next.js', 'Spring Boot', 'Agentic AI',
    'JobCrawler', 'Portfolio', 'Pune', 'AISSMS',
  ],
  authors: [{ name: 'Krushna Pokharkar' }],
  openGraph: {
    title: 'Krushna Pokharkar — Full-Stack Developer & AI Engineer',
    description: 'Building Autonomous AI systems and production-grade full-stack applications.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="scan-overlay">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(6, 13, 20, 0.95)',
              border:     '1px solid rgba(0, 245, 255, 0.15)',
              color:      '#e2e8f0',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize:   '12px',
            },
            success: { iconTheme: { primary: '#00ff88', secondary: '#020408' } },
            error:   { iconTheme: { primary: '#ff0080', secondary: '#020408' } },
          }}
        />
      </body>
    </html>
  )
}