import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { tsconfigPaths: true },
  server: {
    host: true,
    port: 5173,
    proxy: { '/graphql': 'http://localhost:4000', '/uploads': 'http://localhost:4000' },
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
})
