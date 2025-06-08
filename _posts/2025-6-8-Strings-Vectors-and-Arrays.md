---
itle: C++ Primer Chapter 2 Strings Vectors and Arrays
layout: post
date: 2025-06-08
description: C++语言学习
tags: 编程语言 C++
---

### 章节目录

- [x] 3.1 Namespace `using` declarations 命名空间使用声明
- [x] 3.2.1 Defining and Initializing strings 定义与初始化`string`
- [x] 3.2.2 Operations on strings `string`的操作
- [x] 3.2.3 Dealing with the Characters in a `string` 对字符串的字符进行处理
- [ ] 3.3.1 Defining and Initializing vectors 定义和初始化`vector`

### Namespace `using` Declarations (命名空间使用声明)

```cpp
using namespace::name; // the safest way 
```

使用`using`可以避免重复使用`std::xxx`只需要在`#include`之后`main`函数之前声明需要使用的内容即可。

```cpp
#include <iostream>

using std::cin;

int mian() {
    int i;
    cin >> i;
    cout << i; // error 
    std::cout << i;
    return 0;
}
```

使用不同的类型需要单独使用`using`

```cpp
#include <iostream>

using std::cin;
using std::cout;
int mian() {
    int i;
    cin >> i;
    cout << i; // ok
    std::cout << i;
    return 0;
}
```

注意这种是非法的, 不允许公用一个`using`

```cpp
using std::cin, std::cout; // error
using std::cin; using std::cout; // ok
```

### Library `string` type (`string`类型)

`string` is a `variable-length` sequence of characters.

- `#include <string>`
- `using std::string`

#### Defining and Initializing strings `string`的定义与初始化

> 初始化 `string`的方式
>
> ```cpp
> string s1; // defalut initialization; s1 is the empty string 默认初始化
> string s2 = s1; // s2 is a copy of s1 拷贝初始化
> string s3 = "hiya"; // s3 is a copy of the string literal 字符串字面值初始化
> string s4(10, 'c'); // s4 is cccccccccc 
> ```
>
> 注意`s3`并不包含最后字符串字面值的`\0`结束符

注意`=`和`()`初始化是不一样的

```cpp
string s3 = "hiya";
string s3(hiya);
```

- `=`是`copy initialization` 拷贝初始化
- `()`是`direct initializaiton` 直接初始化

| Ways to Initialize a `string`                                |
| ------------------------------------------------------------ |
| ![image-20250602223331886](assets/image-20250602223331886.png) |

#### Operations on strings `string`的操作

| `string` Operations                                          |
| ------------------------------------------------------------ |
| ![image-20250602223834006](assets/image-20250602223834006.png) |

- `os`: output streams
- `is`: input steams

> `>>` 和 `<<`
>
> ```cpp
> int main() {
>     string s;
>     cin >> s; // 读入的时候会忽略所有前置的空白,直到下一个读入的空白
>     cout << s << endl;
>     return 0;
> }
> ```
>
> 和内置类型的输入和输出一样处理
>
> - 返回的也是左操作数
>   - `>>` 返回`std::istream`
>   - `<<`返回 `std::ostream`
> -  使用`>>`读入会忽略空格

> `getline()`
>
> ```cpp
> std::istream& getline(std::istream& is, std::string& str); // 函数签名
> ```
>
> - 注意`getline()`并非`string`的成员函数，而是自由函数。
>
> `getline` 函数接受一个输入流和一个字符串作为参数。它会从输入流中读取内容，直到遇到第一个换行符（包括该换行符），然后将读取的内容（**不包含换行符本身**）存储到指定的字符串参数中。
>
> 当 `getline` 遇到换行符时，无论它是输入中的第一个字符还是其他位置的字符，都会立即停止读取并返回。
> 如果输入的第一个字符就是换行符，那么最终存储的字符串将是一个​**​空字符串​**​。

```cpp
int main() {
    string line;
    while (getline(cin, line))
        cout << line << endl;
    return 0;
}
```

> `empty()` and `size()` 
>
> 基本功能
>
> - `empty()` 返回`bool`值，判断该`string`是否为空
> - `size()`返回`string::size_type`值，计算该`string`的长度
>   - 使用`string::size_type`的目的是为了实现与机器无关
>   - 但可以肯定的时候其一定是一个**无符号类型**
>     - 要注意和`int`计算的时候，`int`会被强制转换为`unsigned int`

Comparing `string `: ==, !=, >, >=, <. <= 

- 大小写敏感
- 按照字典序比较
- 比较的基本规则
  - 若两字符串长度不同，且较短字符串中的每个字符均与较长字符串中对应位置的字符相同，则较短字符串小于较长字符串。
  - 若两字符串在任意对应位置上的字符存在差异，则字符串比较的结果由首个不同字符的比较结果决定。

