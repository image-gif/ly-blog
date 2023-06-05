# HTTP

> HTTP 协议全称为 **H**yper**T**ext **T**ransfer **P**rotocol，即超文本传输协议。
>
> - `超文本`：指文字、图片、音频、视频、文件等的混合体，比如最常见的 HTML。
> - `传输`：指数据从一方转移到另一方，二者之间可能相距数千里。
> - `协议`：指通信双方所做的一些约定，比如怎么开始通信、信息的格式与顺序、怎么结束通信等。
>
> HTTP 协议是干啥的呢？ 答案是**用于客户端与服务器端之间的通信**。我们日常上网过程中最常见的就是 HTTP 协议了，浏览器是最常见的 HTTP 客户端。

## 1. Http 请求

> 一个 http 请求包含：请求行，请求头，请求空行，请求体

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=YmVmNjA0ODdjZWI3N2M0NzVhNmI5MDU1MWE5MmE5NTlfRFV1TjNBTjdaTkpxT3g0SDlyenB1Z2c1VGVXZExOeThfVG9rZW46Ym94Y25YNTBhVTJ6ZVZSWXBNbXBGS1pKOWlmXzE2ODU5Mzk0NDY6MTY4NTk0MzA0Nl9WNA)

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=MjdjYzRiOWQ1NWU3ODYyYzMyN2E1YmIxMTc5ZTI1NzVfTUdkc2pWTnpjclllcVFHQ053dTQ1TzFyejlqMWp0T0xfVG9rZW46Ym94Y25ScWZDY0hna2JuVlhtcWJYbUIzRFlmXzE2ODU5Mzk0NDY6MTY4NTk0MzA0Nl9WNA)

### 1.1 请求行

> 包含： 请求方法 | 资源路径 | http 版本

- 请求方法： 指定要请求资源做什么样的操作，常见的方法有：GET, POST, PUT, DELETE, HEAD, OPTIONS
- 资源请求路径： 指定所要访问的资源在服务器上的位置。比如/index.html 表示访问服务器根目录下名字为 index 的 html 文件
- http 版本，指定所使用的 http 版本，目前使用最多的版本就是 http/1.1

#### 1.1.1 \* (重点) GET 和 POST 请求的区别：

- **一般 GET 请求是将参数放到 URL 中，而 POST 请求是将参数放到请求体中；**

> 因为参数放到 url 中可以被直接看到，所以一般 get 请求会比 post 请求更不安全；但是并不是说 post 请求就是安全的，因为参数放到请求体中，如果不采取加密手段，技术人员通过抓包技术就可以直接拿到明文；
>
> 同时各个**浏览器**对 url 长度做了限制（注意这是浏览器做的限制，官方是没有指定这个限制，关于这个限制，是受到对应浏览器处理能力有关），比如 IE 浏览器限制 url 的长度最大为 2KB,这就使得 get 请求传输的数据长度受到了一定的限制，而 post 请求没有明确规定请求体的长度；

- **一般 GET 请求用于获取数据，POST 请求用于新增数据；**

> 这里需要提一下幂等性的概念。**幂等性**是指**对于一个系统，在同样的条件下，一次请求和重复多次请求对资源的影响是一致的，不会因为多次请求而产生副作用**；
>
> **GET 请求**用于获取资源，不会对系统资源进行改变，因此**是幂等的**。POST 用于信息资源，这意味着多次请求将创建多个资源，因此不是幂等的；

- **GET 和 POST 在本质上并无区别**

> http 的底层是 tcp，所以无论是 get 还是 post 底层都是通过 tcp 进行连接通信的；
>
> 我们可以给 GET 加请求体，给 POST 带上 URL 参数，可以用 GET 请求新增数据，POST 请求查询数据，实际上也是完全可行的。

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZDM1ZjU3YjgzOTI3ZTE2MzUyZTFiMzRiY2MxMDkwODJfczF6VE9KWjBZZWQ1OUtJQzRXelkwMWR6cnRNdWdHcTVfVG9rZW46Ym94Y25LaUVMa3VlMVRHZjVCQ3poc2dBc01nXzE2ODU5Mzk0NDY6MTY4NTk0MzA0Nl9WNA)

### 1.2 请求头

> 常用请求头：

