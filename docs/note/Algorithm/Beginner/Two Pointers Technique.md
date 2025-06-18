---
tag: [Algorithm]
---
# 双指针算法
!!! abstract "简介"
    双指针（Two Pointers）是一种通过使用两个指针（或索引）在数组、链表或字符串中协同遍历的高效技巧。它通常能将 O(n²) 的时间复杂度优化为 O(n)，适用于多种场景。
    
    通常双指针包括如下类型

    - 同向双指针
    - 快慢双指针
    - 从两头往中间的双指针
    - 其他
    
    严格来说双指针并不是算法，而更多只能算一种思路

??? question "相关习题"
    [leetcode922.按奇偶排序数组 II](https://leetcode.cn/problems/sort-array-by-parity-ii/description/)

    [leetcode287.寻求重复数](https://leetcode.cn/problems/find-the-duplicate-number/)

    [leetcode42.接雨水](https://leetcode.cn/problems/trapping-rain-water/description/)

    [leetcode881.救生艇](https://leetcode.cn/problems/boats-to-save-people/description/)

    [leetcode11.盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)

    [leetcode475.供暖器](https://leetcode.cn/problems/heaters/description/)

    [leetcode41.缺失的第一个正数](https://leetcode.cn/problems/first-missing-positive/description/)
## Q1 按奇偶排序数组II
!!! note "问题描述"

??? success "参考实现"
    === "简单拷贝O(N) O(N)"
        ```cpp
        class Solution {
        public:
            // O(N) O(N)简单遍历拷贝
            vector<int> sortArrayByParityII(vector<int>& nums) {
                vector<int> ans(nums.size(), -1);
                for (int i = 0, j = 0, k = 1; i < nums.size(); i++) {
                    if (nums[i] % 2 == 0) {
                        ans[j] = nums[i];
                        j += 2;
                    } else {
                        ans[k] = nums[i];
                        k += 2;
                    }
                }

                return ans;
            }
        };
        ```
    
    === "双指针O(N) O(1)"
        ```cpp
        class Solution {
        public:
            // O(N) O(1) 双指针
            vector<int> sortArrayByParityII(vector<int>& nums) {
                int n = nums.size();
                int j = 1;
                for (int i = 0; i < n; i += 2) {
                    if (nums[i] % 2 == 1) {
                        while (nums[j] % 2 == 1) j += 2;
                        std::swap(nums[i], nums[j]);
                    }
                }
                return nums;
            }
        };
        ```

## Q2 寻找重复数
!!! note "问题描述"
    给定一个包含 n + 1 个整数的数组 nums ，其数字都在 [1, n] 范围内（包括 1 和 n），可知至少存在一个重复的整数。

    假设 nums 只有 一个重复的整数 ，返回 这个重复的数 。

    你设计的解决方案必须{==不修改==}数组nums且{==只用常量级 O(1) 的额外空间==}。


??? success "参考实现"
    === "二进制"
        !!! note "算法描述"
            通过逐位分析二进制位来确定重复的数字。具体来说，对于每一个二进制位，比较数组中该位为1的数字的个数（x）与1到n的数字中该位为1的数字的个数（y）。如果x > y，说明重复数字的该位为1；否则为0。通过这种方式，可以逐位构建出重复的数字。
            时间复杂度 $O(N\log{N})$ $O(1)$
            ??? info "正确性的证明"
                如果重复数字（target）出现两次：

                对于target的第i位为1的位，nums中该位的1的个数比1到n中多1（因为target多出现了一次）。

                对于target的第i位为0的位，nums中该位的1的个数与1到n中相同。

                如果重复数字出现超过两次：

                相当于用target替换了一些缺失的数字。替换时：

                如果被替换的数字的第i位为1且target的第i位为1：x不变。

                如果被替换的数字的第i位为0且target的第i位为1：x增加。

                如果被替换的数字的第i位为1且target的第i位为0：x减少。

                如果被替换的数字的第i位为0且target的第i位为0：x不变。
        ```cpp
        class Solution {
        public:
            int findDuplicate(vector<int>& nums) {
                int n = nums.size(), ans = 0;  // n为数组长度，ans用于存储最终结果（重复的数字）

                // 确定最高有效位的位置（bit_max）
                // 例如，n=5时，数字范围是1~4（因为有一个重复），4的二进制是100，最高位是第2位
                int bit_max = 31;  // 初始设为31
                while ((n - 1) >> bit_max == 0) bit_max--;  // 找到最高有效位的位置

                // 逐位检查（从最低位到bit_max位）
                // 外层 log(n)
                for (int bit = 0; bit <= bit_max; bit++) {
                    int x = 0, y = 0;  // x统计nums中该位为1的数的个数，y统计1~n-1中该位为1的数的个数

                    // 计算x：nums数组中当前bit位为1的数的个数
                    for (int i = 0; i < n; i++) {
                        if (nums[i] & (1 << bit)) x++;  // 检查nums[i]的第bit位是否为1
                    }

                    // 计算y：1~n-1的数字中当前bit位为1的数的个数
                    // 注意：因为nums的长度是n，且包含1~n-1的数字和一个重复数字
                    // 内层n
                    for (int i = 1; i < n; i++) {  // i从1到n-1
                        if (i & (1 << bit)) y++;  // 检查i的第bit位是否为1
                    }

                    // 如果nums中该位为1的数的个数 > 1~n-1中该位为1的数的个数
                    // 说明重复数字的该位为1，将其设置到ans中
                    if (x > y) ans |= 1 << bit;
                }

                return ans;  // 返回找到的重复数字
            }
        };
        ```

    === "快慢双指针-Floyd判圈"
        !!! note "算法描述"
            对于`nums`的每个数建立一条$i\rightarrow nums[i]$,由于存在重复数字，则该图中比如存在环，由下方介绍的Floyd判圈算法只需要使用快慢双指针就可以确定环的入口。

            时间复杂度 $O(N)$ $O(1)$
        ```cpp
        class Solution {
        public:
            int findDuplicate(vector<int>& nums) {
                int slow = nums[0], fast = nums[nums[0]];
                // 让fast和slow一直走，直到相遇
                while (slow != fast) {
                    // slow走一次
                    slow = nums[slow];
                    // fast走两次
                    fast = nums[nums[fast]];
                }
                // 将指针放回起点
                fast = 0;
                while (slow != fast) {
                    // slow和fast都调整为一次走一步
                    slow = nums[slow];
                    fast = nums[fast];
                }

                return fast;
            }
        };
        ```

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

## Q3: {==接雨水(hard)==}
!!! note "问题描述"
    给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。

    ![](../../images/2025-6-12-Two-Pointers/接雨水.png)
    
    输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]
    
    输出：6
    
    解释：上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。

## Q4: 救生艇
!!! note "问题描述"
    给定数组 people 。people[i]表示第 i 个人的体重 ，船的数量不限，每艘船可以承载的最大重量为 limit。

    每艘船最多可同时载两人，但条件是这些人的重量之和最多为 limit。

    返回 承载所有人所需的最小船数 。

## Q5: 盛水最多的容器
!!! note "问题描述"
    给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i]) 。

    找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。

    返回容器可以储存的最大水量。

    {==说明：你不能倾斜容器。==}

    ![alt text](../../images/2025-6-12-Two-Pointers/盛水最多的容器.png)

    输入：[1,8,6,2,5,4,8,3,7]
    
    输出：49 
    
    解释：图中垂直线代表输入数组 [1,8,6,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。
问题可以转换为求解$\min{(左边界,有边界)}*区间长度$ 

## Q6: 供暖器
!!! note "问题描述"
    冬季已经来临。 你的任务是设计一个有固定加热半径的供暖器向所有房屋供暖。

    在加热器的加热半径范围内的每个房屋都可以获得供暖。

    现在，给出位于一条水平线上的房屋 houses 和供暖器 heaters 的位置，请你找出并返回可以覆盖所有房屋的最小加热半径。

    注意：所有供暖器 heaters 都遵循你的半径标准，加热的半径也一样。
## Q7: {==缺失的第一个正数(hard)==}
!!! note "问题描述"
    给你一个未排序的整数数组 nums ，请你找出其中没有出现的最小的正整数。

    请你实现时间复杂度为 O(n) 并且只使用常数级别额外空间的解决方案。

## 双指针算法的总结
!!! abstract "总结"
    