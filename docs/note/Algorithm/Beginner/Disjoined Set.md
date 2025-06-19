---
tags: [Algorithm]
---
# 并查集(不相交集)
!!! abstract "简介"
    并查集（Disjoint Set Union，DSU）​是一种高效处理不相交集合合并及查询的数据结构，支持两种核心操作：

    ​合并（Union）​​：将两个集合合并为一个。
    ​查找（Find）​​：确定元素属于哪个集合（通常通过“代表元”标识）。

    通过路径压缩和按秩合并优化，单次操作时间复杂度接近常数。

!!! question "相关例题"
    [并查集模板](https://www.nowcoder.com/practice/e7ed657974934a30b2010046536a5372)

    [并查集模板](https://www.luogu.com.cn/problem/P3367)

    [leetcode765.Couples Holding Hands](https://leetcode.cn/problems/couples-holding-hands/description/)

    [leetcode839.Similar String Groups](https://leetcode.cn/problems/similar-string-groups/description/)

    [leetcode200.Number of Islands](https://leetcode.cn/problems/number-of-islands/description/)

    [leetcode947.Most Stones Removed with Same Row or Column](https://leetcode.cn/problems/most-stones-removed-with-same-row-or-column/description/)

    [leetcode2092.Find All People With Secret](https://leetcode.cn/problems/find-all-people-with-secret/description/) 

    [leetcode2421.Number of Good Paths](https://leetcode.cn/problems/number-of-good-paths/description/) 

    [leetcode928.Minimize Malware Spread II](https://leetcode.cn/problems/minimize-malware-spread-ii/description/)
## 并查集基本内容
!!! warning 
    带权并查集、可持久化并查集、可撤销并查集，都是备战算法竞赛的必备内容会在`intermediate`标签下面总结

## 并查集模板
!!! example "参考模板"
    // find 操作
    int find(int i) {
        int top = 0;
        // 用栈模拟递归
        while (i != father[i]) {
            stack[top++] = i;
            i = father[i];
        }

        // 将沿途节点全部指向根节点
        // 路径压缩
        while (top > 0) father[stack[--top]] = i;
        return i;
    }

    // Union操作
    void Union(int x, int y) {
        int fx = find(x);
        int fy = find(y);
        if (fx != fy) {
            // 按秩合并
            if (size[fx] >= size[fy]) {
                size[fx] += size[fy];
                father[fy] = fx;
            } else {
                size[fy] += size[fx];
                father[fx] = fy;
            }
        }
    }
## 相关例题
### Q1:Couples Holding Hands
!!! note "题目"
    `n` 对情侣坐在连续排列的 `2n` 个座位上，想要牵到对方的手。

    人和座位由一个整数数组 `row` 表示，其中 `row[i]` 是坐在第 `i` 个座位上的人的 **ID**。情侣们按顺序编号，第一对是 `(0, 1)`，第二对是 `(2, 3)`，以此类推，最后一对是 `(2n-2, 2n-1)`。

    返回 *最少交换座位的次数，以便每对情侣可以并肩坐在一起*。 *每次*交换可选择任意两人，让他们站起来交换座位。

??? tip "hit"

??? success "参考实现"
    ```cpp
    class Solution {
    public:
        int minSwapsCouples(vector<int>& row) {
            build(row.size() / 2);
            for (int i = 0; i < row.size(); i += 2) Union(row[i] / 2, row[i + 1] / 2);
            return row.size() / 2 - sets;
        }
    private:
        static const int N = 32;
        std::array<int, N> father;
        int sets = 0; // 统计集合数

        void build(int m) {
            for (int i = 0; i < m; ++i) father[i] = i;
            sets = m;
        }

        int find(int i) {
            if (i != father[i]) i = find(father[i]);
            return father[i];
        }

        void Union(int x, int y) {
            int fx = find(x);
            int fy = find(y);
            if (fx != fy) {
                father[fx] = fy;
                --sets;
            }
        }
    };
    ```

### Q2:Similar String Groups
### Q3:Number of Islands

## 总结