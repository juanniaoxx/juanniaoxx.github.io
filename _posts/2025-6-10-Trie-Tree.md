---
title: 前缀树（字典树）
layout: post
date: 2025-06-09
description: 前缀树基础、代码实现与相关习题
tags: 编程语言 算法
---

### 前缀树的基本概念

<div style="top: 10px; left: 10px; background: #f8f9fa; border-left: 4px solid #e74c3c; border-radius: 4px; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); ;">
  <div style="padding: 8px 12px; font-weight: bold; color: #e74c3c;">⚠️ 重要</div>
  <div style="padding: 8px 12px; padding-top: 0; color: #333;">前缀树相关操作的复杂度</div>
</div>

- 插入操作 $O(N)$ 与 $O(N)$ 
- 搜索操作$O(N)$与$O(1)$
- 前缀查找操作$O(N)$和$O(1)$
- 删除操作$O(M)$和$O(1)$

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Trie_example.svg/1024px-Trie_example.svg.png" alt="undefined" style="zoom:50%;" />

<div style="top: 10px; left: 10px; background: #f0f7ff; border-left: 4px solid #3498db; border-radius: 4px; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); ;">
  <div style="padding: 8px 12px; font-weight: bold; color: #3498db;">🔍 Trie</div>
  <div style="padding: 8px 12px; padding-top: 0; color: #333;">The Trie data structure is a tree-like structure used for storing a dynamic set of strings. It allows for efficient retrieval and storage of keys, making it highly effective in handling large datasets. Trie supports operations such as insertion, search, deletion of keys, and prefix searches. </div>
</div>

 经典的前缀树一般不在节点内存储信息（上图只是个示意）而是通过路径存储形象，节点一般存有`poss`与`end`，其中`poss`表明有多少个字符串经过该节点，`end`表示多少个字符串以该节点结束。

### 不推荐-前缀树的类实现

<div style="top: 10px; left: 10px; background: #f5f5f5; border-left: 4px solid #7f8c8d; border-radius: 4px; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); ;">
  <div style="padding: 8px 12px; font-weight: bold; color: #7f8c8d;">💻 测试链接</div>
  <div style="padding: 8px 12px; padding-top: 0; color: #333;">
    <a href="https://www.nowcoder.com/practice/7f8a8553ddbf4eaab749ec988726702b">牛客.字典树的实现</a>
    </div>
</div>

```cpp
struct TrieNode {
    int pass;
    int end;
    std::array<TrieNode*, 26> next = {};
    TrieNode() : pass(0), end(0) {
        for (int i = 0; i < 26; ++i) {
            next[i] = nullptr;
        }
    }
    ~TrieNode() {
        for (int i = 0; i < 26; ++i) {
            if (next[i] != nullptr) {
                delete next[i];
            }
        }
    }
};
TrieNode *root;
```

`Trie`的节点如上所示

- `pass`表明有多少个字符串经过了该节点
- `end`表明有多少个字符串以该节点结尾
- `next[]`使用指针数组存储一个节点的26条路径
  - `a`->0,`b`->1 .... z->`25` 
  - 注意这里硬编码了数组大小

**基本操作**

- 初始化`Trie`类
  ```cpp
      Trie() {
          root = new TrieNode();
      }
  ```

- 插入操作(insert)
  ```cpp
  // 插入操作
  void insert(string word) {
      TrieNode *node = root;
      node->pass++; // 根节点的 pass 增加
      for (int i = 0; i < word.size(); i++) {
          int path = word[i] - 'a'; // 计算字符对应的路径（0~25）
          if (node->next[path] == nullptr) {
              node->next[path] = new TrieNode(); // 如果子节点不存在，创建新节点
          }
          node = node->next[path]; // 移动到子节点
          node->pass++; // 当前节点的 pass 增加
      }
      node->end++; // 单词最后一个字符的 end 增加
  }
  ```

- 查询操作
  ```cpp
  int search(string word) {
      TrieNode *node = root;
      for (int i = 0; i < word.size(); i++) {
          int path = word[i] - 'a';
          if(node->next[path] == nullptr) return 0; // 未遍历完word且下一个字符未加入Trie则返回0
          node = node->next[path];
      }
      return node->end;
  }
  ```

- 查询前缀操作
  ```cpp
  int search_prefix(const string &prev) {
      TrieNode *node = root;
      for (int i = 0; i < prev.size(); i++) {
          int path = prev[i] - 'a';
          if (node->next[path] == nullptr) return 0;
          node = node->next[path];
      }
      return node->pass; // 返回经过该节点的字符串个数
  }
  ```

- 删除操作

  - 如果有，删除一次
  - 如果没有，什么都不做

  ```cpp
  void erase(const string &word) {
      // 只有该字符串存在于Trie中才需要操作
      if (search(word) > 0) {
          TrieNode *node = root;
          node->pass--;
          for (int i = 0; i < word.size(); i++) {
              int path = word[i] - 'a';
              if(--node->next[path]->pass == 0) {
                  delete node->next[path];
                  node->next[path] = nullptr;
                  return ;
              }
              node = node->next[path];
          }
          node->end--;
      }
  }
  ```

<div style="top: 10px; left: 10px; background: #f8f9fa; border-left: 4px solid #e74c3c; border-radius: 4px; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); ;">
  <div style="padding: 8px 12px; font-weight: bold; color: #e74c3c;">⚠️ 重要</div>
  <div style="padding: 8px 12px; padding-top: 0; color: #333;">可以改用哈希表存储更多字符</div>
</div>

### 推荐-前缀树的静态数组实现

<div style="top: 10px; left: 10px; background: #f5f5f5; border-left: 4px solid #7f8c8d; border-radius: 4px; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); ;">
  <div style="padding: 8px 12px; font-weight: bold; color: #7f8c8d;">💻 测试链接</div>
  <div style="padding: 8px 12px; padding-top: 0; color: #333;">
    <a href="https://www.nowcoder.com/practice/7f8a8553ddbf4eaab749ec988726702b">牛客.字典树的实现</a>
    </div>
</div>

### 前缀树的相关习题

<div style="top: 10px; left: 10px; background: #f5f5f5; border-left: 4px solid #7f8c8d; border-radius: 4px; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); ;">
  <div style="padding: 8px 12px; font-weight: bold; color: #7f8c8d;">💻 测试链接</div>
  <div style="padding: 8px 12px; padding-top: 0; color: #333;">
    <a href="https://www.nowcoder.com/practice/c552d3b4dfda49ccb883a6371d9a6932">Q1:牛客.接头密钥</a>
      <br>
      <a href="https://leetcode.cn/problems/maximum-xor-of-two-numbers-in-an-array/">Q2:leetcode421.数组中两个数的最大异或值</a>
      <br>
      <a href="https://leetcode.cn/problems/word-search-ii/">Q3:leetcode212.单词搜索II</a>
    </div>
</div>

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
      <a href="https://leetcode.cn/problems/longest-well-performing-interval/">Q5:leetcode1124.表明良好的最长时间段</a>
      <br>
      <a href="https://leetcode.cn/problems/range-sum-query-immutable/description/">Q6:leetcode1590.使数组和能被P整除</a>
      <br>
      <a href="https://leetcode.cn/problems/find-the-longest-substring-containing-vowels-in-even-counts/description/">Q7:leetcode1371.每个元音包含偶数次的最长子字符串</a>
      <br>
    </div>
</div>

### 前缀树的总结

