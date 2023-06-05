# 排序算法

> https://blog.csdn.net/qq_51664685/article/details/124427443

## 1. 归并排序

> 归并，指合并，合在一起。归并排序（Merge Sort）是建立在归并操作上的一种[排序算法](https://so.csdn.net/so/search?q=排序算法&spm=1001.2101.3001.7020)。其主要思想是分而治之。
>
> 若将两个有序集合并成一个有序表，称为 2-路归并，与之对应的还有多路归并。

![img](<../../public/1280X1280%20(3).png>)

```JavaScript
var mergeSort = function (nums, startIndex, endIndex) {
  if (startIndex >= endIndex) {
    return;
  }
  // 分
  var middle = parseInt((startIndex + endIndex) / 2);
  mergeSort(nums, startIndex, middle);
  mergeSort(nums, middle + 1, endIndex);

  // 此时到达最底部，不能再拆分了 或者此时到达比较阶段
  // 此时比较的应该看成是两个数组，且都是有序的数组
  // 使用双指针进行比较,使用一个临时数组存放比较之后的数组
  var leftStart = startIndex;
  var leftEnd = middle;
  var rightStart = middle + 1;
  var rightEnd = endIndex;
  var currentIndex = 0; // 临时数组当前所在索引
  var tempList = []; // 临时数组

  // 合并
  while (leftStart <= leftEnd && rightStart <= rightEnd) {
    if (nums[leftStart] > nums[rightStart]) {
      tempList[currentIndex] = nums[rightStart];
      ++currentIndex;
      ++rightStart;
    } else {
      tempList[currentIndex] = nums[leftStart];
      ++currentIndex;
      ++leftStart;
    }
  }

  // 存在两个有序数组其中一个还要剩余部分没有比较，此时将剩余部分直接加入到templist数组之后
  while (leftStart <= leftEnd) {
    tempList[currentIndex] = nums[leftStart];
    ++currentIndex;
    ++leftStart;
  }

  while (rightStart <= rightEnd) {
    tempList[currentIndex] = nums[rightStart];
    ++currentIndex;
    ++rightStart;
  }

    // 将排好序的序列插入到指定的元数组位置
  for (var i = 0; i < currentIndex; ++i) {
    nums[startIndex] = tempList[i];
    ++startIndex;
  }
};
```

## 2. 快速排序

```JavaScript
// 快速排序
// 1. 以第一个元素作为基准，将数组分为两组，使得其中一组的值比另一组的任意值都小
// 2. 分完组之后，分别进入不同的分组，继续重复上一步，直到数组不能再分
var quickSort = function (nums, startIndex, endIndex) {
  if (startIndex >= endIndex) {
    return;
  }
  var baseValue = nums[startIndex];
  var leftNums = [];
  var rightNums = [];
  // 获取两个分组
  for (var i = startIndex + 1; i <= endIndex; ++i) {
    if (nums[i] > baseValue) {
      rightNums.push(nums[i]);
    } else {
      leftNums.push(nums[i]);
    }
  }
  // 将分组重置回数组
  var leftLength = leftNums.length;
  var rightLength = rightNums.length;
  var currentIndex = startIndex; // 这里应该是当前所在分组的首个元素在原数组中的索引值
  for (var i = 0; i < leftLength; ++i) {
    nums[currentIndex++] = leftNums[i];
  }
  nums[currentIndex++] = baseValue;
  for (var i = 0; i < rightLength; ++i) {
    nums[currentIndex++] = rightNums[i];
  }
  quickSort(nums, startIndex, startIndex + leftLength - 1);
  quickSort(nums, startIndex + leftLength + 1, endIndex);
};
```

## 3. 堆排序

> https://blog.csdn.net/weixin_51609435/article/details/122982075

```JavaScript
// 堆排序
/*
堆是一种叫做完全二叉树的数据结构，
可以分为大根堆，小根堆，而堆排序就是基于这种结构而产生的一种程序算法。
// 通过一个逻辑上的构建一个堆结构，而不是真正意义上去构建一个堆

（这里称为：大顶堆和小顶堆）

大顶堆：父节点的值大于等于左右子节点的值
小顶堆：反之亦然

1. 构建一个大顶堆：在排序序列中将最大的值放到根节点上，同时满足大顶堆的特性；
2. 在大顶堆的基础上将根节点与最后一个节点交换；将前n-1个节点作为排序序列，重复上述1步骤；
3. 最后直到排序序列为1个为止
*/

var heapSort = function (nums) {
  var length = nums.length;
  // i 的初始值为堆结构中最后一个非叶子节点的索引值
  for (var i = parseInt((length - 2) / 2); i >= 0; --i) {
    buildHeap(nums, i, length - 1);
  }
  // 每次将根和待排序的最后一个元素交换，然后再调整
  var temp;
  for (var i = 0; i < length - 1; ++i) {
    temp = nums[0];
    nums[0] = nums[length - 1 - i];
    nums[length - 1 - i] = temp;
    buildHeap(nums, 0, length - 1 - i - 1);
  }
};

var buildHeap = function (nums, start, end) {
  var parentNode = nums[start];
  var i = 2 * start + 1;
  while (i <= end) {
    if (i < end && nums[i + 1] > nums[i]) {
      ++i;
    }
    if (nums[i] > parentNode) {
      nums[start] = nums[i];
      start = i;
    } else {
      break;
    }
    i = 2 * i + 1;
  }
  nums[start] = parentNode; // 交换位置
};
```

## 4. 桶排序

> 将一串数据分布到不同的桶中，每个桶也是有序的；
>
> 在桶中将数据排序或者递归进行桶排序；
>
> 每个桶中数据完成排序之后，将数据逐个桶进行合并，最终完成桶排序；
>
> 个人感觉这个有点类似归并排序：先分后合；
>
> 桶排序的思想就是把待排序的数尽量均匀地放到各个桶中，再对各个桶进行局部的排序，最后再按序将各个桶中的数输出，即可得到排好序的数。
>
> 首先确定桶的个数。因为桶排序最好是将数据均匀地分散在各个桶中，那么桶的个数最好是应该根据数据的分散情况来确定。**首先找出所有数据中的最大值 mx 和最小值 mn；**
>
> 根据 mx 和 mn 确定每个桶所装的数据的范围 size，有
>
> **size = (mx - mn) / n + 1**，n 为数据的个数，需要保证至少有一个桶，故而需要加个 1；
>
> 求得了 size 即知道了每个桶所装数据的范围，还需要计算出所需的桶的个数 cnt，有
>
> **cnt = (mx - mn) / size + 1**，需要保证每个桶至少要能装 1 个数，故而需要加个 1；
>
> 求得了 size 和 cnt 后，即可知第一个桶装的数据范围为 [mn, mn + size)，第二个桶为 [mn + size, mn + 2 \* size)，…，以此类推
>
> 因此步骤 2 中需要再扫描一遍数组，将待排序的各个数放进对应的桶中。
>
> 对各个桶中的数据进行排序，可以使用其他的排序算法排序，例如快速排序；也可以递归使用桶排序进行排序；
>
> 将各个桶中排好序的数据依次输出，最后得到的数据即为最终有序。

```JavaScript
// 桶排序
var bucketSort = function (nums) {
  var length = nums.length;
  // 计算最大值
  var max = Number.MIN_SAFE_INTEGER;
  var min = Number.MAX_SAFE_INTEGER;
  for (var i = 0; i < length; ++i) {
    if (nums[i] > max) {
      max = nums[i];
    } else if (nums[i] < min) {
      min = nums[i];
    }
  }
  // 计算桶的容量
  var bucketSize = parseInt((max - min) / length) + 1; //最少能装一个元素
  // 桶的数量
  var bucketNum = parseInt((max - min) / bucketSize) + 1; // 最少一个桶，所以这里会加一个1
  var tempList = [];

  for (var i = 0; i < length; ++i) {
    var j = 0;
    while (j <= bucketNum) {
      var bucketMin = min + j * bucketSize;
      var bucketMax = bucketMin + bucketSize;
      if (nums[i] >= bucketMin && nums[i] < bucketMax) {
        if (tempList[j]) {
          tempList[j].push(nums[i]);
        } else {
          tempList[j] = [nums[i]];
        }
        break;
      }
      ++j;
    }
  }
  for (var i = 0; i < bucketNum; ++i) {
    if (tempList[i]) {
      tempList[i].sort((a, b) => a - b);
    }
  }

  var currentIndex = 0;
  for (var i = 0; i < bucketNum; ++i) {
    var list = tempList[i] || [];
    var len = list.length;
    for (var j = 0; j < len; ++j) {
      nums[currentIndex++] = list[j];
    }
  }
};
```
