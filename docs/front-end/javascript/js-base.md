# js 基础知识

## 1. 关于 undefined 和 void 0

> 在代码中判断变量是否等于 undefined 的常用写法都是 undefined === 变量；
> 但是在以前的 IE 浏览器中，undefined 是作为全局对象中的属性的，可以被修改；虽然在 es5 之后，undefined 就被作为只读属性，不能被修改；但是在局部作用域中，我们仍然可以使用 var undefined = xxx; 修改 undefined 的值；

### 关于 void 的使用

```js
// 语法 -- 一元运算符
void expression;

// 描述
// 这个运算符能向期望表达式的值是undefined的地方插入会产生副作用的表达式
// void 运算符通常只用于获取 undefined的原始值，一般使用void(0)（等同于void 0）。在上述情况中，也可以使用全局变量undefined 来代替（假定其仍是默认值）

// void后跟着表达式，表达式中的语句会全部执行
// void 返回值永远是undefined
// void后面跟含有getter属性的函数，会进行调用执行语句，不会返回值
```

使用 void 的地方：
为什么要用 void 0 替代 undefined：
① 某些情况下用 undefined 判断存在风险，因 undefined 有被修改的可能性，但是 void 0 返回值一定是 undefined
② 兼容性上 void 0 基本所有的浏览器都支持
③ void 0 比 undefined 字符所占空间少。

## 2. \* 纯函数

> - 此函数在输入相同的值时，需产生相同的输出。函数的输出和输入值以外的其他隐藏信息或状态无关。也和由 I/O 设备产生的外部输出无关；
> - 该函数不能有语义上、可观察的函数副作用，诸如：'触发事件'，使输出设备输出，或更改输出值以外物件的内容等。
>   满足以上条件的就称为纯函数；

纯函数的输出可以不用和所有的输入值有关，甚至可以和所有的输入值都无关。但纯函数的输出不能和输入值以外的任何资讯有关。纯函数可以传回多个输出值，但上述的原则需针对所有输出值都要成立。若引数是传引用调用（参数是引用类型），若有对参数物件的更改，就会影响函数以外物件的内容，因此就不是纯函数。

## 3. 关于通过 js 实现控制台输入输出

> 这里主要就是在算法编程中，会出现手动输入，然后读取内容，进行后续逻辑处理
> https://labfiles.acmcoder.com/ojhtml/index.html#/?id=jsv8

```js
// Node.js中
// const readline = require('node:readline');
// const str = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// str.question(`what do you think of Node.js ?${'/n'}`, (answer) => {
//   // TODO: log the answer in a database
//   console.log(`this is your answer: ${answer}`);

//   str.close();
// });

// const str = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// 提示文本独占一行
// console.log('请输入数字：');
// str.on('line', function (input) {
//   console.log(input);
//   str.close();
// });

// 实现提示文本和输入文本在同一行
// str.question('input your answer: ', function (input) {
//   console.log('your answer: ', input);
//   str.close();
// });
// console.log(str);
//

// ACM 模式下，系统给出的输入方式
// const rl = require('node:readline').createInterface({
//   input: process.stdin
// });

// var iter = rl[Symbol.asyncIterator]();
// const readline = async () => (await iter.next()).value;

// void async function () {
//   //
//   while ((lin = await readline())) {
//     let tokens = line.split(' '); // 输入一行数字用空格隔开
//     let a = parseInt(tokens[0]); // 获取第一个数字
//     let b = parseInt(tokens[1]); // 获取第二个
//     console.log(a + b); // 打印数字
//   }
// };
```

## 4. js 库

链接： https://segmentfault.com/a/1190000041405707?utm_source=weekly&utm_medium=email&utm_campaign=email_weekly

## 5. 使用 Proxy 和 Reflect

> Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

**Proxy.revocable()**
创建一个可撤销的 Proxy 对象。

> Reflect 是一个内置的对象，它提供拦截 JavaScript 操作的方法。这些方法与 proxy handler (en-US) 的方法相同。Reflect 不是一个函数对象，因此它是不可构造的。

