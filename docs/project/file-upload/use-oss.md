# 使用云储存

## 阿里云对象存储 OSS

参考使用 node.js 的文件上传 SDK：

https://help.aliyun.com/document_detail/32072.htm?spm=a2c4g.31978.0.0.5c694d33foxq5A#concept-32072-zh

### 一、简单上传

#### 基于阿里云 SDK

```JavaScript
// node.js
const OSS = require('ali-oss')
const path = require("path")

const client = new OSS({
  // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region: 'yourregion',
  // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
  accessKeyId: 'yourAccessKeyId',
  accessKeySecret: 'yourAccessKeySecret',
  // 填写Bucket名称。
  bucket: 'examplebucket',
});

const headers = {
  // 指定Object的存储类型。
  'x-oss-storage-class': 'Standard',
  // 指定Object的访问权限。
  'x-oss-object-acl': 'private',
  // 通过文件URL访问文件时，指定以附件形式下载文件，下载后的文件名称定义为example.jpg。
  // 'Content-Disposition': 'attachment; filename="example.jpg"'
  // 设置Object的标签，可同时设置多个标签。
  'x-oss-tagging': 'Tag1=1&Tag2=2',
  // 指定PutObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
  'x-oss-forbid-overwrite': 'true',
};

async function put () {
  try {
    // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
    // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
    const result = await client.put('exampleobject.txt', path.normalize('D:\\localpath\\examplefile.txt')
    // 自定义headers
    //,{headers}
    );
    console.log(result);
  } catch (e) {
    console.log(e);
  }
}

put();
```

在前端还可以直接使用 JavaScript 上传

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Document</title>
</head>
<body>
<button id="upload">上传</button>
<input id="file" type="file" />
<!--导入SDK文件-->
<script type="text/javascript" src="https://gosspublic.alicdn.com/aliyun-oss-sdk-6.16.0.min.js"></script>
    <script type="text/javascript">
    const client = new OSS({
        // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
        region: 'yourRegion',
        // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
        accessKeyId: 'yourAccessKeyId',
        accessKeySecret: 'yourAccessKeySecret',
        // 从STS服务获取的安全令牌（SecurityToken）。
        stsToken: 'yourSecurityToken',
        // 填写Bucket名称。
        bucket: 'examplebucket'
      });

      // 从输入框获取file对象，例如<input type="file" id="file" />。
      let data;
      // 创建并填写Blob数据。
      //const data = new Blob(['Hello OSS']);
      // 创建并填写OSS Buffer内容。
      //const data = new OSS.Buffer(['Hello OSS']);
      const upload = document.getElementById("upload");

      const headers = {
        // 指定上传文件的类型。
        // 'Content-Type': 'text/html',
        // 指定该Object被下载时网页的缓存行为。
        // 'Cache-Control': 'no-cache',
        // 指定该Object被下载时的名称。
        // 'Content-Disposition': 'oss_download.txt',
        // 指定该Object被下载时的内容编码格式。
        // 'Content-Encoding': 'UTF-8',
        // 指定过期时间。
        // 'Expires': 'Wed, 08 Jul 2022 16:57:01 GMT',
        // 指定Object的存储类型。
        // 'x-oss-storage-class': 'Standard'
        ,// 指定Object的访问权限。
        // 'x-oss-object-acl': 'private',
        // 设置Object的标签，可同时设置多个标签。
        // 'x-oss-tagging': 'Tag1=1&Tag2=2',
        // 指定CopyObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
        // 'x-oss-forbid-overwrite': 'true',
   };

       async function putObject (data) {
         try {
           // 填写Object完整路径。Object完整路径中不能包含Bucket名称。// 您可以通过自定义文件名（例如exampleobject.txt）或文件完整路径（例如exampledir/exampleobject.txt）的形式实现将数据上传到当前Bucket或Bucket中的指定目录。// data对象可以自定义为file对象、Blob数据或者OSS Buffer。
           const result = await client.put(
            "exampledir/exampleobject.txt",
            data
            //{headers}
          );
          console.log(result);
        } catch (e) {
          console.log(e);
        }
      }

      upload.addEventListener("click", () => {
        data = document.getElementById("file").files[0];
        putObject(data);
      });
    </script>
