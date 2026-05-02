/**
 * ========================================
 * 词牌导航侧边栏（方案三）
 * 依赖：poetry.css 中的 .poem-container .poem-title
 * ========================================
 */

class CipaiNav {
    constructor(options = {}) {
        this.panelId = options.panelId || 'cipai-nav-panel';
        this.containerSelector = options.containerSelector || '.poem-container';
        this.titleSelector = options.titleSelector || '.poem-title';
        this.scrollOffset = options.scrollOffset || 80;
        this.poemMap = new Map();    // 词牌名 → [{title, element, id}]
        this.currentActive = null;
        this.isMobileOpen = false;
        this.panel = null;
        this.toggleBtn = null;
    }

    /**
     * 初始化：解析页面、创建面板、绑定事件
     */
    init() {
        this._parsePoems();
        if (this.poemMap.size === 0) return;
        this._createPanel();
        this._createToggleButton();
        this._bindEvents();
        this._attachScrollSpy();
    }

    /**
     * 解析页面上所有诗词，按词牌分组
     */
    _parsePoems() {
        const containers = document.querySelectorAll(this.containerSelector);
        containers.forEach((container, index) => {
            const titleEl = container.querySelector(this.titleSelector);
            if (!titleEl) return;

            const fullTitle = titleEl.textContent.trim();
            // 提取词牌名（取 · 或 — 或空格之前的部分）
            const cipai = this._extractCipai(fullTitle);
            if (!cipai) return;

            // 确保每个诗词容器有唯一 id
            let poemId = container.id;
            if (!poemId) {
                poemId = `poem-${index}-${this._slugify(fullTitle)}`;
                container.id = poemId;
            }

            const poemData = {
                title: fullTitle,
                cipai: cipai,
                element: container,
                id: poemId,
            };

            if (!this.poemMap.has(cipai)) {
                this.poemMap.set(cipai, []);
            }
            this.poemMap.get(cipai).push(poemData);
        });

        // 按词牌名排序（也可按词作数量降序）
        this.sortedCipai = [...this.poemMap.keys()].sort((a, b) => {
            // 可按拼音排序，这里用简单的 localeCompare
            return a.localeCompare(b, 'zh-Hans-CN');
        });
    }

    /**
     * 从完整标题中提取词牌名
     * "水龙吟·次韵章质夫杨花词" → "水龙吟"
     * "水调歌头·丙辰中秋..." → "水调歌头"
     * "江神子/江城子" → "江神子"
     */
    _extractCipai(title) {
        // 去掉副标题：按 · 或 — 分割
        let cipai = title.split(/[·—–\-]/)[0].trim();
        // 处理斜杠别名，取第一个
        cipai = cipai.split('/')[0].trim();
        return cipai;
    }

    _slugify(text) {
        return text.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    }

    /**
     * 创建侧边栏面板
     */
    _createPanel() {
        this.panel = document.createElement('div');
        this.panel.id = this.panelId;
        this.panel.className = 'cipai-nav-panel';
        this.panel.setAttribute('role', 'navigation');
        this.panel.setAttribute('aria-label', '词牌导航');

        // 标题
        const header = document.createElement('div');
        header.className = 'cipai-nav-header';
        // 检测页面是否同时包含诗和词
        const hasShi = document.querySelectorAll('.shi-container').length > 0;
        const hasCi = document.querySelectorAll('.poem-container').length > 0;
        if (hasShi && hasCi) {
            header.textContent = '📜 篇目一览';
        } else if (hasShi) {
            header.textContent = '📜 诗体一览';
        } else {
            header.textContent = '📜 词牌一览';
        }
        this.panel.appendChild(header);

        // 列表
        const list = document.createElement('div');
        list.className = 'cipai-nav-list';
        list.id = 'cipai-nav-list';

        this.sortedCipai.forEach(cipai => {
            const poems = this.poemMap.get(cipai);
            const item = this._createNavItem(cipai, poems);
            list.appendChild(item);
        });

        this.panel.appendChild(list);

        // 底部搜索按钮
        const footer = document.createElement('div');
        footer.className = 'cipai-nav-footer';
        const searchBtn = document.createElement('button');
        searchBtn.className = 'cipai-nav-search-btn';
        if (hasShi && hasCi) {
            searchBtn.textContent = '🔍 搜索作品';
        } else if (hasShi) {
            searchBtn.textContent = '🔍 搜索诗作';
        } else {
            searchBtn.textContent = '🔍 搜索词作';
        }
        searchBtn.addEventListener('click', () => this._openSearch());
        footer.appendChild(searchBtn);
        this.panel.appendChild(footer);
        // 鼠标悬停标记
        this.isHovering = false;
        this.panel.addEventListener('mouseenter', () => {
            this.isHovering = true;
            this.panel.classList.add('hovering');
        });
        this.panel.addEventListener('mouseleave', () => {
            this.isHovering = false;
            this.panel.classList.remove('hovering');
        });
        document.body.appendChild(this.panel);
    }

