/**
 * 滚动阅读进度条组件
 * 用于 MkDocs Material 主题
 */

(function () {
    'use strict';

    // 配置选项
    const config = {
        autoHideDelay: 1500,      // 浮标自动隐藏延迟(ms)
        showPageTitle: true,      // 是否在页面标题显示进度
        smoothJump: true,         // 点击跳转是否平滑滚动
        topOffset: 0              // 顶部偏移量，会自动检测 Material 主题的 header
    };

    // 获取元素
    let elements = {
        container: null,
        bar: null,
        marker: null,
        tooltip: null
    };

    let scrollTimeout = null;

    // 创建组件 DOM 结构
    function createDOM() {
        if (document.querySelector('.scroll-progress-container')) {
            return;
        }

        const container = document.createElement('div');
        container.className = 'scroll-progress-container';
        container.innerHTML = `
      <div class="scroll-progress-bar"></div>
      <div class="scroll-progress-marker">
        <div class="scroll-progress-marker-inner">
          <span class="scroll-progress-icon">📖</span>
        </div>
        <span class="scroll-progress-tooltip">0%</span>
      </div>
    `;

        document.body.insertAdjacentElement('afterbegin', container);
    }

    // 获取元素引用
    function cacheElements() {
        elements.container = document.querySelector('.scroll-progress-container');
        elements.bar = document.querySelector('.scroll-progress-bar');
        elements.marker = document.querySelector('.scroll-progress-marker');
        elements.tooltip = document.querySelector('.scroll-progress-tooltip');
    }

    // 获取滚动进度百分比
    function getScrollPercent() {
        const winScroll = window.pageYOffset || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        if (height <= 0) return 0;
        return Math.min(100, Math.max(0, Math.round((winScroll / height) * 100)));
    }

    // 更新进度显示
    function updateProgress() {
        const percent = getScrollPercent();

        // 更新进度条宽度
        if (elements.bar) {
            elements.bar.style.width = percent + '%';
        }

        // 更新浮标位置
        if (elements.marker) {
            elements.marker.style.left = percent + '%';
            elements.marker.classList.add('visible');

            // 自动隐藏
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (elements.marker) {
                    elements.marker.classList.remove('visible');
                }
            }, config.autoHideDelay);
        }

        // 更新气泡文字
        if (elements.tooltip) {
            elements.tooltip.textContent = percent + '%';
        }

        // 更新页面标题
        if (config.showPageTitle && percent > 0 && percent < 100) {
            const originalTitle = document.title.replace(/^\(\d+%\)\s/, '').replace(/^\(✓\s?读完\)\s/, '');
            if (!document.title.startsWith(`(${percent}%)`)) {
                document.title = `(${percent}%) ${originalTitle}`;
            }
        } else if (config.showPageTitle && percent === 100) {
            const originalTitle = document.title.replace(/^\(\d+%\)\s/, '').replace(/^\(✓\s?读完\)\s/, '');
            if (!document.title.startsWith('(✓ 读完)')) {
                document.title = `(✓ 读完) ${originalTitle}`;
            }
        } else if (config.showPageTitle && percent === 0) {
            const originalTitle = document.title.replace(/^\(\d+%\)\s/, '').replace(/^\(✓\s?读完\)\s/, '');
            if (document.title !== originalTitle) {
                document.title = originalTitle;
            }
        }

        return percent;
    }

    // 获取滚动位置对应的像素值
    function getScrollPosition(percent) {
        const height = document.documentElement.scrollHeight - window.innerHeight;
        return height * (percent / 100);
    }

    // 获取 Material 主题 header 的高度
    function getHeaderOffset() {
        const header = document.querySelector('.md-header');
        if (header) {
            return header.offsetHeight;
        }
        return config.topOffset;
    }

    // 点击跳转
    function bindClickJump() {
        if (!elements.container) return;

        elements.container.addEventListener('click', (e) => {
            // 避免点到浮标时重复触发
            const rect = elements.container.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            let percent = Math.min(100, Math.max(0, (clickX / rect.width) * 100));

            // 如果点击非常接近边缘，微调边界值
            if (clickX < 5) percent = 0;
            if (clickX > rect.width - 5) percent = 100;

            const scrollTop = getScrollPosition(percent);
            const offset = getHeaderOffset();
            const targetTop = Math.max(0, scrollTop - offset);

            if (config.smoothJump) {
                window.scrollTo({
                    top: targetTop,
                    behavior: 'smooth'
                });
            } else {
                window.scrollTo(0, targetTop);
            }
        });
    }

    // 绑定滚动事件（使用 RAF 优化）
    function bindScrollEvent() {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateProgress();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // 绑定窗口大小变化事件
    function bindResizeEvent() {
        window.addEventListener('resize', () => {
            updateProgress();
        });
    }

    // 初始化
    function init() {
        // 确保 DOM 已加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setup();
            });
        } else {
            setup();
        }
    }

    function setup() {
        createDOM();
        cacheElements();
        bindScrollEvent();
        bindResizeEvent();
        bindClickJump();
        updateProgress();
    }

    // 启动
    init();
})();