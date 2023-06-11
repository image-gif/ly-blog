进阶 axios

阅读源码不仅能学习到新的知识点也能发现自己的不足，带着问题去读源码是个好的习惯哦：

- 1.axios 是怎么实现可以创建多个实例的。
- 2.axios 的拦截器是怎么实现的。
- 3.axios 取消请求是怎么实现的。
- 4.axios 是怎么做到防`xsrf(csrf)`攻击的
- 5.axios 的优缺点。

## 解决问题式阅读源码

### axios 是怎么实现可以创建多个实例的

> 在源码中，通过 createInstance 函数创建新的实例、
>
> createInstance 是一个工厂函数，可以创建出相同属性的 axios 对象

```JavaScript
/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */

function createInstance(defaultConfig) {
  // 创建一个Axios实例
  const context = new Axios(defaultConfig);
  // 调用bind函数，将Axios原型上的request函数上下文绑定到context,返回一个实例（函数）
  const instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context, {allOwnKeys: true});

  // Copy context to instance
  utils.extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  // 利用工厂函数创建新的实例
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}
```

从上代码可以看出`createInstance`其实是个工厂函数。通过返回实例上的 create 函数可以创建新的实例。这样一个好处就是用户除了可以使用默认配置外还可以覆盖默认配置。

在之前版本的代码中`create`函数并不在`createInstance`里面，而是放在`axios`上，既：`axios.create(config)`。为什么这么修改呢？可以看看`Github`上的这个 PR-#2795。这么写是为了能更方便的在有多个域名的复杂的项目提供更深层次的构建。

### axios 的拦截器是怎么实现的

> 实现拦截器的过程：将对应的拦截存放到堆栈中-> 将拦截器和请求函数放到一个数组中，形成：
>
> [...请求拦截， 请求函数， ...响应拦截]
>
> 然后再根据 Promise 的链式调用去执行这些函数

`Axios`函数在实例对象上有两个属性`default`和`interceptors`，`defaults`是默认配置；`interceptors`就是我们的拦截器对象，它也有两个属性`request`和`response`分别对应请求拦截和响应拦截；它们的值都是`InterceptorManager`对象实例。

再来看看我们拦截器的使用方式：`axios.interceptors.request.use`。`use`是`InterceptorManager`实例对象上的函数，`InterceptorManager`顾名思义是对拦截器的管理，我们来看看它的源码：

lib/core/InterceptorManager.js

```JavaScript
class InterceptorManager {
  constructor() {
    // 实例化后保存当前实例的拦截器的堆栈
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      // 默认值为false，用于控制请求拦截器是否为同步执行
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}
```

`InterceptorManager`源码很简单，提供`handlers`堆栈来储存拦截器，同时在原型上增加了 3 个函数对这个堆栈的增删以及遍历。

`Axios`实例的`interceptors`对象只在`Axios.prototype.request`函数中使用，而这个函数是`axios`请求的源函数，你调用的请求函数像`axios.get`和`axios.post`等本质都是调用`Axios.prototype.request`这个函数。而拦截器的的处理也是在这个函数中。 我们回到`Axios.js`文件，看看这个函数的源码：

```JavaScript
/**
 * Dispatch a request
 *
 * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
 * @param {?Object} config
 *
 * @returns {Promise} The Promise to be fulfilled
 */
request(configOrUrl, config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof configOrUrl === 'string') {
    config = config || {};
    config.url = configOrUrl;
  } else {
    config = configOrUrl || {};
  }

  config = mergeConfig(this.defaults, config);

  const {transitional, paramsSerializer, headers} = config;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  }

  if (paramsSerializer != null) {
    if (utils.isFunction(paramsSerializer)) {
      config.paramsSerializer = {
        serialize: paramsSerializer
      }
    } else {
      validator.assertOptions(paramsSerializer, {
        encode: validators.function,
        serialize: validators.function
      }, true);
    }
  }

  // Set config.method
  config.method = (config.method || this.defaults.method || 'get').toLowerCase();

  let contextHeaders;

  // Flatten headers
  contextHeaders = headers && utils.merge(
    headers.common,
    headers[config.method]
  );

  contextHeaders && utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    (method) => {
      delete headers[method];
    }
  );

  config.headers = AxiosHeaders.concat(contextHeaders, headers);


  // filter out skipped interceptors
  // 收集请求拦截器
  const requestInterceptorChain = [];
  let synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });
  // 收集响应拦截器
  const responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  let promise;
  let i = 0;
  let len;
  // 如何是异步执行，就执行下面的代码
  if (!synchronousRequestInterceptors) {
    const chain = [dispatchRequest.bind(this), undefined];
    chain.unshift.apply(chain, requestInterceptorChain);
    chain.push.apply(chain, responseInterceptorChain);
    len = chain.length;

    promise = Promise.resolve(config);

    while (i < len) {
      promise = promise.then(chain[i++], chain[i++]);
    }

    return promise;
  }
  // 拦截同步执行
  len = requestInterceptorChain.length;

  let newConfig = config;

  i = 0;

  while (i < len) {
    const onFulfilled = requestInterceptorChain[i++];
    const onRejected = requestInterceptorChain[i++];
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected.call(this, error);
      break;
    }
  }

  try {
    promise = dispatchRequest.call(this, newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  i = 0;
  len = responseInterceptorChain.length;

  while (i < len) {
    promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
  }

  return promise;
}
```

