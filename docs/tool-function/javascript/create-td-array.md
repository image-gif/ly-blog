# JavaScript 创建二维数组

首先说一下这里面的一个坑：

```JavaScript
const arr = Array(3).fill(Array(3).fill(0));
arr[0][0] = 2;

for (let item of arr) {
  console.log(item);
}
// output:
/*
[ 2, 0, 0 ]
[ 2, 0, 0 ]
[ 2, 0, 0 ]
*/
```

了解`Array.fill`方法的同学，会发现这里的第一个 fill 方法里面的实参是一个引用类型，在 MDN 上，也明确说出关于 value 为引用类型时，那么被填充的数组每一项都将是这个引用类型；

那么下面介绍几种创建二维数组的方式：

```JavaScript
// 方式一：
const arr = Array(3).fill(0).map(x => Array(3).fill(0));
// 方式二：
const arr = Array.from(Array(2), () => new Array(4).fill(1));
// 方式三：
const arr = Array(n);
for(let i = 0; i < n; ++i) {
    arr[i] = Array(m).fill(0);
}
```
