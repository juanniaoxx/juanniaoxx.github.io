---
tags: [C++ Primer]
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
!!! warning 
	若一个操作数是负数这对其进行某些位运算(比如说>>对于符号位的处理) 则其结果依赖于机器类型，这种情况下在C/C++标准下是UB的
----------------
`Shift Operators(<< >>)` return a copy of left-hand operand with the bits shifted ad directed by the right-hand operand.
⚠️ 若右边操作数的数值大于左操作数的位数,则该行为也是UB

Associative: left -> right
!!! info "Overload"
	I/O库重载的`>>` 和 `<<`,具有和位运算(内置含义)相同的结合律与优先级.
	```cpp
	std::cout << 42 + 10; // ok, + has higher precedence, so sum is printed
	std::cout << (10 < 42); // ok
	std::cout << 10 < 42; // error: attempt to compare cout to 42!
	```
--------
`NOT(~)` return a new value with the bits of its operand inverted.

- `char` will be promoted to `int` 

--------
`AND(&) OR(|) XOR (^)` return a new value with the bit pattern composed from its two operands.

- `char` will be promoted to `int`

## The sizeof Operator
Associative: right -> left

The `sizeof` operator returns the size, in bytes, of an expression or type name.the result of `sizeof` is a constant expression of type `size_t`.

!!! note inline begin 
	```cpp
	sizeof (type);
	sizeof expr;
	```
The operator takes one of two forms.

The `sizeof` not evaluate its operand, as `decltype`. 

```cpp
Sales_data data, *p;
sizeof(Sales_data);
sizeof data; // size of data's type, i.e. sizeof(Sales_data)
sizeof p; // size of a pointer(基于机器若是64位系统,则大小为8B)
sizeof *p; // size of the type to which op points,i.e. sizeof (Sales_data)
sizeof data.revenue; // size of the type of Sales_data's revenue member
// C++ 11:可以不提供对象访问成员(函数)
sizeof Sales_data::revenue; // alternative way to get the size of revenue
```

!!! info "the result of sizeof"
	- `char` or an expression of type `char` si guaranteed to be 1
	- a `reference` type returns the size of an object of the referenced type
	- {==a pointer returns the size needed hold a pointer==}
	- an `array` is the size of the entire array.
    	- that sizeof does not convent the array to a pointer
		```cpp
		constexpr size_t sz = sizeof(ia) / sizeof(*ia);
		int arr2[sz]; // ok sizeof return a constant expression
		```
	- a `string` or `vector` returns only the size of the fixed part of these types, it does not return the size used by the object's elements.
## The comma Operator(,)
The comma operator takes two operands, which it **evaluates** from {==left to right.==}

- left-hand will be discard when there are evaluated.
- the result of comma expression is the value of its right-hand expression
- the result is an lvalue if the right-hand operand is an lvaule


## Type Conversions
### Implicit Conversions
!!! info "When implicit conversions occur"
	- In most expressions, values of integral types smaller than int are first promoted to an appropriate larger integral type.
	- In conditions, non`bool` expressions are converted `bool`
	- In initializations, the initializer is converted to the type of the variable; in assignments, the right-hand operand is converted to the type of the left-hand
	- IN arithmetic and relational expressions with operands of mixed types, the types are converted to a common type.
	- conversions also happen during function cells.

**Pointer Conversions**
```cpp
int ia[10];
int *ip = ia; // convert ia to a pointer to the first element
```
!!! warning 
	将数组名转换为指针有几个例外

	- `decltype`
	```cpp
		int arr[10];
		decltype(arr) var; // the type of var is int[10]
	```
	- `&`
	```cpp
	int arr[10];
	int (*ptr)[10] = &arr; // the type ptr is int(*)[10]
	```
	- `sizeof`
	```cpp
	int arr[10];
	constexpr size_t size = sizeof(arr); // size is 10
	```
	- `typeid`
	- reference of array
	```cpp
	int arr[10];
	int (&ref)[10] = arr; // ref is reference of arr
	```
!!! info "Some other pointer conversions"
	- A constant integral value of 0 and the literal nullptr can be converted to and pointer type
	```cpp
	int *p1 = 0; // 0 -> int *
	double *p2 = nullptr; // nullptr -> double *
	```
	- a pointer to any non-const type can be converted to `void*`
	```cpp
	int x = 10;
	int *p_int = &x;
	void *p_void = p_int; // int* -> void*
	```
	- a pointer to any type can be converted to a `const void*`
	```cpp
	const char *p_str = "hello";
	const void *p_const_void = p_str; // const char * -> const void *
	```
### Explicit Conversions
`casts` ---> explicit conversion
```cpp
cast-name<type> (expression);
```
- cast-name: one of these
  - `static_cast` 
  - `dynamic_cast` : will be cover in 19.2
  - `const_cast`
  - `reinterpret_cast`
- type : the target type of the conversion
- expression: the value to be cast
!!! note 
	If type is reference, then the result is an lvalue.

**static_cast** 除去涉及底层const的强制类型转换都可以用
```cpp
int i, j;
double slope = static_cast<double>(j) / i; // j:int->double, i: int -> double
```

注意这里`i、j`的类型转换是不同的, `j`是被显示转换为double，而`i`是由于除法隐式提升为`double`

显示类型转换即使发生精度损失编译器也不会给出警告
```cpp
double d = 3.1415;
void *p = &d; // ok non const object can be stored in a void*
double *dp = static_cast<double*> (p); // converts void * back to the original pointer type
```

**const_cast** changes only a low-level const in its operand
```cpp
const char *pc;
char *p = const_cast<char*> (pc); // ok: but writing through p is undefined
```

{==Only a const_cast may be used to change the constness of an expression==}
```cpp
const char *cp;
char *q = static_cast<char*> (cp); // error: static_cast can't cast away const
static_const<string> (cp); // ok: converts string literal to string
const_cast<string>(cp); // error: const_cast only changes constness
```

**reinterpret_cast(非常危险一般不用)** a low-level reinterpretation(重新解释) of the bit pattern of its operands.

```cpp
int *ip;
char *pc = reinterpret_cast<char*> (ip);
```
!!! warning 
	如果真的将pc当char*使用会导致run-time error
	```cpp
	string str(pc); // result in bizarre run-time behavior.
	```

### Old-style cast
```cpp
type (expr); // function-style cast notation
(type) expr; // C-language-style cast notation
```
## Summarize
!!! abstract 
	C++ 提供了一套丰富的运算符，并定义了这些运算符作用于内置类型值时的行为。此外，C++ 还支持运算符重载，允许我们为自定义类类型定义运算符的含义。我们将在第14章学习如何为自己的类型定义运算符。​​
	
	​要理解包含多个运算符的表达式，必须掌握优先级（precedence）、结合性（associativity）和操作数求值顺序（order of operand evaluation）。每个运算符都有优先级和结合性。优先级决定了运算符在复合表达式中的分组方式，而结合性则决定了相同优先级的运算符如何分组。​​
	<br>
	<br>​
	大多数运算符不会规定操作数的求值顺序：编译器可以自由选择先计算左操作数还是右操作数。通常，操作数的求值顺序不会影响表达式的结果。然而，如果两个操作数引用同一个对象，并且其中一个操作数修改了该对象，那么程序就会存在严重的错误——而且这种错误可能很难被发现。​​
	
	最后，操作数通常会从其初始类型自动转换为另一种相关类型。例如，在所有表达式中，较小的整型会被提升为较大的整型。转换既适用于内置类型，也适用于类类型。转换也可以通过强制类型转换（cast）显式进行。
