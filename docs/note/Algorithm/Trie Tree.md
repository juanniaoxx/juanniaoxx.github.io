---
date: 2025-06-09
tags: [Algorithm]
---
# 前缀树（字典树）
!!! abstract "简介"
    字典树（Trie） 是一种专为字符串处理设计的高效树形数据结构，它像一本智能字典，通过共享前缀的方式存储和检索词汇，将字符串操作的时间复杂度优化至 O(L)（L为字符串长度）。

## 前缀树的基本概念

## 不推荐-前缀树的类实现

!!! example "参考实现"
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

!!! tip "字符数超多或者不确定"
    可以改用哈希

## 推荐-前缀树的静态数组实现
??? example "参考实现"
    ```cpp
    const int MAX; // 设置一个合理数值
    int trie[MAX][26]; // 记录路径信息
    int Pass[MAX], End[MAX]; // 记录pass数据和end数据
    // 舍弃节点0不用
    int cnt = 1; // 当前节点
    // 插入操作：将单词插入到Trie树中
    void insert(const string &word) {
        int cur = 1;  // 从根节点(节点1)开始
        Pass[cur]++;  // 根节点的Pass计数+1（表示经过根节点的路径数+1）
        
        // 遍历单词的每个字符
        for (int i = 0; i < word.size(); i++) {
            int path = word[i] - 'a';  // 将字符转换为0-25的索引(对应26个字母)
            
            // 如果当前字符对应的子节点不存在，则创建新节点
            if (trie[cur][path] == 0) {
                trie[cur][path] = ++cnt;  // 分配新节点，cnt递增
            }
            
            cur = trie[cur][path];  // 移动到子节点
            Pass[cur]++;  // 当前节点的Pass计数+1（表示经过该节点的路径数+1）
        }
        
        End[cur]++;  // 单词结束节点的End计数+1（表示以该节点结尾的单词数+1）
    }

    // 查询操作：检查单词是否存在于Trie树中
    int search(const string &word) {
        int cur = 1;  // 从根节点(节点1)开始
        
        // 遍历单词的每个字符
        for (int i = 0; i < word.size(); i++) {
            int path = word[i] - 'a';  // 将字符转换为0-25的索引
            
            // 如果当前字符对应的子节点不存在，则单词不存在
            if (trie[cur][path] == 0) {
                return 0;  // 返回0表示单词不存在
            }

            cur = trie[cur][path];  // 移动到子节点
        }
        
        // 检查当前节点是否是某个单词的结束节点
        return End[cur];  // 返回End计数(0表示不存在，>0表示存在)
    }

    // 查询前缀操作：统计以给定前缀开头的单词数量
    int search_prefix(const string &pre) {
        int cur = 1;  // 从根节点(节点1)开始
        
        // 遍历前缀的每个字符
        for (int i = 0; i < pre.size(); i++) {
            int path = pre[i] - 'a';  // 将字符转换为0-25的索引
            
            // 如果当前字符对应的子节点不存在，则前缀不存在
            if (trie[cur][path] == 0) {
                return 0;  // 返回0表示前缀不存在
            }
            
            cur = trie[cur][path];  // 移动到子节点
        }
        
        // 返回经过该前缀节点的路径数(Pass计数)
        return Pass[cur];
    }

    // 删除操作：从Trie树中删除单词
    void erase(const string &word) {
        // 先检查单词是否存在
        if (search(word)) {
            int cur = 1;  // 从根节点(节点1)开始
            Pass[cur]--;  // 根节点的Pass计数-1
            
            // 遍历单词的每个字符
            for (int i = 0; i < word.size(); i++) {
                int path = word[i] - 'a';  // 将字符转换为0-25的索引
                
                // 减少当前节点的Pass计数
                if (--Pass[trie[cur][path]] == 0) {
                    // 如果Pass计数减为0，表示没有其他单词经过该节点
                    // 可以安全删除该节点(设置为0)
                    trie[cur][path] = 0;
                    return;  // 删除完成，直接返回
                }
                
                cur = trie[cur][path];  // 移动到子节点
            }
            
            End[cur]--;  // 单词结束节点的End计数-1
        }
        // 如果单词不存在，则不做任何操作
    }
    ```

## 接头密钥

## 数组中两个数的最大异或值

## 单词搜索II

## 前缀树的总结

