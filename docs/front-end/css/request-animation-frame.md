# requestAnimationFrame

> **`window.requestAnimationFrame()`** 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的[回调函数](https://so.csdn.net/so/search?q=回调函数&spm=1001.2101.3001.7020)更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行

**语法：**

```JavaScript
window.requestAnimationFrame(callback);

// callback： 下一次重绘之前更新动画帧所调用的函数(即上面所说的回调函数)。该回调函数会被传入DOMHighResTimeStamp参数，该参数与performance.now()的返回值相同，它表示requestAnimationFrame() 开始去执行回调函数的时刻。

// 返回值：
// 一个 long 整数，请求 ID ，是回调列表中唯一的标识。是个非零值，没别的意义。你可以传这个值给 window.cancelAnimationFrame() 以取消回调函数。
```

🍕 **若你想在浏览器下次重绘之前继续更新下一帧动画，那么回调函数自身必须再次调用\*\***`window.requestAnimationFrame()`\*\*

```JavaScript
window.onload = function () {
  var n = 0;
  function test() {
      n++;
      console.log("requestAnimationFrame ----", n);
      requestAnimationFrame(test); // 下次继续执行
  }
  requestAnimationFrame(test);
}
```

**执行频率：**

> 回调函数执行次数通常是每秒 60 次，但在大多数遵循 W3C 建议的浏览器中，回调函数执行次数通常与**浏览器屏幕刷新次数相匹配**。
>
> 即不用手动设置执行间隔时间，而是根据 **浏览器屏幕刷新次数** 自动调整了,也就是说浏览器屏幕刷新多少次，它就执行多少次。

**回调参数：**

> 在同一个帧中的多个回调函数，它们每一个都会接受到一个相同的时间戳，即使在计算上一个回调函数的工作负载期间已经消耗了一些时间。该时间戳是一个十进制数，单位毫秒，最小精度为 1ms(1000μs)。

```JavaScript
function test(timeStamp) {
  console.log("requestAnimationFrame ----", timeStamp);
  requestAnimationFrame(test);
}
requestAnimationFrame(test);
```

**当多个 requestAnimationFrame 同时执行时：**

```JavaScript
function test1(timeStamp) {
  console.log("requestAnimationFrame1 ----", timeStamp);
  requestAnimationFrame(test1);
}
function test2(timeStamp) {
  console.log("requestAnimationFrame2 ----", timeStamp);
  requestAnimationFrame(test2);
}
requestAnimationFrame(test1);
requestAnimationFrame(test2);

// 可以看到，两个 requestAnimationFrame 在控制台输出的时间戳是一样的。也就是浏览器刷新一次的时候，执行所有的 requestAnimationFrame ，并且它们的回调参数是一模一样的。
```

**浏览器优化：**

> 为了提高性能和电池寿命，因此在大多数浏览器里，当`requestAnimationFrame()` 运行在后台标签页或者隐藏的[](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/iframe) 里时，`requestAnimationFrame()` 会被暂停调用以提升性能和电池寿命。
>
> 即当你切换到其他页面时， `requestAnimationFrame()` 会被暂停调用

**取消执行：**

> 传这个值给 [window.cancelAnimationFrame()](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/cancelAnimationFrame) 以取消回调函数

```JavaScript
var stratBtn = document.querySelector("#start"),
    stopBtn = document.querySelector("#stop");
var rAF;
stratBtn.addEventListener("click", () => {
  rAF = requestAnimationFrame(test);
});
stopBtn.addEventListener("click", () => {
  cancelAnimationFrame(rAF);
});

function test() {
  rAF = requestAnimationFrame(test);
  console.log("rAF:", rAF);
}
```

requestAnimationFrame 比起 setTimeout、setInterval 的优势主要有亮点：

1. requestAnimationFrame 会把每一帧中的所有 DOM 操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率；

setTimeout、setInterval 它们的内在运行机制决定了 时间间隔参数 实际上只是指定了把动画代码添加到 浏览器 UI 线程队列 中以等待执行的时间。如果队列前面已经加入了其它任务，那动画代码就要等前面的 任务完成后 再执行，并且如果时间间隔过短（小于 16.7ms）会造成丢帧，所以就会导致动画可能不会按照预设的去执行，降低用户体验。

1. 在隐藏或不可见的元素中，将不会进行重新重绘或回流；
2. requestAnimationFrame 是由浏览器专门为动画提供的 API，在运行时浏览器会自动优化方法的调用，并且如果页面不是激活状态下的话，动画会自动暂停，有效节省了 CPU 开销

参考资料：

[【今天你更博学了么】一个神奇的前端动画 API requestAnimationFrame - 掘金](https://juejin.cn/post/6991297852462858277)

[window.requestAnimationFrame - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)
