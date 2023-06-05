# postCss

> 是一个用 JavaScript 工具和插件转换 CSS 代码的工具

## 特性

- 增强代码可读性

利用从 Can I Use 网站获取的数据为 CSS 规则添加特定厂商的前缀。 [Autoprefixer](https://github.com/postcss/autoprefixer) 自动获取浏览器的流行度和能够支持的属性，并根据这些数据帮你自动为 CSS 规则添加前缀。

- 将最新 css 特性用于项目代码中

[PostCSS Preset Env](https://preset-env.cssdb.org/) 帮你将最新的 CSS 语法转换成大多数浏览器都能理解的语法，并根据你的目标浏览器或运行时环境来确定你需要的 polyfills(聚乙烯填充物，译：负载)，此功能基于 [cssdb](https://cssdb.org/) 实现。

- 终结全局 CSS

[CSS 模块](https://github.com/css-modules/css-modules) 能让你你永远不用担心命名太大众化而造成冲突，只要用最有意义的名字就行了。

```CSS
// input
.name {
  color: gray;
}
// output
.Logo__name__SVK0g {
  color: gray;
}
```

- css 代码错误

通过使用 [stylelint](https://stylelint.io/) 强化一致性约束并避免样式表中的错误。stylelint 是一个现代化 CSS 代码检查工具。它支持最新的 CSS 语法，也包括类似 CSS 的语法，例如 SCSS 。

## 重新认识 postCss

[一些你对 PostCSS 可能产生的误解](http://julian.io/some-things-you-may-think-about-postcss-and-you-might-be-wrong)

1. postCss 不属于预处理器

PostCSS is a JavaScript tool that will read your CSS with special additional syntax, process it, and return regular CSS code.

> Just remember that this isn't a preprocessor replacement, although it could replace it if you wanted it. For a great example, take a look at the [PreCSS](https://github.com/jonathantneal/precss) plugin pack. This is a toolset with many PostCSS plugins which can replace your Sass preprocessor.
>
> If you got used to Stylus or Sass, you'd still be able to use it. After preprocessing, you can also use PostCSS processing with plugins.

1. postCss 使用不会太复杂

> Usage is as simple as the usage of every preprocessor. It depends on your current workflow and tools stack, but it is very modular and flexible. You can choose only some of the plugins which you need. You don't need to install all features like preprocessors.
>
> 有渐进式的感觉，要什么就放什么插件，不需要像 css 预处理那样需要整套安装

## 使用 postCss

## 使用插件

### 配置 autoprefixer

> 浏览器前缀，实现浏览器 css 语法兼容
>
> browserlist 的数据来自于[CanIUse](http://caniuse.com/)网站，由于数据并非实时的，所以不会特别准确

安装`autoprefixer` 插件

```Shell
npm install autoprefixer -D
```

1. 方法一：

```JavaScript
// 在postcss.config.js中配置

// 自动补齐前缀
// autoprefixer 插件
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    autoprefixer({
      // 兼容市面上所有版本的浏览器
      browsers: ['> 0%']
    })
  ]
};
```

1. 方法二：

在 package.json 中配置，在 postcss.config.js 中只是引入插件

```JSON
"browserslist": [
        "last 5 version",
        ">1%",
        "ie>=8"
]
// 在postcss.config.js中配置

// 自动补齐前缀
// autoprefixer 插件
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    autoprefixer
  ]
};
```

1. 方法三:

创建一个.browserslistrc 文件，内容如下，同时 postcss.config.js 同上述方法二

```Shell
last 5 version
>1%
ie>=8
```

### 配置 postcss-import

> 使用@import 导入其他的 css 文件时，通过 postcss 处理导出之后，css 代码中还是显示的那个@import 导出语法，这样肯定是不行的，所以需要对这个进行处理，通过 postcss-import 插件可以处理；
>
> 最终的效果就是将导入的内容直接加入到当前的 css 文件中
>
> browserlist 的数据来自于[CanIUse](http://caniuse.com/)网站，由于数据并非实时的，所以不会特别准确

安装

```Shell
npm install postcss-import -D
```

### 配置 cssnano

> 该插件的作用是: 压缩 css 代码

安装

```Shell
npm install cssnano -S
```

### 配置 postcss-cssnext (**has been deprecated** )

> 使用 css 的最新语法，同时兼容其他的浏览器，可以使用该插件；
>
> 同时需要注意的是，这个插件是包含 autoprefixer 插件的，所以如果项目中已经使用了这个插件，需要将至注释移除(虽然都可以运行，但是会有警告消息)

安装

```Shell
npm install postcss-cssnext -D
```

#### 配置 postcss-preset-env

> **`postcss-cssnext`** **has been deprecated in favor of** **`postcss-preset-env`**
>
> postcss 预设环境
>
> 内置了一些插件配置，包括：autofixer 等

#### 配置 stylelint

> 用来做 css 代码规范用的，功能满强大的；
>
> github 上提供了一些配置操作：https://github.com/stylelint/stylelint/blob/4dc4995750694c6925f3f6aa55cdaff3364c5e72/docs/user-guide/configure.md

安装

```Shell
npm install stylelint -D
```

ps：

既然想在编辑器里达到该功能，那么就要在编辑器里做文章

安装 vscode 的插件`stylelint`即可，它会读取你工程中的配置文件，按照配置进行实时报错

> 实际上，如果你拥有了`stylelint`插件，可以不需要在 postcss 中使用该插件了
