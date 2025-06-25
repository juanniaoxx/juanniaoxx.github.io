---
tags: [CMake, 杂谈]
---

# CMake Tutorial
[参考链接](https://cmake.org/cmake/help/latest/guide/tutorial/A%20Basic%20Starting%20Point.html)

## Step 1:A Basic Starting Point
### Building a Basic Project
```cmake
cmake_minimum_required(VERSION 3.10) 
project(Tutorial)
add_executable(
    Tutorial tutorial.cxx
)
```
三个主要标签
```cmake
cmake_minimum_required(VERSION <min> | ...<policy_max>| [FATAL_ERROR])
```

`cmake_minimum_required`: 指明cmake的最低版本要求

```cmake
project(<PROJECT-NAME> [<language-name>...])
```

`project` 设置项目名字,并将其储存在变量PROJECT_NAME中,当从顶层CMakeLists.txt调用时,还会将项目
名称存储在CMAKE_PROJECT_NAME中

```cmake
add_executable(<name> <options> ... <sources> ....)
```

`cmake` 添加一个名为<name>的可执行目标,该目标将由命令调用中列出的源文件构建而成.

构建与运行
```shell
mkdir Step1_build # 创建build目录
cd Step1_build && cmake ../Step1 && cmake --build . # 进入build目录并编译文件
# 此时build文件夹下就会生成对应的可执行文件
```

### Specifying the C++ Standard
`CMAKE_CXX_STANDARD`变量的值来指明需要的c++版本,通过`set()`来设置.

`CMAKE_CXX_STANDARD_REQUIRED`是布尔值变量若其值为`true(on\yes)`表明如果当前编译器不支持`CMAKE_CXX_STANDARD`中指明的cpp版本则CMake会直接报错并停止配置过程.

```cpp
set(CMAKE_CXX_STANDARD 11) # 设置cpp版本为c11
set(CMAKE_CXX_STANDARD_REQUIRED true)
```

## Step 2:Adding a Library
### Creating a Library

### Adding an Option
## Step 3:Adding Usage Requirements for a Library

## Step 4:Adding Generator Expressions

## Step 5:Installing and Testing

## Step 6:Adding Support for a Testing Dashboard

## Step 7:Adding System Introspection

## Step 8:Adding a Custom Command and Generated File

## Step 9:Packaging an Install

## Step 10:Selecting Static or Shared Libraries

## Step 11:Adding Export Configuration

## Step 12:Packaging Debug adn Release