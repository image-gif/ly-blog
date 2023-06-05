# JavaScript-Promise

1. ## 实现 promise

> 关于使用 promise,参考博客： https://juejin.cn/post/7020335414980378655；

- Promise.resolve
- Promise.reject， 在执行的回调函数中，参数是 thanable，不是传递给回调函数的参数
- Promise.prototype.then
- Promise.prototype.catch
- Promise.all 处理并发请求，等待所有的执行完之后，触发 then 方法，其中如果有 promise 出现 rejected，all 就结束执行
- Promise.race 竞争执行 promise.谁快执行谁，参数为一个数组

> 1. 可以用来处理网络请求超时，数组中，一个是网络请求，一个是定时器(定时器到时，就触发超时事件)
>
> 对于同一个资源有多个请求路径时，可以得到耗时最少的请求，并使用

- Promise.finally 类似于 try/catch 中的 finallty;
- Promise.allSettled 等待所有的 promise 执行完毕，无论是 fulfilled 还是 rejected； 最终的 allSettled 都会返回一个 fulfilled；在 then 函数中，参数为每个 promise 处理的结果，有一个 status 属性，如果最终处理的结果为 fulfilled，那么 status=fulfilled，反之为 rejected
- Promise.any

> // 与 Promise.all 相反，如果有一个为 fulfilled，返回的新 promise 就是 fulfilled，否则就是 rejected// 数组为空或者所有 promise 都是 rejected 状态，返回一个 AggregateError：new AggregateError(errors, 'All promises were rejected')// errors 数组保存每个失败的原因，如果数组为空，则 errors 为空

## 手写 Promise

（参考：https://juejin.cn/post/7043758954496655397）

