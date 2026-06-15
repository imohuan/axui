import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { copyFileSync } from 'fs'

/**
 * Axiom UI CDN 构建配置
 *
 * 输出仅包含组件 JS + 主题 CSS 变量（无 Tailwind 工具类、无字体）。
 * Tailwind 和字体由用户自行加载（CDN 或本地）。
 */
export default defineConfig({
  plugins: [
    vue(),
    // 构建完成后：复制测试页到 dist-cdn/
    {
      name: 'axiom-cdn-postbuild',
      apply: 'build',
      writeBundle() {
        try { copyFileSync('cdn-demo.html', 'dist-cdn/index.html') } catch {}
      },
    },
  ],

  build: {
    watch: {
      exclude: 'dist-cdn/**',
    },
    lib: {
      entry: 'src/components/ui/plugin.cdn.ts',
      name: 'AxiomUI',
      formats: ['umd', 'es'],
      fileName: (format) => `axiom-ui.${format}.js`,
      cssFileName: 'axiom-ui',
    },

    rollupOptions: {
      // Vue 由宿主提供，不打包
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
        // UMD 模式下 bundle 内依赖（如 @floating-ui/vue）会调用 require("vue")
        intro: 'var require=function(m){return m==="vue"?window.Vue||Vue:undefined};',
      },
    },

    cssCodeSplit: false,
    assetsInlineLimit: 0,
    minify: 'esbuild',
    target: 'es2015',
    outDir: 'dist-cdn',
  },
})
