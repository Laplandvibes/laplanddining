import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // CRITICAL: required because we import from ../../shared/. Without this,
  // two React instances ship in the bundle and useContext returns null —
  // production renders a blank deep-night page. See lv_critical_react_dedupe.md.
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router', 'react-router-dom'],
  },
})