```JavaScript
class myPromise {
    // 用static创建静态属性，用来管理状态
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';

    // 构造函数：通过new命令生成对象实例时，自动调用类的构造函数
    constructor(func) { // 给类的构造方法constructor添加一个参数func
        this.PromiseState = myPromise.PENDING; // 指定Promise对象的状态属性 PromiseState，初始值为pending
        this.PromiseResult = null; // 指定Promise对象的结果 PromiseResult
        this.onFulfilledCallbacks = []; // 保存成功回调
        this.onRejectedCallbacks = []; // 保存失败回调
        try {
            /**
             * func()传入resolve和reject，
             * resolve()和reject()方法在外部调用，这里需要用bind修正一下this指向
             * new 对象实例时，自动执行func()
             */
            func(this.resolve.bind(this), this.reject.bind(this));
        } catch (error) {
            // 生成实例时(执行resolve和reject)，如果报错，就把错误信息传入给reject()方法，并且直接执行reject()方法
            this.reject(error)
        }
    }

    resolve(result) { // result为成功态时接收的终值
        // 只能由pending状态 => fulfilled状态 (避免调用多次resolve reject)
        if (this.PromiseState === myPromise.PENDING) {
            this.PromiseState = myPromise.FULFILLED;
            this.PromiseResult = result;
            /**
             * 在执行resolve或者reject的时候，遍历自身的callbacks数组，
             * 看看数组里面有没有then那边 保留 过来的 待执行函数，
             * 然后逐个执行数组里面的函数，执行的时候会传入相应的参数
             */
            this.onFulfilledCallbacks.forEach(callback => {
                callback(result)
            })
        }
    }

    reject(reason) { // reason为拒绝态时接收的终值
        // 只能由pending状态 => rejected状态 (避免调用多次resolve reject)
        if (this.PromiseState === myPromise.PENDING) {
            this.PromiseState = myPromise.REJECTED;
            this.PromiseResult = reason;
            this.onRejectedCallbacks.forEach(callback => {
                callback(reason)
            })
        }
    }

    /**
     * [注册fulfilled状态/rejected状态对应的回调函数]
     * @param {function} onFulfilled  fulfilled状态时 执行的函数
     * @param {function} onRejected  rejected状态时 执行的函数
     * @returns {function} newPromsie  返回一个新的promise对象
     */
    then(onFulfilled, onRejected) {
        // 2.2.7规范 then 方法必须返回一个 promise 对象
        let promise2 = new myPromise((resolve, reject) => {
            if (this.PromiseState === myPromise.FULFILLED) {
                /**
                 * 为什么这里要加定时器setTimeout？
                 * 2.2.4规范 onFulfilled 和 onRejected 只有在执行环境堆栈仅包含平台代码时才可被调用 注1
                 * 这里的平台代码指的是引擎、环境以及 promise 的实施代码。
                 * 实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。
                 * 这个事件队列可以采用“宏任务（macro-task）”机制，比如setTimeout 或者 setImmediate； 也可以采用“微任务（micro-task）”机制来实现， 比如 MutationObserver 或者process.nextTick。
                 */
                setTimeout(() => {
                    try {
                        if (typeof onFulfilled !== 'function') {
                            // 2.2.7.3规范 如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
                            resolve(this.PromiseResult);
                        } else {
                            // 2.2.7.1规范 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)，即运行resolvePromise()
                            let x = onFulfilled(this.PromiseResult);
                            resolvePromise(promise2, x, resolve, reject);
                        }
                    } catch (e) {
                        // 2.2.7.2规范 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e
                        reject(e); // 捕获前面onFulfilled中抛出的异常
                    }
                });
            } else if (this.PromiseState === myPromise.REJECTED) {
                setTimeout(() => {
                    try {
                        if (typeof onRejected !== 'function') {
                            // 2.2.7.4规范 如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的据因
                            reject(this.PromiseResult);
                        } else {
                            let x = onRejected(this.PromiseResult);
                            resolvePromise(promise2, x, resolve, reject);
                        }
                    } catch (e) {
                        reject(e)
                    }
                });
            } else if (this.PromiseState === myPromise.PENDING) {
                // pending 状态保存的 onFulfilled() 和 onRejected() 回调也要符合 2.2.7.1，2.2.7.2，2.2.7.3 和 2.2.7.4 规范
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            if (typeof onFulfilled !== 'function') {
                                resolve(this.PromiseResult);
                            } else {
                                let x = onFulfilled(this.PromiseResult);
                                resolvePromise(promise2, x, resolve, reject);
                            }
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            if (typeof onRejected !== 'function') {
                                reject(this.PromiseResult);
                            } else {
                                let x = onRejected(this.PromiseResult);
                                resolvePromise(promise2, x, resolve, reject);
                            }
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            }
        })

        return promise2
    }
}

/**
 * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {
    // 2.3.1规范 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
    if (x === promise2) {
        throw new TypeError('Chaining cycle detected for promise');
    }

    if (x instanceof myPromise) {
        /**
         * 2.3.2 如果 x 为 Promise ，则使 promise2 接受 x 的状态
         *       也就是继续执行x，如果执行的时候拿到一个y，还要继续解析y
         */
        x.then(y => {
            resolvePromise(promise2, y, resolve, reject)
        }, reject);
    } else if (x !== null && ((typeof x === 'object' || (typeof x === 'function')))) {
        // 2.3.3 如果 x 为对象或函数
        try {
            // 2.3.3.1 把 x.then 赋值给 then
            var then = x.then;
        } catch (e) {
            // 2.3.3.2 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
            return reject(e);
        }

        /**
         * 2.3.3.3
         * 如果 then 是函数，将 x 作为函数的作用域 this 调用之。
         * 传递两个回调函数作为参数，
         * 第一个参数叫做 `resolvePromise` ，第二个参数叫做 `rejectPromise`
         */
        if (typeof then === 'function') {
            // 2.3.3.3.3 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
            let called = false; // 避免多次调用
            try {
                then.call(
                    x,
                    // 2.3.3.3.1 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
                    y => {
                        if (called) return;
                        called = true;
                        resolvePromise(promise2, y, resolve, reject);
                    },
                    // 2.3.3.3.2 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
                    r => {
                        if (called) return;
                        called = true;
                        reject(r);
                    }
                )
            } catch (e) {
                /**
                 * 2.3.3.3.4 如果调用 then 方法抛出了异常 e
                 * 2.3.3.3.4.1 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
                 */
                if (called) return;
                called = true;

                // 2.3.3.3.4.2 否则以 e 为据因拒绝 promise
                reject(e);
            }
        } else {
            // 2.3.3.4 如果 then 不是函数，以 x 为参数执行 promise
            resolve(x);
        }
    } else {
        // 2.3.4 如果 x 不为对象或者函数，以 x 为参数执行 promise
        return resolve(x);
    }
}
```

## 实现 Promise.resolve

