'use client'
import { usePathname } from 'next/navigation'
import CustomCursor from './CustomCursor'
import CodeBackground from './CodeBackground'
import JetonTransition from './JetonTransition'

export default function ClientEffects({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      {/* Keep the developer vibe! */}
      <CodeBackground />
      <CustomCursor />
      <JetonTransition>
        <main className="relative z-10">{children}</main>
      </JetonTransition>
    </>
  )
}