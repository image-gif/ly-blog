# 无重复字符的最长子串

给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。

示例 1：

```js
输入: s = "abcabcbb"
输出: 3
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

示例 2：

```js
输入: s = "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
```

示例 3：

```js
输入: s = "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
```

提示：

- 0 <= s.length <= 5 \* 104
- s 由英文字母、数字、符号和空格组成

实现：

> 使用滑动窗口实现

```js
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  let size = s.length;
  if (!size) {
    return 0;
  }
  let max = 1;
  let start = 0;
  let end = 1;
  while (start <= end && end < size) {
    let subArr = s.slice(start, end);
    let index = subArr.indexOf(s[end]);
    if (index > -1 && start < end) {
      start += index + 1;
    } else {
      max = Math.max(max, end - start + 1);
      ++end;
    }
  }
  return max;
};
```
