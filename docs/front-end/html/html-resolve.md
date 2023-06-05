# 一个 html 文档的解析

### 文档头部 head 中的 meta

- 关于设置 http-equiv="X-UA-Compatible"

```HTML
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
```

**IE 兼容模式：** 为了帮助确保网页在将来的 Internet Explorer 版本中具有一致的外观，Internet Explorer 8 引入了文档兼容性。文件兼容性用于定义 IE 如何渲染网页。 **怎么查看当前网页在 IE 下的兼容性模式：** 在浏览器中按 F12 打开 IE 开发人员工具可以查看到浏览器模式和文档模式。 1、浏览器模式影响浏览器的行为表现以及声明的版本号。 2、文档模式影响 DOM 的转换、渲染操作，影响的是浏览器的外观表现，决定网页显示成什么样子的。 X-UA-Compatible 是自从 IE8 新加的一个设置，对于 IE8 以下的浏览器是不识别的。通过在 meta 中设置 X-UA-Compatible 的值，可以指定网页的兼容性模式设置。

```COBOL
<meta http-equiv="X-UA-Compatible" content="IE=7" />
以上代码告诉IE浏览器，无论是否用DTD声明文档标准，IE8/9都会以IE7引擎来渲染页面。
<meta http-equiv="X-UA-Compatible" content="IE=8" />
以上代码告诉IE浏览器，IE8/9都会以IE8引擎来渲染页面。
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
以上代码告诉IE浏览器，IE8/9及以后的版本都会以最高版本IE来渲染页面。
<meta http-equiv="X-UA-Compatible" content="IE=7,IE=9" />
<meta http-equiv="X-UA-Compatible" content="IE=7,9" />
```

**IE 文档兼容性模式所有可能的值：** 1、Emulate IE8 mode 指示 IE 使用指令来决定如何编译内容。Standards mode 指令会显示成 IE8 Standards mode 而 quirks mode 会显示成 IE5 mode。不同于 IE8 mode，Emulate IE8 mode 重视指令。 2、Emulate IE7 mode 指示 IE 使用指令来决定如何编译内容。Standards mode 指令会显示成 IE7 Standards mode 而 quirks mode 会显示成 IE5 mode。不同于 IE7 mode，Emulate IE7 mode 重视指令。对于许多网页来说这是最推荐的兼容性模式。 3、IE5 mode 编译内容如同 IE7 的 quirks mode 之显示状况，和 IE5 中显示的非常类似。 4、IE7 mode 编译内容如同 IE7 的 standards mode 之显示状况，无论网页是否含有指令。 5、IE8 mode 提供对业界标准的最高支持，包含 W3C Cascading Style Sheets Level 2.1 Specification 和 W3C Selectors API，并有限的支持 W3C Cascading Style Sheets Level 3 Specification (Working Draft)。 6、Edge mode 指示 IE 以目前可用的最高模式显示内容。当使用 IE8 时其等同于 IE8 mode。若(假定)未来放出支持更高兼容性模式的 IE，使用 Edge mode 的页面会使用该版本能支持的最高模式来显示内容。同样的那些页面在使用 IE8 浏览时仍会照常显示。 **注意事项：** 1、根据官网定义 X-UA-compatible 标头不区分大小写；不过，它必须显示在网页中除 title 元素和其他 meta 元素以外的所有其他元素之前。如果不是的话，它不起作用 2、content 的内容是 IE=8，或者 IE=edge 等值，注意不是 IE8 或者直接写个 edge 的值，否则不起作用

原文处：https://blog.csdn.net/fay462298322/article/details/66969892

### head 中的 meta

[Html 中的 meta 标签](https://blog.csdn.net/shangyanaf/article/details/106400771)

- Name

```HTML
<!--作者-->
<meta name="author" content="http://www.html.com" />
<!--网页关键字：多个关键字用英文逗号分隔-->
<meta name="keywords" content="HTML5,网页,Web 前端开发" />
<!--网页描述：搜索网站时，title 下面的解释文字。-->
<meta name="description" content="这是我的第一个网页。" />
```

- Viewport

手机浏览器是把页面放在一个虚拟的“窗口”（viewport）中，通常这个虚拟的“窗口”（viewport）比屏幕宽，这样就不用把每个网页挤到很小的窗口中（这样会破坏没有针对手机浏览器优化的网页的布局），用户可以通过平移和缩放来看网页的不同部分。移动版的 Safari 浏览器最新引进了 viewport 这个 meta tag，让网页开发者来控制 viewport 的大小和缩放，其他手机浏览器也基本支持。

Viewport 基础

一个常用的针对移动网页优化过的页面的 viewport meta 标签大致如下：

width：控制 viewport 的大小，可以指定的一个值，如果 600，或者特殊的值，如 device-width 为设备的宽度（单位为缩放为 100% 时的 CSS 的像素）

height：和 width 相对应，指定高度

initial-scale：初始缩放比例，也即是当页面第一次 load 的时候缩放比例

maximum-scale：允许用户缩放到的最大比例

minimum-scale：允许用户缩放到的最小比例

user-scalable：用户是否可以手动缩放

shrink-to-fit=no

下面的一行代码可以让网页的宽度自动适应手机屏幕的宽度:

```HTML
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<!-- 在iOS9中要想起作用，得加上"shrink-to-fit=no"  -->
```

### 关于 link 标签 rel=canonical

```HTML
<link rel="canonical" htrf="https//:example.com/index.html" />
```

> 该标签的作用是告诉浏搜索引擎该页面的主要版本，以此处理重复的内容问题；
>
> 具体来说，如果一个网站的多个页面的内容相似甚至相同，搜索引擎可能会将这些网页视为重复内容，从而影响网站的排名和用户体验。在这种情况下，网站管理员可以使用 rel=canonical 标签来指定主要版本的链接地址，告诉搜索引擎将其视为其他重复页面的标准版本，从而避免重复内容的影响。
>
> 例如，某网站可能有多个版本的同一内容的页面，如繁体中文版、简体中文版和英文版，但这些页面基本上是相同的。在这种情况下，网站管理员可以在所有这些页面的头部添加一个相同的 rel=canonical 标签，以指定英文版页面作为主要版本，以避免搜索引擎认为它们是重复的页面。

Ps:

如果搜索引擎认为网站的多个页面是重复的，可能会对网站的排名和用户体验产生负面影响。具体来说，以下是可能产生的影响：

1. 降低搜索排名：搜索引擎通常会尝试过滤掉网站中的重复内容，这样可以提高搜索结果的质量。如果搜索引擎认为网站的多个页面是重复的，那么它们可能会被过滤掉，从而影响网站的排名。
2. 减少网站的流量：如果搜索引擎认为网站的多个页面是重复的，那么它们可能会被过滤掉，导致网站的流量减少。许多用户可能会选择点击不同的搜索结果而不是同一网站的多个页面。
3. 消耗资源：如果网站的多个页面被认为是重复的，搜索引擎可能会花费更多的时间和资源来索引这些页面，而这些成本可能会对搜索引擎的性能产生负面影响。

因此，确保网站避免重复内容问题对于网站的搜索引擎优化和用户体验至关重要。
