import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],

  build: {
    lib: {
      entry: 'src/components/ui/index.ts',
      name: 'AxiomUI',
      formats: ['es', 'umd'],
      fileName: (format) => `axui.${format}.js`,
      cssFileName: 'style',
    },

    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
        intro: 'var require=function(m){return m==="vue"?window.Vue||Vue:undefined};',
      },
    },

    cssCodeSplit: false,
    minify: 'esbuild',
    target: 'es2015',
    outDir: 'dist',
  },
})
