---
tags: [Algorithm]
---

# 单调队列
!!! abstract "简介"
    单调队列（Monotonic Queue）是一种特殊的队列数据结构，主要用于高效维护滑动窗口内的极值（最大值/最小值），在算法优化中能显著降低时间复杂度。

    这一章还是比较难的，通过例题也能看出来基本全是hard题....
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
!!! note "题目描述"
    Given an array of integers nums and an integer limit, return the size of the longest non-empty subarray such that the absolute difference between any two elements of this subarray is less than or equal to limit.

这个问题可以转换为在滑动窗口内最大值与最小值的差的绝对值要小于等于limit的最大窗口长度,
??? tip "Hit"

    - 考虑如下单调性,一个窗口范围变大,其`MAX`只可能变大或者保持,`MIN`只可能变小或者保持,一个窗口范围变小,其`MAX`只可能变小或者保持,`MIN`只可能变大或者保持。
        - 若一个窗口满足条件则缩少其大小仍然满足条件
        - 若一个窗口不满足调整则增加其长度必然也不满足条件 
    - 为滑动窗口维持两个单调队列，分别维持最大值与最小值

??? success "参考实现"
    ```cpp
    class Solution {
    public:
        int longestSubarray(vector<int>& nums, int limit) {
            arr = nums;
            int ans = 0;
            int n = nums.size();
            for (int l = 0, r = 0; l < n; ++l) {
                // sliding windows : [l, r)
                while (r < n && can_join(limit, nums[r])) {
                    join(r++);
                }
                // 从while出来表明当前位置以及不可能在扩大了，结算答案并弹出窗口左边的元素
                ans = std::max(ans, r - l);
                remove(l);
            }

            return ans;
        }
    private:
        static constexpr int N = 1e5 + 10;
        vector<int> arr;
        array<int, N> deque_max;
        array<int, N> deque_min;
        int h_min{0}, t_min{0}, h_max{0}, t_max{0};
        // 判断当前元素是否可以加入滑动窗口
        bool can_join(int limit, int num) {
            int max = h_max < t_max ? std::max(arr[deque_max[h_max]], num) : num;
            int min = h_min < t_min ? std::min(arr[deque_min[h_min]], num) : num;
            return max - min <= limit;
        }

        // 新元素加入时候不要忘记修改单调栈的结构
        void join(int r) {
            while(h_max < t_max && arr[deque_max[t_max - 1]] <= arr[r]) --t_max;
            deque_max[t_max++] = r;
            while(h_min < t_min && arr[deque_min[t_min - 1]] >= arr[r]) --t_min;
            deque_min[t_min++] = r;
        }

        // 删除元素也不要忘记修改单调栈的结构
        void remove(int l) {
            if (h_max < t_max && deque_max[h_max] == l) ++h_max;
            if (h_min < t_min && deque_min[h_min] == l) ++h_min;
        }

    };
    ```