与大多数全局对象不同 Reflect 并非一个构造函数，所以不能通过 new 运算符对其进行调用，或者将 Reflect 对象作为一个函数来调用。Reflect 的所有属性和方法都是静态的（就像 Math 对象）。
Reflect 对象提供了以下静态方法，这些方法与 proxy handler 方法的命名相同。

### 13 种捕获器

捕获器：这是从操作系统中借用的概念。在操作系统中，捕获器是程序流中的一个同步中断，可以暂停程序流，转而执行一段子例程，之后再返回原始程序流。

#### Get

```js
  /**
   * @param {Object} trapTarget 目标对象
   * @param {string | symbol} property 引用的目标对象上的字符串键属性（也可以是符号键symbol）
   * @param {Object} receiver 代理对象或者继承代理对象的对象
   */
  get(trapTarget, property, receiver) {
    // todo some handle
    return Reflect.get(trapTarget, property, receiver);
  },
```

#### Set

```js
  /**
   * @param {any} value 赋值的value
   */
  set(trapTarget, property, value, receiver) {
    //todo some handle
    if (Reflect.set(trapTarget, property, value, receiver)) {
      alert('set success');
    } else {
      alert('set error'); // 严格模式下，如果如果设置失败就直接抛出TypeError
    }
  },
```

#### Has

```js
    has(trapTarget, property) {
      return Reflect.has(...arguments);
    },
```

#### defineProperty

```js
    defineProperty(trapTarget, property, descriptor) {
      return Reflect.defineProperty(trapTarget, property, descriptor);
    },
```

#### getOwnPropertyDescriptor

```js
  getOwnPropertyDescriptor(trapTarget, property) {
    return Reflect.getOwnPropertyDescriptor(...arguments);
  },
```

#### deleteProperty

```js
deleteProperty(trapTarget, property) {
  return Reflect.deleteProperty(...arguments);
},
```

#### ownKeys

```js
  ownKeys(trapTarget) {
    return Reflect.ownKeys(trapTarget);
  },
```

#### getPrototypeOf

```js
  getPrototypeOf(trapTarget) {
    return Reflect.getPrototypeOf(trapTarget);
  },
```

#### setPrototypeOf

```js
setPrototypeOf(trapTarget, property) {
  return Reflect.setPrototypeOf(...arguments);
},
```

#### isExtensiable

```js
  isExtensiable(trapTarget) {
    return Reflect.isExtensible(trapTarget);
  },
```

#### preventExtensiable

```js
preventExtensiable(trapTarget) {
  return Reflect.preventExtensions(trapTarget);
},
```

#### apply

```js
apply(trapTarget, thisArg, ...argumentsList) {
  return Reflect.apply(...arguments);
},
```

#### constructor

```js
contructor(trapTarget, argumentsList, newTartget) {
  return Reflect.construct(...arguments);
}
```

## Map / WeakMap 、Set / WeakSet

### 1. Map

> 在 es6 之前，JavaScript 使用 Object 存储键值对。但是这种方式终究是存在问题的，为此 TC39 委员会专门为键值对存储定义了一个规范。
> Map 是一种新的集合类型，实现真正的键值对存储机制。

- 通过 new, 构造函数 创建一个 Map 集合

```js
  // 初始化一个空映射
  const map = new Map();
  // 初始化一个有初始值的映射, 需要传入一个可迭代对象（注意原始的 object 是一个不可迭代对象）
  const mapHasDefault = new Map([
  ['userName', '张三'],
  ['userAge', 12]
  ]);

  // 使用一个自定义的可迭代对象初始化
  const customIterator = new Map({
    [Symbol.Iterator]: function\* {
    yield ['key1', 'value1'];
    yield ['key2', 'value2'];
    ... ...
    }
  })
```

- 基本操作