在执行请求前定义了两个堆栈`requestInterceptorChain`和`responseInterceptorChain`来存储拦截器处理函数

- `requestInterceptorChain`存储的是请求拦截器的处理函数，要注意它通过`unshift`添加的，**是先进后出的，所以越早添加的拦截器越晚执行**。
- `responseInterceptorChain`存储的是响应拦截器的处理函数，这个是先进先出的，也就是越早添加越先执行。

> 这里需要注意的是，在存入堆栈时都是两个为一组存储的，第一个始终是`fulfilled`的处理函数，第二个始终是`rejected`，因为后续取值的时候也是两个为一组取，刚好对应`Promise.then`函数对应的两个参数。

我们现在再来看请求的执行，进入`if`语句块的代码(默认执行 if 语句块里的代码，原因后面再来讲解)。

我们可以看到定义了一个`chain`数组来存放要执行的函数，默认有两个值，第一个是`dispatchRequest`,第二个是`undefined`。现在暂时不去看`dispatchRequest`是怎么样的，只要明白这个函数是可以发起请求就行了。

```JavaScript
chain.unshift.apply(chain, requestInterceptorChain);
chain.push.apply(chain, responseInterceptorChain);
```

`chain`通过上面代码处理 之后变成这样了: `chain = [...请求拦截函数, dispatchRequest, undefined, ...响应拦截函数 ]`。之后使用`Promise`链式调用执行函数。**这样就使得请求拦截函数始终在发起请求前执行，响应拦截函数在请求之后执行。**

**再来看看刚刚问题：为什么默认执行 if 语句里面的代码？** 看`if (!synchronousRequestInterceptors) { ... }`这个判断条件。

在`axios.interceptors.request`中`synchronousRequestInterceptors`默认值为`false`，如果在请求拦截器中没有配置`synchronous`为`true`的情况下这个值会被设置为`false`。`synchronous`是用于设置请求拦截器是否为同步执行。

使用代码如下：

```JavaScript
axios.interceptors.request.use(function (config) {
  config.headers.test = 'I am only a header!';
  return config;
}, null, { synchronous: true });
```

`synchronous`是用来控制请求拦截器是否为同步执行的。我们一般情况下使用是不用配置这个的，那什么时候需要配置呢？

**假如请求拦截器是异步的(其实默认就是异步的)，而请求的\*\***`promise(dispatchRequest)`\***\*又是在请求拦截堆栈后面，所以当主线程被阻塞时，那么\*\***`axios`\***\*请求发起时机就会被延迟。所以想要避免发起请求时机会延迟这个问题，可以设置请求拦截器是同步执行的。**

所以会默认情况是会执行`if`语句块里的代码。后面的代码就是请求拦截器同步执行的代码，这里就不多赘述啦

### axios 取消请求是怎么实现的

目前 axios 提供了两种处理取消请求的方式：

参考：https://axios-http.com/docs/cancellation

- AbortController
- cancelToken（deprecated）

使用 AbortController

```JavaScript
const controller = new AbortController();

axios.get('/foo/bar', {
   signal: controller.signal
}).then(function(response) {
   //...
});
// cancel the request
controller.abort()


// 提供了一个AbortSignal.timeout()
axios.get('/foo/bar', {
   signal: AbortSignal.timeout(5000) //Aborts request after 5 seconds
}).then(function(response) {
   //...
});
```

