'use client'
import { useEffect, useRef } from 'react'

const CODE_SNIPPETS = [
  'const app = express()',
  'async function fetchData() {',
  'import React from "react"',
  'SELECT * FROM users WHERE active = true',
  'docker-compose up -d',
  'git commit -m "feat: add new feature"',
  'npm install framer-motion',
  'const [state, setState] = useState()',
  'export default function Component()',
  'mongoose.connect(uri, options)',
  'app.use(cors({ origin: "*" }))',
  'router.get("/api/v1/projects")',
  'await bcrypt.hash(password, 12)',
  'jwt.sign(payload, SECRET_KEY)',
  'CREATE TABLE users (id UUID)',
  'kubectl apply -f deployment.yaml',
  'FROM node:22-alpine AS builder',
  'const token = jwt.verify(authToken)',
  'res.json({ success: true, data })',
  'app.listen(PORT, () => {})',
  'require("dotenv").config()',
  'const { data } = await supabase',
  'INSERT INTO projects VALUES',
  'UPDATE skills SET proficiency',
  'DELETE FROM analytics WHERE',
  'SELECT COUNT(*) FROM contacts',
  'const data = await fetch(url)',
  'useEffect(() => { cleanup() }, [])',
  'useState<DataType | null>(null)',
  'motion.div animate={{ opacity: 1 }}',
  'whileInView={{ scale: 1.05 }}',
  'transition={{ duration: 0.8 }}',
  'layoutId={`project-${project.id}`}',
  'const mesh = useRef<THREE.Mesh>()',
  'useFrame((state) => { })',
  '<Canvas camera={{ position: [0, 0, 5] }}>',
  'MeshDistortMaterial color="#00e5ff"',
  'const router = useRouter()',
  'const { id } = useParams()',
  'try { await db.query(sql) } catch',
  'process.env.MONGODB_URI',
  'const PORT = process.env.PORT || 5000',
  'app.use(helmet())',
  'rateLimit({ windowMs: 15 * 60 * 1000 })',
  'nodemailer.createTransport({ host })',
  'await transporter.sendMail(options)',
  'WebSocket.onmessage = (event) => {}',
  'localStorage.setItem("token", jwt)',
  'Promise.allSettled(promises)',
  'async/await with try/catch',
  'Proxy handler get/set trap',
  'WeakMap for private data storage',
  'Array.prototype.map/filter/reduce',
  'JSON.stringify(obj, null, 2)',
  'fetch(url, { method: "POST" })',
  'axios.get("/api", { params })',
  'GraphQL query { user { id } }',
  'Redux Toolkit createSlice',
  'Zustand create((set) => ({}))',
  'Context API useContext(MyContext)',
  'Custom Hook useCustomLogic()',
  'Higher Order Component withHOC',
  'Suspense fallback={<Spinner />}',
  'React.lazy(() => import)',
  'Tree Shaking unused code elimination',
  'Core Web Vitals LCP/FID/CLS',
  'SEO meta tags OpenGraph',
  'Accessibility a11y aria-label',
  'Responsive Design mobile-first',
  'CSS-in-JS Styled Components',
  'Utility-First Tailwind CSS',
  'CSS Modules scoped styles',
  'Animations Framer Motion',
  'Transforms rotate/scale/translate',
  'Filters blur/brightness/contrast',
  'Backdrop Filter blur(10px)',
  'Gradients linear/radial/conic',
  'Shadows box-shadow/drop-shadow',
  'Glassmorphism backdrop-filter blur',
  'Dark Mode prefers-color-scheme',
  'Container Queries @container',
  'Aspect Ratio 16/9 aspect-ratio',
  'Position sticky/fixed/absolute',
  'Display grid/flex/block',
  'Pointer Events none/auto',
  'Will Change transform/opacity',
  'Content Visibility auto',
  'CSS Custom Properties var(--color)',
  'Calc Function calc(100% - 2rem)',
  'Clamp Function clamp(1rem, 5vw, 3rem)',
  'Color Functions rgb/hsl/oklch',
  'Masking mask-image: linear-gradient',
  'Clip Path polygon(50% 0%, 100% 50%)',
  'Font Variation Settings wght@400;700',
  'Letter Spacing -0.02em tight',
  'Scroll Behavior smooth',
  'Scroll Snap Type x mandatory',
  'Scrollbar Color #00e5ff #1a1a1a',
  'Accent Color #00e5ff',
  'Border Radius 0.5rem/1rem/full',
  'Box Shadow 0 4px 6px rgba',
  'Container Type inline-size',
  'Popover API popover=auto',
  'Dialog Element showModal()',
  'Drag and Drop API',
  'Clipboard API navigator.clipboard',
  'File API FileReader',
  'Blob URL URL.createObjectURL',
  'Service Worker Cache',
  'Push Notifications',
  'Background Sync',
  'Web Authentication',
  'Biometric Auth',
  'Device Orientation',
  'Geolocation API',
  'Speech Recognition',
  'Web Audio API',
  'MediaStream API',
  'WebRTC PeerConnection',
  'Canvas 2D Context',
  'WebGL 3D Graphics',
  'WebGPU Next-Gen',
  'WebAssembly WASM',
  'Web Workers Threads',
  'Service Workers',
  'Paint Worklet',
  'Resize Observer',
  'Intersection Observer',
  'Mutation Observer',
  'Performance Observer',
  'Request Idle Callback',
  'Scheduler API',
  'Dynamic Import',
  'Import Maps',
  'Module Preload',
  'ES Modules',
  'Bundle Size < 100kb',
  'Code Splitting Routes',
  'Tree Shaking Dead Code',
  'Memoization Cache',
  'Debouncing Input',
  'Throttling Scroll',
  'Request Animation Frame',
  'Largest Contentful Paint',
  'First Input Delay',
  'Cumulative Layout Shift',
  'Time to First Byte',
  'First Contentful Paint',
  'Lighthouse Score 100',
  'React DevTools',
  'Redux DevTools',
  'Network Throttling',
  'Memory Profiling',
  'Heap Snapshots',
  'Layout Shift Regions',
  'GPU Acceleration',
  'Virtual Scrolling',
  'Infinite Scroll',
  'Pagination Cursor',
  'Lazy Hydration',
  'Concurrent Rendering',
  'Time Slicing',
  'Suspense List',
  'Server Actions',
  'Edge Functions',
  'Middleware Next',
  'JWT Tokens',
  'Refresh Tokens',
  'OAuth 2.0 Flow',
  'OpenID Connect',
  'Multi Factor Auth',
  'Passkeys Passwordless',
  'Magic Links',
  'Rate Limiting',
  'DDoS Protection',
  'SSL/TLS HTTPS',
  'CSP Content Security',
  'XSS Protection',
  'CSRF Tokens',
  'CORS Configuration',
  'Helmet JS Security',
  'Validation Joi/Yup',
  'TypeScript Strict',
  'ESLint Rules',
  'Prettier Format',
  'Husky Git Hooks',
  'Semantic Release',
  'GitHub Actions',
  'CI/CD Pipeline',
  'Docker Container',
  'Kubernetes Deploy',
  'Terraform IaC',
  'AWS Infrastructure',
  'GCP Cloud Run',
  'Vercel Platform',
  'Netlify Edge',
  'Railway App',
  'Render Service',
  'Fly IO Edge',
  'Deno Deploy',
  'Bun Runtime',
  'Node LTS',
  'PM2 Process Manager',
  'Nginx Reverse Proxy',
  'Redis Cache Cluster',
  'Elasticsearch Search',
  'MongoDB Atlas',
  'PostgreSQL Supabase',
  'DynamoDB NoSQL',
  'Firestore Realtime',
  'Prometheus Metrics',
  'Grafana Dashboards',
  'Datadog APM',
  'Sentry Error Tracking',
  'LogRocket Session Replay',
  'Google Analytics 4',
  'Plausible Privacy',
  'GitHub Copilot AI',
  'Tabnine Code Completion',
  'LangChain Framework',
  'LlamaIndex RAG',
  'Rasa Conversational AI',
  'Stable Diffusion Images',
  'Midjourney AI Art',
  'DALL-E OpenAI',
  'ElevenLabs Voice',
  'Claude Anthropic',
  'GPT-4 OpenAI',
  'VS Code Insiders',
  'Neovim Modern Vim',
  'CodeSandbox Cloud IDE',
  'StackBlitz WebContainers',
  'Replit Browser IDE',
  'GitHub Codespaces',
  'Next.js React Framework',
  'Nuxt.js Vue Framework',
  'SvelteKit Svelte',
  'Astro Islands',
  'Remix React Router',
  'Supabase Backend',
  'Firebase Google',
  'Prisma ORM',
  'Drizzle ORM TypeScript',
  'NestJS Framework',
  'Fastify Node.js',
  'Socket.io WebSocket',
  'Supabase Realtime',
  'Liveblocks Collaboration',
  'Clerk Authentication',
  'Auth0 Identity',
  'Stripe Payments',
  'PayPal Checkout',
  'Lemon Squeezy',
  'OpenSea NFT Marketplace',
  'Unity Game Engine',
  'Unreal Engine 5',
  'Three.js WebGL',
  'Babylon.js 3D',
  'A-Frame VR',
  'WebXR VR/AR',
  'Blender 3D Modeling',
  'Ray Tracing RTX',
  'DLSS Deep Learning',
  'Vulkan Khronos',
  'WebGPU Next-Gen',
  'Apple Vision Pro',
  'Meta Quest 3',
  'Ultraleap Hand Tracking',
  'Neuralink Brain',
]

