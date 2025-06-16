---
tags: [Algorithm]
---
# 单调栈与相关习题
!!! abstract "简介"
    在算法问题中，我们常常需要快速找到一个元素附近（左侧或右侧）第一个比它大或小的元素，或者计算由这些边界定义的区间特征（如面积、距离等）。这类问题的朴素解法通常是双重循环遍历，时间复杂度为$O(n²)$，而单调栈(Monotonic Stack)则能以$O(n)$的时间复杂度高效解决，其核心在于利用栈结构维护数据的单调性，以空间换时间。
!!! question "课程例题"
    ----
    单调栈的基本应用

    [单调栈结构(进阶)](https://www.nowcoder.com/practice/2a2c00e7a88a498693568cef63a4b7bb)

    [739.Daily Temperatures](https://leetcode.cn/problems/daily-temperatures/description/)

    [907.Sum of sub-array Minimus](https://leetcode.cn/problems/sum-of-subarray-minimums/description/)

    [84.Largest Rectangle in Histogram](https://leetcode.cn/problems/largest-rectangle-in-histogram/description/)

    [85.Maximal Rectangle](https://leetcode.cn/problems/maximal-rectangle/description/)

    ----
    单调栈的拓展应用
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
## 课上例题
### Q1 : Daily Temperatures
!!! note "题目"
    === "英文"
        Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0 instead.
    === "中文"
        给定一个整数数组 temperatures ，表示每天的温度，返回一个数组 answer ，其中 answer[i] 是指对于第 i 天，下一个更高温度出现在几天后。如果气温在这之后都不会升高，请在该位置用 0 来代替。

题目说的也是比较直白的，求距离`i`最近的大于其的元素，可以用递减的单调栈实现。
!!! success "参考实现"

### Q2: Sum of Sub-array Minimus
!!! note "题目描述"
    === "English"
        Given an array of integers arr, find the sum of min(b), where b ranges over every (contiguous) subarray of arr. 
        
        Since the answer may be large, return the answer modulo 109 + 7.
    === "中文"
        给定一个整数数组 arr，找到 min(b) 的总和，其中 b 的范围为 arr 的每个（连续）子数组。

        由于答案可能很大，因此 返回答案模 10^9 + 7 。

考虑单调栈结构每次都可以快出查出距离该元素最近的小于其的元素的位置，可以快速确定某一个子数组的最小值，故可以快速求的答案。
## 单调栈的总结
!!! abstract "总结"
