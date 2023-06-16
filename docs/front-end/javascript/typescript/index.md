# TypeScript 学习

## Typescript 和 JavaScript 区别

> Typescript 是 **JavaScript 的超集**，可以被编译成 JavaScript 代码。用 JavaScript 编写的代码，在 TypeScript 中依然有效。Typescript 是纯面向对象的编程语言，包含类和接口的概念。 程序员可以用它来编写面向对象的服务端或客户端程序，并将它们编译成 JavaScript 代码。
>
> - 超集
> - 兼容 js
> - 面向对象
> - 编译成 js

## Ts 数据类型

### 简单基础类型

- Number
- String
- Boolean

只能是 true 或者 false

- Null
- Undefined
- BigInt
- Symbol

> 1. null 和 undefined 类型是比较特殊的一类，它们既可以是类型也是值，它们是所有类型的子类，但是严格模式下它们只能赋值给它们对应的类型和 any 类型，当然这里有一个例外，就是 undefined 可以赋值给 void 类型；
> 2. Symbol 类型，表示一个独一无二的值。在 TypeScript 中，可以使用 unique symbol 类型，它是 Symbol 的子类型

```TypeScript
const value: unique symbol = Symbol("123")
const value1: symbol = Symbol("123")
```

symbol 类型可以作为对象的属性名，在 es6 特性中，对象的属性可以是一个变量，那么我们可以将这个变量赋值为一个 symbol 类型的值，但是在遍历这个对象的时候，是不能通过：Object.keys, Object.getOwnPropertyNames, for...in 等方法访问到这个 symbol 类型的属性的；

但是我们通过: Object.getOwnPropertySymbols, Reflect.ownKeys 方法获取, 其中 Reflect.ownKeys 是可以获取对象自身的所有属性;

```TypeScript
let key: symbol = Symbol("name")
const obj = {
    age: 123,
    [key]: "TypeScript"
}

for(let key in obj) {
    console.log(key)
}

console.log(Object.keys(obj))
console.log(Object.getOwnPropertyNames(obj))
console.log(Object.getOwnPropertySymbols(obj))
console.log(Reflect.ownKeys(obj))
// output
[LOG]: "age"
[LOG]: ["age"]
[LOG]: ["age"]
[LOG]: [Symbol(name)]
[LOG]: ["age", Symbol(name)]
```

- Symbol.for

使用 Symbol.for 传入字符串，会先检查有没有使用该字符串调用 Symbol.for 方法创建 Symbol 类型的值，如果有就直接返回该值，如果没有就使用功能该字符串创建对应的 symbol 类型的值，并返回。

```TypeScript
const value1 = Symbol.for("123");

const value2 = Symbol.for("123");

console.log(value1 === value2) // true
```

- Symbol.keyFor

该方法传入一个 Symbol 类型的值，返回该值在全局注册的键名。

```TypeScript
const value1 = Symbol.for("123");

console.log(Symbol.keyFor(value1)); // "123"
```

### 复杂基础类型

#### Array

定义方式：

- 直接定义：通过 Type[] 的形式指定这个类型元素均为 Type 类型的数组类型，推荐使用这种方式；
- 数组泛型：通过 Array\<Type\>的形式定义，使用这种形式定义时，tslint 可能会警告让我们使用第一种形式定义，可以通过 tslint.json 的 rules 中加入 "array-type": [false] 就可以关闭 tslint 对这条的检测

```TypeScript
let array1: number[] = [1,2,3]
console.log(array1)
let array2: Array<number> = [4,5,6]
console.log(array2)
```

#### Object

在 TypeScript 中，当想让一个变量或者函数的参数类型是一个对象的形式时，可以使用这个类型

### ts 中基本数据类型的分析

> any，null，undefined（这两个在 js 中也是有的，是 js 的基本数据类型），以及 void（一般用户没有返回值的函数返回值类型上）

#### any

> `any` 类型在 TypeScript 类型系统中占有特殊的地位。它提供给你一个类型系统的「后门」,TypeScript 将会把类型检查关闭。在类型系统里 `any` 能够兼容所有的类型（包括它自己）。因此，所有类型都能被赋值给它，它也能被赋值给其他任何类型。以下有一个证明例子：

```TypeScript
let power: any;// 赋值任意类型
power = '123';
power = 123;// 它也兼容任何类型let num: number;
power = num;
num = power;
```

