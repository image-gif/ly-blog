# hash&history

## 切换路由实现页面跳转

> 通过 hash 路由，进行路由切换

- Demo-hash

```JavaScript
const routerView = document.getElementById('router-view');
    // 监听url的变化
    window.addEventListener('hashchange', () => {
      switch(location.hash) {
        case '#/home':
          routerView.innerHTML = `<h2>这是使用的hash首页</h2>`;
          break;
        case '#/about':
          routerView.innerHTML = `<h3>这是about的关于页面</h3>`;
          break;
        default:
          routerView.innerHTML = `<div>这是默认页面</div>`;
      }
    })

```

- Demo-history

```JavaScript
 const routerView = document.getElementById('router-view');
        const aElements = document.getElementsByTagName('a');
        for(let el of aElements) {
          el.addEventListener('click', e => {
            e.preventDefault();
            const href = el.getAttribute('href');
            history.pushState({}, "", href);
            urlChange();
          })
        }
        window.addEventListener('popState', urlChange);

        function urlChange() {
        switch(location.pathname) {
          case "/home":
            routerView.innerHTML = `<h2>我的首页</h2>`;
            break;
          case "/about":
            routerView.innerHTML = `<h3>关于about</h3>`;
            break;
          default:
            routerView.innerHTML = `<div>默认页面</div>`;
        }
```

## **附加：history 的六种模式可以改变 URl 而不刷新页面**

1. replaceState: 替换原来的路径
2. pushState: 使用新的路径
3. popState: 路径的回退
4. go: 向前或向后改变路径
5. forward: 向前改变路径
6. back: 向后改变路径

关于 history 的博客： https://blog.csdn.net/qq_41581588/article/details/124744073
