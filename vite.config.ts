import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Enables access on both localhost and network IP
    port: 5178, // Ensure this is your required port
    strictPort: true, // Prevents Vite from auto-changing the port
  }
})