```JavaScript
class MyPromise {}
function resolve(promise2, x, resolve, reject) {}

//
/**
* Promise.resolve()
* @param {[type]} value 要解析为promise对象的值
*/

Mypromise.resolve = function(value) {
    // 如果value 是一个promise对象，直接返回这个promise对象
    if(value instanceof MyPromise) {
        return value;
    }
    // 如果value是一个对象，并且有一个then方法属性(thanable)
    if(value instanceof Object && 'then' in value) {
        return new Promise((resolve, reject) => {
            value.then(resolve, reject);
        })
    }

    //什么都不是，就是一个字符串之类的
    return new Promise(resolve => {
        resolve(value);
    })
}
// 也可以直接在Mypromise中写静态方法
```

## 实现 Promise.reject

```JavaScript
MyPromise.reject = function(value) {
    return new MyPromise((resolve, reject) => {
        //不同于resolve, 这里直接将value作为回调函数的参数
        reject(value);
    })
}
```

## 实现 Promise.prototype.catch

> `catch()` 方法返回一个`Promise`，并且处理拒绝的情况。它的行为与调用`Promise.prototype.then(undefined, onRejected)` 相同。
>
> 事实上, calling `obj.catch(onRejected)` 内部 calls `obj.then(undefined, onRejected)`。(这句话的意思是，我们显式使用`obj.catch(onRejected)`，内部实际调用的是`obj.then(undefined, onRejected)`)
>
> `Promise.prototype.catch()`方法是`.then(null, rejection)`或`.then(undefined, rejection)`的别名，用于指定发生错误时的回调函数。

```JavaScript
MyPromise.prototype.catch = function(callback) {
    this.then(null, callback);
}
```

## 实现 Promise.finally

> `finally() ` 方法返回一个`Promise`。在 promise 结束时，无论结果是 fulfilled 或者是 rejected，都会执行指定的回调函数。这为在`Promise`是否成功完成后都需要执行的代码提供了一种方式。
>
> 这避免了同样的语句需要在`then()`和`catch()`中各写一次的情况。该方法是 ES2018 引入标准的。
>
> **由于无法知道 promise 的最终状态，所以\*\***`finally`\***\*的回调函数中不接收任何参数，它仅用于无论最终结果如何都要执行的情况.**

```JavaScript
MyPromise.finally = function(callback） {
    return this.then(callback, callback);
}
```

## 实现 Promise.all

```JavaScript
    /**
     * Promise.all
     * @param {iterable} promises 一个promise的iterable类型（注：Array，Map，Set都属于ES6的iterable类型）的输入
     * @returns
     */
+   MyPromise.all = function(promises) {
+       return new MyPromise((resolve, reject) => {
+           // 参数校验
+           if (Array.isArray(promises)) {
+               let result = []; // 存储结果
+               let count = 0; // 计数器
+
+               // 如果传入的参数是一个空的可迭代对象，则返回一个已完成（already resolved）状态的 Promise
+               if (promises.length === 0) {
+                   return resolve(promises);
+               }
+
+               promises.forEach((item, index) => {
+                   //  判断参数是否为promise
+                   if (item instanceof myPromise) {
+                       MyPromise.resolve(item).then(
+                           value => {
+                               count++;
+                               // 每个promise执行的结果存储在result中
+                               result[index] = value;
+                               // Promise.all 等待所有都完成（或第一个失败）
+                               count === promises.length && resolve(result);
+                           },
+                           reason => {
+                               /**
+                                * 如果传入的 promise 中有一个失败（rejected），
+                                * Promise.all 异步地将失败的那个结果给失败状态的回调函数，而不管其它 promise 是否完成
+                                */
+                               reject(reason);
+                           }
+                       )
+                   } else {
+                       // 参数里中非Promise值，原样返回在数组里
+                       count++;
+                       result[index] = item;
+                       count === promises.length && resolve(result);
+                   }
+               })
+           } else {
+               return reject(new TypeError('Argument is not iterable'))
+           }
+       })
+   }
}
```

## 实现 Promise.allSettled

```JavaScript
MyPromise.allSettled = function(promises) {
   return new MyPromise((resolve, reject) => {
        if(Array.isArray(promises)) {
        let result = []; // 存储结果
        let count = 0; // 计数器

        // 如果传入的是一个空数组，则直接返回一个resolved的空数组promise对象
        if(promises.length === 0) {
            return resolve(promises);
        }
        promises.forEach((item, index) => {
            MyPromise.resolve(item).then(
               value=> {
                    result[index] = {
                        status: 'fulfilled',
                        value
                    };
                   ++count;
                   count === promises.length && resolve(result);
               },
               reason => {
                   result[index] = {
                       status: 'rejected',
                       reason
                   };
                   ++count;
                   count === promises.length && resolve(result);
               }
            )
        })
    } else {
        return reject(new TypeError('Argument is not iterable'));
    }
   })

}
```

