---
title: 西瓜书 第三章：线性模型
layout: post
date: 2025-06-10
description: 学习并推到西瓜书公式
tags: 机器学习
---
# Chapter 3 线性模型

​                                  

<div style="top: 10px; left: 10px; background: #f8f9fa; border-left: 4px solid #e74c3c; border-radius: 4px; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); ;">
  <div style="padding: 8px 12px; font-weight: bold; color: #e74c3c;">⚠️ 重要</div>
  <div style="padding: 8px 12px; padding-top: 0; color: #333;">线性模型的基本样式与向量形式</div>
</div>

$$
\begin{align*}
\text{基本形式} &: f(\textbf{x})=w_1x_1+w_2x_2+\dots+w_dx_d+b \\
\text{向量形式} &: f(\textbf{x})=\textbf{w}^{T}\textbf{x}+b
\end{align*}
$$

### 线性回归(Linear regression)

<div style="top: 10px; left: 10px; background: #f8f9fa; border-left: 4px solid #e74c3c; border-radius: 4px; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); ;">
  <div style="padding: 8px 12px; font-weight: bold; color: #e74c3c;">⚠️ 重要</div>
  <div style="padding: 8px 12px; padding-top: 0; color: #333;">线性回归的目的为试图学习一个线性模型以尽可能准确地预测实际值的输出</div>
</div>

$$
f(x_i)=wx_i+b\ \ 使得f(x_i)\approx y_i
$$

<div style="top: 10px; left: 10px; background: #f5f9fe; border-left: 4px solid #3498db; border-radius: 4px; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); ;">
  <div style="padding: 8px 12px; font-weight: bold; color: #3498db;">🧠 求解模型</div>
    <div style="padding: 8px 12px; padding-top: 0; color: #333;">基于均方误差最小化求解模型的方法称为最小二乘法</div>
</div>

$$
\begin{align*}
(w^*,b^*) &=\arg_{(w,b)}\min\sum_{i=1}^m(f(x_i)-y_i)^2 \\
 &=\arg_{(w,b)}\min\sum_{i=1}^m(y_i-wx_i-b)^2 \\
\end{align*}
$$

均方根误差的几何意义：**对应了常用的欧几里德距离** 

<div style="top: 10px; left: 10px; background: #f9f0ff; border-left: 4px solid #9b59b6; border-radius: 4px; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); ;">
  <div style="padding: 8px 12px; font-weight: bold; color: #9b59b6;">🔄 凸函数的差异</div>
  <div style="padding: 8px 12px; padding-top: 0; color: #333;">这本书采用的凸函数定义与同济定义的凸函数相反，x^2为凸函数而非凹函数</div>
</div>
**参数估计**:求解参数`w*`和`b*`使得$\sum_{i=1}^m(y_i - w x_i - b)^2$最小，其过程如下 


$$
\begin{align*}
\frac{\partial{E}_{(w,b)}}{\partial{w}}=2(w\sum_{i=1}^mx_i^2-\sum_{i=1}^m(y_i-b)x_i) \\
\frac{\partial{E}_{(w,b)}}{\partial{b}}=2(mb-\sum_{i=1}^m(y_i-wx_i))
\end{align*}
$$

<div style="top: 10px; left: 10px; background: #f8f9fa; border-left: 4px solid #e74c3c; border-radius: 4px; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); ;">
  <div style="padding: 8px 12px; font-weight: bold; color: #e74c3c;">⚠️ 重要</div>
  <div style="padding: 8px 12px; padding-top: 0; color: #333;">凸函数的局部最优解</div>
</div>
函数 $f: \mathbb{R}^n \to \mathbb{R}$是凸函数，如果对任意 $\mathbf{x}, \mathbf{y} \in \mathbb{R}^n $ 和 $ \theta \in [0, 1] $，满足：
$$
\begin{align*}
f(\theta \mathbf{x} + (1-\theta) \mathbf{y}) \leq \theta f(\mathbf{x}) + (1-\theta) f(\mathbf{y})
\end{align*}
$$
直观上，连接函数图像上任意两点的线段位于函数图像上方。

若$f$可微，则$f$是凸函数的充要条件是：
$$
\begin{align*}
f(\mathbf{y}) \geq f(\mathbf{x}) + \nabla f(\mathbf{x})^\top (\mathbf{y} - \mathbf{x}), \quad \forall \mathbf{x}, \mathbf{y}.
\end{align*}
$$


- **非凸函数**：梯度为零可能是鞍点或局部极值（如 $f(x) = x^3$ 在 $x=0$ 处）。
- **严格凸函数**：若 $f$ 严格凸，梯度为零的点是唯一的全局最小值。

基于上述理论，求解参数$w^*$和$b^*$只需要令上面的式子为零即可----> **最优解的闭式(closed-form)解**

先解关于`b`的式子 
$$
\begin{align*}
2(mb-\sum_{i=1}^m(y_i-wx_i))=0 \\
b^*=\frac{1}{m}\sum_{i=1}^m(y_i-wx_i)
\end{align*}
$$
在计算关于`w`的式子
$$
\begin{align*}
2(w\sum_{i=1}^mx_i^2-\sum_{i=1}^m(y_i-b)x_i)=0 \\
w\sum_{i=1}^mx_i^2=\sum_{i=1}^m(y_i-b)x_i \\
w=\frac{\sum_{i=1}^m(y_i-b)x_i}{\sum_{i=1}^mx_i^2} 
\end{align*}
$$
将上面求得的`b*`带入即可求出`w*`

**TO-DO-List 这里没推完**

