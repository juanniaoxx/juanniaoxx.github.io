/**
 * ========================================
 * 词牌搜索过滤（方案四）
 * 支持：词牌名、标题、词句内容搜索
 * 通过自定义事件 cipai:openSearch 触发
 * ========================================
 */

class CipaiSearch {
    // 标签关键词词典
    static tagKeywords = {
        '怀古': ['怀古', '赤壁', '故垒', '故国', '风流人物', '千古', '兴亡', '金陵', '六朝', '乌衣巷', '英雄', '当年'],
        '中秋': ['中秋', '明月', '月', '婵娟', '银汉', '玉盘', '琼楼', '广寒', '桂魄'],
        '送别': ['送', '别', '赠', '寄', '离', '归去', '留别', '送别', '离别', '阳关'],
        '悼亡': ['十年生死', '孤坟', '断肠', '亡妻', '魂', '泪千行', '尘满面', '鬓如霜'],
        '春景': ['春', '花', '柳', '燕', '莺', '东风', '芳草', '桃', '杏', '清明', '杨花'],
        '田园': ['村', '田', '农', '渔父', '溪', '山', '野', '耕', '钓', '蓑', '柴门', '陇', '麦'],
        '咏物': ['杨花', '梅花', '荷花', '橘', '荔枝', '琵琶', '琴', '扇', '茶', '雪', '柳'],
        '感怀': ['感慨', '叹', '悲', '愁', '恨', '寂寞', '凄凉', '惆怅', '潦倒', '身世', '人生'],
        '豪放': ['大江', '浪淘', '千骑', '射天狼', '醉', '狂', '浩', '万里', '老夫', '谈笑'],
        '婉约': ['泪', '愁', '思', '梦', '柔肠', '帘', '窗', '夜', '孤', '寂', '寒', '幽'],
    };

    constructor(options = {}) {
        this.containerSelector = options.containerSelector || '.poem-container';
        this.titleSelector = options.titleSelector || '.poem-title';
        this.poemContainers = [];
        this.dialog = null;
        this.input = null;
        this.resultsContainer = null;
        this.currentTag = null;
        this.allPoemsData = [];
        this._buildIndex();
        this._listenForOpen();
    }

    /**
     * 预建索引：每首词的标题、词牌、内容文本
     */
    _buildIndex() {
        const containers = document.querySelectorAll(this.containerSelector);
        this.poemContainers = Array.from(containers);
        this.allPoemsData = this.poemContainers.map((container, index) => {
            const titleEl = container.querySelector(this.titleSelector);
            const title = titleEl ? titleEl.textContent.trim() : '';
            const cipai = title.split(/[·—–\-]/)[0].trim().split('/')[0].trim();
            const fullText = container.textContent.trim();
            return {
                index,
                title,
                cipai,
                fullText,
                element: container,
                id: container.id || `poem-${index}`,
            };
        });
    }

    _listenForOpen() {
        document.addEventListener('cipai:openSearch', () => this.open());
    }

    /**
     * 打开搜索浮层
     */
    open() {
        if (this.dialog) {
            this.dialog.style.display = '';
            this.input.value = '';
            this.currentTag = null;
            // 清除标签选中状态
            const tags = this.dialog.querySelectorAll('.cipai-search-tag');
            tags.forEach(t => t.classList.remove('active'));
            this._doSearch();
            this.input.focus();
            return;
        }
        this._createDialog();
    }

    /**
     * 关闭搜索浮层
     */
    close() {
        if (this.dialog) {
            this.dialog.style.display = 'none';
        }
    }

