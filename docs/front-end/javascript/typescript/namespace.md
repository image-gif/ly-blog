# 命名空间

> **命名空间**：命名空间一个最明确的目的就是解决重名问题
>
> 命名空间定义了标识符的可见范围，一个标识符可在多个名字空间中定义，它在不同名字空间中的含义是互不相干的
>
> 这样，在一个新的名字空间中可定义任何标识符，它们不会与任何已有的标识符发生冲突，因为已有的定义都处于其他名字空间中

## **命名空间的声明**

TypeScript 的命名空间只对外暴露需要在外部访问的对象，命名空间内的对象通过 export 关键字对外暴露，比如我们在一个名叫 `utils.ts` 的文件里声明一个命名空间：

```COBOL
// utils.ts
namespace Utils {
    export interface IPerson {
        name: string;
        age: number;
    }
}
```

## **命名空间的使用**

通过 namespace 关键字声明命名空间，在命名空间外部需要通过*完全限定名*访问这些对象，通常情况下，声明的命名空间代码和调用的代码不在同一个文件里，因此在其他文件中使用，注意引入的路径要写正确，此处我们在同级目录中任意一个 ts 文件中使用我们刚定义的命名空间：

```COBOL
/// <reference path="utils.ts" />
const me: Utils.IPerson = {
    name: 'funlee',
    age: 18
}
console.log(me); // {name: 'funlee', age: 18}

```

如上述代码所示，通过 reference 注释引用命名空间，即可通过*完全限定名*进行访问，我们也可以通过 `import` 导入模块的形式，引入命名空间：

```COBOL
import './utils'

const me: Utils.IPerson = {
    name: 'funlee',
    age: 18
}
console.log(me); // {name: 'funlee', age: 18}

```

## **多文件的命名空间**

就像普通的 JS 模块文件可以相互引用一样，包含 namespace 的命名空间文件也可以相互引入，还可以组合成一个更大的命名空间，下面是一个简单的示例，所有文件都在同一目录下，你也可参考官方示例：

```COBOL
namespace Utils {
    export interface IAnimal {
        name: string;
        say(): void;
    }
}
```

animal.ts

```COBOL
/// <reference path="utils.ts" />

export namespace Animal {
    export class Dog implements Utils.IAnimal{
        name: string;
        constructor(theName: string) {
            this.name = theName;
        }
        say() {
            console.log(`${this.name}: 汪汪汪`)
        }
    }
}
```

index.ts

```COBOL
import {Animal} from './animal';

const he = new Animal.Dog('Jack');
he.say(); // Jack: 汪汪汪

```

## 命名空间和模块的区别

> **模块**：`TypeScript` 与` ECMAScript` 2015 一样，任何包含顶级 `import` 或者 `export` 的文件都被当成一个模块
>
> 相反地，如果一个文件不带有顶级的`import`或者`export`声明，那么它的内容被视为全局可见的

**它们之间的区别**：

- 命名空间是位于全局命名空间下的一个普通的带有名字的 JavaScript 对象，使用起来十分容易。但就像其它的全局命名空间污染一样，它很难去识别组件之间的依赖关系，尤其是在大型的应用中
- 像命名空间一样，模块可以包含代码和声明。 不同的是模块可以声明它的依赖
- 在正常的 TS 项目开发过程中并不建议用命名空间，但通常在通过 d.ts 文件标记 js 库类型的时候使用命名空间，主要作用是给编译器编写代码的时候参考使用

## 类型声明空间和变量声明空间

```TypeScript
// 类型声明空间包含用来当做类型注解的内容，例如下面的类型声明：
class Foo {}
interface Bar {}
type Bas = {};

//
let foo: Foo;
let bar: Bar;
let bas: Bas;
```

🍓 注意，尽管你定义了 `interface Bar`，却并不能够把它作为一个变量来使用，因为它没有定义在变量声明空间中。

```TypeScript
//变量声明空间包含可用作变量的内容，在上文中 Class Foo 提供了一个类型 Foo 到类型声明空间，此外它同样提供了一个变量 Foo 到变量声明空间，如下所示：

class Foo {}
const someVar = Foo;
const someOtherVar = 123;
```

🍓 与此相似，一些用 `var` 声明的变量，也只能在变量声明空间使用，不能用作类型注解。