| 请求头            | 含义                                                                                                                                                                              |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host              | 接收请求的服务器域名                                                                                                                                                              |
| User-Agent        | 客户端软件的名称和版本号等信息                                                                                                                                                    |
| Connection        | 设置发送响应之后 TCP 连接是否继续保持的通信选项（keep-alive）                                                                                                                     |
| Referer           | 记录请求的来源（当点击超级链接进入下一个页面时，会记录上一个页面的 URL）                                                                                                          |
| Accept            | 客户端可支持的数据类型，以[MIME 类型](https://blog.csdn.net/weixin_40228534/article/details/125267677)来表示（MIME 是网络中用来标识资源类型的标识，网路根据这个来处理对应的资源） |
| Accept-Encoding   | 客户端可支持的编码格式                                                                                                                                                            |
| Accept-Language   | 客户端可支持的语言                                                                                                                                                                |
| If-Modified-Since | 用于判断资源的缓存是否有效（对应服务端的 Last-modified，本地缓存 的最后修改时间）                                                                                                 |
| If-None-Match     | 用于判断资源的缓存是否有效（对应服务端的 Etag）                                                                                                                                   |
| Range             | 用于断点续传，指定第一个字节的位置和最后一个字节的位置                                                                                                                            |
| Cookie            | 表示请求者的身份，用于保存状态信息                                                                                                                                                |
| origin            | 表明了请求来自于哪个站点，包括且仅仅包括协议、域名、和端口，并不包含任何路径信息，经常用于 CORS 或者 POST 请求。可以看到 response 有对应的 header                                 |

> 关于 referer 和 origin 的区别：
>
> 1、只有跨域请求，或者同域时发送 post 请求，才会携带 origin 请求头，而 referer 不论何种情况下，只要浏览器能获取到请求源都会携带，除了上面提到的几种情况。
>
> ​ 2、如果浏览器不能获取请求源，那么 origin 满足上面情况也会携带，不过其值为 null。referer 则不同，浏览器如果不能获取请求源，那么请求头中不会携带 referer。
>
> ​ 3、origin 的值只包括协议、域名和端口，而 erferer 不但包括协议、域名、端口，还包括路径和参数。

### 1.3 请求空行

> 表示请求头内容已经结束了。

### 1.4 请求体

> 请求行和请求头的数据都是文本形式且格式化的，而请求体不同，其可以包含任意的二进制数据，比如文本，图片，视频等。

## 2. http 响应

> 服务器向客户端发送的信息称为**响应报文**，响应报文的结构如下：
>
> 响应报文结构： 响应行， 响应头，响应空行， 响应体

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=YjM2ZGU5MjU3NWNjMDBkMWIzZGIwNmYzOGU1MDY4NGJfNVBMM3dacDlhUzNyRFpiZ3E0NWNKekZ1bFY1Q081blFfVG9rZW46Ym94Y25VRmM0VWpQMjNtYWtTZDU0cHM1ZGZkXzE2ODU5Mzk0NDY6MTY4NTk0MzA0Nl9WNA)

### 2.1 响应行

> 响应行用于说明对请求的处理情况：
>
> 内容包含： http 版本，状态码，消息短语

- **HTTP 版本**，指定所使用的 HTTP 版本，比如 HTTP/1.1 表示使用的 HTTP 版本 1.1
- **状态码**， 以三位数字形式描述服务器对请求的处理结果，比如 200 表示成功
- **消息短语**，以文本形式描述服务器对请求的处理结果 比如 OK 表示成功

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=YjNjOTRiM2ViMmY1N2I3ZDMwYzM2NDA2NzZhNDliY2RfdmlpMVlMczQzZG42M0ZETDNjWDZMSXBDN0o2OVhwS29fVG9rZW46Ym94Y25qN2NUZDdvdEdYRm9jNk1HTXVXcm9oXzE2ODU5Mzk0NDY6MTY4NTk0MzA0Nl9WNA)

#### 2.1.1 HTTP 有哪些常见的状态码

| 状态码 | 含义                                                   | 常见               |
| ------ | ------------------------------------------------------ | ------------------ |
| 1XX    | 提示信息，表示请求已被成功接收，继续处理               |                    |
| 2XX    | 成功，表示请求被正常处理完毕                           | 200、204           |
| 3XX    | 重定向，资源位置发生变化，表示请求需要附加操作才能完成 | 301、302、304      |
| 4XX    | 客户端错误，表示服务端无法处理请求                     | 400、401、403、404 |
| 5XX    | 服务端错误，表示服务器处理请求出错                     | 500,502,503        |

- 204 Not Content： 表示请求被正常处理，但是在返回的响应报文中不含响应体内容，一般用在只是客户端向服务端发送信息，而服务端不用向客户端返回什么信息的情况，不会刷新页面。
- 301 Moved Permanently(永久性的): 永久重定向，表示请求的资源已经被永久转移，新的 URL 定义在响应报文的 Location 字段中，浏览器将自动获取新的 URL 发出新的请求；

> 在原始的京东官网地址，就是重定向到最新的地址上来的；

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZTc4MWY1OGY1MzE2Y2Y2MzM1YWI4YWIxYjgzOGEyMjlfY1pheTViT0YyMzNHZjVKVFNadWE3cHFCbjdSV3dnVHRfVG9rZW46Ym94Y25RR0RXZ3NFdXhvZlVxaHVVZUtkZDNkXzE2ODU5Mzk0NDY6MTY4NTk0MzA0Nl9WNA)

