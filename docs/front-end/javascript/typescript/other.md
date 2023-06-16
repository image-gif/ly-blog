# TypeScript 随笔

## 关于`noImplicitAny`

```
noImplicitAny
```

选项 `noImplicitAny` 用来告诉编译器，当无法推断一个变量时发出一个错误（或者只能推断为一个隐式的 `any` 类型），你可以：

- 通过显式添加 `:any` 的类型注解，来让它成为一个 `any` 类型；
- 通过一些更正确的类型注解来帮助 TypeScript 推断类型。

注： 这个选项是在 ts.config.json 中的

## Type-Only Imports and Export（官方文档拷贝）

> [文档地址](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export)

This feature is something most users may never have to think about; however, if you’ve hit issues under `isolatedModules`, TypeScript’s `transpileModule` API, or Babel, this feature might be relevant.

TypeScript 3.8 adds a new syntax for type-only imports and exports.

**仅含类型的导入和导出，主要是用于在类型注解，申明等；**

```Plaintext
import type { SomeThing } from "./some-module.js";
export type { SomeThing };
```

`import type` only imports declarations to be used for type annotations and declarations. It _always_ gets fully erased, so there’s no remnant of it at runtime. Similarly, `export type` only provides an export that can be used for type contexts, and is also erased from TypeScript’s output.

It’s important to note that classes have a value at runtime and a type at design-time, and the use is context-sensitive. When using `import type` to import a class, you can’t do things like extend from it.

**需要注意的是类的特性，因为其既可以作为类型也可以作为变量；但是在通过仅类型导入时，如果去用于子类的继承时，就会报错，因为继承需要的是一个值，一个变量的形式，而不是类型；**

```Plaintext
import type { Component } from "react";
interface ButtonProps {
  // ...
}
class Button extends Component<ButtonProps> {
  //               ~~~~~~~~~
  // error! 'Component' only refers to a type, but is being used as a value here.
  // ...
}
```
