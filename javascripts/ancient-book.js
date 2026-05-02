/**
 * 古籍竖屏阅读器
 * Ancient Book Reader for MkDocs-Material
 * 
 * 使用方法：
 * 1. 在 Markdown 文件中放置 <div id="ancient-reader-root"></div>
 * 2. 定义 window.ancientBookData 数据
 * 3. 调用 initAncientReader()
 */

(function () {
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
    let currentFontStyle = 'traditional'; // 'traditional' | 'simplified'
    let openccConverter = null;
    let switchBtn = null;

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
            setTimeout(() => {
                scrollContainer.scrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
            }, 10);
        }

        // 每次换卷时自动检测原文语言并重置按钮状态
        const allText = bookContentDiv.textContent;
        currentFontStyle = detectFontStyle(allText);
        if (switchBtn) {
            switchBtn.textContent = currentFontStyle === 'traditional' ? '简' : '繁';
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
            // 优先使用 title，如果没有 title 则降级为 "卷X"
            btn.textContent = vol.title || `卷${vol.id}`;
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
        return str.replace(/[&<>]/g, function (m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    /**
     * 检测文本是简体还是繁体
     * 返回 'simplified' | 'traditional'
     */
    function detectFontStyle(text) {
        // 繁体特征字：這些字只在繁体中出現，簡体中不會有
        const traditionalChars = /[爲茲於無來處體氣與東門萬飛書時長後為]|[\u3100-\u312F\u31A0-\u31BF]/;;
        // 简体特征字：這些字只在簡体中出現，繁体中不會有
        const simplifiedChars = /[为兹于无来处体气与东门万飞书时长后]|[\u4E00-\u9FFF]/;
        
        let tradCount = 0;
        let simpCount = 0;
        
        // 统计繁简特征字出现次数
        for (const char of text) {
            if (/[爲茲於無來處體氣與東門萬飛書時長後開關見]/.test(char)) tradCount++;
            if (/[为兹于无来处体气与东门万飞书时长后开关见]/.test(char)) simpCount++;
        }
        
        return tradCount > simpCount ? 'traditional' : 'simplified';
    }

    /**
     * 简繁切换
     */
    async function toggleFontStyle() {
        if (!window.OpenCC) return;
        
        // 获取当前实际显示的语言
        const currentDisplay = currentFontStyle;
        const targetDisplay = currentDisplay === 'traditional' ? 'simplified' : 'traditional';
        
        // 创建对应方向的转换器
        const converter = currentDisplay === 'traditional'
            ? window.OpenCC.Converter({ from: 't', to: 'cn' })  // 繁→简
            : window.OpenCC.Converter({ from: 'cn', to: 't' }); // 简→繁
        
        const paragraphs = bookContentDiv.querySelectorAll('p');
        for (const p of paragraphs) {
            // 首次转换时保存当前内容作为原始状态
            if (!p.getAttribute('data-original')) {
                p.setAttribute('data-original', p.innerHTML);
            }
            await replaceTextNodes(p, converter);
        }
        
        // 更新状态
        currentFontStyle = targetDisplay;
        switchBtn.textContent = targetDisplay === 'simplified' ? '繁' : '简';
    }

    /**
     * 替换元素中的文本内容（逐文本节点替换，保留 HTML 标签）
     */
    async function replaceTextNodes(element, converter) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (node) {
                    // 跳过注音注释内的文本节点
                    if (node.parentElement && node.parentElement.classList.contains('comment-inline')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // 跳过空白节点
                    if (!node.textContent.trim()) {
                        return NodeFilter.FILTER_SKIP;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const textNodes = [];
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        for (let i = 0; i < textNodes.length; i++) {
            const node = textNodes[i];
            const originalText = node.textContent;
            const convertedText = await converter(originalText);
            if (convertedText !== originalText) {
                node.textContent = convertedText;
            }
        }
    }

    /**
     * 横向滚动移动
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

        // 初始化 OpenCC 简繁转换器
        if (window.OpenCC) {
            openccConverter = window.OpenCC.Converter({ from: 't', to: 'cn' });
        }

        // 创建简繁切换按钮的固定容器（不参与横向滚动）
        const container = document.querySelector('.ancient-book-container');
        if (container) {
            // 创建按钮包裹层
            const btnWrapper = document.createElement('div');
            btnWrapper.className = 'font-switch-wrapper';
            // 创建按钮
            switchBtn = document.createElement('button');
            switchBtn.textContent = '简';
            switchBtn.className = 'font-switch-btn';
            switchBtn.setAttribute('title', '切换简繁体');
            switchBtn.addEventListener('click', toggleFontStyle);
            btnWrapper.appendChild(switchBtn);
            // 插入到容器中，但独立于滚动内容
            container.style.position = 'relative';
            container.appendChild(btnWrapper);

            // 动态计算按钮位置，使其始终在阅读框可视区域右上角
            function updateBtnPosition() {
                const containerRect = container.getBoundingClientRect();
                const top = containerRect.top + 12;
                const right = window.innerWidth - containerRect.right + 12;
                btnWrapper.style.top = top + 'px';
                btnWrapper.style.right = right + 'px';
            }

            // 初始定位
            updateBtnPosition();

            // 滚动和窗口大小变化时重新定位
            window.addEventListener('scroll', updateBtnPosition, { passive: true });
            window.addEventListener('resize', updateBtnPosition);
        }

        // 构建 UI 并渲染
        buildVolumeButtons();
        renderVolume(currentVolume);
        bindEvents();
    }

    // 暴露全局方法
    window.initAncientReader = initAncientReader;
})();