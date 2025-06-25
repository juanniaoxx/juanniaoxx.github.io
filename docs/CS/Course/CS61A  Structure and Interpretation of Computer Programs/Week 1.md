---
tags: [CS61A]
---

# Week 1
!!! abstract "简介"
    掌握Python基本语法和编程范式

    理解函数作为一等公民的概念(可绑定、传递、返回和包含在数据结构中)
    
    学习控制结构(条件语句和迭代)的使用
    
    理解高阶函数的概念和应用
    
    掌握函数式编程的基本技术(如lambda表达式和柯里化)
    
    熟悉Python的文档测试和调试方法
## Functions
### Reading TextBook (Ch1.1 - 1.3)
computer programs consist of instructions to either computer some value or carry out some action.

{++statements++} typically describe actions.

{++expression++} typically describe computations.

^^Function^^: function encapsulate logic that manipulates data.

^^Object^^: An object seamlessly bundles together data and the logic that manipulates that data in a way that manages the complexity of both.

^^Interpreters^^: A program that implements such a procedure, evaluating compound expressions, is called an interpreter.

!!! note
     programs must be written for people to read, and only incidentally for machines to execute.

Every one powerful language has three such mechanisms:

^^primitive expression and statements(基本表达式与语句)^^:represent the simplest building blocks that the language provides

^^means of combination(组合的方法)^^: compound elements are built from simpler ones,

^^means of abstraction(抽象的方法)^^:  compound elements can be named and manipulated as units

```python
# call expression
>>> max(7.5, 9.5)
9.5
```
max: Operator, {(7.5, 9.5)}: Operands

```python
# Important Library Functions
for math import sqrt
sqrt(256)
# output 16.0
```

