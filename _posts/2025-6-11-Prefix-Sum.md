---
title: 构建前缀信息的技巧-解决子数组相关问题
layout: post
date: 2025-06-11
description: 前缀和与子数组问题
tags: 算法
---

### 构建前缀信息的技巧-解决子数组相关问题

<div style="top: 10px; left: 10px; background: #f5f5f5; border-left: 4px solid #7f8c8d; border-radius: 4px; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); ;">
  <div style="padding: 8px 12px; font-weight: bold; color: #7f8c8d;">💻 测试链接</div>
  <div style="padding: 8px 12px; padding-top: 0; color: #333;">
	<a href="https://leetcode.cn/problems/range-sum-query-immutable/description/">Q1:leetcode303.区域和检索-数组不可变</a>
      <br>
      <a href="https://www.nowcoder.com/practice/36fb0fd3c656480c92b569258a1223d5">Q2:牛客.未排序数组中累加和为给定值的最长子数组长度</a>
      <br>
      <a href="https://leetcode.cn/problems/subarray-sum-equals-k/">Q3:leetcode560.和为k的子数组</a>
      <br>
     <a href="https://leetcode.cn/problems/range-sum-query-immutable/description/">Q4:牛客.未排序数组中累加和为给定值的最长子数组系列问题补1</a>
      <br>
      <a href="https://leetcode.cn/problems/longest-well-performing-interval/">Q5:leetcode1124.表现良好的最长时间段</a>
      <br>
      <a href="https://leetcode.cn/problems/make-sum-divisible-by-p/">Q6:leetcode1590.使数组和能被P整除</a>
      <br>
      <a href="https://leetcode.cn/problems/find-the-longest-substring-containing-vowels-in-even-counts/description/">Q7:leetcode1371.每个元音包含偶数次的最长子字符串</a>
      <br>
    </div>
</div>


#### 区域和检索-数组不可变

<div style="top: 10px; left: 10px; background: #f0fff4; border-left: 4px solid #2ecc71; border-radius: 4px; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
  <div style="padding: 8px 12px; font-weight: bold; color: #2ecc71;">💡 提示</div>
  <div style="padding: 8px 12px; padding-top: 0; color: #333;">数据结构设计题</div>
</div>

<div style="top: 10px; left: 10px;background: #f9f0ff; border-left: 4px solid #9b59b6; border-radius: 4px; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
  <div style="padding: 8px 12px; font-weight: bold; color: #9b59b6;">🔄 朴素解法</div>
  <div style="padding: 8px 12px; padding-top: 0; color: #333;">发现主要的时间消费在sumRange</div>
</div>

```cpp
// 测试结果 123ms 23.4MB
class NumArray {
public:
    NumArray(vector<int>& nums) {
        this->nums = nums;
    }
    
    // 最费时间的操作
    int sumRange(int left, int right) {
        int ans = 0;
        for (int i = left; i <= right; i++)
            ans += nums[i];
        return ans;
    }
private:
    vector<int> nums;
};
```

<div style="top: 10px; left: 10px; background: #f0faf0; border-left: 4px solid #27ae60; border-radius: 4px; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); ;">
  <div style="padding: 8px 12px; font-weight: bold; color: #27ae60;">⚡ 优化版本</div>
  <div style="padding: 8px 12px; padding-top: 0; color: #333;">使用前缀和简化查询</div>
</div>

基于如下数学公式：
$$
\begin{align*}
&sumRange(i, j)\\
&= \sum_{k = i} ^{j}num[k] \\
&= \sum_{k=0}^{j}num[k]-\sum_{k=0}^{i-1}num[k]
\end{align*}
$$
转换为`0~j`的前缀和与`0~(i-1)`的前缀和之差

```cpp
// 测试结果 3ms 23.5MB
class NumArray {
public:
    vector<int> sums;
    NumArray(vector<int>& nums) {
        int n = nums.size();
        sums.resize(n + 1); // 避免边界讨论
        for (int i = 0; i < n; i++) {
            sums[i + 1] = sums[i] + nums[i];
        }
    }
    
    int sumRange(int left, int right) {
        return sums[right + 1] -sums[left]; // sums的长度为n+1
    }
};
```

#### 未排序数组中累加和为给定值的最长子数组长度

