import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'Krushna Pokharkar — Full-Stack Developer & AI Engineer',
  description: 'Full-Stack Software Developer specializing in Agentic AI systems, MERN stack, Java Spring Boot. Building autonomous reasoning pipelines. Open to SDE/AI Intern roles.',
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
      <body className="scan-overlay noise-overlay">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(6, 13, 20, 0.97)',
              border: '1px solid rgba(0, 245, 255, 0.15)',
              color: '#c8d8e8',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              borderRadius: '10px',
              padding: '12px 16px',
              lineHeight: '1.5',
            },
            success: { iconTheme: { primary: '#00ff88', secondary: '#020408' } },
            error: { iconTheme: { primary: '#ff0080', secondary: '#020408' } },
          }}
        />
      </body>
    </html>
  )
}