🍓 在进行 js -> ts 的迁移过程中，可能会大量使用 any 类型，但是 any 类型会是的 ts 几乎不进行任何的类型校验；

#### Null 和 undefined

**Js 中：**

> Undefined 和 Null 作为 JS 中唯二的两种只有一个值的类型，在 js 的许多转换机制及逻辑判断上有异于其他类型之处 一.Undefined 类型 对于一个定义了，但未赋值的变量，系统默认其为 Undefined 类型，且值为 undefined；
>
> 对于一个定义了为赋值的变量，默认赋值 undefined，对于一个未定义的变量，使用 typeof 时，返回 undefined
>
> 二.Null 类型 一般未指定指向对象的指针会被默认为 Null 类型，因为一个值为 Null 的变量其实际类型为 object，因为系统会将其视为一个保存对象的变量，只不过还未初始化。

**Ts 中：**

> 在类型系统中，JavaScript 中的 null 和 undefined 字面量和其他被标注了 `any` 类型的变量一样，都能被赋值给任意类型的变量，如下例子所示：

```TypeScript
// strictNullChecks: false

let num: number;
let str: string;// 这些类型能被赋予
num = null;
str = undefined;
```

#### Void

> 使用 `:void` 来表示一个函数没有一个返回值

```TypeScript
function log(message: string): void {console.log(message);}
```

#### Never

> `never` 类型是 TypeScript 中的底层类型。它自然被分配的一些例子：
>
> - 一个从来不会有返回值的函数（如：如果函数内含有 `while(true) {}`）；
> - 一个总是会抛出错误的函数（如：`function foo() { throw new Error('Not Implemented') }`，`foo` 的返回类型是 `never`）；

你也可以将它用做类型注解：

```TypeScript
let foo: never; // ok
```

但是，`never` 类型仅能被赋值给另外一个 `never`：

```TypeScript
let foo: never = 123;
// Error: number 类型不能赋值给 never 类型
// ok, 作为函数返回类型的 never
let bar: never = (() => {throw new Error('Throw my hands in the air like I just dont care');})();
```

##### 与 `void` 的差异

一旦有人告诉你，`never` 表示一个从来不会优雅的返回的函数时，你可能马上就会想到与此类似的 `void`，然而实际上，`void` 表示没有任何类型，`never` 表示永远不存在的值的类型。

当一个函数返回空值时，它的返回值为 void 类型，但是，当一个函数永不返回时（或者总是抛出错误），它的返回值为 never 类型。void 类型可以被赋值（在 strictNullChecking 为 false 时），但是除了 never 本身以外，其他任何类型不能赋值给 never。

````TypeScript
// 一般的never不能用于函数返回值，但是像这种抛错误异常的函数，可以使用never
function bar(): never {
  throw new Error('稀烂');
}

// 使用void
function foo(): void {
  // throw new TypeError();
  console.log('稀烂');
}

#### Unknown

> unknown 类型是 ts 中所有基础类型的父类型，所有基础类型都能赋值为 unknown 类型。
>
> 但是当 unknown 类型赋值为其他任意类型时，就会进行类型检查。我们必须将这个 unknown 类型的变量断言为具体的类型，才可以继续使用。
>
> 所以 any 和 unknown 的区别就是：
>
> 二者都是可以赋值给任意类型的， `any` 会绕过类型检查，直接可用；而 `unkonwn` 则必须要在判断完它是什么类型之后才能继续使用（需要先进行类型断言）

## TypeScript 中特有的类型

### 联合类型

> 在 JavaScript 中，你可能希望属性为多种类型之一，如字符串或者数组。这正是 TypeScript 中联合类型能派上用场的地方（它使用 `|` 作为标记，如 `string | number`）。关于联合类型，一个常见的用例是一个可以接受字符串数组或单个字符串的函数

