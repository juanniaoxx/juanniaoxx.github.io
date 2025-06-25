---
tags: [CS70]
---
# Week 0
!!! abstract "主要内容"
    Introduction, Propositional Logic, Proofs, Induction, Stable Matching.


## Note 0 : Review of Sets and Mathematical Notation
### Sets
^^set^^ : a ^^collection^^ of objects.

$A=\{2, 3, 5, 7, 11\}$ if x is an element of A, then $x\in A$, if y is not an element of A, then $y \notin A$

If A and B have same elements, then A and B are said to be equal, then $A = B$

!!! info "Order is not important"
    $\{A, B, C\} = \{C, B, A\}$

An other more complicated set can be defined as:
$\mathbb{Q} = \left\{ \frac{b}{a} \mid a,b \text{ are integers}, b \neq 0 \right\}$

^^Cardinality(势) of set^^ : the size of a set.

If $A = \{1, 2, 3, 4\}$, the cardinality of A is 4, then $|A| = 4$

!!! info "Cardinality is zero"
    Only one set's cardinality is zero, that is ^^empty set^^, $\emptyset$

^^Subsets(子集) and Proper Subsets(真子集)^^

$A \subseteq B$, if every elements of A is also in B

$A \subset B$, if every elements of A is also in B, and B have at least one element not in A.

!!! note "properties of subset"
    - $\{\} \subset A$, A is any non-emptyset
    - $\{\} \subseteq B$ B is every set
    - $A\subseteq A$

^^Intersections(交集) and Unions(并集)^^

$A\cup B$, is the ^^set^^ containing all elements which are in both A and B.

if $A\cup B=\emptyset$, said A and B are ^^disjoint(不相交)^^

$A\cap B$, is the ^^set^^ containing all elements which are in either A or B or both.

!!! note "properties of intersections and unions"
    - $A\cup B = B\cap A$
    - $A\cup \emptyset = \emptyset$
    - $A\cap B = B\cap A$
    - $A\cap \emptyset = \emptyset$

^^Complements(补集)^^

$B-A = B/A = \{x\in B \mid x \notin A\}$, a complements is a ^^set^^ containing elements which in B but not in A.

!!! note "properties of complements"
    - $A/A=\emptyset$
    - $A/\emptyset=A$
    - $\emptyset/A=\emptyset$

!!! info "Significant Sets"
    $\mathbb{N}$ the set of all natural numbers: $\{0, 1, 2, 3, \ldots \}$

    $\mathbb{Z}$ the set of all integer numbers: $\{\ldots,-2,-1,0, 1, 2, 3, \ldots \}$

    $\mathbb{Q}$ the set of all rational numbers

    $\mathbb{R}$ the set of all real numbers

    $\mathbb{C}$ the set of all complex numbers.

^^Products(积) and Power Sets(幂集)^^

The **Cartesian Product**(cross product) written as $A\times B$, is the ^^set^^ of all pairs whose first component is an element of A adn whose second component is an element of B.

The power set of S, denoted by $\mathcal{P}$(s), is the ^^set^^ of all subsets.

!!! Question
    Question : if $|S|=k$, then $|\mathcal{P}|=2^k$

    ^^Proof^^: 
    
    $$
    \begin{align*}
    \textbf{Binomial Theorem} \\
    (a + b)^n &= \sum_{k=0}^{n} \binom{n}{k} a^{n-k} b^k
    \end{align*}
    $$
### Mathematical Notation
^^Sum^^:$\sum_{i = m}^{n}f(i) = f(m) + f(m + 1) + \ldots + f(n)$ 

^^Product^^:$\prod_{i = m}^{n}f(i) = f(m)f(m + 1)\ldots f(n)$ 

^^Universal Quantifiers(全称量词)^^ : $\forall$

^^Existential Quantifiers^^: $\exists$


## Note 1 命题
### Propositional Logic(命题逻辑)
^^propositional^^ which is simply a statement which is either true or false

^^Conjunction(合取)^^: $P \land Q$. True only when both P and Q are true

^^Disjunction(析取)^^: $P \lor Q$. True when at least of P and Q is true

^^Negation(否定)^^: $\lnot P$. True when P is false. 

!!! info "law of excluded middle (排中律)"
    for any proposition $P$, either $P$ is true or $\lnot P$ is true(but not both)
    so $P\lor \lnot P$ always true

^^tautology(重言式)^^ A propositional form that is always true regardless of the truth values of tis variables.