// VS Code inspired colors - using RGB for easy alpha manipulation
const SYNTAX_COLORS = [
  { r: 0, g: 229, b: 255 },    // Cyan
  { r: 138, g: 43, b: 226 },   // Purple
  { r: 255, g: 107, b: 157 },  // Pink
  { r: 255, g: 217, b: 61 },   // Yellow
  { r: 107, g: 207, b: 127 },  // Green
  { r: 79, g: 195, b: 247 },   // Light Blue
  { r: 255, g: 138, b: 101 },  // Orange
  { r: 77, g: 182, b: 172 },   // Teal
]

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: { r: number; g: number; b: number }
  alpha: number
  pulsePhase: number
}

interface CodeLine {
  text: string
  x: number
  y: number
  speed: number
  color: { r: number; g: number; b: number }
  alpha: number
  fontSize: number
  glowIntensity: number
}

interface GradientOrb {
  x: number
  y: number
  radius: number
  color: string
  vx: number
  vy: number
  pulseSpeed: number
  pulsePhase: number
}

// Helper to convert RGB + alpha to rgba string
const rgba = (c: { r: number; g: number; b: number }, a: number) => 
  `rgba(${c.r}, ${c.g}, ${c.b}, ${Math.max(0, Math.min(1, a))})`

export default function CodeBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const codeLinesRef = useRef<CodeLine[]>([])
  const orbsRef = useRef<GradientOrb[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
      initCodeLines()
      initOrbs()
    }

    const initParticles = () => {
      particlesRef.current = []
      const particleCount = Math.floor((canvas.width * canvas.height) / 25000)
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          color: SYNTAX_COLORS[Math.floor(Math.random() * SYNTAX_COLORS.length)],
          alpha: Math.random() * 0.6 + 0.2,
          pulsePhase: Math.random() * Math.PI * 2,
        })
      }
    }

    const initCodeLines = () => {
      codeLinesRef.current = []
      const lineCount = Math.floor(canvas.width / 80)
      
      for (let i = 0; i < lineCount; i++) {
        codeLinesRef.current.push(createCodeLine(true))
      }
    }

    const initOrbs = () => {
      orbsRef.current = []
      const colors = [
        'rgba(0, 229, 255, 0.15)',
        'rgba(138, 43, 226, 0.15)',
        'rgba(255, 107, 157, 0.15)',
        'rgba(255, 217, 61, 0.1)',
        'rgba(107, 207, 127, 0.1)',
      ]
      
      for (let i = 0; i < 5; i++) {
        orbsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 300 + 200,
          color: colors[i],
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          pulseSpeed: Math.random() * 0.002 + 0.001,
          pulsePhase: Math.random() * Math.PI * 2,
        })
      }
    }

    const createCodeLine = (randomY = false): CodeLine => {
      return {
        text: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
        x: Math.random() * canvas.width,
        y: randomY ? -Math.random() * canvas.height : -50 - Math.random() * 100,
        speed: Math.random() * 1 + 0.5,
        color: SYNTAX_COLORS[Math.floor(Math.random() * SYNTAX_COLORS.length)],
        alpha: Math.random() * 0.2 + 0.05,
        fontSize: Math.random() * 5 + 11,
        glowIntensity: Math.random() * 10 + 5,
      }
    }

    const drawGradientBackground = () => {
      if (!ctx) return
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, '#050505')
      gradient.addColorStop(0.5, '#0a0a0f')
      gradient.addColorStop(1, '#050505')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const drawOrbs = () => {
      if (!ctx) return
      
      orbsRef.current.forEach(orb => {
        orb.x += orb.vx
        orb.y += orb.vy
        orb.pulsePhase += orb.pulseSpeed

        if (orb.x < -orb.radius) orb.x = canvas.width + orb.radius
        if (orb.x > canvas.width + orb.radius) orb.x = -orb.radius
        if (orb.y < -orb.radius) orb.y = canvas.height + orb.radius
        if (orb.y > canvas.height + orb.radius) orb.y = -orb.radius

        const pulse = Math.sin(orb.pulsePhase) * 0.3 + 1
        const currentRadius = orb.radius * pulse

        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, currentRadius
        )
        gradient.addColorStop(0, orb.color)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(orb.x, orb.y, currentRadius, 0, Math.PI * 2)
        ctx.fill()

        const dx = mouseRef.current.x - orb.x
        const dy = mouseRef.current.y - orb.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 300) {
          const force = (300 - distance) / 300
          orb.vx -= (dx / distance) * force * 0.02
          orb.vy -= (dy / distance) * force * 0.02
          orb.vx *= 0.98
          orb.vy *= 0.98
        }
      })
    }

    const drawGrid = () => {
      if (!ctx) return
      
      const gridSize = 60
      const time = Date.now() * 0.0001
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)'
      ctx.lineWidth = 1

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        for (let y = 0; y < canvas.height; y += 20) {
          const wave = Math.sin(y * 0.01 + time + x * 0.005) * 5
          const drawY = y + wave
          if (y === 0) ctx.moveTo(x, drawY)
          else ctx.lineTo(x, drawY)
        }
        ctx.stroke()
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        for (let x = 0; x < canvas.width; x += 20) {
          const wave = Math.sin(x * 0.01 + time + y * 0.005) * 5
          const drawX = x + wave
          if (x === 0) ctx.moveTo(drawX, y)
          else ctx.lineTo(drawX, y)
        }
        ctx.stroke()
      }

      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const dx = mouseRef.current.x - x
          const dy = mouseRef.current.y - y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const glow = Math.max(0, 1 - distance / 250)
          
          if (glow > 0.01) {
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30)
            gradient.addColorStop(0, `rgba(0, 229, 255, ${glow * 0.5})`)
            gradient.addColorStop(1, 'rgba(0, 229, 255, 0)')
            
            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.arc(x, y, 30, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
    }

    const drawParticles = () => {
      if (!ctx) return
      
      particlesRef.current.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.pulsePhase += 0.02

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        const dx = mouseRef.current.x - p.x
        const dy = mouseRef.current.y - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const glow = Math.max(0, 1 - distance / 200)
        
        const pulse = Math.sin(p.pulsePhase) * 0.5 + 1
        const currentSize = p.size * pulse

        // FIXED: Use rgba() helper instead of hex concatenation
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, currentSize * 4
        )
        gradient.addColorStop(0, rgba(p.color, p.alpha + glow * 0.5))
        gradient.addColorStop(1, rgba(p.color, 0))
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, currentSize * 4, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = rgba(p.color, p.alpha + glow * 0.5)
        ctx.beginPath()
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2)
        ctx.fill()
      })

      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 120) {
            const alpha = (1 - distance / 120) * 0.2
            ctx.strokeStyle = rgba({ r: 0, g: 229, b: 255 }, alpha)
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        })
      })
    }

    const drawCode = () => {
      if (!ctx) return
      
      codeLinesRef.current.forEach(line => {
        line.y += line.speed
        line.glowIntensity += 0.05

        if (line.y > canvas.height + 50) {
          Object.assign(line, createCodeLine())
        }

        ctx.font = `${line.fontSize}px 'Courier New', monospace`
        ctx.fillStyle = rgba(line.color, line.alpha)

        for (let i = 3; i > 0; i--) {
          ctx.shadowColor = rgba(line.color, 0.8)
          ctx.shadowBlur = line.glowIntensity * i * 0.3
          ctx.fillText(line.text, line.x, line.y)
        }
        
        ctx.shadowBlur = 0
      })
    }

    const drawScanlines = () => {
      if (!ctx) return
      ctx.fillStyle = 'rgba(0, 0, 0, 0.03)'
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.fillRect(0, y, canvas.width, 2)
      }
    }

    const animate = () => {
      if (!ctx) return
      
      ctx.fillStyle = 'rgba(5, 5, 5, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      drawGradientBackground()
      drawOrbs()
      drawGrid()
      drawParticles()
      drawCode()
      drawScanlines()

      animationRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    resize()
    animate()

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ mixBlendMode: 'screen', opacity: 0.8 }}
    />
  )
}