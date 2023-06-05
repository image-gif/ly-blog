# nginx 中 location 匹配

> 解释一个问题

- **unknown directive "if(!-e" in /usr/local/nginx/conf/nginx.conf**

> 问题在于，if 和(之间必须有个空格，这搞我很无语，能在配置文件里面可以用类似于语言类的 if 语句，也算是一进步吧，但是还不是很完美。

## 1. location 的两种语法

> 第一种语法分为 3 个部分, 分别是: `location关键字`+`@name别名(name是自己取的名字)`+`如何处理`, 这个语法很简单, 就是做内部跳转, 这里不讨论了.

```Shell
location @name { ... }
```

> 第二种语法分为 4 个部分, 分别是: `location关键字` + `匹配方式符号(可省略)`+`匹配规则`+`如何处理`, 这个最复杂也是最常用, 我们只讨论这个.

```Shell
location [ = | ~ | ~* | ^~ ] uri { ... }
```

## 2. 普通匹配和[正则匹配](https://so.csdn.net/so/search?q=正则匹配&spm=1001.2101.3001.7020)

> 这个语法的难点全部集中在`[ = | ~ | ~* | ^~ ]`这里, 只要搞懂这个就能正确使用 location.
>
> `[ = | ~ | ~* | ^~ ]`分为两种匹配模式, 分别是普通匹配和正则匹配.

### 普通匹配概述

> = : 这代表精准匹配全路径, 命中它后直接返回, 不再进行后续匹配, 优先级最高.
>
> ^~ : 这代表精准匹配开头, 命中开头后直接返回, 不再进行后续匹配, 优先级第二.
>
> 无匹配方式符号 : 这代表通用性匹配, 命中后还会继续后续匹配, 最后选取路径最长的匹配, 并储存起来, 优先级第四.

### 普通匹配举例

```Shell
#这是精准匹配, 只有请求路径完全匹配`/index.html`才会命中它
location = /index.html {
  ...
}
#这是精准匹配开头, 只要请求路径的开头是`/image/`, 就会命中并立即返回
location ^~ /image/ {
  ...
}
#这是无匹配方式符号的普通匹配, 如果请求路径开头是`/image/`, 则会命中, 但是不会立即返回还会接着进行普通匹配
location /image/ {
  ...
}
#这是无匹配方式符号的普通匹配, 如果请求路径开头是`/image/meinv`, 则会命中, 但是不会立即返回还会接着进行普通匹配, 同时会舍弃掉上面那个匹配
location /image/meinv {
  ...
}
```

### 正则匹配概述

```Shell
#区分大小写的正则匹配, 如果路径包含 /image/ 则立即返回, 注意这里并不需要开头命中, 因为这是正则表达式
location ~ /image/ {
  ...
}

#区分大小写的正则匹配, 如果路径包含 /image(不分大小写)/ 则立即返回, 注意这里并不需要开头命中, 因为这是正则表达式, 但由于上面一个正则匹配规则在前面, 所以如果路径包含 /image/ 则会被挡下来, 匹配不到这里.
location *~ /IMAGE/ {
  ...
}
```

## 3. location 如何匹配?

> 1. 先进行普通匹配中的精准匹配, 如果命中了立马返回.
> 2. 然后进行普通匹配中的精准开头匹配, 如果命中则立马返回.
> 3. 进行普通匹配中的 无匹配符号 匹配, 如果命中继续匹配, 知道普通匹配全部完成, 并保存路径最长的匹配.
> 4. 由上自下进行正则匹配, 如果命中立即返回.
> 5. 如果正则匹配全部失败, 则返回普通匹配中存放的匹配.

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=ZmJiYjlhMjIyMjYyYjU4MGI3MTQ2M2Y1MGNmZGNlM2ZfM015bDgyN1pYWVRNc2F0VG5Xd1lhMHhNcmtRQUNaZTJfVG9rZW46Ym94Y25reVpPbmdOd3NCQ0JEN2JDUVlTcE1rXzE2ODU5MzY5Mzc6MTY4NTk0MDUzN19WNA)