### Q2: Flowerpot S
!!! note "题目"
    ![](https://cdn.luogu.com.cn/upload/pic/9174.png) 

    老板需要你帮忙浇花。给出 $N$ 滴水的坐标，$y$ 表示水滴的高度，$x$ 表示它下落到 $x$ 轴的位置。

    每滴水以每秒 $1$ 个单位长度的速度下落。你需要把花盆放在 $x$ 轴上的某个位置，使得从被花盆接着的第 $1$ 滴水开始，到被花盆接着的最后 $1$ 滴水结束，之间的时间差至少为 $D$。

    我们认为，只要水滴落到 $x$ 轴上，与花盆的边沿对齐，就认为被接住。给出 $N$ 滴水的坐标和 $D$ 的大小，请算出最小的花盆的宽度 $W$。

    **输入格式**

    第一行 $2$ 个整数 $N$ 和 $D$。

    接下来 $N$ 行每行 $2$ 个整数，表示水滴的坐标 $(x,y)$。

    **输出格式**

    仅一行 $1$ 个整数，表示最小的花盆的宽度。如果无法构造出足够宽的花盆，使得在 $D$ 单位的时间接住满足要求的水滴，则输出 $-1$。

    **【数据范围】**

    $40\%$ 的数据：$1 \le N \le 1000$ ，$1 \le D \le 2000$。

    $100\%$ 的数据：$1 \le N \le 10 ^ 5$，$1 \le D \le 10 ^ 6$，$0\le x,y\le10^6$。

这道题可以转换为求给你一个含有重复数字的数组,询问满足`max - min>= limit`要求的最小窗口长度


### Q3: Maximum Number of Tasks you can Assign
!!! note "题目"
    You have `n` tasks and `m` workers. Each task has a strength requirement stored in a **0-indexed** integer array `tasks`, with the `i^th` task requiring `tasks[i]` strength to complete. The strength of each worker is stored in a **0-indexed** integer array `workers`, with the `j^th` worker having `workers[j]` strength. Each worker can only be assigned to a **single** task and must have a strength **greater than or equal** to the task's strength requirement (i.e., `workers[j] >= tasks[i]`).

    Additionally, you have `pills` magical pills that will **increase a worker's strength** by `strength`. You can decide which workers receive the magical pills, however, you may only give each worker **at most one** magical pill.

    Given the **0-indexed** integer arrays `tasks` and `workers` and the integers `pills` and `strength`, return *the **maximum** number of tasks that can be completed.*
??? info "举例与数据范围"
    **Example 1:**

    ```txt
    Input: tasks = [3,2,1], workers = [0,3,3], pills = 1, strength = 1
    Output: 3
    Explanation:
    We can assign the magical pill and tasks as follows:
    - Give the magical pill to worker 0.
    - Assign worker 0 to task 2 (0 + 1 >= 1)
    - Assign worker 1 to task 1 (3 >= 2)
    - Assign worker 2 to task 0 (3 >= 3)
    ```

    **Example 2:**

    ```txt
    Input: tasks = [5,4], workers = [0,0,0], pills = 1, strength = 5
    Output: 1
    Explanation:
    We can assign the magical pill and tasks as follows:
    - Give the magical pill to worker 0.
    - Assign worker 0 to task 0 (0 + 5 >= 5)
    ```

    **Example 3:**

    ```txt
    Input: tasks = [10,15,30], workers = [0,10,10,10,10], pills = 3, strength = 10
    Output: 2
    Explanation:
    We can assign the magical pills and tasks as follows:
    - Give the magical pill to worker 0 and worker 1.
    - Assign worker 0 to task 0 (0 + 10 >= 10)
    - Assign worker 1 to task 1 (10 + 10 >= 15)
    The last pill is not given because it will not make any worker strong enough for the last task.
    ```

    **Constraints:**

    -   `n == tasks.length`
    -   `m == workers.length`
    -   `1 <= n, m <= 5 * 10^4`
    -   `0 <= pills <= m`
    -   `0 <= tasks[i], workers[j], strength <= 10^9`

### Q4: Max Value of Equation

!!! note "描述"
    You are given an array `points` containing the coordinates of points on a 2D plane, sorted by the x-values, where `points[i] = [xi, yi]` such that `xi < xj` for all `1 <= i < j <= points.length`. You are also given an integer `k`.

    Return *the maximum value of the equation* `yi + yj + |xi - xj|` where `|xi - xj| <= k` and `1 <= i < j <= points.length`.

    It is guaranteed that there exists at least one pair of points that satisfy the constraint `|xi - xj| <= k`.
??? info "举例和数据范围"
    **Example 1:**

    ```txt
    Input: points = [[1,3],[2,0],[5,10],[6,-10]], k = 1
    Output: 4
    Explanation: The first two points satisfy the condition |xi - xj| <= 1 and if we calculate the equation we get 3 + 0 + |1 - 2| = 4. Third and fourth points also satisfy the condition and give a value of 10 + -10 + |5 - 6| = 1.
    No other pairs satisfy the condition, so we return the max of 4 and 1.
    ```

    **Example 2:**

    ```txt
    Input: points = [[0,0],[3,0],[9,2]], k = 3
    Output: 3
    Explanation: Only the first two points have an absolute difference of 3 or less in the x-values, and give the value of 0 + 0 + |0 - 3| = 3.
    ```

    **Constraints:**

    -   `2 <= points.length <= 10^5`
    -   `points[i].length == 2`
    -   `-10^8 <= xi, yi <= 10^8`
    -   `0 <= k <= 2 * 10^8`
    -   `xi < xj` for all `1 <= i < j <= points.length`
    -   `xi` form a strictly increasing sequence.

!!! tip "hit"
    这道题的关键在于将$y_i+y_j+|x_i-x_j|$通过题目给的`i < j`则必然有$x_i < x_j$可以转换为求$\max{y_i+y_j+x_j-x_i} = \max{((y_i-x_i)+(y_j+x_j))}$则可以通过记录在`j`点左侧与其距离小于等于限制的点$y_i - x_i$点最大值来快速得出以该点为右端点的线段关于题目不等式的最大值。

??? success "参考实现"
    ```cpp
    ```
### Q5: Shortest Subarray with Sum at Least K
!!! note "描述" 
    Given an integer array `nums` and an integer `k`, return *the length of the shortest non-empty **subarray** of* `nums` *with a sum of at least* `k`. If there is no such **subarray**, return `-1`.
    
    A **subarray** is a **contiguous** part of an array.

??? info "举例与数据范围"
    **Example 1:**

    ```txt
    Input: nums = [1], k = 1
    Output: 1
    ```

    **Example 2:**

    ```txt
    Input: nums = [1,2], k = 4
    Output: -1
    ```

    **Example 3:**

    ```txt
    Input: nums = [2,-1,2], k = 3
    Output: 3
    ```

    **Constraints:**

    -   `1 <= nums.length <= 10^5`
    -   {==-10^5 <= nums[i] <= 10^5==} ⚠️ 可以是负数
    -   `1 <= k <= 10^9`
这道题如果全是正数就是个普通的滑动窗口的题,但如果有负数就不可能简简单单的通过滑动窗口做出来。

??? tip "hit"
    - 这道题和前缀和专题的 寻找和为K的最长子数组思路类似
    - 变成寻找以r结尾的子数组最小的l在哪里[l....r] 
        - 假设当前[0...r]的前缀和是 x
        - 目标就变成了寻找[0...l]的前缀合 <= x - k 且要求l最大
    - 维护一个前缀和的{==单调递增==}队列

??? success "参考实现"
    ```cpp
    class Solution {
    public:
        int shortestSubarray(vector<int>& nums, int k) {
            vector<long long> sum{0}; // ⚠️防止溢出 
            // 处理前缀和数组
            // sum[0] = 0
            // sum[1] = nums[0] + 0
            // sum[2] = nums[1] + nums[2] + 0
            for(int i = 0; i < nums.size(); ++i) sum.push_back(sum[i] + nums[i]);
            int ans = INT_MAX;
            for (int i = 0; i <= nums.size(); ++i) {
                // 如果当前[i...deque[h]]的和满足条件则弹出队头,并计算一次结果
                while (h != t && sum[i] - sum[deque[h]] >= k) ans = std::min(ans, i - deque[h++]);
                // 如果当前前缀和的结果小于队列尾的结果则弹出队尾
                while (h != t && sum[deque[t - 1]] >= sum[i]) --t;
                deque[t++] = i;
            }

            return ans == INT_MAX ? -1 : ans;

        }
    private:
        static constexpr int N = 1e5 + 10;
        array<int, N> deque;
        int h{0}, t{0};
    };
    ```
## 单调队列的总结
!!! abstract "总结"
    无论是单调队列还是单调栈,本质都在于找一种`单调`关系，通过这种单调关系去`优化`暴力解法中的无用形象。而如何寻找这种单调关系就是需要去学习的点。

    比如说Q1 Q2 通过{==正数数组拓展一个位置其最大值不可能减少，最小值不可能增大的特性==},并结合单调队列能在摊还消耗下每次以O(1)的复杂度获取最大值\最小值从而维持队列的最大值与最小值的差值,从而避免暴力解法中每次窗口改变都需要重新遍历的糟糕操作。

    