    /**
     * 创建单个词牌导航项
     */
    _createNavItem(cipai, poems) {
        const item = document.createElement('div');
        item.className = 'cipai-nav-item';
        item.setAttribute('data-cipai', cipai);

        const nameSpan = document.createElement('span');
        nameSpan.className = 'cipai-name';
        nameSpan.textContent = cipai;
        item.appendChild(nameSpan);

        const countSpan = document.createElement('span');
        countSpan.className = 'cipai-count';
        countSpan.textContent = poems.length;
        item.appendChild(countSpan);

        // 点击跳转到该词牌第一首
        item.addEventListener('click', () => {
            this._scrollToPoem(poems[0]);
            // 如果有子词作列表，可以在这里展开/收起
        });

        return item;
    }

    /**
     * 创建移动端折叠按钮
     */
    _createToggleButton() {
        this.toggleBtn = document.createElement('button');
        this.toggleBtn.className = 'cipai-nav-toggle';
        this.toggleBtn.innerHTML = '☰';
        this.toggleBtn.setAttribute('aria-label', '词牌导航');
        this.toggleBtn.addEventListener('click', () => this._toggleMobile());
        document.body.appendChild(this.toggleBtn);
    }

    _toggleMobile() {
        this.isMobileOpen = !this.isMobileOpen;
        if (this.isMobileOpen) {
            this.panel.classList.add('mobile-open');
        } else {
            this.panel.classList.remove('mobile-open');
        }
    }

    /**
     * 绑定全局事件
     */
    _bindEvents() {
        // 点击页面其他区域关闭移动端面板
        document.addEventListener('click', (e) => {
            if (this.isMobileOpen &&
                !this.panel.contains(e.target) &&
                !this.toggleBtn.contains(e.target)) {
                this._toggleMobile();
            }
        });

        // 键盘快捷键 Ctrl/Cmd+K 打开搜索
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this._openSearch();
            }
        });
    }

    /**
     * 滚动到指定词作
     */
    _scrollToPoem(poemData) {
        const element = poemData.element;
        const top = element.getBoundingClientRect().top + window.pageYOffset - this.scrollOffset;
        window.scrollTo({ top, behavior: 'smooth' });
    }

    /**
     * 滚动监听：高亮当前浏览位置对应的词牌
     */
    _attachScrollSpy() {
        const options = {
            rootMargin: `-${this.scrollOffset}px 0px -50% 0px`,
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const titleEl = entry.target.querySelector(this.titleSelector);
                    if (titleEl) {
                        const cipai = this._extractCipai(titleEl.textContent.trim());
                        this._setActive(cipai);
                    }
                }
            });
        }, options);

        this.sortedCipai.forEach(cipai => {
            const poems = this.poemMap.get(cipai);
            if (poems.length > 0) {
                observer.observe(poems[0].element);
            }
        });
    }

    _setActive(cipai) {
        if (this.currentActive === cipai) return;
        const prev = this.panel.querySelector('.cipai-nav-item.active');
        if (prev) prev.classList.remove('active');
        const next = this.panel.querySelector(`[data-cipai="${cipai}"]`);
        if (next) {
            next.classList.add('active');
            // 仅在鼠标悬停在面板上时才自动滚动
            if (this.isHovering) {
                next.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
        this.currentActive = cipai;
    }

    /**
     * 打开搜索（触发 cipai-search.js 的搜索浮层）
     */
    _openSearch() {
        // 通过自定义事件与搜索模块通信
        const event = new CustomEvent('cipai:openSearch', {
            detail: { poemMap: this.poemMap }
        });
        document.dispatchEvent(event);
    }

    /**
     * 销毁
     */
    destroy() {
        if (this.panel) this.panel.remove();
        if (this.toggleBtn) this.toggleBtn.remove();
    }
}

// 挂载到全局
window.CipaiNav = CipaiNav;