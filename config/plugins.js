import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'
import { visualizer } from 'rollup-plugin-visualizer'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock' // https://github.com/anncwb/vite-plugin-mock/blob/HEAD/README.zh_CN.md

import eslintPlugin from 'vite-plugin-eslint'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import {
  createStyleImportPlugin,
  VxeTableResolve,
} from 'vite-plugin-style-import'

function toPascalCase(str) {
  const words = str.split('-')
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toLowerCase() + word.slice(1),
  )
  return capitalizedWords.join('')
}
export function composePlugins(command, VITE_LEGACY) {
  const prodMock = true
  const lifecycle = process.env.npm_lifecycle_event
  return [
    vue(),
    vueJsx(),
    // 注册svg图标
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
      /**
       * 自定义插入位置
       * @default: body-last
       */
      // inject: 'body-first',
      /**
       * 自定义id
       * @default: __svg__icons__dom__
       */
      // customDomId: '#icon-',
    }),
    AutoImport({
      // 自动引入以下方法 Vue 相关函数，如：ref, reactive, toRef 等 不建议开启
      // imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [
        ElementPlusResolver({
          // 自定义命名空间且按需导入必需，不然样式不会被引入
          importStyle: 'sass',
        }),
      ],
      // 该目录下的文件会被自动导入，但每次新加的变量或函数需重启项目
      // dirs: ['./src/utils'],
      // 解决eslint报错问题 然后把filepath的文件在 .eslintrc.js 的 extends 中引入
      eslintrc: {
        enabled: true, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
      vueTemplate: true,
    }),
    Components({
      // 默认自动导入src/components文件夹下的组件
      // dirs: ['src/components'],

      // 自定义指令配合下面的自定义解析器使用
      // directives: true,
      resolvers: [
        ElementPlusResolver({
          // 自定义命名空间且按需导入必需，不然样式不会被引入
          importStyle: 'sass',
        }),
        // 自定义解析器
        /* {
          type: 'directive',
          resolve: (name) => {
            console.log(toPascalCase(name))
            // toPascalCase(name) === 文件夹名称
            return {
              as: name,
              from: `@/directive/${toPascalCase(name)}/index.js`,
            }
          },
        },*/
      ],
    }),

    //  需安装 pnpm i  vite-plugin-style-import consola -D
    createStyleImportPlugin({
      resolves: [VxeTableResolve()],
      // resolves: [ElementPlusResolve()],
      /*libs: [
        // 如果没有你需要的resolve，可以在lib内直接写，也可以给我们提供PR
        {
          libraryName: 'element-plus',
          ensureStyleFile: true,
          esModule: true,
          resolveStyle: (name) => {
            return `element-plus/theme-chalk/src/${name.replace(
              /^el-/,
              '',
            )}.scss`
          },
        },
      ],*/
    }),
    {
      ...eslintPlugin({
        failOnError: false,
      }),
    },
    /*eslintPlugin({
              include: ['src/!**!/!*.js', 'src/!**!/!*.vue', 'src/!*.js', 'src/!*.vue']
            }),*/
    // https://www.npmjs.com/package/@vitejs/plugin-legacy
    VITE_LEGACY
      ? legacy({
          targets: ['ie >= 11'],
          additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
          // renderLegacyChunks: true,
          // polyfills: [
          //   'es.symbol',
          //   'es.array.filter',
          //   'es.promise',
          //   'es.promise.finally',
          //   'es/map',
          //   'es/set',
          //   'es.array.for-each',
          //   'es.object.define-properties',
          //   'es.object.define-property',
          //   'es.object.get-own-property-descriptor',
          //   'es.object.get-own-property-descriptors',
          //   'es.object.keys',
          //   'es.object.to-string',
          //   'web.dom-collections.for-each',
          //   'esnext.global-this',
          //   'esnext.string.match-all'
          // ]
        })
      : null,
    // https://www.npmjs.com/package/rollup-plugin-visualizer
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'report.html',
    }),
    viteMockServe({
      mockPath: 'mock',
      watchFiles: true,
      supportTs: false,
      localEnabled: command === 'serve',
      prodEnabled: command !== 'serve' && prodMock,
      injectCode: `
          import { setupProdMockServer } from './mockProdServer';
          setupProdMockServer();
        `,
      logger: true,
    }),
  ]
}