!!! abstract "Python 3 Library Docs"
    [Python3 Library Docs](https://docs.python.org/zh-cn/3.13/library/index.html)

```python
# assignment statement
>>> radius = 10
>>> radius 
10
>>> 2 * radius
20
```
^^Assignment statement(赋值语句)^^: establish new bindings
```python
# name also can bind by import
>>> from math import pi
>>> pi * 71 / 233
1.0002380197528042
```

^^environment(环境)^^: some structure keep track of the names, values and bindings

name also can be bound to function, for example `max`
```python
>>> max
<build-in function max>

# can change the new relation 
>>> f = max
>>> f
<build-in function max>
>>> f(2, 3, 4)
4
# also can change the bind
>>> f = 2
>>> f
2
```

!!! tip "multiple values to multiple names"
    ```python
    area, circumference = pi * radius * radius, 2 * pi * radius
    ```

^^Evaluating Nested Expression^^ : recursion, and expression tree
```python
>>> mul(add(2, mul(4, 6)), add(3, 5))
208
```
![](https://www.composingprograms.com/img/expression_tree.png)

^^pure functions(纯函数)^^ Functions have some input and return some output, no effects beyond returning a value, and must return the same value when called twice withe the same arguments.

![pure functions](https://www.composingprograms.com/img/function_abs.png)

^^no pure functions(非纯函数)^^ In addition to returning a value, applying a non-pure function can generate side effects, which make some change to the state of the interpreter or computer.

![non-pure functions](https://www.composingprograms.com/img/function_print.png)
```python
>>> abs(1)
1  # abs is pure function
>>> print(1, 2, 3) # print is not-pure function 
1 2 3 #the effect is print 1 2 3
>>> print(print(1), print(2))
1 # print(1) print 1
2 # print(2) print 2
None None # the print return None, and print(None, None) print None None
```

```python
# defining new function -- square
>>> def square(x):
        return mul(x, x)
>>> square
<function square at 0x1038cb240>
# as build-in function cell 
>>> square(4)
16
>>> square(10)
100
```

```python
# can use self-function to build other function, as build-in function
>>> def sum_squares(x, y):
            return add(square(x), square(y))
>>> sum_squares(3, 4)
25
```
^^function signatures(函数签名)^^ Functions differ in the number of arguments that they are allowed to take
```python
# function signatures also name function definition
def square(x):
    return mul(x, x)
```

^^name evaluation(名字求值规则)^^ A name evaluates to the value bound to that name in the earliest frame of the current environment in which that name is found.

!!! note "Using python Tutor"
    [python tutor](https://pythontutor.com/)

!!! note "Parameters"
    the parameter names of a function must remain local to the body of the function
    ```python
    def square(x):
        return mul(x, x)
    # that is same as square(y)
    def square(y):
        return mul(y, y)
    ```
!!! abstract "PEP 8 Style Guide for Python code"
    [PEP 8 Style Guide for Python code](https://peps.python.org/pep-0008/)


## Control
### Reading TextBook (ch 1.4 - 1.5)
!!! quote "Designing Functions"
    
    - Each function should have exactly one job
    - Don't repeat yourself is a central tenet of software engineering.
    - Function should be defined generally

^^Documentation(文档说明)^^: The first line describes the job of the function in one line. The following lines can describe arguments and clarify the behavior of the function

```python
def pressure(v, t, n):
    """Computer the pressure in pascals of an ideal gas.
    Applies the ideas gas law : http://en.wikipedia.org/wiki/Ideal_gas_law
    
    v -- volume of gas, in cubic meters
    t -- absolute temperature in degrees kelvin
    n -- particles of gas
    """
    k = 1.38e-23 # Boltzmann's constant
    return n * k * t / v
```
!!! note "help"
    ```python
    >>> help(pressure) # return documentation
    Computer the pressure in pascals of an ideal gas.
    Applies the ideas gas law : http://en.wikipedia.org/wiki/Ideal_gas_law
    
    v -- volume of gas, in cubic meters
    t -- absolute temperature in degrees kelvin
    n -- particles of gas
    ```

^^Default Argument Values(默认参数值)^^ When calling that function, arguments whit default values are optional,if they are not provided, then the default value is bound to the formal parameter name instead.

```python
# n is default argument
def pressure(v, t, n = 6.022e23):
    """Computer the pressure in pascals of an ideal gas.
    Applies the ideas gas law : http://en.wikipedia.org/wiki/Ideal_gas_law
    
    v -- volume of gas, in cubic meters
    t -- absolute temperature in degrees kelvin
    n -- particles of gas
    """
    k = 1.38e-23 # Boltzmann's constant
    return n * k * t / v
```
^^Conditional Statements(条件语句) & Boolean values(布尔变量)^^

- python build-in Boolean values : `True` or `False`
!!! info "boolean return value"
    ```python
    >>> True and False
    True
    >>> True and 41
    41
    >>> False and 41
    False
    >>> 0 or False
    False
    >>> False or 0
    0
    >>> 21 or True
    21
    >>> True or 21
    True
    ```

```python
# if - else if - else
if <expression>:
    <suite>
elif <expression>:
    <suite>
else :
    <suite>
# Boolean values
>>> 4 < 2
False
>>> 5 >= 5
True
```
^^Boolean operators(布尔运算符)^^ `and` `or` `not`
```python
# boolean operators
>>> True and False
False
>>> True or False
True
>>> not True
False
```
!!! note "short-circuiting"
    `and` `or`
    ```python
    <left> and <right>
    <left> or <right>
    ```
    
    - Evaluate the sub-expression <left>
    - if the left is true, then the expression value is true (or)
    - if the left is false, then the expression value is false (and)
    - otherwise, the expression is the result of evaluate the sub-expression right
!!! tip
    Functions that perform comparisons and return boolean values typically begin with is, not followed by an underscore(e.g., isfinite, isdigit, isinstance, etc.)

^^Iteration(迭代语句) --- which^^
```python
while <expression>:
    <suite>
```

^^assert(断言)^^ use assert statements to verify expectations, such as the output of a function being tested.

```python
# assert is True, nothing will be done
assert fib(8) == 13, 'The 8th Fibonacci number should be 13' # when assert is False, the 'xxxx' will be printed
```

^^Doctest(文档测试)^^ Python provides a convenient method for placing simple tests directly in the docstring of a function. 
```python
def sum_naturals(n):
    """Return the sum of the first n natural numbers.

    >>> sum_naturals(10)
    55
    >>> sum_naturals(100)
    5050
    """
    total, k = 0, 1
    while k <= n:
        total, k = total + k, k + 1
    return total
# using doctest module to run documentation test
>>> from doctest import testmod
>>> testmod()
TestResults(failed=0, attempted=2)
```

```shell
# using doctest to run all document test of a python file
python3 -m doctest <python_source_file>
```

## Higher-Order Functions
### Reading TextBook (ch 1.6)
^^Functions as arguments(函数作为参数)^^
```python
def summation(n, term)
    """
    term -- function as argument
    """
    total, k = 0, 1
    while k <= n:
        total, k = total + term(k), k + 1
    return total

def cube(x):
    return x**3

def sum_cubes(n)
    return summation(n, cube) 

result = sum_cubes(3)
```
^^nested definitions(嵌套定义) & Lexical scope(词法作用域)^^

```python
def sqrt(a):
    # 内层嵌套的函数可以使用外层函数的参数
    def sqrt_update(x):
        return average(x, a/x)
    def sqrt_close(x):
        return approx_eq(x * x, a)
    return improve(sqrt_update, sqrt_close)
```
^^Function as Returned Values(函数作为返回值)^^
```python
def compose1(f, g):
    def h(x):
        return f(g(x))
    return h
```
^^Currying(柯里化)^^use higher-order functions to convert a function that takes multiple arguments into a chain of functions that each take a single argument.

```python
def curried_pow(x):
    def h(y):
        return pow(x, y)
    return h
>>> curried_pow(2)(3)
8
```

!!! note "auto to curry"
    ```python
    >>> def curry2(f):
            """Return a curried version of the given two-argument function."""
            def g(x):
                def h(y):
                    return f(x, y)
                return h
            return g

    >>> def uncurry2(g):
            """Return a two-argument version of the given curried function."""
            def f(x, y):
                return g(x)(y)
            return f
    ```
^^lambda expression(lambda表达式/Anonymous function 匿名函数)^^A lambda expression evaluates to a function that has a single return expression as its body. {++Assignment and control statements are not allowed++}.


```python
def compose1(f, g):
    """
    A function that takes x and returns f(g(x))
    """
    return lambda x : f(g(x))
```
!!! tip "When using lambda expression?"
     Python style prefers explicit def statements to lambda expressions, but allows them in cases where a simple function is needed as an argument or return value

!!! note "First class status --- function"
    - can be bound to names
    - can be passed as arguments to function
    - can be returned as the results of function
    - can be included in data structures

^^Function Decorators(函数装饰器)^^ Python provides special syntax to apply higher-order functions as part of executing a def statement, called a decorator. Perhaps the most common example is a trace

```python
def trace(fn):
    def wrapped(x):
        print('->', fn, '(', x, ')')
        return fn(x)
    return wrapped

@trace 
"""
@trace equivalent to:
triple = trace(triple)
"""
def triple(x):
    return 3 * x
>>> triple(12)
-> <function triple at 0x10344d440> ( 12 )
36
```

