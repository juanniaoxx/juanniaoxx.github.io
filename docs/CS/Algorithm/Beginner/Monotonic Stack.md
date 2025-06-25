---
tags: [Algorithm]
---
# 单调栈与相关习题
!!! abstract "简介"
    在算法问题中，我们常常需要快速找到一个元素附近（左侧或右侧）第一个比它大或小的元素，或者计算由这些边界定义的区间特征（如面积、距离等）。这类问题的朴素解法通常是双重循环遍历，时间复杂度为$O(n²)$，而单调栈(Monotonic Stack)则能以$O(n)$的时间复杂度高效解决，其核心在于利用栈结构维护数据的单调性，以空间换时间。
!!! question "课程例题"
    ----
    [单调栈结构(进阶)](https://www.nowcoder.com/practice/2a2c00e7a88a498693568cef63a4b7bb)

    [739.Daily Temperatures](https://leetcode.cn/problems/daily-temperatures/description/)

    [907.Sum of sub-array Minimus](https://leetcode.cn/problems/sum-of-subarray-minimums/description/)

    [84.Largest Rectangle in Histogram](https://leetcode.cn/problems/largest-rectangle-in-histogram/description/)

    [85.Maximal Rectangle](https://leetcode.cn/problems/maximal-rectangle/description/)
    ----
    [962.Maximum Width Ramp](https://leetcode.cn/problems/maximum-width-ramp/)

    [316.Remove Duplicate Letters](https://leetcode.cn/problems/remove-duplicate-letters/description/)

    [2289.Steps to Make Array non Decreasing](https://leetcode.cn/problems/steps-to-make-array-non-decreasing/description/)

    [1504.Count sub-matrices with all ones](https://leetcode.cn/problems/count-submatrices-with-all-ones/description/)

## 单调栈的内容

### 不含重复元素的单调栈(以递增栈举例)
    
假设现在有数组[4,3,2,5,7,4,6,8]，想要查询每个元素左侧/右侧比其小的最近元素，可以采用`递增模式的单调栈`。
!!! note inline end "单调递归栈"
    - 栈内大数压下数，且加入元素的`数组下标`
        - 为了获取更多结果：比如说距离
    - 弹出元素的时候结算结果
        - 使得该元素弹出的为其{==右边==}比其小的最近元素
        - 该元素下方的元素为其{==左边==}比其小的最近元素
    - 若下方无元素则表明其左边的数都比它小
    - 若是在遍历完数组后才弹出的元素，则其右边无比其小的数

对于数组[9,3,2,5,7,4,6,8],其过程如下:
⚠️按规则应该返回下标，我这里为了方便返回了数值。

- `9`进入栈
- `3`进入栈，发现`9`比`3`大，弹出`9`
    - 根据规则，结算`9`的结果，此时`9`的底下无元素故其左边没有比其小的元素,右边比其小的最近元素为`3` {==[-1, 3]==}
    - 此时栈中仅剩`3`
- `2`进入栈,`3`比`2`大，弹出`3`
    - 根据规则返回{==[-1, 2]==}
- `5`进入栈
- `7`进入栈
- `4`进入栈,比`7`小，弹出`7`
    - 根据规则结算`7`，返回{==[5, 4]==}
    - 发现`5`还是大于`4`弹出`5`
      - 根据规则结算`5`,返回{==[2, 4]==}
- `6`进入栈
- `8`进入栈
- `清空栈`  
    - 弹出`8` 返回{==[6, -1]==}
    - 弹出`6` 返回{==[4, -1]==}
    - 弹出`4` 返回{==[2, -1]==}
    - 弹出`2` 返回{==[-1, -1]==} 

??? info "单调栈的合理性证明"
    为啥弹出的时候在其下方的元素就是最近的小于其的元素呢？

    假设存在一个元素`x`，比当前元素`cur`小且比当前元素在栈中的下一个元素`pre`的距离`x`更近,那么回溯遍历过程，，必然有一个小于`x`的数使其弹出(因为此时`x`不在栈中)假设这个数是`y`则有`y < x < cur` 且`y`比`x`离`cur`更近，故归纳可知，位于该元素下方元素必然是最近的小于该元素的元素.
### 含有重复元素的单调栈(以递增栈举例)
大体上和不包含重复元素的单调栈流程一致，唯一的区别是如遇到相同元素一样要弹出当前栈顶元素，并记录其结果但标记当前结果。

待遍历完全部元素后，对上述带有标记元素按照如下规则修改结果
- 将其右侧小于的最近元素更改为其记录的元素相对应的右侧小于其的最近元素
    - 例如假设当前记录为$nums[2]$的记录[1, 3] ---> $nums[3]$的结果为[1, 4]则更改$nums[2]$的结果为[1, 4]

!!! note "时间复杂度"
    时间复杂度为$O(N)$---每个元素最多入栈\出栈一次
    
    空间复杂度为$O(N)$
## 单调栈结构的模板
!!! tip 
    面试和笔试中使用静态数组模拟栈而不建议使用库自带的栈

!!! example "参考模板"
    === "单调递增栈"
        ```cpp
        vector<int> arr(N, 0); // 记录题目数组
        vector<int> stack(N, 0); // 模拟栈

        std::pair<int, int> ans[N]; // 记录左右边界
        int n, top; // n为总元素数，top为栈顶指针
        void monotonicallyIncreasingStack() {
            top = 0;
            int cur;
            // 遍历阶段
            for (int i = 0; i < n; i++) {
                while (top > 0 && arr[i] <= arr[stack[top - 1]]) {
                    cur = stack[--top];
                    ans[cur].first = top > 0 ? stack[top - 1] : -1;
                    ans[cur].second = i;
                }
                stack[top++] = i;
            }

            // 清空栈
            while (top > 0) {
                cur = stack[--top];
                ans[cur].first = top > 0 ? stack[top - 1] : -1;
                ans[cur].second = -1;
            }

            // 对重复元素进行修改
            for (int i = n - 1; i > 0; i--) {
                if (ans[i].second != -1 && arr[ans[i].second] == arr[i]) {
                    ans[i].second = ans[ans[i].second].second;
                }
            }
        }
        ```
!!! tip 
    虽然模版中带有对相同元素的处理，但对于实际题目是否真的需要额外处理还需要进一步考虑。
## 课上例题
### Q1 : Daily Temperatures
!!! note "题目"
    === "英文"
        Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0 instead.
    === "中文"
        给定一个整数数组 temperatures ，表示每天的温度，返回一个数组 answer ，其中 answer[i] 是指对于第 i 天，下一个更高温度出现在几天后。如果气温在这之后都不会升高，请在该位置用 0 来代替。

题目说的也是比较直白的，求位于`i`右边且距离`i`最近的严格大于其的元素，可以用递减的单调栈实现。
??? success "参考实现"
    ```cpp
    class Solution {
    public:
        vector<int> dailyTemperatures(vector<int>& temperatures) {
            vector<int> ans(temperatures.size(), 0);

            for (int i = 0; i < temperatures.size(); i++) {
                while (top > 0 && temperatures[i] > temperatures[st[top - 1]]) {
                    int cur = st[--top];
                    ans[cur] = i - cur;
                }
                // 相等也加入
                st[top++] = i;
            }

            return ans;
        }
    private:
        static constexpr int N = 1e5 + 10;
        array<int, N> st;
        int top;
    };
    ```
### Q2: Sum of Sub-array Minimus
!!! note "题目描述"
    === "English"
        Given an array of integers arr, find the sum of min(b), where b ranges over every (contiguous) subarray of arr. 
        
        Since the answer may be large, return the answer modulo 109 + 7.
    === "中文"
        给定一个整数数组 arr，找到 min(b) 的总和，其中 b 的范围为 arr 的每个（连续）子数组。

        由于答案可能很大，因此 返回答案模 10^9 + 7 。

对于每个元素`x`下标为i其中以其为最小值的子数组，为左侧最靠近其且小于其的元素l小标为j和右侧最靠近且小于其的元素r下标为k所确定的范围构成的组合：[j.... i ...k] 总的个数为 (i - j) * (k - i)

则这个问题就转换为了求数组每个元素左右两侧距离其最近的小于其的元素的位置

??? success "参考实现"
    ```cpp
    class Solution {
    public:
        typedef long long LL;
        int sumSubarrayMins(vector<int>& arr) {
            int MOD = 1'000'000'000 + 7;
            LL ans = 0;
            
            for (int i = 0, cur; i < arr.size(); i++) {
                // 相同元素一样弹出
                while (top > 0 && arr[st[top - 1]] >= arr[i]) {
                    cur = st[--top];
                    int left = top == 0 ? -1 : st[top - 1];
                    ans = (ans + (LL) (cur - left) * (i - cur) * arr[cur]) % MOD;
                }
                st[top++] = i;
            }

            while (top > 0) {
                int cur = st[--top];
                int left = top == 0 ? -1 : st[top - 1];
                ans = (ans + (LL) (cur - left) * (arr.size() - cur) * arr[cur]) % MOD;
            }

            return (int)(ans % MOD);
        }
    private:
        constexpr static int N = 3e4 + 10;
        array<int, N> st;
        int top = 0;
    };
    ```
### Q3: Largest Rectangle in Histogram
!!! note "题目"
    === "English"
        Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.
    === "中文"
        给定 n 个非负整数，用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 1 。求在该柱状图中，能够勾勒出来的矩形的最大面积。
    
    举例说明

    **input**: heights = [2, 1, 5, 6, 2, 3]
    
    **output**: 10

    The above is a histogram where width of each bar is 1.
    The largest rectangle is shown in the red area, which has an area = 10 units.

    ![](https://assets.leetcode.com/uploads/2021/01/04/histogram.jpg)

这道题的转换也比较明显，寻找其左右两侧小于其的最近位置即可以

??? success "参考实现"
    ```cpp
    class Solution {
    public:
        int largestRectangleArea(vector<int>& heights) {
            int n = heights.size();
            int ans = 0;
            for (int i = 0; i < n; i++) {
                while (top > 0 && heights[i] <= heights[st[top - 1]]) {
                    int cur = st[--top];
                    int right = i;
                    int left = top == 0 ? -1 : st[top - 1];
                    ans = std::max(ans, (right - left - 1 ) * heights[cur]);
                }
                st[top++] = i;
            }

            while (top > 0) {
                int cur = st[--top];
                int left = top == 0 ? -1 : st[top - 1];
                ans = std::max(ans, heights[cur] * (n - left - 1));
            }
            return ans;
        }
    private:
        constexpr static int N = 1e5 + 10;
        array<int, N> st;
        int top = 0;
    };
    ```
### Q4: Maximal Rectangle
!!! note "题目"
    === "English"
        Given a rows x cols binary matrix filled with 0's and 1's, find the largest rectangle containing only 1's and return its area.
    === "中文"
        给定一个仅包含 0 和 1 、大小为 rows x cols 的二维二进制矩阵，找出只包含 1 的最大矩形，并返回其面积。
    
    Input: matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]

    Output: 6
    
    Explanation: The maximal rectangle is shown in the above picture.

    ![](https://assets.leetcode.com/uploads/2020/09/14/maximal.jpg)

这道题如何转换为单调栈呢？可以考虑转换为Q3的直方图问题,通过逐行遍历即可以把这个二维数组转换为直方图(记录`1`个数)此时问题等价于Q3 


??? success "参考实现"
    ```cpp
    class Solution {
    public:
        int maximalRectangle(vector<vector<char>>& matrix) {
            // 使用单调栈O(m * n)
            int ans = 0;
            int n = matrix.size();
            int m = matrix[0].size();
            vector<int> height(m, 0);

            for (int i = 0; i < matrix.size(); i++) {
                // 压缩矩阵
                for (int j = 0; j < m; j++) height[j] = matrix[i][j] == '0' ? 0 : height[j] + 1;
                ans = std::max(ans, largesRectangLeArea(height));
            }
            return ans;
        }
    private:
        static const int MAX = 210;
        array<int, MAX> st;
        int top = 0;

        int largesRectangLeArea(vector<int> &height) {
            // Q3 solution
            int ans = 0;
            int n = height.size();
            for (int i = 0; i < n; i++) {
                while(top > 0 && height[i] <= height[st[top - 1]]) {
                    int cur = st[--top];
                    int left = top == 0 ? -1 : st[top - 1];
                    int right = i;
                    ans = std::max(ans, (right - left - 1) * height[cur]);
                }

                st[top++] = i;
            }

            while (top > 0) {
                int cur = st[--top];
                int left = top == 0 ? -1 : st[top - 1];
                int right = n;
                ans = std::max(ans, (right - left - 1) * height[cur]);
            }

            return ans;
        }
    }
    ```
### Q5: Maximum Width Ramp
!!! note "题目"
    A ramp in an integer array nums is a pair (i, j) for which i < j and nums[i] <= nums[j]. The width of such a ramp is j - i.

    Given an integer array nums, return the maximum width of a ramp in nums. If there is no ramp in nums, return 0.

首先从左到右收集严格递减的单调栈，再倒序弹出栈中元素且计算区间长度，即可获得答案。

如何理解呢？首先假设i位置的元素大小为x，j(j > i)位置的元素是y，而y > x,有可能j是最长的答案左边界而i不是吗？显然是不可能的，所以只需要收集严格递减的元素即可。

弹出过程中，若当前位置的元素对应的右边界可以与栈顶元素对应的左边界构成一个坡，则该结果一定是栈顶元素能构成坡的最大值，因为在(栈顶元素.....当前元素)中的任意元素的长度都不可能大于这个结果。

??? success "参考实现"
    ```cpp
    class Solution {
    public:
        int maxWidthRamp(vector<int> &nums) {
            // 加入严格递增的序列 -- 左边界
            int ans = 0;
            for (int i = 1; i < nums.size(); ++i) {
                if (nums[i] < nums[st[top - 1]]) st[top++] = i;
                
            }
            // 逆序确定右边界
            for (int i = nums.size() - 1; i >= 0; --i) {
                while (top > 0 && nums[i] >= nums[st[top - 1]]) {
                    ans = std::max(ans, i - st[--top]);
                }
            }

            return ans;
        }

    private:
        static const int N = 5e4 + 10;
        array<int, N> st;
        int top = 1; // 等价于 st[top++] = 0;
    };
    ```

### Q6: Remove Duplicate Letters
!!! note "题目"
    给你一个字符串 s ，请你去除字符串中重复的字母，使得每个字母只出现一次。需保证 返回结果的字典序最小(要求不能打乱其他字符的相对位置)

比较好想的就是利用单调递增的栈去记录结果然后反序就可以，但由于有重复元素如何保证弹出元素的合理性呢？可以使用一个哈希表或者静态数组去记录每个字符出现的次数，当小压大发生的时候，若被压的元素在后面还有则可以直接弹出，否则不能弹出。

??? success "参考实现"
    ```cpp
    class Solution {
    public:
        string removeDuplicateLetters(string s) {
            // 统计频率
            string ans;
            for (char c : s) count[c - 'a']++;

            for (char c : s) {
                if (!enter[c - 'a']) {
                    while(top > 0 && st[top - 1] > c && count[st[top - 1] - 'a'] > 0) {
                        enter[st[top - 1] - 'a'] = false;
                        top--;
                    }
                    st[top++] = c;
                    enter[c - 'a'] = true;
                }
                count[c - 'a']--;
            }
            while (top > 0) ans += st[--top];
            std::reverse(ans.begin(), ans.end());
            return ;
        }
    private:
        std::array<int, 26> count;
        std::array<char, 26> st;
        std::array<bool, 26> enter;
        int top = 0;
    };
    ```
### Q7: Steps to Make Array nonDecreasing(大鱼吃小鱼问题)
!!! note "题目描述"
    You are given a 0-indexed integer array nums. In one step, remove all elements nums[i] where nums[i - 1] > nums[i] for all 0 < i < nums.length.

    Return the number of steps performed until nums becomes a non-decreasing array.

大鱼吃小鱼模型，通过一个pair记录当前元素的执行完后续操作需要的轮次与数值，举例说明。通过单调栈(单调递减栈)来维护答案。

举例说明，比如说输入[5,3,4,4,7,3,6,11,8,5,11]
{==逆序遍历==}

- {11, 0}压入栈
  - 含义为: 11这个元素,需要0轮才能使得其右侧元素都不小于它(都不能被它吃掉)
- 5 < 11,将 {5, 0}压入栈
  - 含义为: 5这个元素,需要0轮才能使得其右侧元素都不小于它(都不能被它吃掉)
- 8 > 5, 弹出{5, 0},并且将{8, 1}压入栈中
  - 含义为: 在第0轮`8`这个元素需要消费`1轮`才能吃掉`5`，而`11 > 8`不需要操作
- 11 > 8, 弹出{8, 1}, 且将{11, 2}压入栈
- 6 < 11, 压入{6, 0}
- 3 < 6, 压入{3, 0}
- 7 > 3，压入{7,1}; 7 > 6 压入{7, 2}
- 4 < 7, 压入{4, 0}
- 4 = 4, 压入{4, 0}
- 3 < 4, 压入{3, 0}
- 5 > 3, 弹出{3, 0} 压入{5, 1}; 5 > 4弹出{4,0},压入{5, 2}; 5 > 4弹出{4,0} 压入{5,4}

此时只需要返回栈中第二个位置最大的值即可

??? success "参考实现"
    ```cpp
    class Solution {
    public:
        using PII = std::pair<int, int>;
        int totalSteps(std::vector<int>& nums) {
            int ans = 0;
            for (int i = nums.size() - 1; i >= 0; --i) {
                int curTurns = 0;
                while (size > 0 && st[size - 1].first < nums[i]) {
                    curTurns = std::max(curTurns + 1, st[--size].second);
                }
                st[size].first = nums[i];
                st[size++].second = curTurns;
                ans = std::max(ans, curTurns);
            }

            return ans;
        }
    private:
        static constexpr int N = 1e5 + 10;
        std::array<PII, N> st;
        int size = 0;
    };
    ```

### Q8: Count sub-matrices with all ones
和Q3与Q4类似,这道题的单调栈思路并不显然说实话，即使想到了单调栈这个逻辑也不容易想到。

通过计算一层一层的递增(bottom值的判断)计算来避免重复计算。

??? success "参考实现"
    ```cpp
    class Solution {
    public:
        int numSubmat(std::vector<std::vector<int>>& mat) {
            int n = mat.size();
            int m = mat[0].size();
            int ans = 0;
            for (int i = 0; i < n; ++i) {
                // 矩阵压缩
                for (int j = 0; j < m; ++j) {
                    heights[j] = mat[i][j] == 0 ? 0 : heights[j] + 1;
                }
                // 收集结果
                ans += countFroBottom(m);
            }
            return ans;
        }
    private:
        static constexpr int N = 200;
        std::array<int, N> heights;
        std::array<int, N> st;
        int top = 0;

        int countFroBottom(int m) {
            top = 0;
            int ans = 0;
            for (int i = 0, left, len, bottom; i < m; ++i) {
                // 通过单调递增栈收集结果
                while (top > 0 && heights[st[top - 1]] >= heights[i]) {
                    int cur = st[--top];
                    // 仅当当前栈顶元素大于当前元素，导致栈顶元素被弹出的情况才计算一次答案
                    if (heights[cur] > heights[i]) {
                        left = top == 0 ? -1 : st[top - 1]; // 左侧端点
                        len = i - left - 1; // 总宽度
                        bottom = std::max(left == - 1 ? 0 : heights[left], heights[i]); // 找左右端点的较大值作为底，防止重复计算
                        ans += (heights[cur] - bottom) * len * (len + 1) / 2; // 通过C(len + 1, 2)的方法计算一层总的小矩形数, heights[cur] - bottom计算出一共有多少层
                    }
                }
                st[top++] = i;
            }

            // 将栈清空
            while (top > 0) {
                int cur = st[--top];
                int left = top == 0 ? -1 : st[top - 1];
                int len = m - left - 1;
                int down = left == -1 ? 0 : heights[left];
                ans += (heights[cur] - down) * len * (len + 1) / 2;
            }

            return ans;
        }
    };    
    ```
## 单调栈的总结
!!! abstract "总结"
    单调栈最经典的用法当然是寻找位于其左右两侧大于/小于其的最近位置，当然单调栈还可以有其他妙用，最主要的思想是{==维持求解答案的可能性==}

    - 单调栈里的所有对象按照规定好的单调性来组织
    - 当某个对象进入单调栈道时候，会从{==栈顶==}依次淘汰单调栈里{==对后续求解答案没有帮助的对象==}
    - 每个对象从栈顶弹出的时候，结算当前对象参与的结果，随后这个对象{==不在参与求解过程==}

单调栈还可以和动态规划问题进行组合，将会在拓展部分进行讲解。