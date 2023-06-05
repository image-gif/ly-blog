# HTTP 缓存

## 1. Http 缓存

### 1.1 强缓存

> 通过特殊的 HTTP Cache-control 和 Expires 请求头，HTTP 让原始服务器向每个文档附加一个过期日期，这些请求头部说明了在多长时间内可以将这些内容是为新鲜的；
>
> 浏览器在第二次发送请求相同资源时，拿出过期时间与当前时间进行比较，如果在过期日期之前，这强缓存命中，反之，缓存就必须与服务器进行核对，询问文档是否过期(是否被修改了)，如果是就需要获取最新的一份文档；

例子：

- **Expires:** 设置过期的具体时间，以此来判断当前请求的资源是否过期；

- 缺点： 客户端和服务器时间可能不同步，导致拿到的资源可能不是新鲜的；

- **Cache-control:** 设置一个资源可以缓存的时长，单位(秒),这是继 Expires 之后提出的一个改进方案；

- 从第一次请求开始，后序只要在这个时长内，就使用缓存文件，如果超出时长，就去服务器进行核对；(作为 Expires 的替代品)

```JavaScript
// 通过node.js模拟资源请求
Server.on('request', function (req, res) {
  const response = `请求路径 ${req.url}, 请求方法 ${req.method}`;
  // console.log(url.parse(req.url));
  const { pathname } = url.parse(req.url);
  if (pathname === '/') {
    const response = fs.readFileSync('../pages/index.html');
    res.end(response);
  } else if (/images/.test(pathname)) {
    console.log('拿图片');
    const url = path.resolve(__dirname, '../' + pathname);
    const file = fs.readFileSync(url);

    // 使用Expires
    // res.setHeader('Expires', new Date('2022-12-12 10:40:59').toUTCString()); // 设置一个过期时间
    // res.writeHead(200, {
    //   Expires: new Date('2022-12-12 10:30:59').toUTCString()
    // });
    // 使用Cache-control
    res.setHeader('Cache-control', 'max-age=50'); // 单位秒
    res.end(file);
  } else {
    res.setHeader('Content-type', 'text/html; chartset=utf-8');
    res.end();
  }
});
```

**关于 Cache-control 其他属性值：**

- **no-cache, no-store:**

**no-cache: 表示强制进行协商缓存，在每次请求资源时，不是直接从本地缓存中根据过期时间判断是否要与服务器进行核对，而是直接先与服务器进行协商，再确认是否使用本地缓存中的资源；（不是不缓存）**

**no-store: 表示不需要缓存；与 no-cache 是对立的，不能一起使用**

- **public, private:**

- **在一些项目中，一般会有代理服务器，那么我们的请求的资源同样可以缓存到这些服务器上，设置 public 和 private 就是来确定是否要在这些中间服务器上进行资源缓存；**

- **public:表示可以在中间服务器上进行缓存；**

- **Private: 表示私有的，只在客户端上进行缓存；**

- **两者也是对立的，不能同时使用；默认是(public),如果要求为 http 认证，响应会自动设置为 private**

- **max-age 与 s-maxage**

s-maxage:是给中间服务器设置的缓存时长，只有在 public 下，才能生效

### 1.2 协商缓存

> 在使用本地缓存之前，需要向服务器发起一次 GET 请求，与之协商当前浏览器保存的本地缓存是否已经过期。

- last-modified:最近修改的时间，指的是当前请求资源最近修改的时间(时间戳，但是精确到的是秒，对于一些快速修改无法进行精准判断)；同时需要搭配 Cache-control：no-cache(进行协商缓存)；last-modified 无法对于资源修改做精准的判断，没有做到根据文件内容变化来制定相应的修改时间；
- Etag: 对于 last-modified 进行弥补,但不是替代品，各有个的优势，通过 hash 运算，对文件内容的修改进行判断，使得协商更加准确；

例子：

```JavaScript
 /* 协商缓存 */
    // 获取修改时的时间(获取的时间，不完全是资源内容修改的时间)
    // const { mtime } = fs.statSync(url);
    // 通过hash运算获取资源修改后的新的hash值
    const file = fs.readFileSync(url);
    const etagContent = etag(file);
    // const ifModifiedSince = req.headers['if-modified-since'];
    const ifNoneMatch = req.headers['if-none-match'];
    console.log(req.headers);
    // console.log(mtime.toUTCString(), ifModifiedSince);
    // if (ifModifiedSince === mtime) {
    if (ifNoneMatch === etagContent) {
      res.statusCode = 304;
      res.end();
      return;
    }
    res.setHeader('Cache-control', 'no-cache');
    res.setHeader('etag', etagContent);
    // res.setHeader('last-modified', mtime.toUTCString());
    res.end(file);
```

### 1.3 缓存策略

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=MDQ2ZDNhZWEyM2Q1ZGIzZDk1NThjOGJjOWU1YjkyMTdfQlRJQnRBSmVsYUI0ZzcwMlh0RXhiZXNuYVFVdjFvUjdfVG9rZW46Ym94Y255S1NUQUlSeHMyUm96YzBYNFp5cW9kXzE2ODU5Mzg5Mzg6MTY4NTk0MjUzOF9WNA)
