# 前端大文件上传

## 前言

大文件上传最主要的问题就在于：在一个请求中，要上传大量的数据，导致**整个过程会比较漫长**，且**失败**后需要**重头开始上传**。未处理大文件上传时，常常是如下的结果：

- 上传过程时间比较久（要传输更多的报文，丢包重传的概率也更大），在这个过程中不能做其他操作，用户不能刷新页面，只能耐心等待请求完成。
- 常见的软件应用中，前端/后端都会对一个请求的时间进行限制，那么大文件的上传就会很容易超时，导致上传失败。

## 问题分析

在http请求中，我们知道可以进行并发请求，那么我们是否可以将这个大文件进行分段，然后并发出去，这样就保证了每个请求发送的数据就不会太大，同时如果出现请求失败，我们也不必在全部重传，感觉很完美，那么我们需要完成的任务有那些嘞：

- 首先要实现文件切片（Blob.slice,现学现用，嘿嘿😂）
- 断点续传（噢~，之前在计网中学习的知识，想不到在这个地方派上用场了，good~👏）
- 显示上传进度和暂停上传（之前在项目使用过axios库的process，但是当时好像没有完全实现，这次我要拿回属于我的一切💪）

## 开始表演

### 一、文件切片

> 在JavaScript中，文件File对象是Blob对象的子类，在Blob对象上有一个非常重要的方法**`slice`****，**通过这个方法，我们可以对二进制文件进行分割。

```JavaScript
let SIZE = DEFAULT_VALUE;
// 生成文件切片
/**
* @param {File} file 文件内容
* @param {number} size 切片大小
*/
function createFileChunk(file, size=SIZE) {
    const fileChunkList = [];
    let curIndex = 0;
    while(curIndex < file.size) {
        fileChunkList.push({
            file: file.slice(curIndex, curIndex + size)
        })
        curIndex += size;
    }
    return fileChunkList;
}
```

> 将file文件拆分为size大小（可以是100K, 500K, 1MB...）的切片，得到一个file切片数组fileChunkList，然后每次请求只需要上传这个一部分的分块即可，服务器接收到这些切片后，再将他们拼接起来。

### 二、获取原文件的hash值

获取原文件的hash是关键的一步，在同一个文件中，修改文件的文件名，也不会修改hash值，这样就可以避免文件改名后重复上传的问题。

这里使用了**`spark-md5`**来根据文件的二进制内容计算文件的hash值。

