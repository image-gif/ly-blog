# 对 rollup 的理解

> Rollup 已被许多主流的 JavaScript 库使用，也可用于构建绝大多数应用程序。但是 Rollup 还不支持一些特定的高级功能，尤其是用在构建一些应用程序的时候，特别是代码拆分和运行时态的动态导入。如果你的项目中更需要这些功能，那使用 Webpack 可能更符合你的需求。与 Webpack 偏向于应用打包的定位不同，rollup.js 更专注于 Javascript 类库打包。

对于打包工具的选择，这时候还是要看你具体的需求，如果你的诉求是需要代码拆分，或者你有很多静态资源需要处理，再或者你构建的项目需要引入很多 CommonJS 模块的依赖，那应该选择 webpack 。但是如果你的代码库是基于 ES6 模块的，而且希望你写的代码能够被其他人直接使用，你更需要的打包工具可能是 Rollup。

1. ## Rollup 的特点

> Rollup 是一个 JavaScript 模块打包工具，可以将多个小的代码片段编译为完整的库和应用。与传统的 CommonJS 和 AMD 这一类非标准化的解决方案不同，Rollup 使用的是 ES6 版本 Javascript 中的模块标准。新的 ES 模块可以让你自由、无缝地按需使用你最喜爱的库中那些有用的单个函数。这一特性在未来将随处可用，但 Rollup 让你现在就可以，想用就用。

### javascript 模块打包器

### Tree-shaking

> vue 的作者尤雨溪在知乎里回答，关于 Rollup 之所以能高效的用 Tree-shaking 来消除无用的代码主要为以下四个原因。
>
> import 只能作为模块顶层的语句出现，不能出现在 function 里面或是 if 里面。
>
> import 的模块名只能是字符串常量。
>
> 不管 import 的语句出现的位置在哪里，在模块初始化的时候所有的 import 都必须已经导入完成。
>
> import binding 是 immutable 的，类似 const。比如说你不能 import { a } from ‘./a’ 然后给 a 赋值个其他什么东西。

#### 为什么 ES 模块比 CommonJS 模块更好?

ES 模块是一个官方标准，也是 JavaScript 代码结构的明确的发展方向，而 CommonJS 模块是一种特殊且老旧的格式，仅仅在提出 ES 模块标准之前作为暂时性的解决方案。ES 模块允许进行静态分析，从而有助于摇树(tree-shaking)和作用域提升(scope-hoisting)之类的优化工作，同时提供了一些高级特性，例如循环引用和实时绑定。

#### 什么是“tree-shaking”？

Tree-shaking，也被称为“live code inclusion”，是 Rollup 消除项目中并未实际使用到的代码的过程。它是一种[消除无效代码的方式](https://medium.com/@Rich_Harris/tree-shaking-versus-dead-code-elimination-d3765df85c80#.jnypozs9n)，但在优化输出内容大小方面可能比其他方法有效得多。这个名字源于模块内容(而非模块图)的[抽象语法树(abstract syntax tree, AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree)。Tree-shaking 算法首先标记所有相关语句，然后“摇动语法树”以删除所有无效代码。其思想类似于[标记-清除垃圾收集算法](https://en.wikipedia.org/wiki/Tracing_garbage_collection)。虽然该算法不仅限于 ES 模块，但由于 Rollup 将所有模块视为一颗具有共享绑定的大型抽象语法树，使它能够运行的更快。