## 实现 Promise.race

```JavaScript
MyPromise.race = function(promises) {
    return new MyPromise(resolve, reject) {
        // 参数校验
        if(Array.isArray(promises)) {
            if(promises.length > 0) {
                promises.forEach(item => {
                    MyPromise.resolve(item).then(resolve, reject);
                })
            }
        } else {
            return reject(new TypeError('Argument is not iterable'));
        }
    }
}
```

## 关于手写 promise

### 实现 then 方法的异步执行

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=YThhYmNlNWQ1ZjMzNTM2NDlhNTNmODZiMGQ3YTk3MmRfWnptbkxTSUZZemZhN2dHR0toZ253OWdRZGJzWHV4aE5fVG9rZW46Ym94Y25PY0JtWjhwTHA4bGdTWDUxNDZaTk1jXzE2ODU5NDY2NzI6MTY4NTk1MDI3Ml9WNA)

### 实现一个 MyPromise demo

```JavaScript
// 实现一个MyPromise demo

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

// excutor 参数
function MyPromise(excutor) {
  // 获取excutor参数
  if (excutor === undefined || excutor === null) {
    throw new Error('function must have a callback function prop');
  }
  if (typeof excutor !== 'function') {
    throw new Error('function prop must be a function');
  }

  let _this = this; // 缓存实例this，防止在使用时被污染
  _this.status = PENDING; // 默认状态为pending
  _this.value = undefined; // 成功时要传递给成功回调的数据，默认为undefined;
  _this.reason = undefined; // 失败时要传递给失败回调的数据，默认为undefined;

  // 存放回调函数
  _this.onResolvedCallbacks = []; // 成功回调函数
  _this.onRejectedCallbacks = []; // 失败回调函数

  // 内置resolve方法，接收成功状态数据
  function resolve(value) {
    // 只有pending可以转向另外两种状态
    if (_this.status === PENDING) {
      _this.status = FULFILLED; // 修改状态
      _this.value = value; // 保存成功时传进来的数据
      // 当成功的函数被调用时，之前缓存的回调函数会被调用
      _this.onResolvedCallbacks.forEach(function (fn) {
        fn();
      });
    }
  }
  // 内置reject方法
  function reject(reason) {
    if (_this.status === PENDING) {
      _this.status = REJECTED;
      _this.reason = reason;
      _this.onRejectedCallbacks.forEach(function (fn) {
        fn();
      });
    }
  }
  try {
    excutor(resolve, reject);
  } catch (exception) {
    reject(exception);
  }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  let _this = this;
  // 关于这里的onFulfilled和onRejected不是函数时，应该直接返回对应值，而不是不去处理哦

  /*
    Promise 规范如果 onFulfilled 和 onRejected 不是函数，就忽略他们。
    所谓“忽略”并不是什么都不干，对于onFulfilled来说“忽略”就是将value原封不动的返回，
    对于onRejected来说就是返回reason，通过 throw 抛出reason

    因为规范 2.2.7.3 和 2.2.7.4 对 onFulfilled 和 onRejected 不是函数的情况做了更详细的描述，
    根据描述我们对 onFulfilled 和 onRejected 引入了新的参数校验，所以之前的参数校验就可以退役了
  */
  // onFulfilled =
  //   typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
  // onRejected =
  //   typeof onRejected === 'function'
  //     ? onRejected
  //     : (value) => {
  //         throw value;
  //       };

  const promise2 = new MyPromise((resolve, reject) => {
    if (_this.status === FULFILLED) {
      // 微任务处理
      // js 浏览器
      // queueMicrotask(() => onFulfilled(_this.value));

      // node.js
      // process.nextTick(() => {
      //   onFulfilled(_this.value);
      // });

      setTimeout(() => {
        try {
          // 如果onFulfilled 不是一个函数，同时promise是成功执行的，那么promise2必须成功执行并返回相同的值
          if (typeof onFulfilled !== 'function') {
            resolve(onFulfilled);
          } else {
            // 获取reject的结果
            let x = onFulfilled(_this.value);
            resolvePromise(promise2, x, resolve, reject);
          }
        } catch (exception) {
          // 当resolve抛出错误时就要reject
          reject(exception);
        }
      });
    } else if (_this.status === REJECTED) {
      // queueMicrotask(() => onRejected(_this.reason));
      setTimeout(() => {
        try {
          // 如果onRejected不是一个函数，同时promise执行失败，那么此时promise2必须执行拒绝执行同时返回相同的拒绝原因
          if (typeof onRejected !== 'function') {
            reject(onRejected);
          } else {
            let x = onRejected(_this.reason);
            resolvePromise(promise2, x, resolve, reject);
          }
        } catch (exception) {
          reject(exception);
        }
      });
    } else if (_this.status === PENDING) {
      _this.onResolvedCallbacks.push(() => {
        setTimeout(() => {
          try {
            // 如果onFulfilled 不是一个函数，同时promise是成功执行的，那么promise2必须成功执行并返回相同的值
            if (typeof onFulfilled !== 'function') {
              resolve(onFulfilled);
            } else {
              // 获取reject的结果
              let x = onFulfilled(_this.value);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch (exception) {
            reject(exception);
          }
        });
      });
      _this.onRejectedCallbacks.push(
        setTimeout(() => {
          try {
            // 如果onRejected不是一个函数，同时promise执行失败，那么此时promise2必须执行拒绝执行同时返回相同的拒绝原因
            if (typeof onRejected !== 'function') {
              reject(onRejected);
            } else {
              let x = onRejected(_this.reason);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch (exception) {
            reject(exception);
          }
        })
      );
    }
  });
  return promise2;
};

// 不论promise1被resolve还是被reject时，promise2都会执行Promise解决过程：
// [[Resolve]](promise2, x);

// Promise解决过程
/**
 * 对resolve(), reject()进行改造增强，针对resolve和reject()中不同值情况，进行处理
 * @param {promise} promise2 promise1.then方法返回的新的promise
 * @param {[type]}  x        promise1中onFulfilled或onRejected的返回值
 * @param {[type]}  resolve  promise2的resolve方法
 * @param {[type]}  reject   promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {
  // 如果x 和 promise2是同一个对象，那么抛出一个TypeError作为拒因
  if (x === promise2) {
    throw new TypeError('Chaining cycle datected for promise');
  }
  // 如果x 是一个Promise,则使promise2接受x的状态
  // 也就是继续执行x,如果执行的时候拿到一个y，还要继续解析y
  if (x instanceof MyPromise) {
    // 如果x处于等待状态，promise需要保持等待状态直至x被执行或拒绝
    x.then((y) => {
      // 如果x处于执行态，用相同的值执行promise
      resolvePromise(promise2, y, resolve, reject);
    }, reject); // 如果x处于拒绝态，用相同的拒因拒绝promise
  } else if (x !== null && typeof x === 'object' && typeof x === 'function') {
    let then = null;
    // 如果x 为对象或函数
    try {
      // 把x.then 赋值给then
      then = x.then;
    } catch (exception) {
      reject(exception);
    }

    // 如果then是函数，将x作为函数的作用域this调用；
    // 传递两个回调函数作为参数，
    // 第一个参数叫做resolvePromise, 第二个参数叫做 rejectPromise
    if (typeof then === 'function') {
      // 如果resolvePromise和rejectPromise均被调用，或者被同一参数多次调用，则优先采用首次调用并忽略执行剩下的调用
      let called = false; // 防止多次调用
      try {
        then.call(
          x,
          (y) => {
            // 如果resolvePromise以值y为参数被调用，则运行[[Resolve]](promise, y)
            if (called) {
              return;
            }
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            // 如果rejectPromise以拒因r为参数，这以拒因拒绝promise
            if (called) {
              return;
            }
            called = true;
            reject(r);
          }
        );
      } catch (exception) {
        // 如果调用then方法抛出了异常
        // 忽略重复调用
        if (called) {
          return;
        }
        reject(exception);
      }
    } else {
      // 如果then不是函数，以x为参数执行promise
      resolve(x);
    }
  } else {
    // x 不是函数，不是对象，以x为参数，z执行promise
    resolve(x);
  }
}

// 实现resolve方法
MyPromise.resolve = function (value) {
  // 如果 value 是 MyPromise
  if (value instanceof MyPromise) {
    return value;
  } else if (
    value instanceof Object &&
    'then' in value &&
    typeof value['then'] === 'function'
  ) {
    // 如果这个值是thenable，返回promise会跟随这个thenable的对象，采用他的最终状态;
    return new MyPromise((resolve, reject) => {
      value.then(resolve, reject);
    });
  } else {
    // 否则返回promise将此值完成，执行resolve
    return new MyPromise((resolve) => {
      resolve(value);
    });
  }
};

// 实现reject
MyPromise.reject = function (reason) {
  return new MyPromise((resolve, reject) => {
    reject(reason);
  });
};

// 实现 catch
MyPromise.prototype.catch = function (onRejected) {
  let _this = this;
  _this.then(undefined, onRejected); // catch的实质就是将onFulfilled设置为undefined
};

// 实现finally
MyPromise.prototype.finally = function (callback) {
  let _this = this;
  _this.then(callback, callback);
};

// 实现 all
// 参数为一个Iterator对象
/**
 * @param {iterator} promises 一个promise的iterable类型(注: Array, Map, Set都属于ES6的iterable类型)的输入
 * @returns
 */
MyPromise.all = function (promises) {
  // 等待所有Promise元素执行完之后，或者其中一个执行后被拒绝
  return new MyPromise((resolve, reject) => {
    // 参数校验
    if (Array.isArray(promises)) {
      let result = []; // 存储结果
      let count = 0; // 计数器

      // 如果传入的参数为一个空的可迭代对象，则返回一个已完成（already resolved）状态的Promise
      if (promises.length === 0) {
        return resolve(result);
      }

      promises.forEach((item, index) => {
        // 判断参数是否为promise
        if (
          item instanceof MyPromise ||
          (item instanceof Object &&
            'then' in item &&
            typeof item['then'] === 'function')
        ) {
          MyPromise.resolve(item).then(
            (value) => {
              ++count;
              // 每个promise执行的结果存储在result中
              result[index] = value;
              // Promise.all 等待所有都完成（或第一个失败）
              count === promises.length && resolve(result);
            },
            (reason) => {
              // 如果传入的promise 中有一个失败(rejected)
              // Promise.all 异步地将失败的那个结果给失败状态的回调函数，而不管其他promise是否完成
              reject(reason);
            }
          );
        } else {
          // 参数里中非Promise值，原样返回在数组里
          ++count;
          result[index] = item;
          count === promises.length && resolve(result);
        }
      });
    } else {
      return reject(new TypeError('Argument is not iterable'));
    }
  });
};

// 实现Promise.allSettled
// 接收一个迭代器对象
MyPromise.allSettled = function (promises) {
  return new MyPromise((resolve, reject) => {
    // 参数校验
    if (Array.isArray(promises)) {
      let result = []; // 存储结果
      let count = 0; // 计数器

      // 如果传入的是一个空数组，那么就直接返回一个resolved的空数组promise对象
      if (promises.length === 0) {
        return resolve(result);
      }
      promises.forEach((item, index) => {
        // 非promise值，通过promise.resolve转换为promise进行统一处理
        MyPromise.resolve(item).then(
          (value) => {
            ++count;
            // 对于每个结果对象，都有status字符串，如果他的值为fulfilled，则结果对象上存在一个value
            result[index] = {
              status: FULFILLED,
              value
            };
            // 所有给定的promise都已经fufilled或rejected后，返回这个promise
            count === promises.length && resolve(result);
          },
          (reason) => {
            ++count;
            result[index] = {
              status: REJECTED,
              reason
            };

            count === promises.length && resolve(result);
          }
        );
      });
    } else {
      return reject(new TypeError('Argument is not iterable'));
    }
  });
};

// 实现Promise.any 有一个fulfilled就完成执行，或者全部都为rejected就直接reject
// 参数还是一个迭代器
MyPromise.any = function (promises) {
  return new Promise((resolve, reject) => {
    if (Array.isArray(promises)) {
      let rejectCount = 0; // 执行拒绝
      let errors = []; // 收集拒因
      promises.forEach((item, index) => {
        MyPromise.resolve(item).then(
          (value) => {
            resolve(value);
          },
          (reason) => {
            ++rejectCount;
            errors.push(reason);
            rejectCount === promises.length &&
              reject(new AggregateError(errors));
          }
        );
      });
    } else {
      return reject(new TypeError('Argument is not iterable'));
    }
  });
};

// 实现Promise.race
// 参数为一个迭代器
MyPromise.race = function (promises) {
  return new Promise((resolve, reject) => {
    if (Array.isArray(promises)) {
      promises.forEach((item) => {
        MyPromise.resolve(item).then(resolve, reject);
      });
    } else {
      return reject(new TypeError('Argument is not iterable'));
    }
  });
};
```
