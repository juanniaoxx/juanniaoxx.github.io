---
tags: [CS61A]
---
# Week 2

## Environments
[python tutor](https://pythontutor.com/)
## Recursion
### Reding Textbook
^^Recursion^^ if the body of the function calls the function itself

!!! example "sum_digits"
    ```python
    def sum_digits(n):
        """Return the sum of the digits of positive integer n."""
        if n < 10:
            return n
        else :
            all_but_last, last = n // 10, n % 10
            return sum_digits(all_but_last) + last
    ```
    The problem of summing the digits of a number is broken down into two steps

    - summing all but the last digit
    - adding the last digit

    ``` 
    For example sum_digits(1234)
    sum_digits(1234)
    ├── sum_digits(123) + 4
        ├── sum_digits(12) + 3
            ├── sum_digits(1) + 2
                ├── 1  (base case，n < 10)
            └── 1 + 2 = 3
        └── 3 + 3 = 6
    └── 6 + 4 = 10
    ```

Recursion consists of one or more {++base cases++}, followed by one or more {++recursive calls++}. It solves the original problem by gradually simplifying it

^^Recursion VS Iteration^^
```python
""" Iteration Version """
def fact_iter(n):
    total, k = 1, 1
    while k <= n:
        total, k = total * k, k + 1
    return total

""" Recursion Version """
def fact_rec(n):
    if n == 1:  # base case
        return 1
    else :
        return fact_rec(n - 1) * n
```
!!! quote "proof"
    $$
    \begin{align*}
    \text{induction} \\
    (n-1)! &= (n - 1)(n - 2)\ldots 1 \\
    n! &= n(n-1)(n-2)\ldots 1 \\
    n! &= n(n-1)! 
    \end{align*}
    $$

^^Mutual Recursion(相互递归)^^ when a recursive procedures in divided among two functions that call each other.

For example : 

- a number is even if it is one more than an odd number
- a number is odd if it is one more than an even number
- zero is even (base case)

```python
def is_even(n):
    if n == 0:
        return True
    else :
        return is_odd(n - 1)

def is_odd(n):
    if n == 0:
        return False
    else :
        return is_odd(n - 1)

"""merge two function"""
def is_even(n):
    if n == 0:
        return True
    else :
        if (n - 1) == 0:
            return False
        else :
            return is_even(n - 2)
```
## Tree Recursion
### Reading Textbook
^^Tree Recursion (树形递归)^^ a function calls itself {++more than once++}.

For example : Fibonacci sequence

![](https://media.geeksforgeeks.org/wp-content/uploads/20210608083944/img-300x172.PNG)

```python
"""Fibonacci Sequence
    0 1 1 2 3 5 8 .....
"""
def fib(n):
    if n == 1:
        return 0 # fib(1) = 0
    elif n == 2:
        return 1 # fib(2) = 1
    else:
        return fib(n - 2) + fib(n - 1) # fib(n) = fib(n - 2) + fib(n - 3)
```

!!! question "Partitions"
    The number of partitions of a positive integer n, using parts up to size m, is the number of ways in which n can be expressed as the sum of positive integer parts up to m in increasing order.

## Containers and Sequences
^^Sequence(序列)^^ is an {++ordered++} collection fo values.
### Reding Textbook
#### Lists and String
^^Lists(列表)^^ a sequence that can have arbitrary length
```python
>>> digits = [1, 2, 3, 8]
>>> digits[2]
3
>>> digits[3]
8

# lists can be add and can be mul by numbers
>>> [2, 7] + 2 * digits
[2, 7, 1, 2, 3, 8, 1, 2, 3, 8]
```

^^Sequence Iteration -- for (列表循环--for)^^ iterate over the elements of a sequence and perform some computation each element in turn

```python
"""while version"""
def count(s, value):
    """Count the number of occurrences of value in sequence s"""
    total, index = 0, 0
    while index < len(s):
        if s[index] == value:
            total += 1
        index += 1
    return total

"""for version"""
def count(s, value):
    total = 0
    for elem in s:
        if elem == value:
            total += 1
    return total
```

^^Sequence unpacking(序列解包)^^ This pattern of binding multiple names to multiple values in a fixed-length sequence

```python 
pairs = [[1, 2], [2, 2], [2, 3], [4, 5]]
same_count = 0

for x, y in pairs:
    # x = list.first
    # y = list.second
    if x == y:
        same_count += 1
```

^^Range(范围)^^ {++built-in++} type of sequence in python
```python
>>> range(1, 10) # includes 1 but not 10
range(1, 10) # not lists
>>> list(range(5, 8))
[5, 6, 7]
>>> list(range(4)) # only one argument
[0, 1, 2, 3]
```

!!! tip "_ in range()"
    ```python
    for _ in range(3):
        print("Go Bears!")
    ```
    A conventional meaning among programmers that indicates the name will not appear in any future expressions

^^List Comprehensions(列表推导)^^ Many sequence processing operations can be expressed by evaluating a fixed expression for each element in a sequence and collecting the resulting values in a result sequence.

```python
>>> odds = [1, 3, 5, 7, 9]
# for is not for statement,but instead part of a list comprehensions
>>> [x + 1 for x in odds]  # list comprehension
[2, 4, 6, 8, 10]

>>> [x for x in odds if 25 % x == 0] # list comprehension
[1, 5]
```
^^Membership(成员资格)^^ A value can be tested for membership in a sequence.

```python
>>> digits
[1, 8, 2, 8]
# in or  in not
>>> 2 in digits
True
>>> 1828 in not digits
True
```

^^Slicing(切片)^^ Sequences contain smaller sequences within them.
```python
>>> digits[:2]
[1, 8]
>>> digits[0:2]
[1, 8]
>>> digits[1:]
[8, 2, 8]
```

!!! quote "Further reading"
    [Dive into Python3 - Slicing A list](http://getpython3.com/diveintopython3/native-datatypes.html#slicinglists)

^^Strings literals(字符串字面值)^^ 
```python
>>> 'I am string'
I am string
>>> "I am string"
I am string
>>> city = "Berkeley"
>>> len(city)
8
>>> city[3] 
'k'
```
Python not `char` type, any text is a string.

```python
# string can add and mul
>>> 'Berkeley' + ', CA'
'Berkeley, CA'
>>> 'Shabu ' * 2
'Shabu Shabu '
```

``` python
# string membership
>>> 'here' in "Where's Waldo?"
True
```
string membership matches substrings rather the elements

```python
# multiline literals
>>> """The Zen of Python
claims, Readability counts.
Read more: import this."""
```

!!! tip "str()"
    ^^string coercion(字符强制转换)^^
    ```python
    >>> str(2) + 'is an element of ' + str(digits)
    '2 is an element of [1, 8, 2, 8]'
    ```

!!! note "Further Reading"
    [Dive into python3 - string](http://getpython3.com/diveintopython3/strings.html)

^^closure property of a data type 数据类型的闭包特性^^ to use lists as the elements of other lists.

![alt text](./images/data%20closure%20property.png)

#### Trees
^^Trees^^ is a fundamental data abstraction that imposes regularity on how hierarchical values are structured and manipulated.

```python
# simple version
def tree(root_label, branches=[]):
    """constructor tree"""
    for branch in branches:
        assert is_tree(branch), 'branches must be tree'
    return [root_label] + list(branches)

def label(tree):
    """selectors label"""
    return tree[0]

def branches(tree):
    """selectors branches"""
    return tree[1:]

def is_tree(tree):
    """to verify that  all branches are well-formed"""
    if type(tree) != list or len(tree) < 1:
        return false
    for branch in branches(tree):
        if not is_tree(branch):
            return False
    return True
```

## Homework & laboratory
### HW3 Recursion, Tree Recursion
递归一来这个题目就没那么简单喽,主要记录一下两道题的解法

!!! question "count_coin"
    Given a positive integer total, a set of coins makes change for total if the sum of the values of the coins is total. Here we will use standard US Coin values: 1, 5, 10, 25. For example, the following sets make change for 15:

    - 15 1-cent coins
    - 10 1-cent, 1 5-cent coins
    - 5 1-cent, 2 5-cent coins
    - 5 1-cent, 1 10-cent coins
    - 3 5-cent coins
    - 1 5-cent, 1 10-cent coin

基本思路,通过枚举是使用当前的硬币还是下一个比当前硬币大\小的硬币来凑这个总数
```python
def count_coin(total):
    def helper(amount, coin)
        if total == 0:
            return 1
        elif total < 0 or coin == None:
            # 无法凑成总数或者已无硬币可用(比当前大\小)
            return 0
        else:
            # 要么接着使用当前硬币,要么使用更大的硬币
            return count_coin(amount - coin, coin) + count_coin(amount, next_larger_coin(coin))
    return helper(total, 1) # 从小枚举到大
```

!!! question "Anonymous Factorial"
    Write an expression that computes n factorial using only call expressions, conditional expressions, and lambda expressions (no assignment or def statements).

    Note: You {++re not allowed to use make_anonymous_factorial++} in your return expression.

    The ^^sub and mul^^ functions from the operator module are the only built-in functions required to solve this problem.

^^Y-combinator Y结合子^^ 让函数接受自身作为参数,实现匿名递归
```python
return (lambda f: 
        f(f))(lambda f
                : lambda n : 1 if n == 0 else n * f(f)(n-1))
```
解释
`lambda f:f(f) **** ` 接受一个函数f并调用f

- (lambda f: f(f))(func) == func(func)
- 对于这个题,这个func就是(lambda f: lambda n : ....)

<iframe width="800" height="500" frameborder="0" src="https://pythontutor.com/iframe-embed.html#code=from%20operator%20import%20sub,%20mul%0A%0Adef%20make_anonymous_factorial%28%29%3A%0A%20%20%20%20return%20%28lambda%20f%3A%20%0A%20%20%20%20%20%20%20%20%20%20%20%20f%28f%29%29%28lambda%20f%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3A%20lambda%20n%20%3A%201%20if%20n%20%3D%3D%200%20else%20n%20*%20f%28f%29%28n-1%29%29%0Amake_anonymous_factorial%28%29%285%29&codeDivHeight=400&codeDivWidth=350&cumulative=false&curInstr=0&heapPrimitives=nevernest&origin=opt-frontend.js&py=311&rawInputLstJSON=%5B%5D&textReferences=false"> </iframe>

### HW4 Sequences, ADT Tree