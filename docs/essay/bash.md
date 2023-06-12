# bash 创建自定义执行脚本

> 参考： https://m.elecfans.com/article/1941370.html

举例：
实现 git 提交代码

```shell
#!/bin/bash


# $0：代表第一个参数(一般就是当前执行的sh文件)， $1: 手动传入的第一个参数，$2：依次类推
git status
git add ../
git status
git commit -m $1
git pull
git push
```
