# 最大子数组和

> 给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。
> 子数组 是数组中的一个连续部分。

示例 1：

```js
输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
输出：6
解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。
```

示例 2：

```js
输入：nums = [1]
输出：1
```

示例 3：

```js
输入：nums = [5,4,-1,7,8]
输出：23
```

## 使用动态规划

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
  let len = nums.length;
  if (!len) {
    return 0;
  }
  let dp = Array(len); // 记录以指定元素为末位的连续子数组的最大和
  dp[0] = nums[0]; // 表示以nums[0]结尾的连续子数组的最大和为dp[0];
  let max = nums[0];
  for (let i = 1; i < len; ++i) {
    dp[i] = Math.max(nums[i] + dp[i - 1], nums[i]);
    max = Math.max(max, dp[i]);
  }
  return max;
};
```
