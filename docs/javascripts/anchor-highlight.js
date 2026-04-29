// ==================== 锚点跳转短暂高亮 ====================
(function initAnchorHighlight() {
    // 配置项
    const CONFIG = {
        highlightDuration: 1200,      // 高亮持续时间(ms)
        highlightClass: 'anchor-highlight',
        animationName: 'highlightFlash',
        scrollOffset: 80,            // 滚动偏移量(px)，避免被顶部栏遮挡
        smoothScroll: true           // 是否平滑滚动
    };

    // 添加动画样式
    if (!document.querySelector('#anchor-highlight-style')) {
        const style = document.createElement('style');
        style.id = 'anchor-highlight-style';
        style.textContent = `
            @keyframes ${CONFIG.animationName} {
                0% {
                    background-color: rgba(255, 235, 59, 0.4);
                    box-shadow: 0 0 0 0 rgba(255, 235, 59, 0.6);
                }
                30% {
                    background-color: rgba(255, 235, 59, 0.7);
                    box-shadow: 0 0 0 8px rgba(255, 235, 59, 0.3);
                }
                70% {
                    background-color: rgba(255, 235, 59, 0.3);
                    box-shadow: 0 0 0 4px rgba(255, 235, 59, 0.1);
                }
                100% {
                    background-color: transparent;
                    box-shadow: none;
                }
            }
            
            .${CONFIG.highlightClass} {
                animation: ${CONFIG.animationName} ${CONFIG.highlightDuration}ms ease-out;
                border-radius: 4px;
            }
            
            /* 为可能被高亮的元素增加过渡效果 */
            .msg-memorial, .msg-edict, .msg-letter, p, li, blockquote {
                transition: background-color 0.2s ease;
            }
            
            /* 滚动时的偏移补偿 */
            :target {
                scroll-margin-top: ${CONFIG.scrollOffset}px;
            }
        `;
        document.head.appendChild(style);
    }

    // 短暂高亮目标元素
    let activeTimeout = null;
    
    function highlightElement(element) {
        if (!element) return;
        
        // 清除之前的定时器
        if (activeTimeout) {
            clearTimeout(activeTimeout);
        }
        
        // 移除现有的高亮类
        element.classList.remove(CONFIG.highlightClass);
        
        // 强制重绘，确保动画能重新触发
        void element.offsetHeight;
        
        // 添加高亮类，触发动画
        element.classList.add(CONFIG.highlightClass);
        
        // 定时移除高亮类
        activeTimeout = setTimeout(() => {
            element.classList.remove(CONFIG.highlightClass);
            activeTimeout = null;
        }, CONFIG.highlightDuration);
    }

    // 滚动到目标元素（考虑顶部栏遮挡）
    function scrollToElement(element) {
        if (!element) return;
        
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - CONFIG.scrollOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: CONFIG.smoothScroll ? 'smooth' : 'auto'
        });
    }

    // 处理 URL 中的锚点跳转
    function handleHashChange() {
        const hash = window.location.hash;
        
        if (!hash || hash === '#') {
            return;
        }
        
        // 解码 URL 编码的 ID（支持中文）
        let targetId;
        try {
            targetId = decodeURIComponent(hash.substring(1));
        } catch(e) {
            targetId = hash.substring(1);
        }
        
        // 查找目标元素
        let targetElement = document.getElementById(targetId);
        
        // 如果没找到，尝试查找 name 属性（兼容旧式锚点）
        if (!targetElement) {
            targetElement = document.querySelector(`[name="${targetId}"]`);
        }
        
        if (targetElement) {
            // 延迟一点执行，确保页面布局稳定
            setTimeout(() => {
                scrollToElement(targetElement);
                highlightElement(targetElement);
            }, 100);
        }
    }

    // 监听 hash 变化
    window.addEventListener('hashchange', function() {
        handleHashChange();
    });
    
    // 页面加载时处理
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', handleHashChange);
    } else {
        handleHashChange();
    }
    
    // 监听 MkDocs 的页面切换事件（Material 主题的即时加载）
    // 当通过左侧导航切换页面时，需要重新处理锚点
    const observer = new MutationObserver(function(mutations) {
        // 检查页面内容是否变化
        const article = document.querySelector('.md-content__inner');
        if (article && mutations.some(m => m.target === article || article.contains(m.target))) {
            // 页面内容变化后，重新检查锚点
            setTimeout(handleHashChange, 150);
        }
    });
    
    // 等待页面主要内容区域加载完成
    setTimeout(() => {
        const article = document.querySelector('.md-content__inner');
        if (article) {
            observer.observe(article, { childList: true, subtree: true });
        }
    }, 500);
    
    // 导出功能，供其他脚本使用（可选）
    window.anchorHighlight = {
        highlight: highlightElement,
        scrollTo: scrollToElement,
        handleHash: handleHashChange,
        config: CONFIG
    };
})();