---  
date: 2025-06-05
tags: [Algorithm]
---      
!!! abstract "简介"
    几道有关链表的经典题目
# 链表高频题目   
    链表面试题一般是考察`coding`能力而不是算法思维，所以下面的链表题一定要全部掌握!
!!! question "参考习题"
    [leetcode 160.相交链表 Easy](https://leetcode.cn/problems/intersection-of-two-linked-lists/)

     [leetcode 25 K个一组反转链表 Hard](https://leetcode.cn/problems/reverse-nodes-in-k-group/description/)

    [leetcode 138.随机链表的复制 mid](https://leetcode.cn/problems/copy-list-with-random-pointer/description/)

    [leetcode 234回文链表 easy](https://leetcode.cn/problems/palindrome-linked-list/description/)

    [leetcode 142环形链表II mid](https://leetcode.cn/problems/linked-list-cycle-ii/description/)

    [leetcode 148链表排序(思路mid,代码hard)](https://leetcode.cn/problems/sort-list/solutions/2993518/liang-chong-fang-fa-fen-zhi-die-dai-mo-k-caei/)


## 链表题的注意点

- 空间要求不严格 使用容器实现即可
- 空间要求严格  要求O(1)的空间复杂度
- 最常用技巧-快慢指针
- 本质不是算法设计能力而是coding能力
- 链表需要多多训练才可以！

!!! note "提醒"
    更难的链表题会在约瑟夫环专题中讲解
## 经典题目

### Question 1 两个链表相交的第一个节点

### Question 2 按组反转链表

### Question 3 复制带随机指针的链表

### Question 4 判断链表是否存有回文结构

### Question 5 链表第一个入环节点
??? info "Floyd判圈算法" 
    如果有限状态机、迭代函数或者链表存在环，那么一定存在一个起点可以到达某个环的某处(这个起点也可以在某个环上)。

    初始状态下，假设已知某个起点节点为节点S。现设两个指针t和h，将它们均指向S。

    接着，同时让t和h往前推进，但是二者的速度不同：t每前进1步，h前进2步。只要二者都可以前进而且没有相遇，就如此保持二者的推进。当h无法前进，即到达某个没有后继的节点时，就可以确定从S出发不会遇到环。反之当t与h再次相遇时，就可以确定从S出发一定会进入某个环，设其为环C。

    如果确定了存在某个环，就可以求此环的起点与长度。

    上述算法刚判断出存在环C时，显然t和h位于同一节点，设其为节点M。显然，仅需令h不动，而t不断推进，最终又会返回节点M，统计这一次t推进的步数，显然这就是环C的长度。

    为了求出环C的起点，只要令h仍位于节点M，而令t返回起点节点S，此时h与t之间距为环C长度的整数倍。随后，同时让t和h往前推进，且{==保持二者的速度相同==}：t每前进1步，h前进1步。持续该过程直至t与h再一次相遇，设此次相遇时位于同一节点P，则节点P即为从节点S出发所到达的环C的第一个节点，即环C的一个起点。
    
    {==证明寻找入环节点的正确性==}

    假设从跑道起点A到环起点B的路程为$m$,从B点到相遇点C的路程为$k$,环的长度为$n$,则相遇的时候乌龟(慢指针)走过的距离为:
    
    $$S_1=m+k+t_1*n$$

    兔子(快指针)走过的距离为：

    $$S_2=m + k + t_2 * n(t_2>t_1)$$

    且$S_2=2*S_1$则由上式可以推出

    $$
    \begin{align*}
        S_1&=S_2-S_1=(t_2-t_1)*n \\
        S_2 &= 2 * (t_2-t_1) * n
    \end{align*}
    $$
    
    即快慢指针走过的距离都是环长的倍数，而$m + k = (t_2 - 2 * t_1) * n$也是环长的倍数
    当快指针回到跑道起始点的时候，慢指针从相遇点出发.此时当快指针走到环起点的时候经过了m此时慢指针走过了$k+m$即环长倍数也就回到了环的起点。
### Question 6 链表排序

