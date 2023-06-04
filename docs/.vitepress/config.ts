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
          { text: '计算机网络', link: '/computer-base/index' },
          { text: '数据结构与算法', link: '/computer-base/index' }
        ]
      },
      { text: '随笔', link: '/essay/index' },
      { text: 'gitee', link: 'https://gitee.com/codingpeasant12' },
      {text: '项目实践', link: '/project/index'}
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
            { text: 'js基础知识', link: '/front-end/javascript/js-base' }
          ]
        }
      ],
      '/computer-base/': [
        {
          text: '计算机基础',
          items: [{ text: '基础', link: '/computer-base/index' }]
        }
      ],
      '/project/': [
        {
          text: '项目实践',
          items: [
            {text: '概述', link: '/project/index'},
            {text: '项目部署', link: '/project/deploy'}
          ]
        }
      ]
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/image-gif' }]
  }
});
