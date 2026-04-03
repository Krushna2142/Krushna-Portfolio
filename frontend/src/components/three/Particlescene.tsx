'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ParticleScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return
    const mount = mountRef.current

    const scene    = new THREE.Scene()
    const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)
    camera.position.z = 30

    // ── Particles ──────────────────────────────────────────────
    const COUNT     = 1800
    const positions = new Float32Array(COUNT * 3)
    const colors    = new Float32Array(COUNT * 3)
    const palette   = [
      new THREE.Color('#00f5ff'),
      new THREE.Color('#bf00ff'),
      new THREE.Color('#ff0080'),
      new THREE.Color('#00ff88'),
    ]

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3
      positions[i3]     = (Math.random() - 0.5) * 130
      positions[i3 + 1] = (Math.random() - 0.5) * 130
      positions[i3 + 2] = (Math.random() - 0.5) * 80
      const c = palette[Math.floor(Math.random() * palette.length)]
      colors[i3] = c.r; colors[i3+1] = c.g; colors[i3+2] = c.b
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3))

    const mat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true,
    })

    const particles = new THREE.Points(geo, mat)
    scene.add(particles)

    // ── Wireframe shapes ───────────────────────────────────────
    const shapeDefs = [
      { geo: new THREE.OctahedronGeometry(2, 0),    color: '#00f5ff', pos: [-22,  10, -12] as const },
      { geo: new THREE.TetrahedronGeometry(1.5, 0), color: '#bf00ff', pos: [ 24,  -8, -18] as const },
      { geo: new THREE.IcosahedronGeometry(1.2, 0), color: '#ff0080', pos: [ -6, -16,  -6] as const },
      { geo: new THREE.OctahedronGeometry(1.8, 0),  color: '#00ff88', pos: [ 18,  14, -10] as const },
    ]

    const shapes: THREE.Mesh[] = []
    shapeDefs.forEach(({ geo, color, pos }) => {
      const mesh = new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.12 })
      )
      mesh.position.set(pos[0], pos[1], pos[2])
      scene.add(mesh)
      shapes.push(mesh)
    })

    // ── Mouse parallax ─────────────────────────────────────────
    const mouse = { x: 0, y: 0 }
    const onMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse)

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    // ── Animate ────────────────────────────────────────────────
    let raf: number
    const clock = new THREE.Clock()

    const animate = () => {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      particles.rotation.y = t * 0.012
      particles.rotation.x = t * 0.008

      camera.position.x += (mouse.x * 2.5 - camera.position.x) * 0.025
      camera.position.y += (-mouse.y * 1.8 - camera.position.y) * 0.025
      camera.lookAt(scene.position)

      shapes.forEach((s, i) => {
        s.rotation.x = t * (0.2 + i * 0.07)
        s.rotation.y = t * (0.15 + i * 0.05)
      })

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />
}