> 考虑到在上传大文件时，读取文件内容，并计算对应的hash值是一件非常耗时的事情，同时会造成页面卡顿，导致页面出现假死状态，所有我们使用web-worker在worker线程计算hash值，这样用户仍然可以在页面上进行正常的交互工作。
>
> 关于实例化web-worker：
>
> 由于实例化web-worker时，参数是一个js文件路径且不能跨域，所以我们将单独创建一个hash.js文件放在public目录下，另外在worker中是无法访问页面DOM，但是它提供了importScripts函数用于导入外部的脚本，通过它导入[spark-md5](https://www.npmjs.com/package/spark-md5);

计算文件的hash值:(spark-md5中的一个例子)

```HTML
    <input type="file" id="file" />
    <script src="https://cdn.bootcdn.net/ajax/libs/spark-md5/3.0.2/spark-md5.min.js"></script>
    <script>
      // 计算file文件的hash值
      // 初始化一些常量
      const size = 2 * 1024 * 1024 // 文件切片大小 2MB

      const input = document.getElementById('file')
      input.addEventListener('change', function (e) {
        const file = e.target.files[0]
        const hash = calcHash(file)
      })
      function calcHash(file) {
        const fileSize = file.size
        // 切片大小
        const chunkSize = Math.ceil(fileSize / size)
        // 当前切片索引
        let currentChunk = 0
        spark = new SparkMD5.ArrayBuffer()
        fileReader = new FileReader()

        fileReader.onload = function (e) {
          console.log('read chunk nr', currentChunk + 1, 'of', chunkSize)
          spark.append(e.target.result)
          currentChunk++

          if (currentChunk < chunkSize) {
            loadNext(currentChunk, file, fileReader, fileSize, chunkSize)
          } else {
            console.log('finished loading')
            console.info('computed hash', spark.end())
          }
        }
        fileReader.onerror = function (e) {
          console.warn('oops, something went wrong.')
        }

        loadNext(currentChunk, file, fileReader, fileSize, chunkSize)
      }
      function loadNext(currentChunk, file, fileReader, fileSize, chunkSize) {
        const start = currentChunk * chunkSize
        const end = start + chunkSize >= fileSize ? fileSize : start + chunkSize
        fileReader.readAsArrayBuffer(
          Blob.prototype.slice.call(file, start, end)
        )
      }
    </script>
```

当然我们在此处使用的是web-worker来计算hash，那么就要在onmessage事件中处理，同时也要进行postMessage发送消息给主页面

```JavaScript
// public/hash.js
self.onmessage = e => {
        const { fileChunkList } = e.data
        const spark = new self.SparkMD5.ArrayBuffer()
        let percentage = 0
        let count = 0
        const loadNext = index => {
                const reader = new FileReader()
                reader.readAsArrayBuffer(fileChunkList[index].file)
                reader.onload = e => {
                        count++
                        spark.append(e.target.result)
                        if (count === fileChunkList.length) {
                                self.postMessage({
                                        percentage: 100,
                                        hash: spark.end()
                                })
                                self.close()
                        } else {
                                percentage += 100 / fileChunkList.length
                                self.postMessage({
                                        percentage
                                })
                                loadNext(count)
                        }
                }
        }
        loadNext(count)
}
```

我们传入fileChunkList，利用FileReader读取切片的ArrayBuffer并不断传入spark-md5中，每计算完一个切片通过postMessage向主线程发送一个进度事件，全部完成将最终的hash发送给主线程。

spark-md5 需要根据所有切片才能计算出一个hash值，不能直接将整个文件放入计算，否则即时不同文件也会有相同的hash。

### 三、文件上传

1. 在上传文件到服务器时，先发送请求判断一下服务端是否存在对应的文件，传递一个文件名和对应的hash值，如果存在，就不用再传递，否则进入下面文件上传过程；

```JavaScript
const { shouldUpload, uploadedList } = await VerifyUpload(fileName, fileHash);
// 返回是否需要上传的标识 shouldUpload；
// 返回已经上传的文件切片列表 uploadedList ；
```

1. 上传除了已经上传的切片

```JavaScript
// 上传切片的时候，过滤到已经上传成功的切片
async function uploadChunks(uploadedList = []) {
    console.log('uploadList', uploadList);
    // 需要上传的文件切片
    const requestList = fileChunkList
        .filter(({hash}) => !uploadList.includes(hash))
        .map(({chunk, hash, index}) => {
                const formData = new FormData();
                // 切片文件
                formData.append('chunk', chunk);
                // 切片文件hash
                formData.append('hash', hash);
                // 大文件的文件名
                formData.append('filename', file.name); 
                formData.append('filehash', file.hash);
                return {formData, index};
        })
        .map(async ({formData, index}) => {
                request({
                    url: string,
                    data: formData,
                    onProgress: function,
                    requestList: requestListArr
                })
         });
    // 并发请求
    await Promise.all(requestList);
    
    // 发送合并切片的请求
    if(uploadedList.length + requestList.length === fileChunkList.length) {
        // 请求合并文件
        mergeRequest();
    }         
               
}
```

### 四、文件切片合并

合并方案一般有如下：

1. 前端发送完切片之后，发送一个合并请求，后端收到这个请求之后，就将之前的切片文件合并；
2. 后台记录切片文件上传数据，当后台检测到切片上传完成后，自动完成合并；
3. 创建一个和源文件大小相同的文件，根据切片文件的起止位置直接将切片写入对应的位置；

这里采用的是第一种方案：

```JavaScript
// 合并文件夹中的切片，生成一个完整的文件
const mergeFileChunk = async (filePath, fileHash, size) => {
    // 所有文件切片放在以“大文件的文件hash命名文件夹”中
    const chunkDir = path.resolve(UPLOAD_DIR, fileHash);
    const chunkPaths = await fse.readdir(chunkDir); // fse: fs-extra 原fs模块的扩展
    // 根据切片下表进行排序
    // 如果直接读取目录的获得顺序，可能会出现错乱的问题
    chunkPaths.sort((a, b) => {
        return a.split('-')[1] - b.split('-')[1];
    })
    
    await Promise.all(
        chunkPaths.map((chunkPath, index) => {
            return pipeStream(
                path.resolve(chunkDir, chunkPath),
                /*
                   创建写入的目标文件的流，并指定位置，目的是能够并发合并多个可读流到可写流中，
                   这样即使流的顺序不同也能传输到正确的位置，所以这里还需要让前端在请求的时候
                   多提供一个size参数。其实也可以等上一个切片合并完之后再合并下一个切片，这样
                   就不需要指定位置，但是这样会使传输速度降低，所以使用了并发合并的手段。
                */
                fse.createWriteStream(filePath, {
                    start: index * size,
                    end: (index + 1) * size
                })
            )
        })
    )
    // 文件合并之后，删除保存切片的目录
    fse.rmdirSync(chunkDir);
}
```

## 总结

### 一、上传文件

我们都知道如果要上传一个文件，需要把 form 标签的 enctype 设置为 multipart/form-data，同时method 必须为 post 方法。（这是最原始的方式）

那么 multipart/form-data 表示什么呢？

> multipart 互联网上的混合资源，就是资源由多种元素组成，form-data 表示可以使用 HTML Forms 和 POST 方法上传文件，具体的定义可以参考 RFC 7578。

但是现在，我们很少使用这种 form 的方式了，我们都是直接使用 XMLHttpRequest 来发送 Ajax 请求。

最开始 XMLHttpRequest 是不支持传输二进制文件的。文件只能使用表单的方式上传，我们需要写一个 Form，然后将 enctype 设置为 multipart/form-data。

后来 XMLHttpRequest 升级为 Level 2 之后，新增了 **FormData** 对象，用于模拟表单数据，并且支持发送和接收二进制数据。我们目前使用的文件上传基本都是基于 XMLHttpRequest Level 2。

xhr.send(data) 中 data 参数的数据类型会影响请求头部 content-type 的值。我们上传文件，data 的类型是 FormData，此时 content-type 默认值为 multipart/form-data；在上传文件场景下，不必设置 content-type 的值，**浏览器会根据文件类型自动配置；**

### 二、显示进度条

我们可以通过 onprogress 事件来实时显示进度，**默认情况下这个事件每 50ms 触发一次**。需要注意的是，上传过程和下载过程触发的是不同对象的 onprogress 事件：上传触发的是 xhr.upload 对象的 onprogress 事件，下载触发的是 xhr 对象的 onprogress 事件。

特别提醒：`xhr.upload.onprogress` 要写在 `xhr.send` 方法前面。

### 三、暂停上传

一个请求能被取消的前提是，我们需要将未收到相应的请求保存在一个列表中，然后以此调用每个请求xhr对象的abort方法，调用这个方法后，xhr对象会停止触发时间，将请求的status置为0，并且无法访问任何与响应有关的属性。

从后端的角度看，一个上传请求被取消，意味着当前浏览器不会再向后端传输数据流，后端此时会报错，如下，错误信息也很清楚，就是文件还没到末尾就被客户端中断。当前文件切片写入失败。

但是要注意的是，在中断请求这里，要是在别的情况下，我们中断请求，并不会中断后端的处理流程，我们只是关闭了客户端接收请求响应的过程。

### 四、Hash的优化空间

计算 hash 耗时的问题，不仅可以通过 web-workder，还可以参考 React 的 FFiber 架构，通过 requestIdleCallback 来利用浏览器的空闲时间计算，也不会卡死主线程；

如果觉得文件计算全量 Hash 比较慢的话，还有一种方式就是计算抽样 Hash，减少计算的字节数可以大幅度减少耗时；

在前文的代码中，我们是将大文件切片后，全量传入 spark-md5.min.js 中来根据文件的二进制内容计算文件的 hash 的。

那么，举个例子，我们可以这样优化： 文件切片以后，取第一个和最后一个切片全部内容，其他切片的取 首中尾 三个地方各2个字节来计算 hash。这样来计算文件 hash 会快很多。

### 五、限制请求个数

解决了大文件计算 hash 的时间优化问题；下一个问题是：如果一个大文件切了成百上千来个切片，一次发几百个 http 请求，容易把浏览器搞崩溃。那么就需要控制并发，也就是限制请求个数。

思路就是我们把异步请求放在一个队列里，比如并发数是4，就先同时发起4个请求，然后有请求结束了，再发起下一个请求即可。

我们通过并发数 max 来管理并发数，发起一个请求 max--，结束一个请求 max++ 即可。

### 六、拥塞控制，动态计算文件切片大小

## 引用

- [前端必学 - 大文件上传如何实现](https://blog.csdn.net/csdn_yudong/article/details/123720232)
