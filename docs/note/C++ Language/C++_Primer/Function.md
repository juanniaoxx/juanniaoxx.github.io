---
tags: [C++ Primer]
---

# Function
!!! abstract 
    本章的主要内容:函数的声明与定义,{==按值传递参数==},{==函数的重载==}以及编译器如何选择重载函数,和函数指针相关的
    内容.
<a style="color:red; font-size:29px">A Function</a> is a block of code with a name.
A function may take zero or more arguments and usually yields a result.

## Function Basics
```cpp
// function declare
type_return fun_name(parameters);
// function define
type_return fun_name(parameters) {
    // body
}

// cell function
type_return n = fun_name(parameters); 
```

!!! example "factorial"
    ```cpp
    // factorial of val is val * (val - 1) * (val - 2) * ... * 1
    int fact(int val) {
        int ret = 1; // local variable to hold the result as we calculate it
        while (val > 1) 
            ret *= val--; // assign ret * val to ret and decrement val
        return ret; // return the result
    }
    ```

    ```cpp
    // cell fact
    int j = fact(5);
    ```
    cell function will do two things:
    
    - initializes the function's parameters from the corresponding arguments
    - transfers control to thant function

    return also do two things:
    
    - return the value(if any) in the return 
    - transfers control out of the called function back to the calling function

函数调用时候必须具有和定义相同数目的参数个数,类型可以不同但必须能存在某种转换关系.
```cpp
fact("hello"); // error const char* has no conversion from to int
fact(); // error: too less arguments
fact(42, 10, 0)// error: too many arguments
fact(3.124)// ok double -> int
```
!!! info "empty parameter list"
    ```cpp
    void f1() {} // cpp style
    void fi(void) {} // c-style
    ```
### Local Objects
{==scope(作用域)==} : the scope of a name is the part of the program's text in which that name is visible

{==lifetime(生命周期)==} : the lifetime of an object is the time during the program's execution that the object exists.

!!! note "local static objects"
    通过`static`声明的变量第一次执行完其定义后,其并不会随着函数结束而被销毁而是直到程序结束才会被销毁.
    ```cpp
    size_t count_calls() {
        static size_t ctr = 0; // value will persist across calls
        return ++ctr; 
    }

    int main() {
        for (size_t i = 0; i != 10; ++i) cout << count_calls() << endl;
        return 0;
    }
    ```
    若`static`为通过初始化器初始化则会执行值初始化而非默认初始化,比如说内置类型`int\double`等都会被初始化为`0`
### Function Declarations(Function Prototype 函数原型)
函数声明可以省去函数体与参数列表的名字,如下所示
```cpp
// 虽然可以省去但如果可能还是写上参数名字比较好 便于理解
void print(vector<int>::const_iterator , vector<int>::const_iterator);
```
!!! tip "Best Practices"
    The header that declares a function should be included in the source file that defines that function.

## Argument Passing
!!! note 
    If the parameter is a reference then the parameter is {==bound to its argument==}(pass by reference), otherwise, the argument's value is {==copied==}(pass by value). 
### Passing Arguments by value
按值传递的参数在函数体内的修改不会影响传入的参数.如下所示
```cpp
int n = 5;
fact(n); 
// n = 5 not 0
```

**Pointer Parameters**
传指针也是按值传递,传入是指针的副本,但由于指针的特性可以通过这个副本指针(间接)修改原来指针指向的对象.
```cpp
void reset(int *ip) {
    *ip = 0; // changes the value of the object to which ip points
    ip = nullptr; // changes only the local copy of ip
}
```
!!! tip "Using reference rather than using pointer"
    Programmers accustomed to programming in C often use pointer parameters to access objects outside a function. 
    
    In C++, programmers generally use reference parameters instead.

### Passing Arguments by reference
```cpp
void reset(int &i) i = 0;
```
传引用可以避免拷贝参数,对于大型数据结构可以避免拷贝的开销,甚至有些类型是没有拷贝选项的只能传应用.
```cpp
bool isShorter(const string &s1, const string &s2) return s1.size() < s2.size();
```
!!! tip "Best Practices"
    Reference parameters that are not changed inside a function should be references to const.

!!! example "Return Additional Information"
    C++的函数通常只能返回一个变量,若我们需要返回多个变量呢?可以使用一个结构封装但通过传入额外的引用也可以达到同样的目的.

    比如说假设我们需要一个函数它能返回给定字符在字符串中的首位置,并返回其出现次数,通过额外引入一个记录该元素出现次数的引用来传递更多信息.

    ```cpp
    string::size_type find_char(const string &s, char c, string::size_type &occurs) {
        auto ret = s.size();
        occurs = 0;
        for (decltype(ret) i = 0; i != s.size(); ++i) {
            if (s[i] == c) {
                if (ret == s.size()) ret = i;
                ++occurs;
            }
        }
        return ret;
    }
    ```
### `const` Parameters and Arguments

## Return Types and the return Statement

## Overloaded Functions

## Features for Specialized Uses

## Function Matching

## Pointers to Functions

## Summer