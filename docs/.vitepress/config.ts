import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/ly-blog/',
  title: '🌕诗月随笔🌈',
  titleTemplate: '一个前端coder的学习笔记',
  description: '一个前端coder的学习笔记',
  head: [['link', { rel: 'icon', href: '/ly-blog/favicon.ico' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      {
        text: '前端',
        items: [
          { text: 'JavaScript', link: '/front-end/javascript/index' },
          { text: 'CSS', link: '/front-end/css/index' },
          { text: 'HTML', link: '/front-end/html/index' },
          { text: 'Vue', link: '/front-end/framework/vue/index' },
          { text: 'React', link: '/front-end/framework/react/index' },
          { text: '前端工程化', link: '/front-end/front-project/module' }
        ]
      },
      {
        text: '计算机基础',
        items: [
          { text: '计算机网络', link: '/computer-base/network/index' },
          { text: '操作系统', link: '/computer-base/operating-system/index' },
          { text: '数据结构与算法', link: '/computer-base/data-struct/index' }
        ]
      },
      { text: '随笔', link: '/essay/index' },
      { text: '项目实践', link: '/project/index' },
      {
        text: '工具函数',
        items: [
          {
            text: 'JavaScript',
            link: '/tool-function/javascript/create-td-array'
          },
          { text: '网络', link: '/tool-function/network/axios-request' }
        ]
      },

      { text: 'gitee', link: 'https://gitee.com/codingpeasant12' }
    ],
    sidebar: {
      '/front-end/html/': [
        {
          text: 'HTML',
          items: [
            { text: '概述', link: '/front-end/html/index' },
            { text: '基础知识', link: '/front-end/html/base' },
            { text: 'canvas', link: '/front-end/html/canvas' },
            {
              text: '一个 html 文档的解析',
              link: '/front-end/html/html-resolve'
            }
          ]
        }
      ],
      '/front-end/css/': [
        {
          text: 'CSS',
          items: [
            { text: '概述', link: '/front-end/css/index' },
            { text: 'CSS基础', link: '/front-end/css/css-base' },
            { text: 'CSS选择器优先级', link: '/front-end/css/css-priority' },
            { text: 'BFC块级格式化上下文', link: '/front-end/css/css-bfc' },
            { text: 'flex布局', link: '/front-end/css/css-flex' },
            { text: 'grid布局', link: '/front-end/css/grid' },
            { text: 'CSS页面布局', link: '/front-end/css/css-layout' },
            { text: 'CSS-position', link: '/front-end/css/css-position' },
            { text: 'CSS预处理器', link: '/front-end/css/css-pre-handle' },
            { text: 'PostCss', link: '/front-end/css/post-css' },
            { text: 'Bootstrap', link: '/front-end/css/css-bootstrap' },
            {
              text: 'requestAnimationFrame',
              link: '/front-end/css/request-animation-frame'
            }
          ]
        }
      ],
      '/front-end/javascript/': [
        {
          text: 'JavaScript',
          items: [
            { text: '概述', link: '/front-end/javascript/index' },
            {
              text: 'JavaScript基础知识',
              link: '/front-end/javascript/js-base'
            },
            {
              text: 'JavaScript原型及原型链',
              link: '/front-end/javascript/prototype-chain'
            },
            {
              text: 'JavaScript执行过程',
              link: '/front-end/javascript/execute-progress'
            },
            {
              text: '实现Promise',
              link: '/front-end/javascript/promise'
            },
            {
              text: 'JavaScript经典方法实现',
              link: '/front-end/javascript/classical-demo'
            },
            {
              text: '常用设计模式',
              link: '/front-end/javascript/design-pattern'
            },
            {
              text: 'ECMAScript新特性',
              link: '/front-end/javascript/ecma-feature'
            },
            {
              text: '文件处理',
              items: [
                {
                  text: 'ArrayBuffer',
                  link: '/front-end/javascript/file-handler/array-buffer'
                },
                {
                  text: 'TextDecoder & TextEndecoder',
                  link: '/front-end/javascript/file-handler/text-decode-endecode'
                },
                {
                  text: 'Blob',
                  link: '/front-end/javascript/file-handler/blob'
                },
                {
                  text: 'File & FileReader',
                  link: '/front-end/javascript/file-handler/file-filereader'
                }
              ]
            }
          ]
        },
        {
          text: 'TypeScript',
          items: [
            { text: '基础', link: '/front-end/javascript/typescript/index' }
          ]
        }
      ],
      '/front-end/framework/vue/': [
        { text: 'vue基础', link: '/front-end/framework/vue/index' },
        {
          text: '虚拟DOM和diff算法',
          link: '/front-end/framework/vue/vnode-diff'
        },
        { text: 'vue数据绑定', link: '/front-end/framework/vue/data-bind' },
        { text: '源码阅读', link: '/front-end/framework/vue/vue-source' }
      ],
      '/front-end/framework/react/': [
        { text: 'react基础', link: '/front-end/framework/react/index' },
        {
          text: 'redux',
          link: '/front-end/framework/react/redux'
        }
      ],
      '/front-end/front-project/': [
        { text: '模块化', link: '/front-end/front-project/module' },
        { text: 'webpack', link: '/front-end/front-project/webpack' },
        { text: 'rollup', link: '/front-end/front-project/rollup' },
        { text: 'vite', link: '/front-end/front-project/vite' },
        { text: 'Git', link: '/front-end/front-project/git' }
      ],
      '/computer-base/network/': [
        {
          text: '计算机网络',
          items: [
            { text: '概述', link: '/computer-base/network/index' },
            { text: 'HTTP缓存', link: '/computer-base/network/http-cache' },
            {
              text: 'TCP三次握手和四次挥手',
              link: '/computer-base/network/tcp-connect'
            },
            { text: 'HTTP', link: '/computer-base/network/http' },
            {
              text: 'session&cookies 与 token',
              link: '/computer-base/network/session-cookies-token'
            },
            {
              text: '网络模型结构',
              link: '/computer-base/network/network-model'
            },
            {
              text: 'Ajax',
              link: '/computer-base/network/ajax'
            },
            {
              text: 'axios基本使用',
              link: '/computer-base/network/axios-base'
            },
            { text: 'axios核心', link: '/computer-base/network/axios-core' },
            { text: 'DNS', link: '/computer-base/network/dns' },
            { text: 'HTTPS', link: '/computer-base/network/https' },
            { text: '网络安全', link: '/computer-base/network/network-safe' }
          ]
        }
      ],
      '/computer-base/operating-system/': [
        {
          text: '操作系统',
          items: [
            { text: '概述', link: '/computer-base/operating-system/index' },
            {
              text: '进程管理',
              link: '/computer-base/operating-system/progress'
            },
            {
              text: '内存管理',
              link: '/computer-base/operating-system/memory'
            },
            {
              text: '文件管理',
              link: '/computer-base/operating-system/file-manage'
            },
            { text: '输入输出I/O', link: '/computer-base/operating-system/io' }
          ]
        }
      ],
      '/computer-base/data-struct/': [
        { text: '概述', link: '/computer-base/data-struct/index' },
        { text: '排序算法', link: '/computer-base/data-struct/sort' },
        {
          text: 'JavaScript',
          items: [
            {
              text: '3. 无重复字符的最长子串',
              link: '/computer-base/data-struct/javascript/longest-substring-without-repeating-characters'
            },
            {
              text: '53. 最大子数组和',
              link: '/computer-base/data-struct/javascript/maximum-subarray'
            },
            {
              text: '2629.复合函数',
              link: '/computer-base/data-struct/javascript/function-composition'
            },
            {
              text: '2630.记忆函数II',
              link: '/computer-base/data-struct/javascript/memoize-ii'
            },
            {
              text: '2631.分组',
              link: '/computer-base/data-struct/javascript/group-by'
            }
          ]
        }
      ],
      '/project/': [
        {
          text: '项目实践',
          items: [
            { text: '概述', link: '/project/index' },
            { text: '项目部署', link: '/project/deploy' },
            { text: '项目中遇到的问题', link: '/project/problem-in-project' },
            {
              text: 'nginx中location匹配规则',
              link: '/project/nginx-location-match'
            },
            { text: '项目笔记', link: '/project/project-record' },
            {
              text: '文件上传',
              items: [
                {
                  text: '前端实现大文件上传',
                  link: '/project/file-upload/large-file-upload'
                },
                {
                  text: '基于云存储的大文件上传',
                  link: '/project/file-upload/use-oss'
                }
              ]
            },
            {
              text: '性能',
              items: [
                { text: '虚拟列表', link: '/project/performance/virtual-list' },
                {
                  text: '浏览器渲染',
                  link: '/project/performance/broswer-render'
                },
                {
                  text: '性能优化方案',
                  link: '/project/performance/performance-method'
                }
              ]
            },
            {
              text: '浏览器',
              items: [
                { text: '事件循环', link: '/project/broswer/event-loop' },
                {
                  text: '浏览器重绘与回流',
                  link: '/project/broswer/reflow-repaint'
                },
                { text: 'hash&history', link: '/project/broswer/hash-history' },
                { text: '路由演变', link: '/project/broswer/router-progress' },
                { text: '浏览器跨域', link: '/project/broswer/cors' },
                { text: 'web安全', link: '/project/broswer/web-security' },
                {
                  text: '浏览器垃圾回收机制',
                  link: '/project/broswer/broswer-gc'
                }
              ]
            }
          ]
        }
      ],
      '/essay/': [
        { text: '概述', link: '/essay/index' },
        { text: 'halo 一个开源网站构建工具', link: '/essay/halo' },
        { text: '一些常用工具', link: '/essay/tools' },
        { text: '前端监控系统', link: '/essay/monitor' },
        { text: 'bash创建自定义执行脚本', link: '/essay/bash' },
        {
          text: 'PWA',
          items: [
            { text: '概述', link: '/essay/pwa/index' },
            { text: 'Manifest', link: '/essay/pwa/manifest' },
            { text: 'ServiceWorker', link: '/essay/pwa/service-worker' }
          ]
        },

        { text: 'WebComponents', link: '/essay/web-components' }
      ],
      '/tool-function/javascript/': [
        {
          text: 'JavaScript',
          items: [
            {
              text: '创建二维数组',
              link: '/tool-function/javascript/create-td-array'
            },
            {
              text: '注销监听器',
              link: '/tool-function/javascript/unregistry-event-listener'
            },
            {
              text: '判断是否为偶数',
              link: '/tool-function/javascript/is-even'
            }
          ]
        }
      ],
      '/tool-function/network/': [
        {
          text: '网络',
          items: [
            {
              text: '封装axios请求',
              link: '/tool-function/network/axios-request'
            }
          ]
        }
      ]
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/image-gif' }]
  }
});
