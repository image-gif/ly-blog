# 常用的一些工具

### jsDelivr

> https://www.jsdelivr.com/ jsDelivr 由 ProspectOne 维护的公共库，使用的融合 CDN 技术，由 Cloudflare、Fastly、StackPath、QUANTIL 等 CDN 供应商提供了全球超过 750 个 CDN 节点。（内容分发网络） 最重要的是，jsDelivr 在中国大陆也拥有超过数百个节点，因为 jsDelivr 拥有正规的 ICP 备案，解决了中国大陆的访问速度优化，实现真正的全球极速低延迟体验。 jsDelivr 是免费的、不限制带宽的，可以加速 NPM、Github 内的文件。 本文采用的方法就是将静态文件资源放到 Github 的仓库内，再使用 jsDelivr 进行加速访问，达到完全零成本优化访问速度。相当于一个高速访问的图床！

> 相关博客： https://zhuanlan.zhihu.com/p/550431549

jsDelivr 是一个开源免费的 CDN（内容分发网络）服务，主要用于加速网站内容的加载。它通过将静态资源（如 JavaScript、CSS、图像等）缓存在全球节点服务器上，使这些资源能够更快地加载到用户的终端设备上。

jsDelivr 的主要优势在于其网络扩展性和可靠性，它使用全球各地的服务器来存储和传输内容，从而在许多情况下比传统自托管内容更快、更稳定。

jsDelivr 的使用非常简单，只需要按照这个格式引用资源即可：https://cdn.jsdelivr.com/package@version/file-path，其中package为资源包名，version为资源版本号，file-path为资源文件路径。通过使用jsDelivr，网站的访问速度可以显著提高，从而提升用户的体验。
