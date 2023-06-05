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
          { text: 'HTML', link: '/front-end/html/index' },
          { text: 'CSS', link: '/front-end/css/index' },
          { text: 'JavaScript', link: '/front-end/javascript/index' }
        ]
      },
      {
        text: '计算机基础',
        items: [
          { text: '计算机网络', link: '/computer-base/network/index' },
          { text: '数据结构与算法', link: '/computer-base/data-struct/index' }
        ]
      },
      { text: '随笔', link: '/essay/index' },
      { text: '项目实践', link: '/project/index' },
      { text: 'gitee', link: 'https://gitee.com/codingpeasant12' }
    ],
    sidebar: {
      '/front-end/html/': [
        {
          text: 'HTML',
          items: [{ text: '概述', link: '/front-end/html/index' }]
        }
      ],
      '/front-end/css/': [
        {
          text: 'CSS',
          items: [{ text: '概述', link: '/front-end/css/index' }]
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
        }
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
            { text: 'axios核心', link: '/computer-base/network/axios-core' }
          ]
        }
      ],
      '/computer-base/data-struct/': [
        { text: '概述', link: '/computer-base/data-struct/index' },
        { text: '排序算法', link: '/computer-base/data-struct/sort' }
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
            }
          ]
        }
      ]
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/image-gif' }]
  }
});
