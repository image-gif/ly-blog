# 注销 addEventListner 注册的监听事件

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
