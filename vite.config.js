import { defineConfig, loadEnv } from 'vite'
import path from 'node:path'
import fs from 'node:fs'

import { composePlugins } from './config/plugins'

function resolve(dir) {
  return path.join(__dirname, dir)
}
// 加载 'src/style/resources' 下面的 scss
const scssResources = []
const cssPath = 'src/styles/config'
fs.readdirSync(cssPath).map((dirname) => {
  if (fs.statSync(`${cssPath}/${dirname}`).isFile()) {
    scssResources.push(`@use "${cssPath}/${dirname}" as *;`)
  }
})

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const { VITE_APP_BASE_API, VITE_APP_BASE_API_REAL, VITE_LEGACY } = loadEnv(
    mode,
    process.cwd(),
    '',
  )
  return {
    base: './',
    resolve: {
      alias: {
        '@': resolve('src'),
      },
      // 忽略文件后缀
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.vue'],
    },
    plugins: composePlugins(command, VITE_LEGACY),
    // https://cn.vitejs.dev/config/dep-optimization-options.html#optimizedeps-exclude
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: scssResources.join(''),
          /*additionalData: `
           @use "@/styles/config/element" as *;
           // 全局变量
           @use '@/styles/config/variables' as *;
         `,*/
        },
      },
    },
    server: {
      https: false,
      open: false,
      // hmr: true,
      /* proxy: {
        '/api': {
          target: 'https://api.occtai.com/test',
          ws: false,
          changeOrigin: true,
          // 不保留任何路径 /api/xxx/xxx => /
          rewrite: (path) => '/',
        },
      },*/
      /* proxy: {
        [VITE_APP_BASE_API]: {
          target: VITE_APP_BASE_API_REAL,
          ws: false,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${VITE_APP_BASE_API}`, 'g'), ''),
        },
      },*/
    },
    // 全局变量 window
    define: {
      // https://vue-i18n.intlify.dev/guide/advanced/optimization.html#quasar-cli
      // 消除 vue-i18n 警告
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify({
        version: '3.0.0',
      }),
    },
    build: {
      path: './',
      sourcemap: false,
      brotliSize: false,
      chunkSizeWarningLimit: 2500,

      // minify: 'terser',
      // terserOptions: {
      //   compress: {
      //     drop_console: true,
      //     drop_debugger: true
      //   }
      // },

      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')[0]
                .toString()
            }
          },
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split('/')
              : []
            const fileName =
              facadeModuleId[facadeModuleId.length - 2] || '[name]'
            return `js/${fileName}/[name].[hash].js`
          },
        },
      },
    },
    // build.minify为 esbuild
    esbuild: {
      drop: ['console', 'debugger'],
    },
  }
})
