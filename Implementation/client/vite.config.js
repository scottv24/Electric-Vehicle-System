import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/hwcharging',
  preview: {
    port: 8287,
    strictPort: true,
   },
   server: {
    port: 8287,
    strictPort: true,
    host: true,
   },
})