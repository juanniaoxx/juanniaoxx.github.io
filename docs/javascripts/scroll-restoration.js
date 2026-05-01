/**
 * ========================================
 * Core - 禁用浏览器滚动恢复
 * 防止刷新后自动滚动到之前位置
 * ========================================
 */

(function() {
    // 禁用浏览器自动恢复滚动位置
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    
    // 可选：每次页面加载时滚动到顶部
    window.addEventListener('load', () => {
        window.scrollTo(0, 0);
    });
})();