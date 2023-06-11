# JavaScript

## 1、注销 addEventListner 注册的监听事件

```JavaScript
const btn = document.getElementById('btn');
const ac = new AbortController();
const {signal} = ac;
btn.addEventListener('click', function() {
    // TODO: something will be handled
}, { signal })

// 在当前组件被销毁前(时)，注销对应的事件
ac.abort();
```

> `AbortSignal`，该 `AbortSignal` 的 `abort()` 方法被调用时，监听器会被移除。

当然这里肯定就有小伙伴会说`removeListener` 不就是专门用来注销的嘛。的确，这个方法确实是用来删除对应的监听的；但是，如果我们的组件里面监听了多个事件时，是不是就需要一个一个地进行删除呢？

我相信大家在心里都有一个答案了。没错，这里的 AbortSignal 就能实现这一点，通过一个`ac.abort()`就可以快速删除多个监听事件。

## 2、JavaScript 创建二维数组

首先说一下这里面的一个坑：

```JavaScript
const arr = Array(3).fill(Array(3).fill(0));
arr[0][0] = 2;

for (let item of arr) {
  console.log(item);
}
// output:
/*
[ 2, 0, 0 ]
[ 2, 0, 0 ]
[ 2, 0, 0 ]
*/
```

了解`Array.fill`方法的同学，会发现这里的第一个 fill 方法里面的实参是一个引用类型，在 MDN 上，也明确说出关于 value 为引用类型时，那么被填充的数组每一项都将是这个引用类型；

那么下面介绍几种创建二维数组的方式：

```JavaScript
// 方式一：
const arr = Array(3).fill(0).map(x => Array(3).fill(0));
// 方式二：
const arr = Array.from(Array(2), () => new Array(4).fill(1));
// 方式三：
const arr = Array(n);
for(let i = 0; i < n; ++i) {
    arr[i] = Array(m).fill(0);
}
```