```TypeScript
function formatCommandline(command: string[] | string) {
let line = '';
if (typeof command === 'string') {
    line = command.trim();
}
else {
    line = command.join(' ').trim();
}
// Do stuff with line: string
}
````

### 交叉类型

> 在 JavaScript 中， `extend` 是一种非常常见的模式，在这种模式中，你可以从两个对象中创建一个新对象，新对象拥有着两个对象所有的功能。交叉类型可以让你安全的使用此种模式：

```TypeScript
function extend<T extends object, U extends object>(first: T, second: U): T & U {
    const result = <T & U>{};
    for (let id in first) {
        (<T>result)[id] = first[id];
    }
    for (let id in second) {
        if (!result.hasOwnProperty(id)) {
            (<U>result)[id] = second[id];
         }
    }
    return result;
}
const x = extend({ a: 'hello' }, { b: 42 });
// 现在 x 拥有了 a 属性与 b 属性
const a = x.a;
const b = x.b;
```

### 元组类型

> JavaScript 并不支持元组，开发者们通常只能使用数组来表示元组。而 TypeScript 支持它，开发者可以使用
>
> `:[typeofmember1, typeofmember2]` 的形式，为元组添加类型注解，元组可以包含任意数量的成员，示例：

```TypeScript
let nameNumber: [string, number];// Ok
nameNumber = ['Jenny', 221345];// Error
nameNumber = ['Jenny', '221345'];
```

### 枚举类型

使用 enum 关键字定义一个枚举类型，可以给指定的枚举类型设置一个初始值，那么后面的值会根据这个值进行累加(前提是 number 类型)，如果值为 string 等其他类型，需要手动设置值

```TypeScript
enum Roles {
    ONE=1,
    TWO,
    THREE,
    FOUR,
    FIVE=100,
    SEX,
    SEVEN,
    EIGHT = 2,
}
console.log(Roles.ONE)
console.log(Roles.TWO)
console.log(Roles.THREE)
console.log(Roles.FOUR)
console.log(Roles.FIVE)
console.log(Roles.SEX)
console.log(Roles.SEVEN)
console.log(Roles.EIGHT)
// output
[LOG]: 1
[LOG]: 2
[LOG]: 3
[LOG]: 4
[LOG]: 100
[LOG]: 101
[LOG]: 102
[LOG]: 2
```

## 函数

#### 重载

```TypeScript
// 重载
function padding(all: number);
function padding(topAndBottom: number, leftAndRight: number);
function padding(top: number, right: number, bottom: number, left: number);
// Actual implementation that is a true representation of all the cases the function body needs to handle
// 函数重载，在写多个函数重载时，最后是通过一个实际执行函数作为最终执行的部分，上述只是进行了定义
function padding(a: number, b?: number, c?: number, d?: number) {
if (b === undefined && c === undefined && d === undefined) {
    b = c = d = a;} else if (c === undefined && d === undefined) {
    c = a;
    d = b;}return {
    top: a,
    right: b,
    bottom: c,
    left: d
  };}
```

## class 类型

- #### 提供了三个访问修饰符

- - public
  - private
  - protected

其中 protected 还可以修饰 contructor，以此来实现类似抽象类，不能直接实例化

```JavaScript
// js实现类似抽象类
class Animal {
    constructor() {
        if(new.target === Animal) {
            throw new Error('...')
        }
    }
}
// ts实现
class Animal {
    protected contructor() {

    }
}
```

#### 只读修饰符 readonly

```TypeScript
class Animal {
    readonly name: string;
    constructor(name: string) {
        this.name = name;
    }
}
```

#### 静态属性

```TypeScript
class Animal {
    public static Type: string = "Animal";
    constructor() {}
}
Animal.Type;
```

#### 抽象类

不能直接实例化，只能被继承，同时派生类必须定义对应抽象类中的声明的抽象函数（带有 abstract 的函数）;

注意必须给类加上 abstract 关键字

```TypeScript
abstract class Animal {
    constructor(name:string) {
        this.name = name;
    }
    abstract printName():void;
}

class Cat extends Animal {
    constructor(name: string) {
        super(name);
    }
    printName() {
        console.log(this.name);
    }
}
```

#### 类的接口

类可以实现定义的接口，通过 implements 关键字；

接口检测的是使用该接口定义的类创建的实例，所以下面第五行虽然定义了静态属性 type，但静态属性不会添加到实例上，所以还是会报错

```TypeScript
interface IFoodTypes {
    type: string;
}
class Animal implements IFoodTypes {
    static type: string = "123"; // 直接报错
    constructor() {}
}
 // 修改
