---
tags: [Algorithm]
---

# 单调队列
!!! abstract "简介"
    单调队列（Monotonic Queue）是一种特殊的队列数据结构，主要用于高效维护滑动窗口内的极值（最大值/最小值），在算法优化中能显著降低时间复杂度。
!!! question "相关例题"

    [leetcode239.Sliding Window Maximum(单调队列模板题)](https://leetcode.cn/problems/sliding-window-maximum/description/)

    [leetcode1438.Longest Continuous Sub-array with absolute diff less than or equal to limit](https://leetcode.cn/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/description/)

    [P2698.Flowerpot S](https://www.luogu.com.cn/problem/P2698)

    [leetcode862.Shortest Sub-array with Sum at least K](https://leetcode.cn/problems/shortest-subarray-with-sum-at-least-k/description/)

    [leetcode499.Max Value of Equation](https://leetcode.cn/problems/max-value-of-equation/description/)

    [leetcode2071.Maximum Number of Tasks you can Assign](https://leetcode.cn/problems/maximum-number-of-tasks-you-can-assign/description/)
## 单调(双端)队列的内容
能在O(N)的时间内维持滑动窗口的最大|最小值.

对比通过一个元素记录当前窗口的最大值\最小值，单调队列的好处在于即使当前的最大值\最小值移出窗口也不需要
重新遍历一边窗口来寻找替代品(O(N))。

以单调递减队列维护最大值为例，假设数组为 nums = [1,3,-1,-3,5,3,6,7], k=3
  
- i = 0, num = 1, q=[], 加入`1`的索引`0`,则q[0] = 0;

- i = 1, num = 3, 且`nums[0] = 1 < 3`移除`0`, q = [], 加入 1 -> q,q = [1]
- i = 2, num = -1, `-1 < 3`加入队列, 2 -> q, q = [1, 2]
  - 此时窗口最大值为`nums[1] = 3`
- i = 3, num = -3, 检查q[0] = 1是否超出窗口范围,此时窗口范围为[1, 2, 3]`1`在范围内，故不需要最大值未过期，`-3 < 3`加入队列, 3 ->q, q = [1, 2, 3]
- i = 4, num = 5, 
  - nums[3] = -3 < 5 弹出 3
  - nums[2] = -1 < 5 弹出 2
  - nums[1] = 3 < 5 弹出 1
  - 此时队列为空 q = []
  - 4 -> q , q = [4]
  - 窗口最大值为`nums[4]`
- i = 5, num = 3,  `3 < 5`,且`4`未超过窗口, 5->q, q = [4, 5]
- i = 6, num = 6, `6 > 3`弹出5, `6 > 5`弹出4，队列为空 6 -> q, q = [6],此时最大值为nums[6]
- i = 7, num = 7, `7 > 6`,弹出6, 队列为空 7 -> q, q = [7],此时最大值为nums[7]

!!! note "时间复杂度\空间复杂度"
    单调队列的摊还时间复杂度是$O(N)$ --- 每个元素最多进入队列一次，每个元素最多被移除一次
    
    空间复杂度是$O(N)$


## 单调队列的模板
!!! example "参考模板"
    ```cpp
    class Solution {
    public:
        // k is the size of sliding window
        vector<int> maxSlidingWindow(vector<int>& nums, int k) {
            int n = nums.size();
            // 预处理前 k - 1个元素
            for (int i = 0; i < k - 1; ++i) {
                while (h < t && nums[deque[t - 1]] <= nums[i]) --t;
                deque[t++] = i;
            }

            int m = n - k + 1;
            vector<int> ans(m, 0); // 一共有 n - k + 1个窗口

            // l 表示窗口左边界面，r表示窗口右边界
            // 每次向右滑动一次
            for (int l = 0, r = k - 1; l < m; ++l, ++r) {
                // 维护单调队列
                while (h < t && nums[deque[t - 1]] <= nums[r]) --t;
                deque[t++] = r;
                // 获取当前窗口的最大值
                ans[l] = nums[deque[h]];

                // 将过期元素删除
                if (deque[h] == l) ++h;
            }
            return ans;
        }
    private:
        static const int N = 1e5 + 10;
        array<int, N> deque;
        int h = 0, t = 0;
    };
    ```
## 课上例题
### Q1: Longest Continuous Sub-array with absolute diff less than or equal to limit

### Q2: Flowerpot S

### Q3: Shortest Sub-array with Sum at least K

### Q4: Max Value of Equation

### Q5: Maximum Number of Tasks you can Assign

## 单调队列的总结
