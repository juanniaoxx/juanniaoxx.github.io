---
tags: [C++]
---

## Fundamentals
!!! quote "Expression"
	An expression is composed of one or more operands(操作数) and yields a
	result when it is evaluated.

### Basic Concepts
`unary operators(一元操作数)` and `binary operators(二元操作数)` 

!!! example 
	`&` `*(de-reference)` --- unary operators

	`+` `-` `*(multiplication)` `\` -- binary operators


!!! note "Overloaded Operators(运算符重载)"
	the number of operands and the precedence and the associativity of 
	the operator cannot be changed.

!!! note "Lvalues and Rvalues(左值与右值)"
	In short, lvalues could stand on the left-hand side of an assign-ment
	whereas revalues could not.

	An lvalue expression yields an object or a function.

	- when we use an object as an rvalue, we use the object's value(its contents)

	- when we sue an object as an lvalue, we use the object's identity(its location in memory)

	!!! warning 

		- 能够使用左值替代右值(此时使用的是对象的内容)

		- 但不能使用右值替代左值(即不能在没有明确位置的情况下使用)

	!!! example "operators that involve lvalues"
		1. `Assignment` requires a (non-const) lvalue as its left-hand operand 
		and yield its left-hand operand as an lvalue.

			```cpp
			int x = 10;
			x = 20;  // right
			// 10 = x error: 10 is rvalue
			int y = (x = 30); // y = 30, because assignment return lvalue
			```

		2. `address-of operator *` requires an lvalue operand and returns a pointer to its
		operand as an rvalue

			```cpp
			int a = 42;
			int *p = &a; // right
			// int *p2 = &10; error 10 is rlvaue
			```

		3. `dereference and subscript operators` all yield lvalues
			
			```cpp
			int arr[3] = {1, 2, 3};
			arr[0] = 100; // right

			int *ptr = &arr[0];
			*ptr = 200; // right *ptr return lvalue

			std::vector<int> vec = {1, 2 ,3};
			vec[1] = 50; // vec[1] return lvalue

			std::string s = "hello";
			s[0] = 'H'; // right
			```

		4. `increment and decrement operators` require lvalue operands and the prefix versions also yield lvalues

			```cpp
			int b = 5;
			++b = 10; // right ++b return lvalue
			// b++ = 10; // error, b++ return rvlaue

			std::vector<int>::iterator it = vec.begin();
			*++it = 99; // right ++it return lvalue
			```

	!!! warning "`decltype`"
		`decltype`对于左右值的处理并不相同

		- 若推断表达式是一个左值，则会返回引用类型

		- 若是一个右值，则返回正常推断类型

		```cpp
		int *p = nullpter;
		decltype(*p) // type is int&
		decltype(&p) // type is int**
		```

### Precedence and Associativity 

简单来说优先级决定表达式如何组合的次序，而结合方式决定表达式如何解读，可以使用括号改变表达式的运算优先级。

!!! quote "cppreference - Operator Precedence"
	[Operator Precedence](https://en.cppreference.com/w/cpp/language/operator_precedence.html)



### Order of Evaluation
!!! warning "一些表达式的解读顺序并不确定"
	```cpp
	int i = f1() + f2(); // cpp标准并不保证f1和f2的调用顺序，仅能保证二者一定会被调用
	```
	
	若只是上面这种情况还比较好办，但如果是下面这个情况就需要⚠️了
	
	```cpp
	int i = 0;
	cout << i << " " << ++i << endl;
	```
	根据编译器的不同可能获得`0 1`也可能获得`1 1`甚至编译器不让通过，这是由于
	!!! quote "ISO C++ 5.2/8"
		若表达式有副作用(side effect)与同一标量对象的值计算存在无序关系,则该行为未定义(UB)

There are four operators that do guarantee the order in which operands are evaluated.

- `&&(and)` : 保证最左边的优先执行，后面的表达式只有当其左边的表达式全为真才会执行

- `||(or)`: 和`&&`基本一致,只有前面的表达式都为`false`才会执行后续的表达式

- `?:(conditional)`

- `,(comma)`

!!! note "order preference associativity"
	例如:$f() + g() * h() + j$ : 

	- 优先级决定了`g()`和`h()`的结果先会相乘 --> 组合

	- 结合性决定了`f()`的结果会与`g()*h()`的结果相加并与`j`相加

	- 而加法执行的顺序无人能保证

	如果f g h没有修改相同的对象则这个表达式没啥问题，但如果其修改了则是一个未定义行为


!!! info "advice"
	
	1. When in doubt, parenthesize expressions to force the grouping that the logic of your program requires.  

	2. If you change the value of an operand, don’t use that operand elsewhere in the same expresion.

## Arithmetic Operators
!!! info inline begin "Arithmetic Operators"
	|运算符|类型|使用|
	|---|---|---|
	|+|unary plus|+ expr|
	|-|unary minus|- expr|
	|---|---|---|
	|*|multiplication|expr * expr|
	|/|division|expr / expr|
	|%|remainder|expr % expr|
	|---|---|---|
	|+|addition| expr + expr|
	|-|subtraction|expr - expr| 
-----------------------------
precedence : `+(unary plus)`  = `-(unary plus)` > `* / %` > `+(addition) -(subtraction)`
Associativity: all left

The operand and results of these operators are {==rvalue==}

`+ unary plus` return a (possibly promoted) copy of the value of its operand
```cpp
char c = 'A';
int i = +c; // char -> int 这是显示转换

