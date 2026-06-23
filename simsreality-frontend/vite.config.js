import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 백엔드 CORS 허용 오리진(localhost:5173)과 일치시키기 위해 포트를 고정한다.
  server: {
    port: 5173,
    strictPort: true,
  },
})
