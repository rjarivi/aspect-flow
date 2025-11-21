import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'gh' ? '/aspect-flow/' : '/',
  build: {
    outDir: mode === 'gh' ? 'docs' : 'dist',
  },
}))