const int x = 10;
int y = +x; // right y is copy of x even x is const
```

`- unary minus` return the result of negating a (possible promoted) of the value of its operand;
```cpp
int i = 1024;
int k = -i; // k = -1024

bool b = true;
bool b2 = -b; // b2 is true!
// 被隐式的转换为int进行了计算
```

`\ division` a nonzero quotient is positive if the operands have the same sign and negative otherwise. the quotient to be rounded toward zero(truncated(截断))   


`% modulus` : if m and n are integers and n is nonzero, then $(m/n)*n + m%n$ is equal to m.

{==if m % n is nonzero, it has the same sign as m==}

```cpp
21 % 6 = 3; 21 / 6 = 3;
21 % 7 = 0; 21 / 7 = 3;
-21 % -8 = -5; -21 / -8 = 2;
21 % -5 = 1; 21 / -5 = -4;
```

## Logical and Relational Operators
!!! info inline begin "Logical and Relational Operators"
	|Operator|Function|
	|----|---|
	|!|logical NOT|
	|---|---|
	|<|less than|
	|<=|less than or equal|
	|>|greater than|
	|>=|greater than or equal|
	|---|---|
	|==|equality|
	|!=|inequality|
	|---|---|
	|&&|logical AND|
	|`||`|logical OR|
----------------------
Preference: `!` > `<, <=, >, >=` > `==, !=` > `&&` > `||` 

Associativity: `!` is right, either are `left`

The operands to these operators are {==rvalues==} and the result is {==rvalue==}.

`&&` and `short` {==short-circuit evaluation==}

`!` is return the inverse of the truth value of its operand

`<, <=, >, >=` return `true` or `false` so there are some mistakes
```cpp
if (i < j < k) // error : true if k is grater than 1! 
if (i < j && j < k) // right
```
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>

## Assignment Operators
Preference: lower precedence than the relational operators

Associative: {==right==}

The left-hand operand of an assignment operator must be a {==modifiable lvalue==}, the result of an assignment is the type of the left-hand operand, which is an lvalue.
```cpp
int i = 0, j = 0, k = 0; // initialization, not assignment
const int ci = i; // initialization, not assignment

// each of these assignment s is illegal
1024 = k;
i + j = k;
ci = k; // error, ci is const(non modifiable)lvale

k = 0; // type int, value 0
k = 3.1415926; // type int, value 3

int ival, jval;
ival = jval = 0; // right, each assigned 0
```

compound assignment operators: `+=,-=,/=,*=,%=,>>=,<<=,&=,^=,|=`,  
```cpp
int i = 10;
i += 1; // i = i + 1;
```
!!! note 
	When we use the compound assignment, the left-hand operand is evaluated {==only once==}.

## Increment and Decrement Operators 
These operators require lvalue operands, the prefix form return the object itself as an lvalue, postfix form return a copy of the object's original value as an rvalue.

!!! note "the diff of prefix and postfix"
	```cpp
	int i = 0, j = 0;
	j = ++i; // j = 1, i = 1;
	j = i++; // j = 1, i = 2;
	```

!!! tip "using prefix"
	```cpp
	for (int i = 0; i < n; ++i) // rather than i++
	```
	前缀版本并不生成一个元素的拷贝,在复杂的数据类型中这种小技巧能节省不少开销.


## The Member Accsee Operators
`.(dot)` and `->(arrow) == (*ptr).member` 
```cpp
string s1 = "a string", *p = &s1;

auto n = s1.size(); // run the size member of the string s1
n = (*p).size(); // run size on the object to which p pointer
// deference(*) has lower preference of dot(.)
n = p->size(); // equivalent to (*p).size()
``` 

## The Conditional Operator
`?:` simple if-else logic inside an expression.
```cpp
cond ? expr1 : expr2;
```
if cond is true, then expr1 is evaluated, otherwise, expr 2 is evaluated. (必然先执行cond,在执行后面两个表达式中的一个)
```cpp
string finalgrad = (grade < 60) ? "fail" : "pass";
```

!!! note "return value" 
	That result of the conditional operator is an lvalue if both expressions are lvalues or if they convert to a common lvalue type. 

	Otherwise the result is an rvalue
	```cpp
	int a = 10, b = 20;
	(a > b ? a : b) = 30; // right

	int x = 5;
	double y = 3.14;
	int &ref = (x > 0 ? x : static_cast<int>(y)); // double -> int

	int c = (true ? 10 : 20) // right

	int d = 1;
	std::string s = "hello";
	auto result = (d > 0 ? d : s);// error, int -> string and  string -> int error!
	```

## The Bitwise Operators
!!! info inline begin "bitwise operators"
	|Operator|Function|
	|---|---|
	|~|bit-wise NOT|
	|<<|left shift|
	|>>|right shift|
	|&|bit-wise AND|
	|^|bit-wise XOR|
	|`|`|bit-wise OR|
----------------

## The sizeof Operator

## The comma Operator

## Type Conversions

## Summarize