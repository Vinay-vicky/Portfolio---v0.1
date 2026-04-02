import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

function usePageReveal() {
  const containerRef = useRef(null)

  useGSAP(
    () => {
      const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) return

      const introNodes = gsap.utils.toArray('[data-animate-intro]')
      if (introNodes.length > 0) {
        gsap.fromTo(
          introNodes,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: 'power3.out',
            stagger: 0.1,
          },
        )
      }

      const revealNodes = gsap.utils.toArray('[data-animate-reveal]')
      revealNodes.forEach((node, index) => {
        gsap.fromTo(
          node,
          {
            autoAlpha: 0,
            y: 30,
            scale: 0.985,
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.72,
            delay: Math.min(index * 0.04, 0.24),
            ease: 'power3.out',
            scrollTrigger: {
              trigger: node,
              start: 'top 88%',
              once: true,
            },
          },
        )
      })

      const floatNodes = gsap.utils.toArray('[data-animate-float]')
      floatNodes.forEach((node, index) => {
        gsap.to(node, {
          y: index % 2 === 0 ? -8 : 8,
          duration: 2.8 + index * 0.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      })
    },
    { scope: containerRef },
  )

  return containerRef
}

export default usePageReveal