> string类的赋值与`+` 
>
> - `string`可以和`bulit-in`类型一样直接用一个string给另一个string赋值
>
> ```cpp
> string s1 = "happy", s2;
> s2 = s1; // now, s1 and s2 are "happy";
> ```
>
> - `string`类允许`+`和`+=`操作，和内置类型保持一样的逻辑
>
> ```cpp
> string s1 = "happy", s2 = "world";
> string s3 = s1 + s2; // now s3 is "happyworld";
> s1 += s2; // now s1 is "happyworld";
> ```
>
> - `string`类与字符串字面值的加法(注意)
>   - 必须有一个操作数为`string`才合法
>
> ```cpp
> string s4 = s1 + ", "; // ok
> string s5 = "hello" + ", "; // error: no string operand
> string s6 = s1 + ", " + "world"; // ok
> string s7 = "hello" + ", " + s2; // error
> ```
>
> `s7`不可以的原因为，其实际上可以认为是如下两部分的组合
>
> ```cpp
> string s7 = ("hello" + ", ") + s2; 
> ```
>
> 而第一部分是两个字面值相加，其操作非法

#### Dealing with the Characters in a `string`

> C++从C标准库继承而来的库，一般会使用`c+name`的名字命名且移去后缀`.h`，同时其所有内容都位于命名空间`std`中，但如果使用`.h`的方式导入，则不保证所有的函数\变量位于`std`的命名空间内。所以，对于所有从C继承而来的库，都应该按照`cname`的方式导入。

| `cctype`Functions                                            |
| ------------------------------------------------------------ |
| ![image-20250604140842801](assets/image-20250604140842801.png) |

<hr>

<div style="top: 10px; left: 10px; max-width: 80%; background: #f8f9fa; border-left: 4px solid #e67e22; border-radius: 4px; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: inline-block;">
  <div style="padding: 8px 12px; font-weight: bold; color: #e67e22; white-space: nowrap;">重要</div>
  <div style="padding: 8px 12px; padding-top: 0; color: #333;">
      C11特性中的范围for循环
  </div>
</div>

`C11` --- `Range-Based for`

```cpp
for (declaration : expression)
statement;
```

对于`string`对象，可以按照如下方式遍历每一个字符

```cpp
stirng str("some string");
for (auto c : str)
cout << c << endl;
```

一个更复杂的例子

```cpp
string s("Hello World!!!");  // 定义字符串s并初始化
// punct_cnt的类型与s.size()返回类型相同（参见第2.5.3节第70页）
decltype(s.size()) punct_cnt = 0;  // 标点计数器初始化

// 统计字符串s中的标点符号数量
for (auto c : s)        // 遍历s中的每个字符
 if (ispunct(c))     // 若当前字符是标点符号
     ++punct_cnt;    // 标点计数器自增

// 格式化输出结果
cout << punct_cnt << " punctuation characters in " << s << endl;

```

- 使用`decltype`推断表达式`s.size()`的返回值类型`string::size_tyep`

使用`reference`和范围for循环修改string的每一个字符

```cpp
string str("hello world");
for (auto &c : str)
    c = toupper(c);
cout << str << endl; 

// The output of this code is 
HELLO WORLD
```

注意点

- 虽然看上去是`c`每次重新绑定了`str[i]`，但引用是不支持重新绑定的，所有其实是
  ```cpp
  {
      auto &c = str[0];
      ....
  }
  {
      auto &c = str[1];
      .....
  }
  .....
  ```

  每次迭代的`c`都是全新的`c`
  
  <hr>

### Library `vector` template (`vector`模板)

> - `vector` is a collection of objects, all of which **have the same type.**
>
> ```cpp
> #include <vector>
> using std::vector;
> ```
>
> `vector`是模板(class template)，可以通过如下方式进行实例化(instantiation)
>
> ```cpp
> vector<int> ivec; // ivec holds objects of type int
> vector<Sales_item> Sales_vec; // Sales_vec holds objects of type Sales_item
> vector<vector<string>> file; // vector whose elemnets are vectors
> ```
>
> - 注意`vector`是模板(template)但`vector<int>`是类型(type)
>
> - 注意由于`reference`并非一个对象，所以不存在使用引用实例化的`vector`
> - `vector`支持变长

一个旧标准和新标准的细微差距

```cpp
// 使用vector实例化另一个vector的区别
vector<vector<int> >; // 旧标准需要一个空格
vector<vector<int>> ; // C++11之后并不强制要求
```

####  Defining and Initializing vectors 定义和初始化`vector`

```cpp
vector<string> svec; // 默认初始化，全空
```

```cpp
vector<int> ivec;
vector<int> ivec2(ivec); // 拷贝初始化
vector<string> svec(ivec2); // error: 类型不匹配
```

```cpp
// C++11
vector<string> articles = {"a", "an", "the"}; // 列表初始化
vector<string> articlse{"a", "an", "the"}; // ok
vector<string> articlse("a", "an", "the"); // error: 不能使用()进行列表初始化
```

```cpp
// 创建含有指定初始容量和初始内容的vector
vector<int> ivec(10, -1); // 十个元素，没个元素都是-1
vector<string> svec(10, "hi!"); // 十个元素，每个元素都是hi!
```

```cpp
// 创建指定初始容量但不指定初始内容的vector
vector<int> ivec(10); // 十个元素，全都是0
vector<string> svec(10); // 十个元素，全都是空字符串
```

- 部分类需要明确的显示初始化才可以

注意这个初始化是非法的

```cpp
vector<int> vi = 10; // error: must use direct initialization to supply a size
```

| 总结：`vector`的初始化方法                                   |
| ------------------------------------------------------------ |
| ![image-20250604150208423](assets/image-20250604150208423.png) |

