/**
 * 古籍竖屏阅读器
 * Ancient Book Reader for MkDocs-Material
 * 
 * 使用方法：
 * 1. 在 Markdown 文件中放置 <div id="ancient-reader-root"></div>
 * 2. 定义 window.ancientBookData 数据
 * 3. 调用 initAncientReader()
 */

(function() {
    // 默认数据集（可被 window.ancientBookData 覆盖）
    const defaultData = [
        { id: 1, title: "卷一", content: "<p>示例内容</p>" }
    ];

    let currentVolume = 1;
    let volumesData = [];
    let totalVolumes = 0;

    // DOM 元素引用
    let bookContentDiv = null;
    let volumeJumpDiv = null;
    let prevBtn = null;
    let nextBtn = null;
    let scrollContainer = null;  // 滚动容器引用

    /**
     * 渲染当前卷内容
     */
    function renderVolume(volId) {
        const volume = volumesData.find(v => v.id === volId);
        if (!volume) return;
        
        let contentHtml = `<div style="margin-bottom: 0.5rem; text-align: end; font-size: 0.9rem; color: #a07f60;">${escapeHtml(volume.title)}</div>`;
        contentHtml += volume.content;
        bookContentDiv.innerHTML = contentHtml;

        // 高亮当前卷按钮
        document.querySelectorAll('.volume-btn').forEach(btn => {
            const btnVol = parseInt(btn.getAttribute('data-vol'));
            if (btnVol === volId) {
                btn.classList.add('active-vol');
            } else {
                btn.classList.remove('active-vol');
            }
        });
        
        // 滚动到顶部（纵向）和最右侧（横向），竖排文本从右向左阅读
        if (scrollContainer) {
            scrollContainer.scrollTop = 0;
            // 使用 setTimeout 确保内容渲染完成后再设置滚动位置
            setTimeout(() => {
                scrollContainer.scrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
            }, 10);
        }
    }

    /**
     * 生成卷按钮
     */
    function buildVolumeButtons() {
        if (!volumeJumpDiv) return;
        volumeJumpDiv.innerHTML = '';
        volumesData.forEach(vol => {
            const btn = document.createElement('button');
            btn.textContent = `卷${vol.id}`;
            btn.classList.add('volume-btn');
            if (vol.id === currentVolume) btn.classList.add('active-vol');
            btn.setAttribute('data-vol', vol.id);
            btn.addEventListener('click', () => {
                currentVolume = vol.id;
                renderVolume(currentVolume);
            });
            volumeJumpDiv.appendChild(btn);
        });
    }

    function prevVolume() {
        if (currentVolume > 1) {
            currentVolume--;
            renderVolume(currentVolume);
        }
    }

    function nextVolume() {
        if (currentVolume < totalVolumes) {
            currentVolume++;
            renderVolume(currentVolume);
        }
    }

    /**
     * 简单的防XSS
     */
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    /**
     * 横向滚动移动（每次移动一定像素）
     * @param {number} direction - 1: 向右滚动, -1: 向左滚动
     * @param {number} step - 滚动步长（像素），默认 300
     */
    function scrollHorizontal(direction, step = 300) {
        if (!scrollContainer) return;
        const currentScroll = scrollContainer.scrollLeft;
        const targetScroll = currentScroll + (direction * step);
        scrollContainer.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });
    }

    /**
     * 绑定键盘和触摸事件
     */
    function bindEvents() {
        // 键盘左右键：横向滚动，不切换卷
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                scrollHorizontal(-1, 350);  // 向左滚动
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                scrollHorizontal(1, 350);   // 向右滚动
            }
        });

        // 触摸滑动：横向滚动，不切换卷
        let touchStartX = 0;
        let touchStartScrollLeft = 0;
        
        if (scrollContainer) {
            scrollContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                touchStartScrollLeft = scrollContainer.scrollLeft;
            }, { passive: true });
            
            scrollContainer.addEventListener('touchmove', (e) => {
                const touchCurrentX = e.changedTouches[0].screenX;
                const deltaX = touchCurrentX - touchStartX;
                scrollContainer.scrollLeft = touchStartScrollLeft - deltaX;
            });
        }

        // 按钮事件（切换卷）
        if (prevBtn) prevBtn.addEventListener('click', prevVolume);
        if (nextBtn) nextBtn.addEventListener('click', nextVolume);
    }

    /**
     * 初始化阅读器
     * @param {Object} options - 配置选项
     * @param {Array} options.data - 卷数据，格式: [{ id, title, content }]
     * @param {number} options.startVol - 起始卷号，默认1
     */
    function initAncientReader(options) {
        // 获取数据
        if (options && options.data && options.data.length > 0) {
            volumesData = options.data;
        } else if (window.ancientBookData && window.ancientBookData.length > 0) {
            volumesData = window.ancientBookData;
        } else {
            volumesData = defaultData;
        }
        
        totalVolumes = volumesData.length;
        
        if (options && options.startVol) {
            currentVolume = options.startVol;
        } else if (window.ancientBookStartVol) {
            currentVolume = window.ancientBookStartVol;
        } else {
            currentVolume = 1;
        }

        // 获取 DOM 元素
        bookContentDiv = document.getElementById('ancient-book-content');
        volumeJumpDiv = document.getElementById('volume-jump-buttons');
        prevBtn = document.getElementById('ancient-prev-btn');
        nextBtn = document.getElementById('ancient-next-btn');
        scrollContainer = document.querySelector('.ancient-book-container');

        if (!bookContentDiv) {
            console.error('Ancient Reader: 未找到 #ancient-book-content 元素');
            return;
        }

        // 构建 UI 并渲染
        buildVolumeButtons();
        renderVolume(currentVolume);
        bindEvents();
    }

    // 暴露全局方法
    window.initAncientReader = initAncientReader;
})();