^^implication(蕴含)^^ $P \implies Q$ "If P, then Q", the P is called the hypothesis(前提) , and Q is the conclusion(结论).
!!! note "The true table of implication"
    |$P$|$Q$|$P\implies Q$|$\lnot P \lor Q$|
    |---|---|--------------|----------------|
    |T|T|T|T|
    |T|F|F|F|
    |F|T|T|T|
    |F|F|T|T|

    Note: only when P is true and Q is false, the implication is false, neither implication always true.
    
    ^^Vacuously true(空真)^^, when hypothesis is false, but the implication is true.

^^logically equivalent(逻辑等式)^^ In every possible case (or model), P and Q have the same truth value.

^^if and only if(iff)^^ If $P\implies Q and Q\implies P$, then $P\iff Q$, Only when P and Q have the same truth values(both true or false)

^^Contrapositive(逆否命题)^^ $\lnot Q \implies \lnot P$

^^Converse(逆命题)^^ $Q\implies P$

!!! note
    propositional and its contrapositive have the same truth value, so they are logically equivalent $(P \implies Q) \equiv (\lnot Q\implies \not P)$
### Quantifies(量词)

Statement can have multiple quantifiers but quantifiers {++do not commute++}.

$(\forall x \in \mathbb{Z})(\exists y \in \mathbb{Z})(x < y)$

$(\exists y \in \mathbb{z})(\forall x \in \mathbb{Z})(x < y)$

the first statement says that, given an integer, I can find a larger one.

the second statement says that, exists an integer, for everyone integer, that is bigger than it, then, there is a largest integer!
### Much Ado About Negation
!!! info "De Morgan's Laws (德摩根律)"
    $\lnot (P\land Q)\equiv (\lnot P \lor \lnot Q)$

    $\lnot (P\lor Q)\equiv (\lnot P \land \lnot Q)$

    $\lnot (\forall x P(x)) \equiv \exists x \lnot P(x)$

    $\lnot (\exists x P(x)) \equiv \forall x \lnot P(x)$

## Note 2 证明

### Proofs
^^Proof(证明)^^: A proof is a finite sequence of steps, called logical deductions, which establishes the truth of a desired statement

^^axioms(公理) or postulates(基本假设)^^ that we accept without proof(as start to proof other)
### Notation and basic facts
$\mathbb{Z}=\{\ldots, -2, -1, 0, 1, 2, \ldots\}$, $\mathbb{Z}$ denote the set of integers.

$\mathbb{N}=\{0, 1, 2, \ldots\}$ $\mathbb{N}$ denote the natural numbers.

^^closed^^, the sum or product of two integers(natural numbers) also is integers(natural numbers)

$a \mid b$ denote a divides, iff there exists an integer q such that $b = aq$

$:=$ to indicate a definition
### Direct Proof(直接证明)
!!! note "Theorem 2.1"
    ^^Theorem 2.1^^

    $For\ any\ a,b,c\in\mathbb{Z},if\ a\mid b\ and\ a\mid c,\ then\ a\mid (b+c)$

    {++Equivalent to++}

    $Let\ P(x,y)\ denote\ x\mid y $
    
    $(\forall a,b,c\in\mathbb{Z}(P(a,b)\land P(a,c))\implies P(a,b+c))$

!!! success inline begin "Direct Proof"
    Goal: To prove $P\impliedby Q$

    $$
    \begin{align*}
    Approach: Assume P \\
                .\\
                .\\
                .\\
                Therefore Q
    \end{align*}
    $$        
For prove theorem 2.1, Assume is $a\mid b\ and\ a\mid c$, 

there exist integer $q_1,q_2,\ b = q_1a\ and\ c=q_2a$,

Then,$b+c=q_1a+q_2a=(q_1+q_2)a$ denote $q_1+q_2=q\in\mathbb{Z}$.

So,$b+c=qa\implies a\mid (b+c)$
<br>
<br>
<br>
<br>

!!! question "Direct proof"
    Try to use direct proof to prove $For\ any\ a,b,c\in\mathbb{Z},if\ a\mid b\ and\ a\mid c,\ then\ a\mid (b-c)$

    there exist integer $q_1,q_2,\ b = q_1a\ and\ c=q_2a$,

    Then,$b-c=q_1a-q_2a=(q_1-q_2)a$ denote $q_1-q_2=q\in\mathbb{Z}$.

    So,$b+c=qa\implies a\mid (b-c)$

!!! note "Theorem 2.2"
    ^^Theorem 2.2^^

    $Let\ 0 < n < 1000\ be\ an\ integer.If\ the\ sum\ of\ the digits\ of\ n\ is\ divisible\ by\ 9,\ then\ n\ is\ divisible\ by\ 9.$

    ^^Direct proof^^:

    $n=abc,i.e.,n=100a+10b+c$

    $\exists k\in\mathbb{Z},such\ that\ a+b+c=9k$

    $n=100a+10b+c=9k+99a+9b=9(k+11a+b),then,n\ is\ divisible\ by\ 9$

