# 浏览器安全

## XSS

> Css: cross site scripting ， 跨站脚本攻击，是一种常见于 web 应用中的计算机安全漏洞；

XSS 攻击是指攻击者在网站上**注入恶意的客户端代码**，通过恶意脚本**对客户端网页进行篡改**，从而在用户浏览网页时，对用户浏览器进行控制或者获取用户隐私数据的一种攻击方式。攻击者对客户端网页注入的恶意脚本一般包括 JavaScript，有时也会包含 HTML 和 Flash。有很多种方式进行 XSS 攻击，但它们的共同点为：将一些隐私数据像 cookie、session 发送给攻击者，将受害者重定向到一个由攻击者控制的网站，在受害者的机器上进行一些恶意操作。

### 类型

#### 反射型

> 通过客户端向服务端发送请求时，CSS 代码出现在 URL 中，作为输入提交到服务端，服务端解析后响应，XSS 代码随响应内容一起传回给浏览器，最后浏览器解析执行 XSS 代码，这个过程就像是一次反射，所以叫发射型；

**攻击步骤：**

1. 攻击者构造出特殊的 URL，其中包含恶意代码，
2. 用户打开带有恶意代码的 URL 时，网站服务器将恶意代码从 URL 中取出，拼接在 HTML 中返回给浏览器；
3. 用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行；
4. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。

#### 持久型

> 存储型就是 XSS 代码可以存储到服务器（数据库，内存，文件系统）并且可以被普通用户读取到，从而实现在网络上的传播；

**攻击步骤：**

1. 对比与反射性，唯一的区别就是攻击的脚本被存放到了服务器上，实现了攻击的扩展；

#### DOM 型

> 基于 DOM 的 XSS 攻击是指通过恶意脚本修改页面的 DOM 结构，是纯粹发生在客户端的攻击；
>
> XSS 代码可能是插入简单的 script 脚本，带入第三方恶意脚本，这些恶意脚本通常是读取用户的 Cookie;

**攻击步骤：**

1. 攻击者构造特殊的 URL，其中包含恶意代码；
2. 用户打开带有恶意代码的 URL;
3. 用户浏览器接收到响应之后解析执行，前端 js 去除 URL 中的恶意代码并执行；
4. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者的指定操作；

DOM 行攻击取出和执行恶意代码由浏览器端执行，属于前端 js 自身的漏洞，而其他两种 xss 都属于服务端的安全漏洞；

### 防御措施

- 不是用服务端渲染，这样可以有效避免反射型和存储型攻击；
- 对于数据渲染和字符串拼接的时候应该对可能出现的恶意代码情况进行判断；
- CSP 内容安全策略，它的本质是建立一个白名单，告诉浏览器哪些外部资源可以加载和执行，我们只需要配置规则，如何拦截由浏览器自己来实现。开启 CSP 方式：
  - 设置 HTTP 首部中的 Content-Security-Policy，一种是设置 meta 标签的方式<meta http-equiv="Content-Security-Policy">
- 对一些敏感信息进行保护，比如 Cookie 使用 http-only，使得脚本无法获取，也可以使用验证码，避免脚本伪装成用户执行一些操作；

## CSRF 攻击

> CSRF 攻击指的是**跨站请求伪造，**攻击者诱导用户进入一个第三方网站，然后网站向被攻击网站发送跨站请求。如果用户在被攻击网站中保存了登录状态，那么攻击者就可以利用这个登录状态，绕过后台的用户验证，冒充用户服务器执行一些操作。

CSRF 攻击的**本质是利用 cookie 会在同源请求中携带发送给服务器的特点，以此来实现用户的冒充**；

### 攻击类型

- GET 类型的 CSRF 攻击，比如在网站中的一个 img 标签构建一个请求，当用户打开这个网站的时候就会自动发起提交。
- POST 类型的 CSRF 攻击，比如构建一个表单，然后隐藏它，当用户进入页面时，自动提交这个表单。
- 链接类型的 CSRF 攻击，比如在 a 标签的 href 属性里构建一个请求，然后诱导用户去点击。

### 防御措施

- **进行同源检测：\*\***服务器\*\*根据 http 请求头中 origin 或者 referer 信息来判断请求是否为允许访问的站点，从而对请求

进行过滤。但是这种方式存在一定的缺陷：有些情况下可以被伪造，同时还会把搜索引擎的链接也给屏蔽了。所以一般网站会允许搜索引擎的页面请求，但是相应页面请求这种请求方式也可能被攻击者利用。(Referer 字段会告诉服务器该网页是从哪个页面链接过来的)；

- **使用 CSRF Token 进行验证**：服务器向用户返回一个随机数，Token 当网站再次发起请求时，在请求参数中加入服务端返回的 Token,然后服务器向用户对这个 Token 进行验证，这种方式解决了使用 Cookie 单一验证方式时，可能会被冒用的问题。这种方式存在的一个缺点就是: 我们需要给网站中的所有请求都添加这个 token,操作比较繁琐。还有一个问题是一般不会只有一台网站服务器，如果请求经过负载均衡转移到其他服务器，但是这个服务器的 session 中没有保留这个 token 的话，就没有办法验证了，这种情况可以通过改变 token 的构建方式来解决；
- **对 Cookie 进行双重验证**：服务器在用户访问网站页面时，向请求域名中注入一个 Cookie，内容为随机字符串，然后当用户再次向服务器发送请求的时候，从 cookie 中取出这个字符串，添加这个 URL 参数中，然后服务器通过对 cookie 中的数据和参数中的数据进行比较，来进行验证。使用这种方式是利用了攻击者只能利用 cookie，但是不能访问获取 cookie 的特点，并且这种方法比 CSRF Token 的方法更加方便，并且不涉及到分布式访问的问题。这种方法的缺点是**如果网站存在 XSS 漏洞，那么这种方式会失效，同时这种方式不能做到子域名的隔离**。
- 在设置 cookies 属性的时候设置 Samesite，限制 cookie 不能作为被第三方使用，从而可以避免被攻击者利用。samesite 一共有两种模式，一种是严格模式，在严格模式下 cookie 在任何情况下都不可能作为第三方使用，从而可以避免被攻击者利用。samesite 一共有两种模式，一种是严格模式，在严格模式下 cookie 在任何情况下都不可能作为第三方 cookie 使用，在宽松模式下，cookie 可以被请求是 GET 请求，且会发生页面跳转的请求所使用。

## 中间人攻击

> 中间人攻击是指攻击者与通讯的两端分别创建独立的联系，并交换其所收到的数据，使通讯的两端任务他们正在通过一个私密的连接与对方直接对话，但事实上整个会话都被攻击者完全控制。在中间人攻击中，攻击者可以拦截通讯双方的通话，并插入新的内容。