    /**
     * 创建搜索弹窗
     */
    _createDialog() {
        // 遮罩
        const overlay = document.createElement('div');
        overlay.className = 'cipai-search-overlay';
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.close();
        });

        // 弹窗
        const dialog = document.createElement('div');
        dialog.className = 'cipai-search-dialog';
        dialog.addEventListener('click', (e) => e.stopPropagation());

        // 搜索输入区
        const inputWrap = document.createElement('div');
        inputWrap.className = 'cipai-search-input-wrap';
        inputWrap.innerHTML = `<svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;

        this.input = document.createElement('input');
        this.input.className = 'cipai-search-input';
        this.input.type = 'text';
        const hasShi2 = document.querySelectorAll('.shi-container').length > 0;
        const hasCi2 = document.querySelectorAll('.poem-container').length > 0;
        if (hasShi2 && hasCi2) {
            this.input.placeholder = '搜索诗体、词牌、标题或诗句…';
        } else if (hasShi2) {
            this.input.placeholder = '搜索诗体、标题或诗句…';
        } else {
            this.input.placeholder = '搜索词牌、标题或词句…';
        }
        this.input.addEventListener('input', () => this._doSearch());
        inputWrap.appendChild(this.input);

        const clearBtn = document.createElement('button');
        clearBtn.className = 'cipai-search-clear';
        clearBtn.innerHTML = '×';
        clearBtn.addEventListener('click', () => {
            this.input.value = '';
            this._doSearch();
            this.input.focus();
        });
        inputWrap.appendChild(clearBtn);

        dialog.appendChild(inputWrap);

        // 快速筛选标签
        const tagsWrap = document.createElement('div');
        tagsWrap.className = 'cipai-search-tags';

        Object.keys(CipaiSearch.tagKeywords).forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'cipai-search-tag';
            tagEl.textContent = tag;
            tagEl.addEventListener('click', () => {
                if (this.currentTag === tag) {
                    // 再次点击取消筛选
                    this.currentTag = null;
                    tagEl.classList.remove('active');
                } else {
                    this.currentTag = tag;
                    tagsWrap.querySelectorAll('.cipai-search-tag').forEach(t => t.classList.remove('active'));
                    tagEl.classList.add('active');
                }
                this._doSearch();
            });
            tagsWrap.appendChild(tagEl);
        });
        dialog.appendChild(tagsWrap);

        // 结果区域
        this.resultsContainer = document.createElement('div');
        this.resultsContainer.className = 'cipai-search-results';
        dialog.appendChild(this.resultsContainer);

        // 快捷键提示
        const hint = document.createElement('div');
        hint.className = 'cipai-search-hint';
        hint.textContent = 'Esc 关闭 · ↑↓ 选择 · Enter 跳转 · 点击标签筛选';
        dialog.appendChild(hint);

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        this.dialog = overlay;

        // 键盘事件
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this._focusNextResult();
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                this._focusPrevResult();
            }
        });

        // 初始显示全部
        this.input.focus();
        this._doSearch();
    }

    /**
     * 执行搜索
     */
    _doSearch() {
        const query = this.input.value.trim();
        let results = this.allPoemsData;

        // 文本过滤
        if (query) {
            results = results.filter(data =>
                data.title.includes(query) ||
                data.cipai.includes(query) ||
                data.fullText.includes(query)
            );
        }

        // 标签过滤
        if (this.currentTag && CipaiSearch.tagKeywords[this.currentTag]) {
            const keywords = CipaiSearch.tagKeywords[this.currentTag];
            results = results.filter(data =>
                keywords.some(keyword => data.fullText.includes(keyword))
            );
        }

        this._renderResults(results, query);
    }

    /**
     * 渲染搜索结果
     */
    _renderResults(results, query) {
        this.resultsContainer.innerHTML = '';

        // 结果计数
        const count = document.createElement('div');
        count.className = 'cipai-search-count';
        const hasShi3 = document.querySelectorAll('.shi-container').length > 0;
        const hasCi3 = document.querySelectorAll('.poem-container').length > 0;
        let unit = '首';
        if (hasShi3 && hasCi3) {
            unit = '首';
        } else if (hasShi3) {
            unit = '首诗';
        } else {
            unit = '首词';
        }
        let countText = `共 ${results.length} ${unit}`;
        if (this.currentTag) {
            countText += ` · 筛选: ${this.currentTag}`;
        }
        count.textContent = countText;
        this.resultsContainer.appendChild(count);

        if (results.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'cipai-search-empty';
            let emptyText = '未找到匹配的作品';
            if (hasShi3 && !hasCi3) {
                emptyText = '未找到匹配的诗作';
            } else if (!hasShi3 && hasCi3) {
                emptyText = '未找到匹配的词作';
            }
            empty.textContent = emptyText;
            this.resultsContainer.appendChild(empty);
            return;
        }

        results.forEach(data => {
            const item = document.createElement('div');
            item.className = 'cipai-search-item';
            item.setAttribute('tabindex', '0');
            item.setAttribute('data-poem-id', data.id);

            const titleDiv = document.createElement('div');
            titleDiv.className = 'result-title';
            titleDiv.innerHTML = this._highlight(data.title, query);
            item.appendChild(titleDiv);

            // 提取匹配的句子作为预览，或使用第一句
            const preview = document.createElement('div');
            preview.className = 'result-preview';
            this._setPreview(preview, data, query);
            item.appendChild(preview);

            item.addEventListener('click', () => {
                this._jumpToPoem(data);
            });
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this._jumpToPoem(data);
            });

            this.resultsContainer.appendChild(item);
        });
    }

    /**
     * 设置搜索结果预览文本
     */
    _setPreview(previewEl, data, query) {
        if (query) {
            // 优先显示包含搜索词的句子
            const matchIndex = data.fullText.indexOf(query);
            if (matchIndex !== -1) {
                const start = Math.max(0, matchIndex - 8);
                const end = Math.min(data.fullText.length, matchIndex + query.length + 20);
                let previewText = data.fullText.substring(start, end);
                if (start > 0) previewText = '…' + previewText;
                if (end < data.fullText.length) previewText = previewText + '…';
                previewEl.innerHTML = this._highlight(previewText, query);
                return;
            }
        }
        // 默认取前 30 个字符
        const text = data.fullText.substring(0, 30);
        previewEl.textContent = text + (data.fullText.length > 30 ? '…' : '');
    }

    /**
     * 高亮匹配文本
     */
    _highlight(text, query) {
        if (!query) return text;
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escaped})`, 'gi');
        return text.replace(regex, '<span class="result-highlight">$1</span>');
    }

    /**
     * 跳转到指定词作
     */
    _jumpToPoem(data) {
        this.close();
        const top = data.element.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: 'smooth' });
        // 高亮闪烁效果
        data.element.style.transition = 'background 0.3s';
        data.element.style.background = 'rgba(212, 175, 55, 0.12)';
        setTimeout(() => {
            data.element.style.background = '';
        }, 1800);
    }

    /**
     * 键盘导航：聚焦下一个结果
     */
    _focusNextResult() {
        const items = this.resultsContainer.querySelectorAll('.cipai-search-item');
        const current = this.resultsContainer.querySelector('.cipai-search-item:focus');
        const index = current ? Array.from(items).indexOf(current) : -1;
        const next = items[Math.min(index + 1, items.length - 1)];
        if (next) next.focus();
    }

    _focusPrevResult() {
        const items = this.resultsContainer.querySelectorAll('.cipai-search-item');
        const current = this.resultsContainer.querySelector('.cipai-search-item:focus');
        const index = current ? Array.from(items).indexOf(current) : 1;
        const prev = items[Math.max(index - 1, 0)];
        if (prev) prev.focus();
    }

    /**
     * 销毁
     */
    destroy() {
        if (this.dialog) {
            this.dialog.remove();
            this.dialog = null;
        }
        document.removeEventListener('cipai:openSearch', this._listenForOpen);
    }
}

window.CipaiSearch = CipaiSearch;