```js
// 使用 Map 集合
const map = new Map();
// 获取 map 大小
const size = map.size;
// 插入值
map.set('useName', '张三'); // 返回一个 Map 映射，可以进行链式调用
// 获取值
map.get('userName');
// 判断是否有对应的键值
map.has('userName');
// 删除指定键值
map.delete('userName');
// 清空：危险操作
map.clear();

// 迭代
for (let [key, value] of map.entries()) {
  console.log(key, value);
}
// map.entries === map[symbol.Iterator]

// 返回键值数组的方法
map.keys();
// 返回值的数组的方法
map.values();
```

> 区别于传统的 Object 对象：

> 1. map 映射的键可以是任意数据类型，但是 Object 只能使用数值，字符串，符号作为键；
> 2. map 是一个可迭代的对象；
> 3. map 使用了 SameValueZero(零值相等)来判断键值的相等性，在访问 map 中的值的时候，使用这种方法判断键值相等性（在 Set 集合中也是使用的这个）；Object 采用等值相等;
> 4. map 维护插入顺序，进行顺序迭代；Object 没有这个顺序；
> 5. map 可以直接使用扩展运算符将映射转换成数组;
> 6. 内存占用：不同浏览器有不同策略，对于相同的固定大小内存，Map 大约可以比 Object 多存储 50%的键值对；
> 7. 插入性能：Map 稍微比 Object 快一些，涉及到大量插入时，Map 的性能要更好一些；
> 8. 查找速度：在大型 Object 和 Map 中查找键值对的性能差异极小，但是如果只包含少量的键值对，则有时 Object 速度会更快一些；在浏览器中，如果 Object 的中的属性使用连续整数作为属性值，那么浏览器引擎会做相应的性能优化，提高查询速度，但是 Map 没有这样的待遇。对这两个类型而言，查找速度不会随着键值对增加呈线性增长；
> 9. 删除性能： 在 Map 中的 delete 方法，比查询和插入都快，如果代码中涉及大量删除，Map 肯定就是第一选择；对于 Object 的 delete 方法，感觉不受什么好评，一些使用 undefined、null 来进行伪删除的方式，也是没有得到多少好评；

### 2. WeakMap

> 弱类型映射（WeakMap）的键值只能是 Object 或者是继承 Object 类型；
> 这种映射的键值只有在外部还保留着它的引用，才能继续存 WeakMap 中，如果外部没有应用就会从 WeakMap 中删除；因此，WeakMap 中是没有遍历的方法（因为存在一些属性可以被删除了）；

**举个例子：**

```js
const weakMap = new WeakMap();
const obj = {
key1: 'hello'
}

weakMap.set(obj, '你好')；
weakMap.set({key2: 'world'}, '大家好')

weakMap.get(obj); // '你好'
// 还有一个直接就访问不了，同时他在创建时，就被立即删除了
```

### 3. Set And WeakSet

> 这两个类似上述内容；同时它也是类似于普通数组；区别在于：
>
> 1. set 集合中的元素不存在相同的元素；
> 1. 弱集合类似上述 weakMap 的特点；

## 正则表达式

### 开始

> - new RegExp()
> - /匹配内容/[修饰符]

```js
const reg = new RegExp('', 'g'); // 参数一： 匹配项； 参数二： 修饰符
const str = 'hello RegExp';
str.match(reg); // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/match

const reg = /regexp/g;
reg.test(str); // false
```

### replace

> 首先这个 replace 方法是字符串的方法，之所以这里会使用它，是因为这里的 replace 方法就使用到了正则，不仅对于学习正则有帮助，同时也是我们在项目开发时会使用到的方法；
> MDN: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace

### 修饰符

- g : 匹配全部字符串
- i : 忽略大小写
- m : 匹配多行

```js
// 匹配驼峰字符串，使用连接符连接
function styleHyphenFormatAdv(propertyName) {
  function upperToHyphenLower(match) {
    return '-' + String.prototype.toLowerCase.call(match);
  }
  return propertyName.replace(/(?<=\w)[A-Z]/g, upperToHyphenLower);
}
```
