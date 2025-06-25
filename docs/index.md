---
hide:
  #- navigation # 显示右
  #- toc #显示左
  - footer
  - feedback
comments: false
                                   
---
<div class="grid cards" markdown>

-   :material-notebook-edit-outline:{ .lg .middle } __导航栏__

    ---
    ![image](./CS/images/Wery%20Bird.png){ class="responsive-image" align=right width="230" height="300" style="border-radius: 25px;" }

    
    - [x] 基于{~~~>Material for MkDocs~~}美化
    - [x] 如遇页面卡顿，请使用{--科学上网--}
    - [x] 𝕙𝕒𝕧𝕖 𝕒 𝕘𝕠𝕠𝕕 𝕥𝕚𝕞𝕖 !  
      === "Mac/PC端"

        请在上方标签选择分类/左侧目录选择文章

    === "移动端"

        请点击左上角图标选择分类和文章
    

</div>
<style>
    @media only screen and (max-width: 768px) {
        .responsive-image {
            display: none;
        }
    }
</style>

<!-- 如遇到网页卡顿的情况，请使用<strong><a href="https://www.yuque.com/wcowin/mkdocs-wcowin?# 《Mkdocs-Wcowin中文教程》" target="_blank">Mkdocs-Wcowin中文教程(语雀)</a></strong> -->

<style>
.md-grid {
  max-width: 1220px;
}
</style>





[^Knowing-that-loving-you-has-no-ending]:人生长恨水长东
[^see-how-much-I-love-you]:All-problems-in-computer-science-can-be-solved-by-another-level-of-indirection



<!-- <script src="//code.tidio.co/6jmawe9m5wy4ahvlhub2riyrnujz7xxi.js" async></script> -->


<style>
body {
  position: relative; /* 确保 body 元素的 position 属性为非静态值 */
}

body::before {
  --size: 35px; /* 调整网格单元大小 */
  --line: color-mix(in hsl, canvasText, transparent 80%); /* 调整线条透明度 */
  content: '';
  height: 100vh;
  width: 100%;
  position: absolute; /* 修改为 absolute 以使其随页面滚动 */
  background: linear-gradient(
        90deg,
        var(--line) 1px,
        transparent 1px var(--size)
      )
      50% 50% / var(--size) var(--size),
    linear-gradient(var(--line) 1px, transparent 1px var(--size)) 50% 50% /
      var(--size) var(--size);
  -webkit-mask: linear-gradient(-20deg, transparent 50%, white);
          mask: linear-gradient(-20deg, transparent 50%, white);
  top: 0;
  transform-style: flat;
  pointer-events: none;
  z-index: -1;
}

@media (max-width: 768px) {
  body::before {
    display: none; /* 在手机端隐藏网格效果 */
  }
}
</style>