- 302 Found： 临时重定向，表示请求的资源已被分配了新的 URL，新的 URL 会在响应报文中的 Location 字段中返回，浏览器将会自动使用新的 URL 发出新的请求。
- 304 Not Modified: 代表上次的文档已经被缓存了，还可以继续使用，即访问缓存；
- 400 Bad Request: 一个通用差错状态码，表示请求报文中存在语法错误，客户端发生的错误；
- 401 Unauthorized: 用户未认证；
- 403 Forbidden: 表示服务器虽然收到了请求，但是拒绝提供服务，常见的原因是没有访问权限（即用户未授权）；
- 404 Not Found: 表示请求资源不存在；
- 500 Internal Server Error: 表示服务器出现错误，可能是出现了一些 Bug 或故障；
- 502 Bad Gateway: 通常是服务器作为网关或者代理时返回的错误码，表示服务器自身工作正常，访问后端服务器发生了错误（可能后端服务器宕机了）；
- 503 Service Unavailable： 表示服务器暂时处于超负载或者正在停机维护，暂时无法处理请求，可以稍后再试。web 服务器如果限流，就可以给超载的流量直接响应 503 状态码。

### 2.2 响应头

> 用于向客户端传递一些额外的重要信息

| 响应头           | 含义                                                          |
| ---------------- | ------------------------------------------------------------- |
| Date             | 日期时间，表示服务器产生并发送响应报文的日期和时间            |
| Server           | 表示 HTTP 服务器应用程序的信息，类似于请求报文中的 User-Agent |
| Location         | 该字段会配合重定向使用，提供重定向之后的 URL                  |
| Connection       | 设置发送响应之后 TCP 连接是否继续保持的通信选项               |
| Cache-Control    | 控制缓存的相关信息                                            |
| Content-Type     | 控制返回的响应类型                                            |
| Content-Length   | 服务器返回的响应长度                                          |
| Content-Encoding | 服务器返回的响应编码                                          |
| Content-Language | 服务器返回的响应语言                                          |
| Last-Modified    | 指定响应内容最后的修改时间                                    |
| Expires          | 表示资源失效的时间，浏览器会在指定过期时间内使用本地缓存      |

### 2.3 响应空行

> 表示响应头结束

### 2.4 响应体

> 同请求报文的请求体一样，响应体可以包含任意的二进制数据，浏览器收到响应报文后，则会将正文加载到内存中，然后解析渲染，最后显示页面内容。

## 3. HTTP 持久连接

> 客户端发送一系列请求给服务器，如果服务器与客户端对每个请求/响应对都经过一个单独的 TCP 连接发送，则称为**非持续连接**，也称为短连接；如果经过相同的 TCP 连接发送，则称为**持续连接**，也称为长连接。

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=YzZiMGI1MzE3MjBjYTRmYzcyMzYzNzg3NjA4NTk2ZDZfaGhzenZhaGQwQUplMktzbk1zZThWeTRJMWt5eEplczRfVG9rZW46Ym94Y25CNnc3T3ZocUZPWjRoa1p2c0VqTjBnXzE2ODU5Mzk0NDY6MTY4NTk0MzA0Nl9WNA)

- 非持久连接：
  - 缺点：
    - **每次建立连接都要进行握手阶段，响应时间变长**；当然也不是绝对的，如果多个连接可以并行请求，总响应时间可能变短，比如 Chrome 浏览器为了提升加载速度，可以同时打开 6 个并行连接，但多个并行连接会加重 Web 服务器负担。
    - 必须为每一个请求的对象建立和维护一个全新的连接，而每一个连接都需要客户和服务器分配 TCP 的缓存区和保持 TCP 变量，使得 web 服务器存在严重的负担，因为一台 web 服务器可能同时服务与很多的客户请求；

HTTP/1.1 及以后，默认采用持久连接方式，但是也可以配置成非持久连接方式，在报文中使用 Connection 字段来表示是否使用持久连接。

- Connection: keep-alive； 表示使用持久连接
- Connection: close; 关闭连接

Ps: 持久连接不是永久连接，一般在一个可配置的超时间隔之后，如果此连接仍未被使用，HTTP 服务器就会关闭连接；

## 4. HTTP 缓存

> 对于一些短时间内不会产生变化的资源，客户端（浏览器）可以在一次请求后将服务器响应的资源**缓存**在本地，之后直接读取本地的数据，而不必再重新发送请求。
>
> 在 HTTP 设计中也有缓存的概念，主要是为了**加快响应速度**，HTTP 缓存的实现依赖于请求报文和响应报文中的一些字段，分为强缓存和协商缓存。

### 4.1 强缓存

