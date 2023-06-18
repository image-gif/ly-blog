# 随机数


## 得到一个大于等于0，小于1之间的随机数
```js
function getRandom() {
  return Math.random();
}

```

## 得到一个两数之间的随机数
```js
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
```

## 得到一个两数之间的随机整数
```js
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}

```

## 得到一个两数之间的随机整数，包括两个数在内
```js
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
}
```