</body>
</html>
```

### 二、分片上传

- 关于分片上传的完整示例代码，请参见[GitHub 示例](https://github.com/ali-sdk/ali-oss/blob/565bd8606ffe518dbe98628f86f10f5ff047745f/README.md?spm=a2c4g.111268.0.0.340427edS2PQHu#initmultipartuploadname-options)。
- Node.js SDK 分片上传调用的方法`multipartUpload`中封装了三个 API 接口，详情如下：
  - 关于初始化分片上传事件的 API 接口说明，请参见[InitiateMultipartUpload](https://help.aliyun.com/document_detail/31992.htm#reference-zgh-cnx-wdb)。
  - 关于分片上传 Part 的 API 接口说明，请参见[UploadPart](https://help.aliyun.com/document_detail/31993.htm#reference-pnq-2px-wdb)。
  - 关于完成分片上传的 API 接口说明，请参见[CompleteMultipartUpload](https://help.aliyun.com/document_detail/31995.htm#reference-lq1-dtx-wdb)。
- 关于取消分片上传事件的 API 接口说明，请参见[AbortMultipartUpload](https://help.aliyun.com/document_detail/31996.htm#reference-txp-bvx-wdb)。
- 关于列举已上传分片的 API 接口说明，请参见[ListParts](https://help.aliyun.com/document_detail/31998.htm#reference-hzm-1zx-wdb)。
- 关于列举所有执行中的分片上传事件（即已初始化但尚未完成或尚未取消的分片上传事件）的 API 接口说明，请参见[ListMultipartUploads](https://help.aliyun.com/document_detail/31997.htm#reference-hj2-3wx-wdb)。

#### 初始化上传事件

使用 Multipart Upload 模式传输数据前，您必须先调用 InitiateMultipartUpload 接口来通知 OSS 初始化一个 Multipart Upload 事件。

##### **注意事项**

- 调用接口会返回一个 OSS 服务器创建的全局唯一的 Upload ID，用于标识本次 Multipart Upload 事件。您可以根据这个 ID 来发起相关的操作，例如中止 Multipart Upload、查询 Multipart Upload 等。
- 初始化 Multipart Upload 请求，并不影响已存在的同名 Object。
- 该操作计算认证签名时，需要添加`?uploads`到`CanonicalizedResource`中。
- 要通知 OSS 初始化一个 Multipart Upload 事件，您必须有`oss:PutObject`权限。具体操作，请参见[为 RAM 用户授权自定义的权限策略](https://help.aliyun.com/document_detail/199058.htm#section-ucu-jv0-zip)。

#### 分片上传完整代码

> ❗**重要** Node.js 分片上传过程中不支持 MD5 校验，建议分片上传完成后调用 CRC64 库自行判断是否进行 CRC64 校验。

```JavaScript
const OSS = require('ali-oss');
const path = require("path");

const client = new OSS({
  // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region: 'yourRegion',
  // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
  accessKeyId: 'yourAccessKeyId',
  accessKeySecret: 'yourAccessKeySecret',
  // 填写Bucket名称，例如examplebucket。
  bucket: 'examplebucket',
});


const progress = (p, _checkpoint) => {
  // Object的上传进度。
  console.log(p);
  // 分片上传的断点信息。
  console.log(_checkpoint);
};

const headers = {
  // 指定Object的存储类型。
  'x-oss-storage-class': 'Standard',
  // 指定Object标签，可同时设置多个标签。
  'x-oss-tagging': 'Tag1=1&Tag2=2',
  // 指定初始化分片上传时是否覆盖同名Object。此处设置为true，表示禁止覆盖同名Object。
  'x-oss-forbid-overwrite': 'true'
}

// 开始分片上传。
async function multipartUpload() {
  try {
    // 依次填写Object完整路径（例如exampledir/exampleobject.txt）和本地文件的完整路径（例如D:\\localpath\\examplefile.txt）。Object完整路径中不能包含Bucket名称。
    // 如果本地文件的完整路径中未指定本地路径（例如examplefile.txt），则默认从示例程序所属项目对应本地路径中上传文件。
    const result = await client.multipartUpload('exampledir/exampleobject.txt', path.normalize('D:\\localpath\\examplefile.txt'), {
      progress,
      // headers,
      // 指定meta参数，自定义Object的元信息。通过head接口可以获取到Object的meta数据。
      meta: {
        year: 2020,
        people: 'test',
      },
    });
    console.log(result);
    // 填写Object完整路径，例如exampledir/exampleobject.txt。Object完整路径中不能包含Bucket名称。
    const head = await client.head('exampledir/exampleobject.txt');
    console.log(head);
  } catch (e) {
    // 捕获超时异常。
    if (e.code === 'ConnectionTimeoutError') {
      console.log('TimeoutError');
      // do ConnectionTimeoutError operation
    }
    console.log(e);
  }
}

