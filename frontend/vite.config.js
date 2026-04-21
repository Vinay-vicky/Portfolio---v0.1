import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1300,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined

          if (
            id.includes('react-router-dom') ||
            id.includes('react-redux') ||
            id.includes('@reduxjs/toolkit') ||
            id.includes('react-dom') ||
            /[\\/]react[\\/]/.test(id)
          ) {
            return 'vendor-react'
          }

          if (id.includes('gsap')) {
            return 'vendor-animations'
          }

          if (id.includes('whs') || id.includes('three')) {
            return 'vendor-3d'
          }

          if (id.includes('lucide-react') || id.includes('react-icons')) {
            return 'vendor-icons'
          }

          if (id.includes('axios') || id.includes('clsx') || id.includes('tailwind-merge')) {
            return 'vendor-utils'
          }

          return 'vendor-misc'
        },
      },
    },
  },
})
