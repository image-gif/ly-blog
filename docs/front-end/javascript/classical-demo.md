# JavaScript 经典 demo

## 实现一个 sleep 函数

### 概念

> 官方介绍：sleep 是一种函数，作用是延时，程序暂停若干时间，在执行时要抛出一个中断异常，必须对其进行捕获并处理才可以使用这个函数。

```JavaScript
 log(123);
 sleep(1000);
 log(345);
```

看到这里有人会问了，为什么要使用 sleep，上面的例子我可以使用 setTimeout 来实现啊？

因为 setTimeout 是通过回调函数来实现[定时任务](https://so.csdn.net/so/search?q=定时任务&spm=1001.2101.3001.7020)的，所以在多任务的场景下就会出现回调嵌套;

```JavaScript
 console.time('runTime:');
   setTimeout(() => {
     console.log('1');
     setTimeout(() => {
       console.log('2')
       setTimeout(() => {
         console.log('3')
         console.timeEnd('runTime:');
       }, 2000);
     }, 3000);
```

### 实现

#### 使用 Date 计时处理

```JavaScript
//

function sleep(time){
 var timeStamp = new Date().getTime();
 var endTime = timeStamp + time;
 while(true){
 // 无限循环，直到条件满足为止
     if (new Date().getTime() > endTime){
          return;
     }
 }
```

**这个方法，可以实现表面上的睡眠，但是实则在内部是占用很高内存，CPU 占用也是很大的；通过无限循环的方式，很有可能造成浏览器卡顿；不推荐使用**

### 基于 promise 实现

```JavaScript
  function sleep(time) {
      return new Promise((resolve) => {
          setTimeout(resolve, time);
      })
  }

  sleep(1000).then(() => {
      sleep(1000).then(() => {
      })
  })
```

**虽然 promise 方法没有了 setTimeout 方法的回调地狱问题，但是这里嵌套过程也是很难看的，对于维护也是很不利的，不是很推荐这种方式；**

### 使用 Generator 函数实现

> 搭配 co 执行生成函数

```JavaScript
 function sleeep(time) {
     return new Promise(resolve => {
         setTimeout(resolve, time);
     })
 }

 function * run() {
     console.log('first');
     yield sleep(1000);
     console.log('second');
     yield sleep(1000);
     console.log('third');
 }

 co(run);
```

> 这种方式可以很直观的使用 sleep()函数，便于维护；

### 使用 async/await 实现

```JavaScript
 function sleeep(time) {
     return new Promise(resolve => {
         setTimeout(resolve, time);
     })
 }

 async function run() {
     console.log('first');
     await sleep(1000);
     console.log('second');
     await sleep(1000);
     console.log('third');
 }

 run();
```

> 这种方式也是非常直观，比较推荐使用。

## call、apply、bind

> 实现这个三个方法

### call

**使用**

```JavaScript
fn.call(Context[, arg1[, arg2 ...]]);
// 参数1 为fn函数的this指针指向，如果this === undefined | null, 默认指向window | globalThis
// 参数2及以后的所有参数为传递给fn的参数， 这些参数是直接加上去的，不用特意放到数组中
// call 方法实现
function myCall(thisArg, ...args) {
  const fn = this; // 获取这个函数

  // 当thisArg === undefined || thisArg == null 时，默认指向全局对象
  if (thisArg === undefined || thisArg == null) {
    thisArg = window || globalThis;
  }

  // 因为后面我们需要在thisObj上添加func, 所以这里我们直接将原this上下文作为一个对象的原型，避免污染this上下文
  // 当然这里可以直接使用Object构造函数，创建一个对象，但是在执行完func函数之后，需要将指定的属性删除，避免污染this上下文
  let tempObj = Object.create(thisArg); // 创建一个对象，对象的原型指向thisArg

  // 当然这里的直接这样func属性是没有问题，因为此时的tempObj是一个空对象，但是它的原型是指向thisArgs的
  // 当然也可以采用Symbol('func') 创建一个独一无二的属性名
  tempObj['fun'] = fn;

  const result = tempObj['fun'](...args);
  // 如果上面是直接创建的tempObj， 那么这里需要进行 delete tempObj['func'];

  return result;
}

Function.prototype.myCall = myCall;
```

### apply

```JavaScript
// 使用
fn.apply(Context, [...args]?);
// 参数1 为fn函数的this指针指向， 如果this === undefined | null, 默认指向window | globalThis
// 参数2为可选参数， 为一个数组

Function.prototype.myApply = function myApply(thisArg, args) {
  if (!Array.isArray(args)) {
    throw new TypeError('args should be a Array');
  }
  if (thisArg === undefined || thisArg == null) {
    thisArg = window || globalThis;
  }
  const fn = this;
  let tempObj = Object.create(thisArg);
  tempObj['func'] = fn;

  const res = tempObj['func'](...args);
  return res;
};
```

### bind

```JavaScript
// 使用
const res = bar.bind(thisContext, [...args]?); // 返回一个函数
res();

// 实现
Function.prototype.myBind = function myBind(thisArg, args) {
  if (!Array.isArray(args)) {
    throw new TypeError('args should be a Array');
  }
  if (thisArg === undefined || thisArg == null) {
    thisArg = window || globalThis;
  }
  const fn = this;
  function foo(...rangs) {
    fn.apply(thisArg, [...rangs, ...args]);
  }

  const Empty = function () {};
  Empty.prototype = this.prototype; // 获取原来函数的原型
  // const Empty = Object.create(this.prototype); // 大致同理
  foo.prototype = new Empty();
  return foo;
};
```

## 柯里化

> 柯里化（Currying）又称**部分求值**，一个柯里化的函数首先会接收一些参数，接收了这些参数后，该函数并不会立即求值，而是继续返回另外一个函数，刚才传入的参数在函数形成的闭包中被保存起来。待到函数被真正需要求值的时候，之前传入的所有参数都会被一次性用于求值。

```JavaScript
// 实现函数柯里化
function curry(fn) {
  // 判断是否为函数
  if (Object.prototype.toString.call(fn) === '[object Function]') {
    // 获取函数的形参数量
    const len = fn.length;
    return function foo(...args) {
      // 获取传入实参的数量
      const argLen = args.length;
      if (len <= argLen) {
        // 如果实参的数量大于等于形参时，就返回原函数执行的结果;
        return fn.apply(undefined, args);
      } else {
        // 传入实参不足,返回一个函数，接收剩余实参
        return function (...ranges) {
          // 递归调用foo函数，将所有的实参合并到一起
          return foo.apply(undefined, [...args, ...ranges]);
        };
      }
    };
  } else {
    throw new TypeError('props should be a function');
  }
}
```

## 实现 instanceof

> 获取原型方法，在 es6 里面提供的新的方法 Object.getPrototypeOf(object)

```JavaScript
/**
 * @param {any} object
 * @param {any} classFunction
 * @return {boolean}
 */
var checkIfInstanceOf = function(obj, classFunction) {
    if(obj === null || obj === undefined) {
        return false;
    }
    var prototype = obj.__proto__;
    // 获取原型方法，在es6里面提供的新的方法
    // Object.getPrototypeOf(object)
    while(prototype) {
        if(prototype.constructor === classFunction) {
            return true;
        }
        prototype = prototype.__proto__;
    }
    return false;
};
```
