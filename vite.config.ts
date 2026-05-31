import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  // 這裡的第三個參數設為 ''，代表載入所有環境變數
  const env = loadEnv(mode, '.', '');
  
  return {
    base: './', 
    plugins: [react(), tailwindcss()],
    define: {
      // ✨ 關鍵修正：強制在 Vite 打包時，把 Vercel 的後台環境變數融進網頁中
      'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});