multipartUpload();
```

### 三、追加上传

追加上传是指通过 AppendObject 方法在已上传的追加类型文件（Appendable Object）末尾直接追加内容。

#### **注意事项**

- 本文以华东 1（杭州）外网 Endpoint 为例。如果您希望通过与 OSS 同地域的其他阿里云产品访问 OSS，请使用内网 Endpoint。关于 OSS 支持的 Region 与 Endpoint 的对应关系，请参见[访问域名和数据中心](https://help.aliyun.com/document_detail/31837.htm#concept-zt4-cvy-5db)。
- 本文以 OSS 域名新建 OSSClient 为例。如果您希望通过自定义域名、STS 等方式新建 OSSClient，请参见[新建 OSSClient](https://help.aliyun.com/document_detail/32010.htm#section-ngr-tjb-kfb)。
- 要追加上传，您必须有`oss:PutObject`权限。具体操作，请参见[为 RAM 用户授权自定义的权限策略](https://help.aliyun.com/document_detail/199058.htm#section-ucu-jv0-zip)。
- 当文件不存在时，调用 AppendObject 接口会创建一个追加类型文件。
- 当文件已存在时：
  - 如果文件为追加类型文件，且设置的追加位置和文件当前长度相等，则直接在该文件末尾追加内容。
  - 如果文件为追加类型文件，但是设置的追加位置和文件当前长度不相等，则抛出 PositionNotEqualToLength 异常。
  - 如果文件为非追加类型文件时，例如通过简单上传的文件类型为 Normal 的文件，则抛出 ObjectNotAppendable 异常。
- 追加类型文件暂不支持 CopyObject 操作。

```JavaScript
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="https://gosspublic.alicdn.com/aliyun-oss-sdk-6.17.1.min.js"></script>
  </head>
  <body>
    <input type="file" id="file" />
    <button id="upload">上传</button>
    <script>const upload = document.getElementById("upload");

      const client = new OSS({
        // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
        region: 'yourRegion',
        // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
        accessKeyId: 'yourAccessKeyId',
        accessKeySecret: 'yourAccessKeySecret',
        // 从STS服务获取的安全令牌（SecurityToken）。
        stsToken: 'yourSecurityToken',
        // 填写Bucket名称。
        bucket: 'examplebucket'
      });

      upload.addEventListener("click", async () => {
        const target = file.files[0];
        // 填写Object完整路径，Object完整路径中不能包含Bucket名称，例如examplefile.txt。
        // 第一次追加上传。返回值为下一次追加的位置。
        const result = await client.append("examplefile.txt", target);

        await client.append("123", target, {
          // 第二次追加。后续追加的位置（position）是追加前文件的长度（Content-Length）。
          position: result.nextAppendPosition,
        });
      });
    </script>
  </body>