<div style="top: 10px; left: 10px;background: #f9f0ff; border-left: 4px solid #9b59b6; border-radius: 4px; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
  <div style="padding: 8px 12px; font-weight: bold; color: #9b59b6;">🔄 朴素解法</div>
  <div style="padding: 8px 12px; padding-top: 0; color: #333;"></div>
</div>

```cpp
// O(N^2)的解法，过不了全部测试样例
int maxLength(int sum, int n) {
    int result = 0;
    for (int i = 0; i < n; i++) {
        int cur_sum = array[i];
        for (int j = i + 1; j < n; j++) {
            cur_sum += array[j];
            if (cur_sum == sum) {
                result = result > (j - i + 1) ? result : (j - i + 1);
            }
        }
    }

    return result;
}
```

<div style="top: 10px; left: 10px; background: #f0faf0; border-left: 4px solid #27ae60; border-radius: 4px; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); ;">
  <div style="padding: 8px 12px; font-weight: bold; color: #27ae60;">⚡优化版本</div>
  <div style="padding: 8px 12px; padding-top: 0; color: #333;">使用前缀与哈希表优化</div>
</div>
```cpp
// O(N)
int compute() {
    map.clear();
    map.insert({0, -1});
    int ans = 0;
    for (int i = 0, sum = 0; i < n; i++) {
        sum += q[i];
        if (map.find(sum - aim) != map.end()) ans = max(ans, i - map[sum - aim]);
        if (map.find(sum) == map.end()) map.insert({sum, i});
    }

    return ans;
}
```

- 注意`{0, -1}`是不可以少的，否则会出现错误。
- `sum[i]` 表示 `q[0] + q[1] + ... + q[i]`（即前 `i+1` 个元素的和）。
- 子数组 `q[j..i]` 的和可以表示为：sum[*i*]−sum[*j*−1]
- 寻找 `j` 使得 `sum[j] = sum[i] - aim`。

#### 和为k的子数组

这道题目只需要稍稍修改上面那道题的解法即可

```cpp
class Solution {
public:
    int subarraySum(vector<int>& nums, int k) {
        unordered_map<int, int> map;  // 记录前缀和的出现次数
        map[0] = 1;  // 初始前缀和为0出现1次（方便计算）
        int sum = 0;
        int ans = 0;
        for (int num : nums) {
            sum += num;  // 计算当前前缀和
            if (map.find(sum - k) != map.end()) {
                ans += map[sum - k];  // 统计满足条件的子数组数量
            }
            map[sum]++;  // 更新当前前缀和的出现次数
        }
        return ans;
    }
};
```

#### 未排序数组中累加和为给定值的最长子数组长度补1

这道题和题二基本一直，将正数转换为`1`，负数转换为`-1`，则题目问题转换为子数组和为`0`的最长子数组有多长。

#### 表现良好的最长时间段

本质还是前缀和呀，可以把大于8的转换为`1`，小于`8`的转化为`-1`，则题目的问题转换为求`aim > 0`的最大子数组长度

当然这道题由于`sum`每次只能`+1`/`-1` 若 `sum < 0` 只需要查找最早出现前缀和为`sum - 1`的子串即可

解释：

- 0 ..... j j + 1..... i  的整体 sum = -3
- 0 .... j 的sum可以是 -4, -5, -6 ....
- 但由于sum 每次都是`+1`\`-1`
- 若0....j为`-5`则比如存在0...m, m+1....j 其中0....m为`-4`,  m +  1 ..... j 为`-1`
- 且m + 1..... i比 j +  1 .... i长

#### 使数组和能被P整除

大体上和前面几道题类似，但注意，这道题要求的是 **最短**子数组，哈希表里面就不能存最早出现的位置，而应该存最短出现的位置。

题目本质要求寻找`cur - mod / (cur + p -mod)` 最晚出现的位置

- `mod`为整体数组与`p`的余数
- `cur` 为 `0...i`这部分的余数

#### 每个元音包含偶数次的最长子字符串 (状态压缩+前缀和)

注意到要求所以的元音都是偶数，考虑用一个`00000`标记元音的奇偶状态

- `0`为偶数 `1`为奇数

若`0....i`时候的状态为`11101`此时只需要找，最早出现该状态的位置`0...j` `11101` 此时`j + 1, i`必然是`00000`