> **强缓存**指的是在缓存数据未失效的情况下，那么就会**直接使用浏览器的缓存数据，不会再向服务器发送任何请求**
>
> 具体实现主要是通过 `Cache-Control `字段和 `Expires `字段。
>
> Cache-Control 是一个相对时间（即多长时间后过期，**http1.1** 规范），**Expires** 是一个绝对时间（即在某个时间点过期，**http1.0** 规范），如果**两个字段同时存在，Cache-Control 的优先级更高**。
>
> 由于服务器端时间和客户端时间可能不同步，存在偏差，这也就是导致了使用 Expires 可能会存在时间误差，因此**一般更推荐使用 Cache-Control 来实现强缓存**。

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=NjI3YTk3ZDYyYzhlMzExNzM2OGZjMmE2OGE3MzE2OTlfc1BnWE9VZ1c4UjI1MEdtbnZhVE90eFhIcjdqaWs4dHNfVG9rZW46Ym94Y25xVzJCbW5panNSdGxMUXZPalB0M3FlXzE2ODU5Mzk0NDY6MTY4NTk0MzA0Nl9WNA)

以 Cache-Control 为例，强缓存的具体的实现流程如下：

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZGMwNGIxYzlkNWY0ZTAwMjlkZWZlYzc2NmJhMDRhNDdfTzVvMFY4cEJETnB5MG9tanVPY2U0VDlIbThvS2VNZzNfVG9rZW46Ym94Y25CdHlmN2J1VUVzMm9oZnhMNUZ2MnJkXzE2ODU5Mzk0NDY6MTY4NTk0MzA0Nl9WNA)

1. 当浏览器第一次请求访问服务器数据时，服务器会返回一个**Cache-Control**的响应头信息，以表示本地缓存的信息，对应的值有：
   1. **max-age: 表示缓存将于指定的毫秒值之后过期，比如： Cache-Control: max-age: 10000， 表示资源将于 10 秒之后过期；**
   2. **no-store: 表示不允许缓存（包括强缓存和协商缓存）；**
   3. **no-cache：表示不使用强缓存，而是使用协商缓存；等价于： max-age=0, must-revalidate;**
   4. **must-revalidate: 表示允许缓存，并且如果缓存不过期的话，先使用缓存，如果缓存过期的话，再去服务器进行验证缓存是否过期。**

> **ps**： 关于使用**max-age=0, must-revalidate 和 max-age = 0; 在处理缓存上，都是会先查看本地缓存是否过期，如果过期就只服务端校验资源是否过期。**
>
> 表面上看这两者没有什么区别， 但是在实际过程中，如果在本地缓存过期之后，去进行服务器校验时出现了网络错误，那此时单纯的 max-age=0;就会直接使用过期的本地缓存，但是加了 must-revalidate 之后，就会收到 504 状态码，不能再去使用本地缓存。

1. 浏览器再次请求访问服务器中的该资源时，根据请求资源的时间与 Cache-Control 中设置的过期时间大小，计算出该资源是否过期，
   1. 如果没有过期（且 Cache-Control 没有设置 no-cache 属性和 no-store 属性），则使用该缓存，结束；
   2. 否则重新请求服务器；

### 4.2 协商缓存

> **协商缓存**指的是当第一次请求后，服务器响应头 Cache-Control 字段属性设置为 no-cache 或者缓存时间过期了，那么浏览器再次请求时就会与服务器进行协商，判断缓存资源是否有效，即资源是否进行了修改更新。
>
> - 如果资源没有更新，那么服务器返回 **304** 状态码，表明缓存仍然可用，而不需要再次发送资源，减少了服务器的数据传输压力，并更新缓存时间。
> - 如果数据有更新，服务器返回 200 状态码，新资源存放在请求体中。

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=ODRlZDliYmUxYjM0NzA5MzE1ZDE3YmQ3ODc3MzViYzZfMm9OVVBxMXpydHN6a3Z5Vng1aDRTRlNhN0dlMXBXR2VfVG9rZW46Ym94Y245OEMzTWl5aFhEM01ZMWhhMWFXOHlnXzE2ODU5Mzk0NDY6MTY4NTk0MzA0Nl9WNA)

协商缓存可以基于以下两种方式来实现：

**第一种（HTTP/1.0 规范）**：请求头部中的 `If-Modified-Since` 字段与响应头部中的 `Last-Modified` 字段：

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=ODQwOThjN2Q1NjA1OGZlM2M3MzU3NWZkYTZkOTVmZjhfY2t0MHlydDJwN3NXcDdyQnBRWTdFWWpZVlhOQ2dQYTdfVG9rZW46Ym94Y252WGdyYTBrSzFSSW1tcUNINjY1MnpQXzE2ODU5Mzk0NDY6MTY4NTk0MzA0Nl9WNA)