使用 cancelToken

```JavaScript
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/user/12345', {
  cancelToken: source.token
}).catch(function (thrown) {
  if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
    // handle error
  }
});

axios.post('/user/12345', {
  name: 'new name'
}, {
  cancelToken: source.token
})

// cancel the request (the message parameter is optional)
source.cancel('Operation canceled by the user.');
```

简单查看源码中实现取消请求的方法

- lib/adapters/xhr.js

```JavaScript
    let request = new XMLHttpRequest();
    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
        request.abort();
        request = null;
      };
       // 通过axios.cancelToken实现的取消请求；
       // 这里会去订阅这个onCanceled；然后当触发canle方法时，就执行这个函数
      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        // 这里是使用AbortController实现取消请求
        // 通过事件监听来实现取消请求
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }
```

- lib/cancel/cancelToken

```JavaScript
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    // 新建一个promise, 此时这个promise为pending状态，挂起，等待resolve或reject
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
       // 3. 执行订阅的事件，取消请求
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }
       // 2. 调用cancel函数，准备取消请求
      token.reason = new CanceledError(message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */
    // 1. 订阅，对应事件存放进_listeners中
  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}
```

### axios 如何实现 XSRF 预防

在`axios`使用很简单，在请求上添加配置即可（下面两个都是默认值）

```JavaScript
//`xsrfCookieName`是要用作 xsrf 令牌的值的cookie的名称
xsrfCookieName: 'XSRF-TOKEN', // default
// `xsrfHeaderName`是携带xsrf令牌值的http头的名称
xsrfHeaderName: 'X-XSRF-TOKEN', // default
```

防护`XSRF`策略有多种，一般的防护策略有：

- 阻止不明外域的访问
  - 同源检测
  - Samesite Cookie
- 提交时要求附加本域才能获取的信息
  - 双重 Cookie 验证
  - CSRF Token

同源策略虽然可以防护，但多少还有点缺陷，比如来之搜索引擎的访问。而在请求头上加`token`是目前一种更有效的防护策略。详情参考这篇博文：如何防止 CSRF 攻击？

### axios 优缺点

- 优点
  - 体积小
  - 支持请求响应拦截
  - 支持取消请求
  - 返回自动转换 JSON
  - 兼容性好
  - 支持 node
  - ... ...
- 缺点
  - 给予 xhr，兼容性好，但 XHR 本身的架构不清晰。
  - ... ...

## 源码中的工具方法摘录

### 封装 Function.bind 函数

```JavaScript
// 封装Function.bind函数
/**
 * @param {Function} fn 函数
 * @param {Object} thisArg 指定this的值
 *
 */
export default function bind(fn, thisArg) {
// 返回一个函数，内部就以thisArg作为上下文执行fn
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}
```

### 关于 axios 提供的高阶函数 kindOf，用于判断任意类型的值的类型

```JavaScript
const {toString} = Object.prototype;

// 内容使用闭包，缓存一个对象；
// 闭包内通过Object.prototype.toString()方法获取变量的类型
// 将获取到的类型字符串截取，获取执行位置的值，作为最终类型的值
// 将变量类型字符串和最终的变量类型的值映射关系存入缓存对象（一个原型链为null的空对象）
// 最终实现一个快速类型推断和缓存优化的功能

const kindOf = (cache => thing => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));
```

### 判断一个对象是不是一个纯对象 isPlaintObject

```JavaScript
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val); // 获取原型
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
}
```

Ps:

Symbol.toStringTag

> `Symbol.toStringTag` 内置通用（well-known）symbol 是一个字符串值属性，用于创建对象的默认字符串描述。它由 `Object.prototype.toString()` 方法内部访问。

```JavaScript
class ValidatorClass {
  get [Symbol.toStringTag]() {
    return 'Validator';
  }
}

console.log(Object.prototype.toString.call(new ValidatorClass()));
// Expected output: "[object Validator]"
```

Symbol.iterator

`Symbol.iterator` 为每一个对象定义了默认的迭代器。该迭代器可以被 `for...of` 循环使用。

```JavaScript
const iterable1 = {};

iterable1[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};

console.log([...iterable1]);
// Expected output: Array [1, 2, 3]
```
