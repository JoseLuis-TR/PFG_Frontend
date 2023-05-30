import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  define:{
    'process.env': {
      VITE_ENV_FILE: JSON.stringify(process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.local')
    }
  }
})