- `Last-Modified`：标示这个响应资源的最后修改时间。第一次请求资源后，服务器将在响应头中带上此信息。
- `If-Modified-Since`：当资源过期了，浏览器再次发起请求的时候带上 Last-Modified 的时间（放在请求头 If-Modified-Since 中），服务器将此时间与被请求资源的最后修改时间进行对比，
  - 如果最后修改时间较大，说明资源有被修改过，则返回最新资源和 200 状态码；
  - 否则说明资源无新修改，返回 304 状态码。
- 此种方式存在以下问题：
  - 基于时间实现，可能会**由于时间误差而出现不可靠问题，并且只能精确到秒级**，在同一秒内，Last-Modified 无感知。
  - 如果某些文件被修改了，但是内容并没有任何变化（比如只是修改时间发生了变化），而 Last-Modified 却改变了，导致文件没法使用缓存。

**第二种（HTTP/1.1 规范）**：请求头部中的 `If-None-Match` 字段与响应头部中的 `ETag` 字段：

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=M2VkYTc5OTZlZGM3YTVjY2RhYTI5ZGU4ZjhmYTcxNjBfdUtQUGhGWDltV24xaXlmak53T3JsNEFQbnE5OEZCRHlfVG9rZW46Ym94Y25pZ3psa2kyQ292c3UyZXRGUnlHRlViXzE2ODU5Mzk0NDY6MTY4NTk0MzA0Nl9WNA)

- `Etag`：唯一标识响应资源，是一个 hash 值；第一次请求资源后，服务器将在响应头中带上此信息。
- `If-None-Match`：当资源过期了，浏览器再次向服务器发起请求时，会将请求头 If-None-Match 值设置为 Etag 中的值。服务器将此值与资源的 hash 值进行比对，
  - 如果二者相等，则资源没有变化，则返回 304 状态码。
  - 如果资源变化了，则返回新资源和 200 状态码。
- 此种方式存在的问题在于计算 Etag 会消耗系统性能，但可以解决第一种方式所存在的问题，推荐使用。

注意 ：

- 如果 HTTP 响应头部同时有 Etag 和 Last-Modified 字段的时候，**Etag 的优先级更高**，也就是先会判断 Etag 是否变化了，如果 Etag 没有变化，然后再看 Last-Modified。
- `Ctrl + F5 `强制刷新，会直接向服务器提取数据。
- 按`F5`刷新或浏览器的刷新按钮，默认加上 Cache-Control：max-age=0，即会走协商缓存。
- `浏览器地址栏直接回车`按照正常流程进行，本地检查是否过期，然后服务器检查新鲜度，最后返回内容。

## 5. Cookie

HTTP 是一种**无状态**协议，即其**本身不会记忆请求和响应之间的通信状态**，那么 Web 服务器就无法判断此请求到底来自于哪个用户，HTTP 协议中并不会保存关于用户的任何信息。**这样设计的好处是不需要额外资源保存用户状态信息，减少了服务器的 CPU 及内存资源的消耗**。

但是随着 Web 的发展，很多业务需要保存用户状态。

- 比如电商网站需要在用户跳转到其他商品页面时，仍然可以保存用户的登录状态。不然用户每访问一次网站都要重新登录一下，过于繁琐，体验效果就很差。
- 比如短视频网站希望记录用户以前看过的视频，以便之后向其精准化推荐感兴趣的视频。

**为了实现保持状态的功能，这就出现了 Cookie**。Cookie （服务器给的凭证）类似于我们逛商场时的会员卡（商家给的凭证），记录着我们的身份信息，只要出示了会员卡，商场工作人员就能确定我们的身份。同样的，只要给服务器发送报文时带上了 Cookie，他就知道我们是谁了。

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZDJmMTk0ZTJlYjkzOTAzMWU4ZThmMzlmZjE2MzdhY2NfTmpUMng0NEZYMlJhOUlxSFFRWE5NZlZmQXNNRm1TQnhfVG9rZW46Ym94Y256NWw2bmcxaFlLaUd1cFNxa1ltMUlnXzE2ODU5Mzk0NDY6MTY4NTk0MzA0Nl9WNA)

Cookie 中可以包含任意信息，最常见的是包含一个服务器为了进行跟踪而产生的**独特的识别码**。

举个栗子：

张三在发出第一次请求后，服务器将其状态信息记录下来，比如他的名字、年龄、地址、购物历史等，并通过响应头 `Set-Cookie `字段，给予其一个 id=12345 的独特识别码作为 Cookie，那么其再次向服务器发出请求时，浏览器会自动在请求报文中的 `Cookie` 字段中带上 id=12345，服务器就可以通过这个查询到张三的具体信息，从而实现了保持状态的功能。

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=MDRjMDc0ZTRiZjA0YTU2YzUxZTdjNjJhNzRmYTIzMzhfbjQzd280dE8xd2hlWEszaXBDODg3djc2aUlob2w3UzZfVG9rZW46Ym94Y25ndHdtbGhlR3ViQVlqekhnWW9IbG5IXzE2ODU5Mzk0NDY6MTY4NTk0MzA0Nl9WNA)

