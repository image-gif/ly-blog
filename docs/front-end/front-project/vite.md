# vite 的理解

[Vite 官方中文文档](https://cn.vitejs.dev/)

## 1. 原有打包工具的问题

### 1.1 缓慢的服务器启动

当冷启动开发服务器时，基于打包器的方式启动必须优先抓取并构建你的整个应用，然后才能提供服务。

Vite 通过在一开始将应用中的模块区分为 **依赖** 和 **源码** 两类，改进了开发服务器启动时间。

- **依赖** 大多为在开发时不会变动的纯 JavaScript。一些较大的依赖（例如有上百个模块的组件库）处理的代价也很高。依赖也通常会存在多种模块化格式（例如 ESM 或者 CommonJS）。
- Vite 将会使用 [esbuild](https://esbuild.github.io/) [预构建依赖](https://cn.vitejs.dev/guide/dep-pre-bundling.html)。esbuild 使用 Go 编写，并且比以 JavaScript 编写的打包器预构建依赖快 10-100 倍。
- **源码** 通常包含一些并非直接是 JavaScript 的文件，需要转换（例如 JSX，CSS 或者 Vue/Svelte 组件），时常会被编辑。同时，并不是所有的源码都需要同时被加载（例如基于路由拆分的代码模块）。
- Vite 以 [原生 ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 方式提供源码。这实际上是让浏览器接管了打包程序的部分工作：Vite 只需要在浏览器请求源码时进行转换并按需提供源码。根据情景动态导入代码，即只在当前屏幕上实际使用时才会被处理。

### 1.2 缓慢更新

基于打包器启动时，重建整个包的效率很低。原因显而易见：因为这样更新速度会随着应用体积增长而直线下降。

一些打包器的开发服务器将构建内容存入内存，这样它们只需要在文件更改时使模块图的一部分失活([1])，但它也仍需要整个重新构建并重载页面。这样代价很高，并且重新加载页面会消除应用的当前状态，所以打包器支持了动态模块**热替换**（**HMR**）：允**许一个模块 “热替换” 它自己，而不会影响页面其余部分**。这大大改进了开发体验 —— 然而，在实践中我们发现，**即使采用了 HMR 模式，其热更新速度也会随着应用规模的增长而显著下降**。

在 Vite 中，HMR 是在原生 ESM 上执行的。当编辑一个文件时，Vite 只需要精确地使已编辑的模块与其最近的 HMR 边界之间的链失活([1])（大多数时候只是模块本身），使得无论应用大小如何，HMR 始终能保持快速更新。

Vite 同时利用 HTTP 头来加速整个页面的重新加载（再次让浏览器为我们做更多事情）：**源码模块**的请求会根据 `304 Not Modified` 进行**协商缓存**，而**依赖模块**请求则会通过 `Cache-Control: max-age=31536000,immutable` 进行**强缓存**，因此一旦被缓存它们将不需要再次请求。

## 2. 功能

## 3. 插件

### [unplugin-auto-import 的使用](https://blog.csdn.net/perfect2011/article/details/128539058)

> 实现相关 API 等的自动导入，实则是在全局已经声明；

```TypeScript
AutoImport({
  // targets to transform
  include: [
    /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
    /\.vue$/, /\.vue\?vue/, // .vue
    /\.md$/, // .md
  ],

  // global imports to register
  imports: [
    // presets
    'vue',
    'vue-router',
    // custom
    {
      '@vueuse/core': [
        // named imports
        'useMouse', // import { useMouse } from '@vueuse/core',
        // alias
        ['useFetch', 'useMyFetch'], // import { useFetch as useMyFetch } from '@vueuse/core',
      ],
      'axios': [
        // default imports
        ['default', 'axios'], // import { default as axios } from 'axios',
      ],
      '[package-name]': [
        '[import-names]',
        // alias
        ['[from]', '[alias]'],
      ],
    },
    // example type import
    {
      from: 'vue-router',
      imports: ['RouteLocationRaw'],
      type: true,
    },
  ],
  // Enable auto import by filename for default module exports under directories
  defaultExportByFilename: false,

  // Auto import for module exports under directories
  // by default it only scan one level of modules under the directory
  dirs: [
    // './hooks',
    // './composables' // only root modules
    // './composables/**', // all nested modules
    // ...
  ],

  // Filepath to generate corresponding .d.ts file.
  // Defaults to './auto-imports.d.ts' when `typescript` is installed locally.
  // Set `false` to disable.
  // 这个必须添加，不然这个插件使用之后，还是会有对应ts提示错误
  dts: './auto-imports.d.ts',

  // Cache the result of resolving, across multiple vite builds.
  // A custom path is supported.
  // When set to `true`, the cache will be stored in `node_modules/.cache/unplugin-auto-import.json`.
  cache: false,

  // Auto import inside Vue template
  // see https://github.com/unjs/unimport/pull/15 and https://github.com/unjs/unimport/pull/72
  vueTemplate: false,

  // Custom resolvers, compatible with `unplugin-vue-components`
  // see https://github.com/antfu/unplugin-auto-import/pull/23/
  resolvers: [
    /* ... */
  ],

  // Generate corresponding .eslintrc-auto-import.json file.
  // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
  eslintrc: {
    enabled: false, // Default `false`
    filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
    globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
  },
})
```

**Ps:** 因为在使用该插件之后，解决了每次都要手动导入的问题，但是会存在 ts 报错的问题，比如直接使用 ref 时,还是会提示 ref is not found. 此时在上述配置中的 eslintrc 中将 enabled 设置为 true，重新启动项目，此时会生成一个 auto-import.d.ts 文件还有对应的 json 文件（这个是在项目中使用 eslint 时使用）, 前面的.d.ts 文件是解决 ts 中的报错问题；然后将对应的文件放入对应的配置中；

```TypeScript
// 首先需要注意将auto-import.d.ts文件需要在tsconfig.config.ts文件中配置对应includes
// 然后再上述代码中的dts中配置对应路径，也就是auto-import.d.ts文件路径；
// 如果设置了eslint,这需要下面的配置

// .eslintrc.js
moudle.exports = {
   extends: [
       './eslintrc-auto-import.json'
   ]
}
```

### vite-plugin-vue-setup-extend

- **setup name 增强**

```JavaScript
// 不适用插件
<script lang="ts">
  import { defineComponent, onMounted } from 'vue'

  export default defineComponent({
    name: 'firstPage'
  })
  </script>

  <script lang="ts" setup>
  onMounted(() => {
    console.log('mounted')
  })
</script>

// 使用插件
 <script setup name="Index"></script>
```

- **告别.value**

```JavaScript
众所周知，ref要求我们访问变量时需要加上.value，这让很多开发者觉得难受

let num = ref(1)

const addNum = () => {
  num.value += 1
}
1
2
3
4
5
于是官方出的一种方案，在ref前加上$，该功能默认关闭，需要手动开启。

// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue({
      refTransform: true // 开启ref转换
    })
  ]
})
// 开启之后可以这样写：

let num = $ref(1)

const addNum = () => {
  num ++
}
// 该语法糖根据不同的版本配置也略有不同，下面贴一下我自己所用相关插件的版本：

"vue": "^3.2.2",
"@vitejs/plugin-vue": "^1.9.0",
"@vue/compiler-sfc": "^3.2.5",
"vite": "^2.6.13"

该属性仍处于实验性阶段，谨慎使用！！！
```

- **实现.vue 的文件扩展**

> 可以不用写 vue 这个扩展名，但是 vue 作者还是明确提出了这个设置（原本 vue3 中是需要用户手动写入 vue 扩展名的），所以尽可能还是写上扩展名
