import { useEffect, useRef } from 'react'

const sceneAllowed = () => {
  if (typeof window === 'undefined') return false

  const reduceMotion = Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  const lowMemory = typeof navigator !== 'undefined' && typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 2

  return !(reduceMotion || lowMemory)
}

function WhsHeroScene({ className = '' }) {
  const mountRef = useRef(null)

  useEffect(() => {
    if (!mountRef.current || !sceneAllowed()) return undefined

    let disposed = false
    let idleHandle = null
    let rafId = 0
    let app = null
    let renderingModule = null
    let controlsModule = null

    const cleanup = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId)
      }

      try {
        controlsModule?.controls?.dispose?.()
      } catch (error) {
        console.warn('WhsHeroScene controls cleanup failed.', error)
      }

      try {
        renderingModule?.dispose?.()
      } catch (error) {
        console.warn('WhsHeroScene renderer cleanup failed.', error)
      }

      try {
        app?.stop?.()
      } catch (error) {
        console.warn('WhsHeroScene app stop failed.', error)
      }

      if (mountRef.current) {
        mountRef.current.innerHTML = ''
      }
    }

    const initScene = async () => {
      try {
        const [whsModule, threeModule] = await Promise.all([
          import('whs'),
          import('three'),
        ])

        if (disposed || !mountRef.current) return

        const WHS = whsModule.default ?? whsModule
        const THREE = threeModule.default ?? threeModule

        controlsModule = new WHS.OrbitControlsModule()
        renderingModule = new WHS.RenderingModule({
          bgColor: 0x020617,
          bgOpacity: 0,
          renderer: {
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
          },
        })

        app = new WHS.App([
          new WHS.ElementModule(mountRef.current),
          new WHS.SceneModule(),
          new WHS.DefineModule(
            'camera',
            new WHS.PerspectiveCamera({
              position: new THREE.Vector3(0, 0, 18),
              fov: 42,
              near: 0.1,
              far: 120,
            }),
          ),
          renderingModule,
          controlsModule,
          new WHS.ResizeModule(),
        ])

        controlsModule.controls.autoRotate = true
        controlsModule.controls.autoRotateSpeed = 0.55
        controlsModule.controls.enableZoom = false
        controlsModule.controls.enablePan = false

        const ambientLight = new WHS.AmbientLight({
          color: 0xffffff,
          intensity: 0.58,
        })

        const keyLight = new WHS.DirectionalLight({
          color: 0x8b5cf6,
          intensity: 1.05,
          position: {
            x: 12,
            y: 10,
            z: 16,
          },
        })

        const rimLight = new WHS.PointLight({
          color: 0x22d3ee,
          intensity: 1.1,
          distance: 60,
          position: [
            -10,
            -2,
            14,
          ],
        })

        const coreSphere = new WHS.Sphere({
          geometry: {
            radius: 2.7,
            widthSegments: 32,
            heightSegments: 32,
          },
          material: new THREE.MeshPhongMaterial({
            color: 0x93c5fd,
            emissive: 0x1d4ed8,
            shininess: 90,
          }),
          position: {
            x: 0,
            y: 0,
            z: 0,
          },
          shadow: {
            cast: false,
            receive: false,
          },
        })

        const orbitRing = new WHS.Torus({
          geometry: {
            radius: 5.35,
            tube: 0.55,
          },
          material: new THREE.MeshPhongMaterial({
            color: 0x67e8f9,
            emissive: 0x0f172a,
            shininess: 110,
            transparent: true,
            opacity: 0.74,
          }),
          position: {
            x: 0,
            y: 0,
            z: 0,
          },
          rotation: {
            x: Math.PI / 2.35,
            y: 0.28,
            z: 0,
          },
          shadow: {
            cast: false,
            receive: false,
          },
        })

        const crystal = new WHS.Dodecahedron({
          geometry: {
            radius: 1.55,
          },
          material: new THREE.MeshPhongMaterial({
            color: 0xf5f3ff,
            emissive: 0x8b5cf6,
            flatShading: true,
            shininess: 60,
          }),
          position: {
            x: 6.1,
            y: 2.2,
            z: -1.4,
          },
          shadow: {
            cast: false,
            receive: false,
          },
        })

        await Promise.all([
          ambientLight.addTo(app),
          keyLight.addTo(app),
          rimLight.addTo(app),
          coreSphere.addTo(app),
          orbitRing.addTo(app),
          crystal.addTo(app),
        ])

        if (disposed) return

        app.start()

        const animate = (time) => {
          if (disposed) return

          const t = time * 0.001

          if (coreSphere.native) {
            coreSphere.native.rotation.x = t * 0.5
            coreSphere.native.rotation.y = t * 0.88
            coreSphere.native.position.y = Math.sin(t * 1.25) * 0.34
          }

          if (orbitRing.native) {
            orbitRing.native.rotation.x = Math.PI / 2.35 + Math.sin(t * 0.85) * 0.15
            orbitRing.native.rotation.z = t * 0.52
            orbitRing.native.position.y = Math.cos(t * 1.05) * 0.2
          }

          if (crystal.native) {
            crystal.native.rotation.x = t * 0.72
            crystal.native.rotation.y = t * 1.14
            crystal.native.position.y = 2.2 + Math.sin(t * 1.55) * 0.28
          }

          rafId = window.requestAnimationFrame(animate)
        }

        rafId = window.requestAnimationFrame(animate)
      } catch (error) {
        if (!disposed) {
          console.warn('WhsHeroScene could not initialize WhitestormJS.', error)
        }
      }
    }

    if ('requestIdleCallback' in window) {
      idleHandle = window.requestIdleCallback(() => {
        void initScene()
      }, { timeout: 1200 })
    } else {
      idleHandle = window.setTimeout(() => {
        void initScene()
      }, 80)
    }

    return () => {
      disposed = true

      if (idleHandle !== null) {
        if ('cancelIdleCallback' in window) {
          window.cancelIdleCallback(idleHandle)
        } else {
          window.clearTimeout(idleHandle)
        }
      }

      cleanup()
    }
  }, [])

  return (
    <div className={`pointer-events-none ${className}`} aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.28)_0%,rgba(59,130,246,0)_32%),radial-gradient(circle_at_80%_12%,rgba(34,211,238,0.24)_0%,rgba(34,211,238,0)_26%),linear-gradient(180deg,rgba(15,23,42,0.96)_0%,rgba(15,23,42,0.9)_48%,rgba(15,23,42,0.82)_100%)]" />
      <div className="mesh-overlay absolute inset-0 opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_110%,rgba(139,92,246,0.24)_0%,rgba(139,92,246,0)_46%)]" />
      <div ref={mountRef} className="absolute inset-0" />
    </div>
  )
}

export default WhsHeroScene