class Animal implements IFoodTypes {
    public type: string;
    constrcutor(type: string) {
        this.type = type;
    }
}
```

## 类型别名

> TypeScript 提供了为类型注解设置别名的便捷语法，你可以使用 `type SomeName = someValidTypeAnnotation` 来创建别名：

```TypeScript
type StrOrNum = string | number;// 使用let sample: StrOrNum;
sample = 123;
sample = '123';// 会检查类型
sample = true; // Error
```

TIP

- 如果你需要使用类型注解的层次结构，请使用接口。它能使用 `implements` 和 `extends`
- 为一个简单的对象类型（如上面例子中的 Coordinates）使用类型别名，只需要给它一个语义化的名字即可。另外，当你想给联合类型和交叉类型提供一个语义化的名称时，一个类型别名将会是一个好的选择。

## 类型断言

> TypeScript 允许你覆盖它的推断，并且能以你任何你想要的方式分析它，这种机制被称为「类型断言」。TypeScript 类型断言用来告诉编译器你比它更了解这个类型，并且它不应该再发出错误。

最初的断言语法如下所示：

```TypeScript
let foo: any;let bar = <string>foo; // 现在 bar 的类型是 'string'
```

然而，当你在 JSX 中使用 `<foo>` 的断言语法时，这会与 JSX 的语法存在歧义：

```TypeScript
let foo = <string>bar;</string>;
```

因此，为了一致性，我们建议你使用 `as foo` 的语法来为类型断言

## 异常处理

> JavaScript 有一个 `Error` 类，用于处理异常。你可以通过 `throw` 关键字来抛出一个错误。然后通过 `try/catch` 块来捕获此错误

除内置的 `Error` 类外，还有一些额外的内置错误，它们继承自 `Error` 类：

#### RangeError

当数字类型变量或者参数超出其有效范围时，出现 `RangeError` 的错误提示：

```TypeScript
// 使用过多参数调用 console
console.log.apply(console, new Array(1000000000)); // RangeError: 数组长度无效
```

#### ReferenceError

当引用无效时，会出现`ReferenceError`的错误提示：

```TypeScript
'use strict';
console.log(notValidVar); // ReferenceError: notValidVar 未定义
```

#### SyntaxError

语法错误

#### TypeError

类型错误

```TypeScript
'1.2'.toPrecision(1); // TypeError: '1.2'.toPrecision 不是函数。
```

#### URIError

当传入无效参数至 `encodeURI()` 和 `decodeURI()` 时，会出现 `URIError` 的错误提示：

```TypeScript
decodeURI('%'); // URIError: URL 异常
```

### 使用 Error

> 在开发过程中，需要抛出异常或者错误的地方，尽量不要直接抛出字符串，虽然这样也是允许的；
>
> 但是使用 Error 对象的好处就是，可以自动跟踪堆栈的属性构建 以及生成位置；
>
> 原始字符串会导致极差的调试体验，并且在分析日志时，将会变得错综复杂。

## Mixins

> 混入，通过一个方法，将多个属性，类等合并到一个地方；

[深入理解 TypeScript](https://jkchao.github.io/typescript-book-chinese/)

## 关于 infer 的使用

> 相当于一个类型的占位

Infer 关键字用于条件中的类型推导。

Typescript 官网也拿 `ReturnType` 这一经典例子说明它的作用：

```TypeScript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
复制代码
```

理解为：如果 `T` 继承了 `extends (...args: any[]) => any` 类型，则返回类型 `R`，否则返回 `any`。其中 `R` 是什么呢？`R` 被定义在 `extends (...args: any[]) => infer R` 中，即 R 是从传入参数类型中推导出来的。

## 关于 tslint.json

TSLint 是一个 tslint.json 进行配置的插件，在编写 TypeScript 代码时，可以对代码风格进行检查和提示。如果对代码风格有要求，就需要使用到 TSLint 了，其使用步骤如下：

```Shell
# 安装TSLint
npm install tslint -g

# 使用TSLint初始化配置文件
tslint -i
```

执行初始化之后，会在根目录下生成一个 tslint.json 的配置文件，里面的初始内容如下：

```JSON
{
    "defaultSeverity": "error",
    "extends": [
        "tslint:recommended"
    ],
    "jsRules": {},
    "rules": {},
    "rulesDirectory": []
}
```

- defaultSeverity: 提醒级别，分别如下：
  - error， 此时会报错
  - warning，此时会出现警告
  - off，关闭对应 tslint
- extends：可以指定继承指定的预配置规则；
- jsRules：用来配置对.js 和 .jsx 文件的校验， 配置规则的方法和下面的 rules 一样
- rules：TSLint 检查代码的规则都是在这种进行配置，比如当我们不允许代码中使用 eval 方法时，就要在这里配置"no-eval": true
- rulesDirectory: 可以指定规则配置文件，这里指定相对路径
