import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',  //s3에서 상대 경로 읽을 수 있게 
  // server: {
  //   proxy: {
  //     // '/api'로 시작하는 요청을 'http://localhost:8080'으로 전달
  //     '/api': {
  //       target: 'http://localhost:8080', // 이 부분이 localhost로 설정되어 있을 수 있습니다.
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, '') // '/api' 접두사 제거
  //     },
  //     // 또는 특정 경로 전체를 프록시할 수도 있습니다.
  //     // '/admin': 'http://localhost:8080',
  //     // '/auth': 'http://localhost:8080',
  //   }
  // }
});
