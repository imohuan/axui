import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync } from 'fs'

/**
 * 自定义插件：将 CSS 注入到 JS 中，输出单个 JS 文件。
 * CDN 场景下用户只需加载一个 <script> 标签即可。
 */
function cssInjectPlugin(): Plugin {
  return {
    name: 'axiom-css-inject',
    enforce: 'post',
    generateBundle(_, bundle) {
      const cssFiles = Object.keys(bundle).filter(k => k.endsWith('.css') && !k.endsWith('.map'))

      // 合并所有 CSS
      let css = ''
      for (const file of cssFiles) {
        const chunk = bundle[file]
        if (chunk && chunk.type === 'asset' && typeof chunk.source === 'string') {
          css += chunk.source
        }
        delete bundle[file]
      }

      // 注入到所有 JS 入口文件
      const jsFiles = Object.keys(bundle).filter(k => k.endsWith('.js') && !k.endsWith('.map'))
      for (const file of jsFiles) {
        const chunk = bundle[file]
        if (chunk && chunk.type === 'chunk') {
          // CSS 注入
          const cssInject = [
            '(function(){',
            'var s=document.createElement("style");',
            `s.textContent=${JSON.stringify(css)};`,
            'document.head.appendChild(s);',
            '})();',
          ].join('')

          // UMD 模式下，bundle 内依赖（如 @floating-ui/vue）
          // 直接调用 require("vue")，浏览器环境需 shim
          const requireShim = 'var require=function(m){return m==="vue"?window.Vue||Vue:undefined};'

          chunk.code = cssInject + requireShim + chunk.code
        }
      }
    },

    // 构建完复制测试页到 dist-cdn/
    writeBundle() {
      try {
        copyFileSync('cdn-demo.html', 'dist-cdn/index.html')
      } catch {}
    },
  }
}

export default defineConfig({
  plugins: [vue(), tailwindcss(), cssInjectPlugin()],

  build: {
    // --watch 模式下忽略输出目录，避免 live-server 刷新页面触发循环构建
    watch: {
      exclude: 'dist-cdn/**',
    },
    // 库模式
    lib: {
      entry: 'src/components/ui/plugin.ts',
      name: 'AxiomUI',
      formats: ['umd', 'es'],
      fileName: (format) => `axiom-ui.${format}.js`,
    },

    rollupOptions: {
      // Vue 由宿主提供，不打包
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },

    // 不拆分 CSS，由插件统一注入 JS
    cssCodeSplit: false,

    // 字体文件（woff2）以内联 base64 形式嵌入 CSS
    assetsInlineLimit: 5 * 1024 * 1024, // 5MB

    // 生产环境压缩
    minify: 'esbuild',

    // 关闭模块联邦等不需要的特性
    target: 'es2015',

    // 输出目录
    outDir: 'dist-cdn',
  },
})