</html>
```

### 使用 STS 临时访问凭证访问 OSS

> - https://help.aliyun.com/document_detail/32077.htm?spm=a2c4g.100624.0.0.b6a54f77gbOgzs#section-zkq-3rq-dhb
> - https://help.aliyun.com/document_detail/100624.html?spm=a2c4g.31848.0.i1#section-ezw-6mu-bv1

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=MDY2NDBmNzNmZDZiNmE5MzliOWE1YTJlNmYzNTY5YWJfVHpTQTdkdWlNb1ZlYlB2Y3QzMDZBNzJkeVA3WER0eFJfVG9rZW46UTdxTmJ0dU9qb0NZM1l4YW1GU2NwZmM2bmJkXzE2ODU5NDk1MzY6MTY4NTk1MzEzNl9WNA)

使用 STS 授权用户直接访问 OSS 的流程如下：

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=NTY2NTY4NTc0ZGNmYzQ0MjNkM2NkZmM2ODkwNmM3N2RfY3RZUTNBRXo5V3FURHhiU0NFSm5FN0QxTE1sNGpLaHpfVG9rZW46Rmk2RmI5ZG1abzVYd0t4ZUJkeGNHTWU4blBjXzE2ODU5NDk1MzY6MTY4NTk1MzEzNl9WNA)

## 碰到的一些问题

1. ### 浏览器访问 OSS 时出现跨域

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=MjU1YjcxOWJmNzE3MWUwZGM4MzI3NWYyYzdmNTAyYmZfTjJ4QTZDcGVWMEpVN0ZQQUZaVGVxbHZoWXo3R0RHVWxfVG9rZW46SnN2Q2J0dDJMb3NCdEx4QzVjTWM5Q2RGblBoXzE2ODU5NDk1MzY6MTY4NTk1MzEzNl9WNA)

1. ### 关于使用临时访问凭证访问 OSS 时，出现 Access Id 不存在之类的问题

> InvalidAccessKeyIdError: The OSS Access Key Id you provided does not exist in our records. The Security Token may be lost to specify that it is a STS Access Id.

在项目中测试时，是因为设置 stsToken 时，错误地写成了 securityToken，导致错误。

1. ### 在访问 bucket 中的文件时，再次出现跨域，以及一个 403

> 【阿里云 OSS】403 错误，AccessDenied：The bucket you access does not belong to you.

1. 首先在跨域配置那里，添加 get 请求的跨域允许;
2. 为`RAM角色`添加操作 bucket 的权限（`AliyunOSSFullAccess`）。（关于添加 RAM 用户，角色请参考官方帮助文档）；

3. ### 在进行追加上传时，初次上传返回的结果中的 nextAppendPosition 为 undefined

在使用 OSS 追加上传时，如果初次调用 append 方法返回的 nextAppendPosition 为 undefined，有以下几种可能的情况：

1. Bucket 未开启版本控制：OSS 的追加上传需要开启 Bucket 的版本控制功能，可以在 Bucket 的控制台中开启版本控制。
2. Object 不存在：如果使用的 Object 不存在，则需要先调用`initiateMultipartUpload`方法创建上传任务，成功后才能调用`append`方法上传文件。
3. API 版本不一致：OSS 的 API 版本分为 oss-sdk-js-v2 和 oss-sdk-js-v5，这两个版本的 API 方法和返回值可能会有所不同，需要确认使用的 API 版本是否正确。
4. 单次追加数据大小超过限制：OSS 追加上传时，单次最多只能追加 5GB 大小的数据，如果超过这个限制则会返回`InvalidArgument`错误。

5. ### 进行分片上传时，提示没有暴露 Etag

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=M2Q0NTVkMTE4ZGI5MGIyYmI0ZjE4MWZmZDhhYjcyODlfdkdhVm5QbUVLbkVabnlwc1AwUG9aNGdsS1ZxUGNLcWJfVG9rZW46SkUxR2J1eTJ1bzBWSFF4VkV0eGNvZWxabktmXzE2ODU5NDk1MzY6MTY4NTk1MzEzNl9WNA)

1. ### 不支持 x-oss-storage-class

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=NWU3NmNiYzkwZmEzMGYwMTQ2MGUyNTUxNTNkYzQ0M2FfZkc1RFFwYTNVbVBLRHh5QmpON0dtbTV1MTh0VHNrSXNfVG9rZW46WXdHcGJKNGZ4b3Q0R0l4dHVHV2N5SlFwbmpnXzE2ODU5NDk1MzY6MTY4NTk1MzEzNl9WNA)

**解决方法：直接将对应的属性注释**

![img](https://r14ox2jzbq.feishu.cn/space/api/box/stream/download/asynccode/?code=NjAwNzkwZmY0MjJhZDEzYTdmZWYwMmIyMDJlZjU2NjVfSFI2TER4MHJRZ1hyYjlhMHB5U2E2T0RyVEhibzAxZ1lfVG9rZW46QUhJbmJrNkV5b0ROQ3F4V0RiTWNXV1BKbjllXzE2ODU5NDk1MzY6MTY4NTk1MzEzNl9WNA)
