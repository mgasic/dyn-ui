import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@dyn-ui/react': path.resolve(__dirname, '../../packages/dyn-ui-react/src')
    }
  },
  optimizeDeps: {
    exclude: ['@dyn-ui/react']
  }
})
