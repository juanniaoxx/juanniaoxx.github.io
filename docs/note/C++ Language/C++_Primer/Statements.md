---
tags: [C++ Primer]
---

# Statement
!!! abstract

## Statement Scope
```cpp
int i = 0;
while (int i = get_num())
    std::cout << i << std::endl;
// i = 0 either the return of get_num()
```
`for\while\if\switch`具有块作用域其内的元素的生命周期从其在块内定义的位置开始,到块结束为止. 如上例中的i所示
## Conditional Statements
### The `if` Statement
```cpp
if (condition)
    statement;

if (condition)
    statement;
else if (condition)
    statement;
// ....
else 
    statement; 
```
### THe `switch` Statement
```cpp
switch (condition) {
    case constexpr:
        statement;
        break;
    case constexpr:
        statement;
        break;
    // .....
    default:
        statement;
        break;
}
```

!!! warning 
    注意一个特殊的地方,switch可以不用{}圈定一个分支的区域,但如果这个区域内包含初始化的变量则必须用{}强制指定作用域否则编译器会拒绝编译通过.
    ```cpp
    // 错误版本:`控制传输跳过实例化`
    case true:
        // 这个 switch 语句是非法的，因为这些初始化可能被跳过
        string file_name;  // 错误：控制流可能绕过隐式初始化的变量
        int ival = 0;      // 错误：控制流可能绕过显式初始化的变量
        int jval;          // 正确：jval 未被初始化
        break;
    case false:
        // jval 在作用域内，但未被初始化
        jval = next_num();  // 正确：给 jval 赋值
        if (file_name.empty())  // file_name 在作用域内，但未被初始化
            // ...
    
    // 正确版本
    case true: {
        string file_name = "data.txt";  // 正确：变量在块作用域内
        int ival = 42;                 // 正确：初始化不会影响后续 case
        break;
    }
    case false:
        // file_name 和 ival 在这里不可见，不会引发问题
        cout << "This is false case" << endl;
        break;
    ```

!!! note "Best Practices"
    
    - Although it is not necessary to include a breakafter the last label of a switch, the safest course is to provide one. That way, if an additional caseis added later, the breakis already in place
    
    - It can be useful to define a default label even if there is no work for the default case. Defining an empty default section indicates to subsequent readers that the case was considered.
## Iterative Statements
### The `while` Statement
```cpp
while (condition)
    statement
```
!!! note 
    Variables defined in a while condition or while bod are created and destroyed on each 
    iterative
### The `for` Statement
```cpp
for (init-statement; condition; expression)
    statement
```

!!! note 
    - `init-statement`: all variables must have the same base type.
    ```cpp
    // remember the size of v and stop when we get the original last element
    for (decltype(v.size()) i = 0, sz = v.size(); i != sz; ++i)
        v.push_back(v[i]);
    ```

### Range `for` Statement (C11)
```cpp
for ( (&)declaration : expression)
    statement
```
若需要在循环中修改元素必须使用`&` 
```cpp
std::vector<int> v = {0, 1, 2, ,3 ,4, 5, 6, 7, 8, 9};
for (auto &r : v) r *= 2;
// v = {0, 2, 4, 6, 8, 10, 12, 14, 16, 18}
```

!!! warning 
    如在vector中所说的一样,不能通过范围for循环-增加元素(vector\string).

### The do while Statement
```cpp
do
    statement
while (condition);
```
## Jump Statements
`break`: 立刻跳出当前的内层循环,到外部代码
```cpp
for (int i = 0; i < n; ++i)
    for (int j = i; j < n; ++j) 
        if (nums[i] < nums[j]) break;
        // ....
```
只会跳出内层的以`j`为变量的循环,而立刻执行`++i`执行下次循环

`continue`: 立即终止本次循环执行下次循环
```cpp
for (int i = 0; i < n; ++i)
    for (int j = i; j < n; ++j) 
        if (nums[i] < nums[j]) continue;
        // ....
```
终止本次循环执行`++j`而非`++i`

`goto`

```cpp
goto label;
// ....
label: statement;
```
!!! note
    滥用`goto`会使得程序变得难以理解,但合理利用`goto`也是很好用的.

!!! warning
    `goto`不可以向前跳过变量的初始化
    ```cpp
    goto end;
    int x = 10; // error: goto bypasses an initialized variable definition 
    end:
        // error: code here could use ix but the goto bypassed its declaration
        ix = 42;
    ```

    可以通过`goto`向后跳过变量初始化,应该后续可以重新构造
    ```cpp
    // right edition
    begin:
        int sz = get_size();
        if (sz <= 0) goto begin;
    ```
## `try` Blocks and Exception Handling
**Exception:** run-time anomalies - such as losing a database connectio nor encountering unexpected input - that exist outside the normal functioning of a program.

### A `throw` Expression
```cpp
throw error_style(string)
```

```cpp
if (item1.isbn() != item2.isbn()) throw runtime_error("Data must refer to same ISBN");
std::cout << item1 + item2 << std::endl;
```

### The `try` Block
```cpp
try {
    program-statements
} catch (exception-declaration) {
    handler-statements
} catch (exception-declaration) {
    handler-statements
} // ...
```

!!! example "try"
    ```cpp
    while (cin >> item1 >> item2) {
        try {
            // execute code that will add the two Sales_items
            // if the addition fails, the code throws a runtime_error exception
        } catch (runtime_error) {
            // remind the user that the ISBNs must match and prompt for another pair
            cout << err.what()
                 << "\nTry Again? Enter y or n" << endl;
                char c;
                cin >> c;
                if (!cin || c == 'n) break;
        }
    }
    ```

    Output:
    
    Data must refer to same ISB
    
    Try Again? Enter y or n


异常的搜索顺序是逆向的,对于一个error,通过最后一个调用的try去寻找是否存在对应该error的步骤,若没有
则从其的调用者的try寻找,若仍然没有则继续通过调用链回溯寻找.

若最终都没找到,则执行标准库函数`terminate`
### Standard Exceptions
!!! info "Standard Exceptions headers"
    - `exception` 
        - 定义类`exception`类 仅表面了发生了异常但不提供任何额外的信息.
    - `stdexcept`
    ![stdexcept](../../images/stdexcept.png)
    - `bad_alloc` will cover 12.12
    - `type_info` will cover 19.2
异常库能做的操作比较有限,只能创建\拷贝\赋值任意异常类型的对象.

!!! note "初始化限制"
    对于`exception\bad_alloc和bad_cast`这三种类型的异常只能进行默认初始化

    而对于其他类型的异常比如说上面用过的`runtime_error`必须使用字符串或者C-style风格的字符数组初始化.

**what()成员函数**,每个异常类都会定义一个`what()`成员函数

- 该函数无参数
- 返回指向C-style风格字符数组的`const char*`指针
- 该字符串用于提供关于异常的基本文本描述

!!! note "what()的字符串内容规则"
    - 对于支持字符串初始化的异常返回初始化时候提供的字符串
    - 对于不支持字符串初始化的异常,返回的内容由编译器决定

## Summer 
C++提供的内置语句并不多,基本可以分为如下几类
1. 流程控制语句
    - 循环语句`for\while\do-while`提供循环执行的能力
    - 条件语句(分支跳转)`if\switch` 实现条件分支执行
    - 循环控制语句`break\continue` 
    - 跳转语句`goto`
2. 异常处理语句
    - `try`和`catch`
    - `throw`
3. 函数终止语句
    - `return`
4. 其他基本语句
    - 表达式语句
    - 声明语句