**Cookie 属性：**

- `max-age`：过期时间有多长（绝对时间，单位：秒）。
  - 负数，表示浏览器关闭即失效。默认即为 -1。
  - 正数：失效时刻= 创建时刻+ max-age。
  - 0：表示 Cookie 立即删除，即 Cookie 直接过期（从而实现使 cookie 失效）。
- `expires`：过期时间（相对时间）。
- `secure`：表示这个 Cookie 只会在 https 的时候才会发送。
- `HttpOnly`：设置后无法通过使用 JavaScript 脚本访问，可以保障安全，防止攻击者盗用用户 Cookie。
- `domain`：表示该 Cookie 对于哪个域是有效的。 （Cookie 默认是不能直接跨域访问的，但是二级域名是可以共享 cookie 的）

Cookie 的缺点是如果传递的状态信息较多，使得包过大，将会降低网络传输效率。

一般浏览器限制 Cookie 大小为 4KB

## 6. HTTP 版本

### 6.1 HTTP/1.0

> 具有如下的优点以及缺点：

- 优点
  - 简单易懂，1.0 版本协议设计简单，容易部署和实现；
  - 接口通用性：客户端和服务端可以使用不同的操作系统和编程语言实现 HTTP1.0 协议，因此是一种通用性很强的协议；
  - 提供缓存处理机制；（Expires, If-Modified-Since）
- 缺点：
  - 短连接；
  - 队头阻塞；
  - 无状态；

### 6.2 HTTP/1.1

> HTTP/1.1 是目前最常见的 HTTP 版本，其相对于 HTTP/1.0 有以下改进。

**其相比于 HTTP/1.0 的改进**

#### 1. 实现了持久连接

> http/1.0 中，一次请求需要建立一次连接，但是在 http/1.1 中，多个请求可以共享一个 tcp 连接；
>
> Web 服务软件一般都会提供 `keepalive_timeout` 参数，用来指定 HTTP 持久连接的超时时间。比如设置了 HTTP 持久连接的超时时间是 60 秒，Web 服务软件就会启动一个定时器，如果完成某个 HTTP 请求后，在 60 秒内都没有再发起新的请求，就会触发回调函数来释放该连接。

#### 2. 管道机制

> 持久连接实现了一个 tcp 连接的多个请求，但是每一个请求发送的前提都是前一个请求完成响应之后才能被发送给服务端，整体的响应时间是全部请求响应时间的累加；
>
> 管道机制，允许请求可以在一段时间内并发出去，不必等待前面请求的响应，这使得整体的响应时间缩短。

**存在的问题：**

> 虽然管道机制实现了发送请求不必等待，但是在服务器处理请求时，依旧需要先处理前面的请求，才能处理后面的请求，这就导致如果前面的请求需要耗费大量的时间话，那么后面的请求将迟迟得不到响应，这种情况就称为**队头阻塞；**

实际上，虽然管道机制的想法很好，但实现却非常困难，因而很多浏览器根本不支持它。一般为了提升性能，采用并行多个 TCP 连接的形式来实现请求的同时发送。

#### 3. 缓存控制

> 在 http/1.0 中：
>
> **强缓存**：**expire** ; **协商缓存： If-modified-since(请求) 和 Last-modified(响应)**
>
> http/1.1 中新增：
>
> **强缓存：Cache-control; 协商缓存： If-None-Match(请求) 和 Etag(响应)**

#### 4. 断点续传

> 利用 http 消息头使用功能分块传输编码，将实体主体分块传输。

### 6.3 HTTP/2

> HTTP/2 协议本身是基于 HTTPS 的，因此更加安全，其相对于 HTTP/1.1 如下改进：

#### 1. 头部压缩

> http/1.1 中的请求携带大量的信息，而且每次都要重复发送， 即使是同样的内容，每次请求都需要附带，这会造成性能的损耗，http/2 进行了优化，引入了**头部信息压缩机制。**
>
> 1. 客户端和服务端同时维护一张**头信息表**，高频出现的字段会存入此表，生成一个索引号，发送报文时直接使用索引号替代字段。另外，索引表中不存在的字段使用哈夫曼编码**压缩；**
> 2. **同时多个请求中，如果请求相同，则后序请求只需要发送差异的部分，重复的部分无需再发送**。

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=MWEzODkzMjA0OWU2NzQ2NDA2NWE5YWJiYjc0NjllNThfdHVqek9tTFUyZWkzanBYOUhFbEU1bHRKTXdGeFp2SHpfVG9rZW46Ym94Y25iTXluOUJkWWFWSDNQTnMxcEVnekhiXzE2ODU5Mzk0NDY6MTY4NTk0MzA0Nl9WNA)

#### 2. 二进制帧

