---
tags: [CS61A]
---

# Week 3

## Data Abstraction and ADT Trees
### Reading Textbook
^^Data abstraction^^  similar in character to functional abstraction,isolates how a compound data value is used from the details of how it is constructed.

!!! example "Rational Numbers"
    ^^Rational numbers^^ `<numerator>/<denominator>`
    
    - `rational(n, d)`, return the rational number with numerator n and denominator d --- constructor(构造函数)
    - `numer(x)` returns the numerator of the rational number x --- selector(选择器)
    - `denom(x)` return the denominator of the rational number x --- selector(选择器)

    ^^wishful thinking^^ Assuming that we already do something,then we true to do it.
    ```cpp
    from fractions import gcd
    def rational(n, d):
        g = gcd(n, d)
        return [n//g, d//g]
    
    def numer(x):
        return x[0]

    def numer(x):
        return x[1]
    ```
## Mutability 

## Iterators and Generators 