!!! note "Theorem 2.3"
    ^^Converse of Theorem 2.2^^

    Let 0 < n < 1000 be an integer. If n is divisible by 9, then the sum fo the digits of n is divisible by 9.

    ^^Direct proof^^

    $$
    \begin{align*}
    n \text{ is divisible by } 9 &\implies n=9l \text{ for } l\in\mathbb{Z} \\
    &\implies 100a+10b+c=9l \\
    &\implies a + b + c = 9l - 99a - 9b \\
    &\implies a + b + c = 9(l - 11a - b) \\
    &\implies a + b + c = 9k,\ \text{for } k=l-11a-b\in\mathbb{Z}
    \end{align*}
    $$

!!! tip "to prove equivalence"
    if $P\implies Q$ and $Q\implies P$ then $P\iff Q$
### Proof by Contraposition(使用逆否命题证明)
!!! success inline begin "Proof by Contraposition"
    Goal: To Prove $P\implies Q$.

    $$
    \begin{align*}
    \text{Approach:Assume} &\lnot Q \\
    & \ldots \\
    & \ldots \\
    & \ldots \\
    & \text{Therefore}\lnot P
    \end{align*}
    $$
    
    Conclusion:$\lnot Q\implies \lnot P$which is equivalent to $P\implies Q$
!!! note "Theorem 2.4"
    ^^Theorem 2.4^^ Let n be a positive integer and let d divide n, If n is odd then d is odd.

{++We proceed by contraposition.++}, Assume the d is even.

Then $d=2k,k\in\mathbb{Z}$, Because $d\mid n$, then $n=dl,for\ l\in\mathbb{Z}$

So,$n=dl=(2k)l=2(kl)$,then n is even.

<br>
!!! note "Theorem 2.5 Pigeonhole Principle(鸽巢原理)"
    ^^Pigeonhole Principle^^: Let n and k be positive integers. Place n objects into k boxes. If n > k, then at least one box must contain multiple objects.

    ^^Proof^^: If all boxes contain at most one object, then the number of objects is at most the number of boxes,i.e.,$n\leq k$

### Proof by Contradiction(反证法)
!!! success inline begin "Proof by Contradiction"
    Goal: To prove P.

    $$
    \begin{align*}
    \text{Approach: Assume} &\lnot P \\
    & \cdot \\
    & \cdot \\
    & \cdot \\
    & R \\
    & \cdot \\
    & \cdot \\
    & \cdot \\
    & \lnot R
    \end{align*}
    $$

    Conclusion:$\lnot P\implies \lnot R \land R,$
    
    which is a contradiction, Thus P
!!! note "Theorem 2.6"
    ^^Theorem 2.6^^ : There are infinitely many prime numbers.
    !!! note "Lemma 2.1"
        ^^Lemma 2.1^^ Every natural number greater than one is either prime or has a primer divisor.
    
^^Proof^^: by contradiction.

Suppose that Theorem 2.6 is false, then, that there are only finitely many primes, say k of them. Then we can enumerate them, such as:$p_1,p_2,\ldots,p_k$

then, we can define number $q:=q_1q_2\ldots q_3 + 1$, then q is not primers(as suppose). By lemma 2.1, we therefore conclude that q has a primer divisor, p.

Because $p_1,p_2,\ldots,p_k$ are all the primer, so p must be equal to one of them; thus, p divides $r:=p_1p_2\ldots p_k$,Hence, $p\mid q$ and $p\mid (q-r)$. but $q-r=1,\implies p\leq 1$, then p is not primer

### Exercises
!!! question "Exercise 1"
    Generalize the proof of Theorem 2.2 so that it works for any positive integer n. (Hint: Suppose n has k digits, and write $a_i$ for the digits of n, so that $n=\sum_{i=0}^{k-1}(a_i\cdot 10^i))

!!! Question "Exercise 2"
    Prove if $a^2$ is even, then $a$ is even (Hint: First try a direct proof. Then, try contraposition. Which proof approach is better suited to proving this lemma?)

## Note 3 归纳法

### Mathematical Induction

### Strengthening the Induction Hypothesis

### Simple Induction vs. Strong Induction

### Recursion, Programming and induction

### False proofs

### Practice Problems

## Note 4

### The Stable Matching Problem

### The Propose-and-Reject Algorithm

### The Residency Match

### Properties of the Propose-and-Reject Algorithm

### Optimality

### Further Reading (optional)