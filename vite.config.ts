// vite.config.ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }) => ({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // PRODUCTION
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false, // mets true si tu en as besoin
    manifest: true,   // utile si un backend doit lire la map des assets
    rollupOptions: {
      output: {
        // Vite utilise déjà des noms hashés ; ceci est juste explicite
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
      },
    },
  },
  // DEV seulement (pas utilisé en prod)
  server: {
    watch: { usePolling: true },
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: { host: 'localhost', clientPort: 5173 },
    allowedHosts: ['localhost'],
  },
}))