> HTTP/1.1 的报文为纯文本格式，而 HTTP/2 d 报文是全面采用二进制格式，并将原始的报文拆分为头信息帧和数据帧。**采用二进制格式有利于提升数据传输效率**。

#### 3. 多路复用

> 在 HTTP/2 中定义了**流（Stream）的概念，它是二进制帧的双向传输序列，一个数据流对应着一个完整的请求-响应过程，在同一个请求响应过程中，往返的帧会分配一个唯一的流编号**（Stream ID）。
>
> 在流的支持下，HTTP/2 可以在**一个 TCP 连接中传输多个请求或响应，而不用按照顺序一一对应（即实现多路复用**），因为它们属于不同的流，所发送的帧头部都会携带 Stream ID，可以通过此 Stream ID 有效区分不同的请求-响应。

因而 HTTP/2 解决了 HTTP/1.1 的『队头阻塞』（解决的是 http 的对头阻塞，但是传输成的 TCP 对头阻塞依旧存在）问题，多个请求 - 响应之间没有了顺序关系，不需要排队等待，降低了延迟，大幅度提高了连接的利用率。

举个栗子：

在一个 TCP 连接里面，服务器同时收到了 A 请求和 B 请求，于是先回应 A 请求，结果发现处理过程非常耗时，于是就发送 A 请求已经处理好的部分，接着回应 B 请求，完成后，再发送 A 请求剩下的部分。

#### 4. 服务端推送

> **相关博客**：
>
> [HTTP/2 服务器推送（Server Push）教程](https://blog.csdn.net/qq_34629352/article/details/121319590)

在 HTTP/1.1 中，只能客户端发起请求，服务器对请求进行响应。

而在 HTTP/2 中，服务端可以**主动**给客户端推送必要的资源，以减少请求延迟时间。

比如当客户端向服务器请求一个 `HTML` 文件后，服务器除了将此 `HTML` 文件响应给客户端外，还可以提前主动将此 `HTML` 中所依赖的 `JS` 和 `CSS` 文件推送给客户端，这样客户端在解析 `HTML` 时，无需耗费额外的请求去得到相应的 `JS` 和 `CSS` 文件。

**ps： HTTP/2 中的服务端推送，只能推送静态资源，不能推送自定义的内容。**

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZTliMWY5ZmY3YTg0YjI0NWQ5YWU3MThhMjI1MWVhMDRfTWkwZkVqdHFMRHFzU1NGNlRNWlZVYmw2M2pSRnhwQ3BfVG9rZW46Ym94Y25EMzhCZUV0eVFEOGZUU3FVMDBoNWVlXzE2ODU5Mzk0NDY6MTY4NTk0MzA0Nl9WNA)

### 6.4 HTTP/3

> Google 公司为了解决 HTTP/2 存在的一些问题，提出了 QUIC 协议，而 HTTP-over-QUIC 就是 HTTP/3，其相对于 HTTP/2 有以下改进。

#### 1. 无队头阻塞

> http/2 通过**多路复用**的技术解决了 http/1.1 中的队头阻塞问题，但是其只是解决了 HTTP 这一层面的队头阻塞问题，底层仍然采用的 TCP 连接。HTTP/2 并没有解决 TCP 的队头阻塞问题；

TCP 是可靠的、面向字节流的协议。HTTP/2 的多个请求虽然可以跑在同一个 TCP 连接中，但如果出现丢包现象，TCP 就需要进行重传，这可能就会导致整个 TCP 连接上的所有流阻塞，直到丢的包重传成功，这就是 TCP 的『队头阻塞』问题。

为了解决此问题，**HTTP/3 底层不再使用 TCP，而是采用 UDP ,** 而 UDP 是无连接的，多个流互相独立，之间不再有依赖，因而即使某个流发生了丢包，只会对该流产生影响，并不会使得其他流阻塞！

这时候有的小伙伴可能会问了，HTTP/3 底层不采用 TCP，那怎么保证可靠传输呢？答案就是 HTTP/3 在应用层自己重新实现了可靠性机制。也就是说，**HTTP/3 将原先 TCP 协议提供的部分功能上移至 QUIC，而且进行了改进。**

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=N2FhNzIzMzk0MzVkMTdiYTk2ZTA2NTY3ZTEwOGFkNmJfZU9ZZGRmOXFlYUZ4Q0JpWHRHTzZkVUJ2cDlZOHBObDlfVG9rZW46Ym94Y25reHBRMWpVcmFNajhMMnpPQU9aaWdXXzE2ODU5Mzk0NDY6MTY4NTk0MzA0Nl9WNA)

#### 2. **优化重传机制**

TCP 采用**序号+确认号+超时重传**机制来保证消息的可靠性，即如果某条消息超过一定时间还没有得到确认，则重新发送此消息。

由于网络拥堵情况不断变化，因而消息的超时时间并不是固定的，而是通过不断采样消息的往返时间不断调整的，但 **TCP 超时采样存在不准确的问题**。

