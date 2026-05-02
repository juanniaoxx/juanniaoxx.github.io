---
tags: [史记-笔记]
title: 五帝本纪
hide:
  - toc
  - navigation
---
<!-- 古籍阅读器短代码模板 -->
<div class="ancient-reader">
    <div class="ancient-toolbar">
        <div class="volume-controls">
            <button class="nav-btn" id="ancient-prev-btn"> ◀ 上一卷 </button>
            <div class="volume-jump" id="volume-jump-buttons"></div>
            <button class="nav-btn" id="ancient-next-btn"> 下一卷 ▶ </button>
        </div>
    </div>

    <div class="ancient-book-container">
        <div class="vertical-text" id="ancient-book-content"></div>
    </div>

    <div class="ancient-footer">
        <div>《史记·五帝本纪》</div>
    </div>
</div>

<!-- 绝对路径引入 -->
<script src="/javascripts/原文数据/史记/1.js"></script>

<script>
window.ancientBookData = window.wudibenjiData;
window.ancientBookStartVol = 1;

document.addEventListener('DOMContentLoaded', function() {
    if (typeof initAncientReader === 'function') {
        initAncientReader();
    }
});
</script>

三家注见: [五帝本纪原文(三家注)](../../1-史记/1-五帝本纪.md) 


