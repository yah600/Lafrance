import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Suppress chunk size warning (app is feature-rich, 2.5MB is acceptable)
    chunkSizeWarningLimit: 3000, // 3MB limit instead of default 500KB

    // Enable source maps for better debugging in production
    sourcemap: false, // Set to true if you need debugging in production
  },
})
