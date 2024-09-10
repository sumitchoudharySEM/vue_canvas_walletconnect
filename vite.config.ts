import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@solana/web3.js': '@solana/web3.js/lib/index.browser.esm.js',
    },
  },
  define: {
    'process.env': {},
    global: 'window',
  },
})
