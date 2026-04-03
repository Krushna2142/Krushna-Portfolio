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

    const palette = [
      new THREE.Color('#00f5ff'),
      new THREE.Color('#bf00ff'),
      new THREE.Color('#ff0080'),
      new THREE.Color('#00ff88'),
    ]

    // ── 1. Main particle field ───────────────────────────────
    const COUNT     = 2200
    const positions = new Float32Array(COUNT * 3)
    const colors    = new Float32Array(COUNT * 3)
    const sizes     = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3
      positions[i3]     = (Math.random() - 0.5) * 150
      positions[i3 + 1] = (Math.random() - 0.5) * 150
      positions[i3 + 2] = (Math.random() - 0.5) * 100
      const c = palette[Math.floor(Math.random() * palette.length)]
      colors[i3] = c.r; colors[i3+1] = c.g; colors[i3+2] = c.b
      sizes[i] = Math.random() * 1.5 + 0.3
    }

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3))
    const particles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({ size: 0.13, vertexColors: true, transparent: true, opacity: 0.6, sizeAttenuation: true })
    )
    scene.add(particles)

    // ── 2. Constellation lines ───────────────────────────────
    const constellationPoints: THREE.Vector3[] = []
    for (let i = 0; i < 60; i++) {
      constellationPoints.push(new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 40
      ))
    }

    const linePositions: number[] = []
    for (let i = 0; i < constellationPoints.length; i++) {
      for (let j = i + 1; j < constellationPoints.length; j++) {
        const dist = constellationPoints[i].distanceTo(constellationPoints[j])
        if (dist < 18) {
          linePositions.push(
            constellationPoints[i].x, constellationPoints[i].y, constellationPoints[i].z,
            constellationPoints[j].x, constellationPoints[j].y, constellationPoints[j].z
          )
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3))
    const lines = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({ color: '#00f5ff', transparent: true, opacity: 0.05 })
    )
    scene.add(lines)

    // Constellation node dots
    const nodeGeo = new THREE.BufferGeometry()
    const nodePos = new Float32Array(constellationPoints.length * 3)
    constellationPoints.forEach((p, i) => {
      nodePos[i*3] = p.x; nodePos[i*3+1] = p.y; nodePos[i*3+2] = p.z
    })
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3))
    const nodes = new THREE.Points(
      nodeGeo,
      new THREE.PointsMaterial({ color: '#00f5ff', size: 0.25, transparent: true, opacity: 0.4 })
    )
    scene.add(nodes)

    // ── 3. Wireframe shapes ──────────────────────────────────
    const shapeDefs = [
      { geo: new THREE.OctahedronGeometry(3, 0),    color: '#00f5ff', pos: [-22,  10, -15] as const, rotSpeed: [0.003, 0.005] as const },
      { geo: new THREE.TetrahedronGeometry(2.2, 0), color: '#bf00ff', pos: [ 24,  -8, -20] as const, rotSpeed: [0.004, 0.003] as const },
      { geo: new THREE.IcosahedronGeometry(1.8, 0), color: '#ff0080', pos: [ -6, -18,  -8] as const, rotSpeed: [0.005, 0.004] as const },
      { geo: new THREE.OctahedronGeometry(2.5, 0),  color: '#00ff88', pos: [ 18,  16, -12] as const, rotSpeed: [0.003, 0.006] as const },
      { geo: new THREE.TorusGeometry(3, 0.05, 4, 32), color: '#00f5ff', pos: [0, 0, -20] as const, rotSpeed: [0.002, 0.003] as const },
      { geo: new THREE.IcosahedronGeometry(1.2, 0), color: '#bf00ff', pos: [-30, -10, -25] as const, rotSpeed: [0.006, 0.004] as const },
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

    // ── 4. Floating rings ────────────────────────────────────
    const ringColors = ['#00f5ff', '#bf00ff', '#ff0080']
    const rings: THREE.Mesh[] = []
    ringColors.forEach((color, i) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(6 + i * 4, 0.03, 6, 64),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.07 + i * 0.02 })
      )
      ring.position.set(i % 2 === 0 ? -15 : 15, i * 6 - 8, -30)
      ring.rotation.x = Math.PI / 3 + i * 0.5
      scene.add(ring)
      rings.push(ring)
    })

    // ── 5. Data stream — vertical lines ──────────────────────
    const streamCount = 12
    const streamLines: THREE.Line[] = []
    for (let i = 0; i < streamCount; i++) {
      const x = (Math.random() - 0.5) * 100
      const z = -20 - Math.random() * 30
      const len = 8 + Math.random() * 12
      const sGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, -len/2, z),
        new THREE.Vector3(x,  len/2, z),
      ])
      const col = palette[Math.floor(Math.random() * palette.length)]
      const sLine = new THREE.Line(
        sGeo,
        new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.06 })
      )
      scene.add(sLine)
      streamLines.push(sLine)
    }

    // ── 6. Grid plane ────────────────────────────────────────
    const gridHelper = new THREE.GridHelper(200, 40, 0x001122, 0x001122)
    gridHelper.position.y = -30
    gridHelper.material = new THREE.LineBasicMaterial({ color: 0x002244, transparent: true, opacity: 0.3 })
    scene.add(gridHelper)

    // ── Mouse parallax ───────────────────────────────────────
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

    // ── Animate ──────────────────────────────────────────────
    let raf: number
    const timer = new THREE.Timer()
    let streamOffsets = streamLines.map(() => Math.random() * Math.PI * 2)

    const animate = () => {
      raf = requestAnimationFrame(animate)
      const t = timer.getElapsed()

      particles.rotation.y = t * 0.01
      particles.rotation.x = t * 0.006
      lines.rotation.y = t * 0.008
      nodes.rotation.y = t * 0.008

      camera.position.x += (mouse.x * 3 - camera.position.x) * 0.022
      camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.022
      camera.lookAt(scene.position)

      shapes.forEach((s, i) => {
        const def = shapeDefs[i]
        s.rotation.x = t * def.rotSpeed[0] * 60
        s.rotation.y = t * def.rotSpeed[1] * 60
      })

      rings.forEach((r, i) => {
        r.rotation.z = t * 0.15 * (i % 2 === 0 ? 1 : -1)
        r.rotation.x = Math.PI / 3 + Math.sin(t * 0.3 + i) * 0.2
      })

      streamLines.forEach((sl, i) => {
        const offset = streamOffsets[i]
        const y = Math.sin(t * 0.5 + offset) * 20
        sl.position.y = y
        ;(sl.material as THREE.LineBasicMaterial).opacity = 0.03 + Math.abs(Math.sin(t * 0.3 + offset)) * 0.08
      })

      gridHelper.position.y = -30 + Math.sin(t * 0.2) * 2

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