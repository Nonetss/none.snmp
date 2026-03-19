import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import node from '@astrojs/node'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  prefetch: {
    prefetchAll: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    assets: '_astro-old',
  },
  integrations: [react()],
})
