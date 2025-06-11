---
title: 差分
layout: post
date: 2025-06-11
description: 一维差分、二维差分、二维前缀和、离散化技巧
tags: [Algorithm]
---

### 一维差分与等差数列差分

<div style="top: 10px; left: 10px; background: #f5f5f5; border-left: 4px solid #7f8c8d; border-radius: 4px; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); ;">
  <div style="padding: 8px 12px; font-weight: bold; color: #7f8c8d;">💻 相关习题</div>
  <div style="padding: 8px 12px; padding-top: 0; color: #333;">
    <a href="https://leetcode.cn/problems/corporate-flight-bookings/description/">
        <img src="https://www.google.com/s2/favicons?domain=leetcode.com.cn" alt="洛谷图标" style="vertical-align:middle;margin-right:5px;width:16px;height:16px;">
        leetcode 1109.航班预订统计</a><br>
      <a href="https://www.luogu.com.cn/problem/P4231">
          <img src="https://www.google.com/s2/favicons?domain=luogu.com.cn" alt="洛谷图标" style="vertical-align:middle;margin-right:5px;width:16px;height:16px;">
          洛谷P4231 三步必杀</a><br>
      <a href="https://www.luogu.com.cn/problem/P5026">
  <img src="https://www.google.com/s2/favicons?domain=luogu.com.cn" alt="洛谷图标" style="vertical-align:middle;margin-right:5px;width:16px;height:16px;">
  洛谷P5026 Lycanthropy
</a>
    </div>
</div>
#### 一维差分

假设要在一个数组的[left, right]上进行n次操作

- 只在`left`位置加`x`而在`right + 1`位置减`x`
  - 相当于标记作用范围
- 通过前缀和还原出真正的结果

注意一维差分无法实现在操作的过程中 **查询**的操作

```cpp
// 一维差分模板
arr[left] += x;
arr[right + 1] -= y;

for (int i = 1; i < arr.size(); i++) arr[i] += arr[i - 1];
```

#### 等差数列差分

<div style="top: 10px; left: 10px; background: #fef5f5; border-left: 4px solid #e74c3c; border-radius: 4px; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); ;">
  <div style="padding: 8px 12px; font-weight: bold; color: #e74c3c;">🚧 等差数列差分目前面试并不常见</div>
</div>

<div style="top: 10px; left: 10px; background: #fff8f0; border-left: 4px solid #e67e22; border-radius: 4px; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); ;">
  <div style="padding: 8px 12px; font-weight: bold; color: #e67e22;">🔹 问题描述</div>
  <div style="padding: 8px 12px; padding-top: 0; color: #333;">一开始1~n范围上的数字都是0。接下来一共有m个操作。
每次操作：l~r范围上依次加上首项s、末项e、公差d的数列
最终1~n范围上的每个数字都要正确得到</div>
</div>

具体的推导过程如下(通过最终状态反推参数)

![等差数列推导](../images/2025-6-11-Difference/未命名绘图.drawio-1749630707158-2.svg)

```cpp
// 等差数列差分模板
void set(int l, int r, int s ,int e, int d) {
    arr[l] += s;
    arr[l + 1] += d - s;
    arr[r + 1] -= d + e;
    arr[r + 2] += e;
}

void build() {
    // 两次前缀和
    for (int i = 1; i <= n; i++) arr[i] += arr[i - 1];
    for (int i = 1; i <= n; i++) arr[i] += arr[i - 1];
}
```


### 二维前缀和

<div style="top: 10px; left: 10px; background: #f5f5f5; border-left: 4px solid #7f8c8d; border-radius: 4px; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); ;">
  <div style="padding: 8px 12px; font-weight: bold; color: #7f8c8d;">💻 相关习题</div>
  <div style="padding: 8px 12px; padding-top: 0; color: #333;">
    <a href="https://leetcode.cn/problems/range-sum-query-2d-immutable/description/">
        <img src="https://www.google.com/s2/favicons?domain=leetcode.com.cn" alt="洛谷图标" style="vertical-align:middle;margin-right:5px;width:16px;height:16px;">leetcode 304.二维区域和检索-矩阵不可变(二维前缀和模板)</a><br>
      <a href=""><img src="https://www.google.com/s2/favicons?domain=leetcode.com.cn" alt="洛谷图标" style="vertical-align:middle;margin-right:5px;width:16px;height:16px;">leetcode 1139.最大以1为边界的正方形</a>
    </div>
</div>
二维前缀和的[基本原理](https://oi-wiki.org/basic/prefix-sum/)

### 二维差分

<div style="top: 10px; left: 10px; background: #f5f5f5; border-left: 4px solid #7f8c8d; border-radius: 4px; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); ;">
  <div style="padding: 8px 12px; font-weight: bold; color: #7f8c8d;">💻 相关习题</div>
  <div style="padding: 8px 12px; padding-top: 0; color: #333;">
    <a href="https://www.luogu.com.cn/problem/P3397"><img src="https://www.google.com/s2/favicons?domain=luogu.com.cn" alt="洛谷图标" style="vertical-align:middle;margin-right:5px;width:16px;height:16px;">洛谷P3397地毯(二维差分模板)</a>
      <br>
      <a href="https://leetcode.cn/problems/stamping-the-grid/description/"><img src="https://www.google.com/s2/favicons?domain=leetcode.com.cn" alt="洛谷图标" style="vertical-align:middle;margin-right:5px;width:16px;height:16px;">leetcode2132.用邮票贴满网格图</a>
    </div>
</div>

### 离散化技巧

<div style="top: 10px; left: 10px; background: #f5f5f5; border-left: 4px solid #7f8c8d; border-radius: 4px; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); ;">
  <div style="padding: 8px 12px; font-weight: bold; color: #7f8c8d;">💻 相关习题</div>
  <div style="padding: 8px 12px; padding-top: 0; color: #333;">
    <a href="https://leetcode.cn/problems/xepqZ5/description/"><img src="https://www.google.com/s2/favicons?domain=leetcode.com.cn" alt="洛谷图标" style="vertical-align:middle;margin-right:5px;width:16px;height:16px;">leetcode LCP74.最强祝福力场</a>
    </div>
</div>