(function() {
    // 仅在有诗词容器的页面初始化
    const hasPoem = document.querySelector('.poem-container');
    const hasShi = document.querySelector('.shi-container');
    if (!hasPoem && !hasShi) {
        return;
    }

    // 等待 DOM 和样式就绪
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

    function initAll() {
        // 初始化词牌导航侧边栏
        const nav = new CipaiNav({
            panelId: 'cipai-nav-panel',
            containerSelector: '.poem-container, .shi-container',
            titleSelector: '.poem-title',
        });
        nav.init();

        // 初始化搜索
        const search = new CipaiSearch({
            containerSelector: '.poem-container, .shi-container',
            titleSelector: '.poem-title',
        });

        // 暴露实例以便外部调用
        window.__cipaiNav = nav;
        window.__cipaiSearch = search;
    }
})();