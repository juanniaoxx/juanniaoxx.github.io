---
date: 2025-06-05
tags: [Algorithm]
---
# 数据结构设计习题
!!! abstract "简介"
    在计算机科学中，数据结构设计是算法与工程实践的桥梁，它不仅是存储数据的方式，更是高效解决问题的方法论。无论是设计一个高性能缓存、实现实时推荐系统，还是构建分布式数据库，合理的数据结构选择直接影响系统的吞吐量、响应时间和资源消耗。
!!! question "相关习题"
    [`setAll`功能的哈希表](https://www.nowcoder.com/practice/7c4559f138e74ceb9ba57d76fd169967)

    [实现`LRU`结构](https://leetcode.cn/problems/lru-cache/)

    [插删随$O(1)$的结构](https://leetcode.cn/problems/insert-delete-getrandom-o1/)

    [插删随$O(1)$的结构加强版](https://leetcode.cn/problems/insert-delete-getrandom-o1-duplicates-allowed/description/)

    [快速获得数据流的中位数 ](https://leetcode.cn/problems/find-median-from-data-stream/)

    [最大频率栈](https://leetcode.cn/problems/maximum-frequency-stack/)

    [全是O(1)的结构](https://leetcode.cn/problems/all-oone-data-structure/)

## `setAll`功能的哈希表
设计思路

- 将 `key-value`改成`key - pair<value, time>` 

- 设置三个全局变量`setAllTime` 和 `setAllValue` 与 `cnt`
  - 每次加入加入一对`key-value` `cnt++` ,并且将`time = cnt`
  - 每次执行`setAll`的时候设置`setAllTime = cnt` 和 `setAllValue = 要修改的值` ,并且`cnt++`
    - 注意，这一步并不会修改`key-value`
  - 执行`get()`操作的时候，检查`time`与`setAllTime`若`time < setAllTime`则修改`value = setAllvalue`否则直接获得值

## 实现`LRU`结构
设计思路

{==双向链表 + 哈希表==}

![](../../images/2025-6-5-DateStrucutreDesign/image-20250605142733342.png)

- 插入`key-value`的时候创建一个`双向链表节点` ,并且`value`为指向该节点的指针
- 利用全局指针`head`和`tail`定位链表的头节点和尾节点
- 每次添加、修改、查询时候将对应节点移动到`tail`的后面，并让`tail`指向该节点
  - `tail`指向的永远是最新被操作的数据
  - `head`指向永远是最最旧未被使用的数据
- 容量不够的时候，释放`head`对应的节点，并移动`head = head->next`,同时去除哈希表中`k-v`对

## O(1)时间插入、删除和获取随机元素
设计思路

- 肯定会有一个哈希表，同时申请一个动态数组(vector)存输入的数据
  - 哈希表为了去重
  - 动态数组为了random操作
- 考虑`remove`操作，如果仅仅是删除哈希表的记录，而不对数组进行任何处理，空余的位置将会越来越多从而十分影响`random`操作
  - 解决办法：使用最后一个元素覆盖被`remove`的元素，同时更新哈希表记录即可