举个栗子：

客户端发送一个序号为 N 的包，然后超时了（可能丢了，也可能网络堵塞了），于是重新发送一个序号为 N 的包，之后服务器收到后返回一个确认号 ACK 为 N+1 的包。但此时客户端并无法判断这个确定包是对原始报文的确认还是重传报文的确认，那么此时往返时间应该如何计算呢？

- 如果认为确认包是对原始报文的确认，则可能把时间算长了；
- 如果认为确认包是对重传报文的确认，则可能把时间算短了。（注意这两句话可能不好理解，见下图）

因而 TCP 的重传超时时间计算不准确，如果计算偏大，则效率慢，很久才会重传，而如果计算偏小，则可能确认报文已经在路上了，但却重传了！

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=NjBlMWY5ZWRjMjAwZjBhY2I3YWUyZThiZDlhMzBmMDFfVGlWRlVPcFhjaXFiVG4zWHJrS2hTTDJGV1B4SXA3STNfVG9rZW46Ym94Y25YM2pCajRxRmhTVWlMSVZ6VlpWb0tjXzE2ODU5Mzk0NDY6MTY4NTk0MzA0Nl9WNA)

QUIC 是如何解决此问题呢？其定义了一个**递增**的序列号（不再叫 Seq，而是 Packet Number），每个序列号的包只发送一次，**即使重传相同的包，其序列号也不一样**。

举个栗子：

客户端发送一个序号为 N 的包，然后超时了，于是重新发送一个相同的包，但序号不再是 N，而是 N+1；那么如果返回的确认包 ACK 为 N+1，就是对原始报文的响应，如果 ACK 为 N+2，就是对重传报文的响应，因而采样时间计算相对更加准确！

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=NGJmY2ZhNDYwZjBhYjNlZTUyM2VkZGEwMDBjMzM0MzVfZ25hNTFJVmJNZllCZzZSN2dkbTJFUmk0YXB2bHBOVG9fVG9rZW46Ym94Y240TGMzVmtwamZaRUhsWlQ3RGROOXRlXzE2ODU5Mzk0NDY6MTY4NTk0MzA0Nl9WNA)

那此时怎么知道包 N 和包 N+1 是同一个包呢？**QUIC 定义了一个** **Offset** **概念**。发送的数据有个偏移量 Offset，可以通过 Offset 知道数据目前发送到了哪里，因而如果某个 Offset 的包没有收到确认，就重发。

#### 3. **连接迁移**

众所周知，一条 TCP 连接是由`四元组`标识的，分别是**源 IP、源端口、目的 IP、目的端口**。一旦其中一个元素发生了变化，就需要断开重连。

当手机信号不稳定或者在 WIFI 与移动网络切换时，都将会导致重连，而重连就意味着需要重新进行三次握手，将产生一定的时延，用户感到卡顿，体验不友好。

而 QUIC 不采用`四元组`的方式标识连接，而是以一个 **64 位的随机数作为 ID** 来标识，通过此连接 ID 标记通信的两端，之后即使网络发生变化，IP 或端口变了，但只要 ID 不变，则无需重连，只需要复用原先连接即可，时延低，减少了用户的卡顿感，实现连接迁移。

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=Yjc1YjRiZDkzODg0OTUzNTgzNTMyNjI2ODllZDNlNzVfRm5lMU5yM05ubnVEUmhVRjBvTGJCcUZFYTNvTnZpM0lfVG9rZW46Ym94Y25QVzlxRnBLdEhlRVJEY3l1RnI5Uk1kXzE2ODU5Mzk0NDY6MTY4NTk0MzA0Nl9WNA)

### 6.5 总结

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=YzNhYTQ3OTU5MTQxMWY1NTZlOGZiMTM3YTVhMmQ3MWJfcGlXakVXcjRJUDQ1SGpoeGlaWWVyNVVIN3BoNlJQVmlfVG9rZW46Ym94Y24xTnlrWEE5N3kwTExlNHB0dmNxbTdlXzE2ODU5Mzk0NDY6MTY4NTk0MzA0Nl9WNA)

参考博客： [前后端开发必会的 HTTP 协议“十全大补丸”（万字长文）](https://www.nowcoder.com/discuss/459411847272255488?sourceSSR=search)

## 7. 常见请求方法

- GET：一般用于获取服务端资源；
- POST: 一般用于上传资源到服务端；
- PUT: 一般用于对服务端资源进行修改；
- DELETE: 一般用于删除服务端资源；
- HEAD: 获取报文首部，与 GET 相比，不返回报文主体部分；
- OPTIONS: 询问支持的请求方法，用来跨域请求；
- CONNECT: 要求在与代理服务器通信时建立隧道，使用隧道进行 TCP 通信；
- TRACE: 回显服务器收到的请求，主要⽤于测试或诊断。
