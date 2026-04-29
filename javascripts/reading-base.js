// ==================== 基础渲染函数 ====================
window.readingBase = {
  // 当前选中的卷索引
  currentVolumeIndex: 0,
  volumeList: [],
  groupedData: {},
  originalArticles: [],
  storageKey: 'reading_current_volume',  // localStorage 存储键名

  // 生成星星HTML（使用主题金色）
  generateStars(rating) {
    let starsHtml = '';
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<i class="fa fa-star" style="color: #D4AF37;"></i>';
    }
    if (hasHalf) {
      starsHtml += '<i class="fa fa-star-half-o" style="color: #D4AF37;"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<i class="fa fa-star-o" style="color: #D1D1D1;"></i>';
    }
    return starsHtml;
  },

  // 状态徽章样式（主题色系）
  getStatusBadge(status) {
    const statusMap = {
      '未开始': '<span class="status-badge not-started">📖 未开始</span>',
      '阅读中': '<span class="status-badge reading">📚 阅读中</span>',
      '已读': '<span class="status-badge completed">✅ 已读</span>',
      '搁置': '<span class="status-badge paused">⏸️ 搁置</span>',
      '思考观后感中': '<span class="status-badge thinking">💭 思考中</span>'
    };
    return statusMap[status] || statusMap['未开始'];
  },

  // 按卷分组
  groupByVolume(articles) {
    const groups = {};
    articles.forEach(article => {
      const volume = article.volume || '其他';
      if (!groups[volume]) {
        groups[volume] = [];
      }
      groups[volume].push(article);
    });
    return groups;
  },

  // 保存当前卷索引到 localStorage
  saveCurrentVolumeIndex() {
    if (this.volumeList.length > 0) {
      const saveData = {
        index: this.currentVolumeIndex,
        volumeName: this.volumeList[this.currentVolumeIndex],
        timestamp: Date.now()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(saveData));
    }
  },

  // 从 localStorage 读取上次保存的卷索引
  loadSavedVolumeIndex() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.timestamp && Date.now() - data.timestamp > 30 * 24 * 60 * 60 * 1000) {
          localStorage.removeItem(this.storageKey);
          return 0;
        }
        return data.index || 0;
      }
    } catch (e) {
      console.warn('读取保存的卷索引失败:', e);
    }
    return 0;
  },

  // 动画更新进度条
  animateProgressBar(targetPercent, animate = true) {
    const fillBar = document.getElementById('progressBarFill');
    const marker = document.getElementById('progressMarker');
    const percentSpan = document.querySelector('.progress-percentage');
    
    if (!fillBar) return;
    
    if (animate) {
      fillBar.style.transition = 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      if (marker) marker.style.transition = 'left 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    } else {
      fillBar.style.transition = 'none';
      if (marker) marker.style.transition = 'none';
    }
    
    fillBar.style.width = `${targetPercent}%`;
    
    if (marker) {
      marker.style.left = `${targetPercent}%`;
      const tooltip = marker.querySelector('.progress-tooltip');
      if (tooltip) tooltip.textContent = `${targetPercent}%`;
    }
    
    if (percentSpan) {
      // 数字递增动画
      const currentPercent = parseInt(percentSpan.textContent) || 0;
      if (animate && Math.abs(currentPercent - targetPercent) > 5) {
        let start = currentPercent;
        let end = targetPercent;
        let duration = 500;
        let stepTime = 20;
        let steps = duration / stepTime;
        let increment = (end - start) / steps;
        let current = start;
        let interval = setInterval(() => {
          current += increment;
          if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(interval);
          }
          percentSpan.textContent = `${Math.round(current)}%`;
        }, stepTime);
      } else {
        percentSpan.textContent = `${targetPercent}%`;
      }
    }
    
    // 如果进度达到100%，添加庆祝效果
    if (targetPercent === 100) {
      fillBar.classList.add('completed');
      setTimeout(() => {
        fillBar.classList.remove('completed');
      }, 1000);
    }
  },

  // 重新计算并更新总进度条
  updateGlobalProgress(animate = true) {
    if (!this.originalArticles || this.originalArticles.length === 0) return;
    
    let totalCount = this.originalArticles.length;
    let completedCount = this.originalArticles.filter(a => a.status === '已读').length;
    let newProgress = Math.round((completedCount / totalCount) * 100);
    
    // 更新统计卡片中的数字
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 4) {
      statNumbers[0].textContent = totalCount;
      statNumbers[1].textContent = completedCount;
      const readingCount = this.originalArticles.filter(a => a.status === '阅读中' || a.status === '思考观后感中').length;
      statNumbers[2].textContent = readingCount;
      statNumbers[3].textContent = `${newProgress}%`;
    }
    
    // 更新全局进度条
    const globalFillBar = document.getElementById('progressBarFill');
    if (globalFillBar) {
      this.animateProgressBar(newProgress, animate);
    }
  },

  // 渲染单个卷的表格HTML
  renderVolumeTable(volume, volumeArticles) {
    let volumeCompleted = volumeArticles.filter(a => a.status === '已读').length;
    let volumeProgress = Math.round((volumeCompleted / volumeArticles.length) * 100);

    return `
      <div class="volume-section" data-volume="${volume}">
        <div class="volume-header">
          <div class="volume-title">
            <span class="volume-icon">📚</span>
            ${volume}
          </div>
          <div class="volume-stats">
            <span class="volume-stat">📖 ${volumeArticles.length}篇</span>
            <span class="volume-stat">✅ ${volumeCompleted}篇已读</span>
            <span class="volume-stat">📊 ${volumeProgress}%</span>
          </div>
        </div>
        <div class="volume-progress">
          <div class="volume-progress-bar" style="width: ${volumeProgress}%"></div>
        </div>
        <div class="table-wrapper">
          <table class="reading-table">
            <thead>
              <tr>
                <th width="8%">序号</th>
                <th width="35%">章节名</th>
                <th width="10%">作者</th>
                <th width="10%">阅读状态</th>
                <th width="10%">开始日期</th>
                <th width="10%">结束日期</th>
                <th width="10%">评分</th>
                <th width="8%">备注</th>
              </tr>
            </thead>
            <tbody>
              ${volumeArticles.map(a => `
                <tr class="reading-row ${a.status === '已读' ? 'completed-row' : ''}" data-article-id="${a.id}">
                  <td class="text-center">${a.id}</td>
                  <td><a href="${a.link}" class="chapter-link">${a.title}</a></td>
                  <td class="text-center">${a.author || '—'}</td>
                  <td class="text-center status-cell" data-status="${a.status || '未开始'}">
                    ${this.getStatusBadge(a.status || '未开始')}
                  </td>
                  <td class="text-center start-date">${a.startDate || '—'}</td>
                  <td class="text-center end-date">${a.endDate || '—'}</td>
                  <td class="text-center rating-cell">${a.rating ? this.generateStars(a.rating) : '—'}</td>
                  <td class="text-center note-cell">
                    <div class="note-content ${a.notes?.length > 15 ? 'collapsed' : ''}">
                      ${a.notes || '—'}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
           </table>
        </div>
      </div>
    `;
  },

  // 渲染表格（支持分卷翻页）
  renderTable(containerId, articles) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('Container not found:', containerId);
      return;
    }

    // 保存原始数据
    this.originalArticles = articles;

    // 按卷分组
    this.groupedData = this.groupByVolume(articles);
    this.volumeList = Object.keys(this.groupedData);

    // 读取上次保存的卷索引
    let savedIndex = this.loadSavedVolumeIndex();
    if (savedIndex >= this.volumeList.length || savedIndex < 0) {
      savedIndex = 0;
    }
    this.currentVolumeIndex = savedIndex;

    // 统计总数
    let totalCount = articles.length;
    let completedCount = articles.filter(a => a.status === '已读').length;
    let readingCount = articles.filter(a => a.status === '阅读中' || a.status === '思考观后感中').length;
    let progressPercent = Math.round((completedCount / totalCount) * 100);

    // 生成翻页控制栏
    let paginationHtml = '';
    if (this.volumeList.length > 1) {
      paginationHtml = `
        <div class="volume-pagination">
          <button id="prevVolumeBtn" class="volume-nav-btn" ${this.currentVolumeIndex === 0 ? 'disabled' : ''}>
            <i class="fa fa-chevron-left"></i> 上一卷
          </button>
          <div class="volume-indicator">
            <span id="currentVolumeName" class="current-volume-name">${this.volumeList[this.currentVolumeIndex]}</span>
            <span class="volume-count">(${this.groupedData[this.volumeList[this.currentVolumeIndex]].length}篇)</span>
          </div>
          <button id="nextVolumeBtn" class="volume-nav-btn" ${this.currentVolumeIndex === this.volumeList.length - 1 ? 'disabled' : ''}>
            下一卷 <i class="fa fa-chevron-right"></i>
          </button>
        </div>
        <div class="volume-dots" id="volumeDots"></div>
      `;
    }

    // 完整HTML - 包含增强版进度条
    container.innerHTML = `
      <div class="reading-stats">
        <div class="stat-card">
          <div class="stat-number">${totalCount}</div>
          <div class="stat-label">总章节</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${completedCount}</div>
          <div class="stat-label">已完成</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${readingCount}</div>
          <div class="stat-label">阅读中</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${progressPercent}%</div>
          <div class="stat-label">总完成度</div>
        </div>
      </div>
      
      <!-- 增强版进度条 -->
      <div class="progress-wrapper">
        <div class="progress-bar-container" id="progressBarContainer">
          <div class="progress-bar-bg-glow"></div>
          <div class="progress-bar-fill" id="progressBarFill" style="width: ${progressPercent}%"></div>
          <div class="progress-marker" id="progressMarker" style="left: ${progressPercent}%;">
            <div class="progress-marker-inner">
              <span class="progress-marker-icon">📖</span>
            </div>
            <span class="progress-tooltip">${progressPercent}%</span>
          </div>
        </div>
        <div class="progress-stats">
          <span class="progress-label">
            <i class="fa fa-book"></i> 阅读进度
          </span>
          <span class="progress-percentage">${progressPercent}%</span>
        </div>
        <div class="progress-ticks">
          <span class="progress-tick">0%</span>
          <span class="progress-tick">25%</span>
          <span class="progress-tick">50%</span>
          <span class="progress-tick">75%</span>
          <span class="progress-tick">100%</span>
        </div>
      </div>
      
      ${paginationHtml}
      
      <div id="currentVolumeContainer"></div>
    `;

    this.renderCurrentVolume();

    if (this.volumeList.length > 1) {
      this.bindPaginationEvents();
    }

    // 绑定备注点击展开事件
    document.querySelectorAll('.note-content').forEach(el => {
      el.addEventListener('click', () => {
        el.classList.toggle('expanded');
      });
    });

    // 绑定状态变更观察（可选）
    this.bindStatusChangeObserver();

    this.addStyles();
  },

  // 绑定状态变更观察器（用于实时更新进度）
  bindStatusChangeObserver() {
    // 监听状态下拉菜单的变化（如果有的话）
    document.querySelectorAll('.status-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const row = e.target.closest('.reading-row');
        if (row) {
          const articleId = row.dataset.articleId;
          const article = this.originalArticles.find(a => a.id == articleId);
          if (article) {
            article.status = e.target.value;
            this.updateGlobalProgress(true);
          }
        }
      });
    });
  },

  renderCurrentVolume() {
    const container = document.getElementById('currentVolumeContainer');
    if (!container) return;

    const currentVolume = this.volumeList[this.currentVolumeIndex];
    if (!currentVolume) return;

    const volumeArticles = this.groupedData[currentVolume];
    container.innerHTML = this.renderVolumeTable(currentVolume, volumeArticles);

    // 更新翻页按钮状态
    const prevBtn = document.getElementById('prevVolumeBtn');
    const nextBtn = document.getElementById('nextVolumeBtn');
    const currentNameSpan = document.getElementById('currentVolumeName');
    const countSpan = document.querySelector('.volume-count');

    if (prevBtn) prevBtn.disabled = (this.currentVolumeIndex === 0);
    if (nextBtn) nextBtn.disabled = (this.currentVolumeIndex === this.volumeList.length - 1);
    if (currentNameSpan) currentNameSpan.textContent = currentVolume;
    if (countSpan && volumeArticles) countSpan.textContent = `(${volumeArticles.length}篇)`;

    this.renderVolumeDots();

    // 重新绑定备注点击事件
    document.querySelectorAll('.note-content').forEach(el => {
      el.addEventListener('click', () => {
        el.classList.toggle('expanded');
      });
    });

    this.saveCurrentVolumeIndex();
  },

  renderVolumeDots() {
    const dotsContainer = document.getElementById('volumeDots');
    if (!dotsContainer) return;

    dotsContainer.innerHTML = this.volumeList.map((vol, idx) => `
      <div class="volume-dot ${idx === this.currentVolumeIndex ? 'active' : ''}" 
           data-volume-index="${idx}"
           title="${vol}">
      </div>
    `).join('');

    dotsContainer.querySelectorAll('.volume-dot').forEach(dot => {
      dot.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.volumeIndex);
        if (!isNaN(idx) && idx !== this.currentVolumeIndex) {
          this.currentVolumeIndex = idx;
          this.renderCurrentVolume();
        }
      });
    });
  },

  bindPaginationEvents() {
    const prevBtn = document.getElementById('prevVolumeBtn');
    const nextBtn = document.getElementById('nextVolumeBtn');

    if (prevBtn) {
      prevBtn.onclick = () => {
        if (this.currentVolumeIndex > 0) {
          this.currentVolumeIndex--;
          this.renderCurrentVolume();
        }
      };
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        if (this.currentVolumeIndex < this.volumeList.length - 1) {
          this.currentVolumeIndex++;
          this.renderCurrentVolume();
        }
      };
    }
  },

  addStyles() {
    if (document.getElementById('reading-table-styles')) return;

    const styles = `
      <style id="reading-table-styles">
        .reading-stats {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin: 20px 0 30px;
          flex-wrap: wrap;
        }
        .stat-card {
          text-align: center;
          padding: 15px 25px;
          background: linear-gradient(135deg, #3E5A3C 0%, #2C482A 100%);
          border-radius: 16px;
          color: white;
          min-width: 100px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }
        .stat-card:hover { transform: translateY(-3px); }
        .stat-number {
          font-size: 28px;
          font-weight: bold;
          font-family: 'Cormorant Garamond', serif;
        }
        .stat-label {
          font-size: 12px;
          opacity: 0.9;
          margin-top: 5px;
          letter-spacing: 1px;
        }
        
        /* ========== 增强版进度条 ========== */
        .progress-wrapper {
          margin: 20px 0 40px;
        }
        
        .progress-bar-container {
          position: relative;
          background: linear-gradient(90deg, #E8E2D5, #F0EBE2);
          border-radius: 30px;
          height: 14px;
          overflow: visible;
          box-shadow: inset 0 1px 4px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.05);
          cursor: pointer;
        }
        
        .progress-bar-bg-glow {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 32px;
          background: linear-gradient(90deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05));
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        
        .progress-bar-container:hover .progress-bar-bg-glow {
          opacity: 1;
        }
        
        .progress-bar-fill {
          position: relative;
          background: linear-gradient(90deg, #D4AF37, #F0C674, #E8B553, #D4AF37);
          background-size: 300% 100%;
          height: 100%;
          border-radius: 30px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 12px rgba(212, 175, 55, 0.5);
          animation: shimmerFlow 2.5s ease-in-out infinite;
        }
        
        @keyframes shimmerFlow {
          0% { background-position: 300% 0; }
          100% { background-position: -300% 0; }
        }
        
        /* 进度条浮标 - 书卷笔触风格 */
        .progress-marker {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, #3E5A3C, #2C482A);
          border: 2px solid #D4AF37;
          border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.2), 0 4px 14px rgba(0,0,0,0.15);
          transition: left 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease, box-shadow 0.2s ease;
          z-index: 10;
          cursor: pointer;
        }
        
        .progress-marker-inner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 28px;
          height: 28px;
          background: rgba(212, 175, 55, 0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .progress-marker-icon {
          font-size: 14px;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
        }
        
        .progress-marker:hover {
          transform: translate(-50%, -50%) scale(1.15);
          background: #D4AF37;
          border-color: #3E5A3C;
          box-shadow: 0 0 0 6px rgba(212, 175, 55, 0.3), 0 6px 18px rgba(0,0,0,0.2);
        }
        
        .progress-marker:hover .progress-marker-icon {
          content: "📚";
        }
        
        .progress-marker:hover .progress-marker-inner {
          background: rgba(62, 90, 60, 0.2);
        }
        
        /* 浮标上方显示百分比的气泡 */
        .progress-tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: #2C2A29;
          color: #D4AF37;
          font-size: 11px;
          font-weight: bold;
          padding: 4px 10px;
          border-radius: 20px;
          white-space: nowrap;
          margin-bottom: 10px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.25s ease;
          font-family: 'Cormorant Garamond', serif;
          box-shadow: 0 3px 10px rgba(0,0,0,0.2);
          pointer-events: none;
          letter-spacing: 0.5px;
        }
        
        .progress-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 5px;
          border-style: solid;
          border-color: #2C2A29 transparent transparent transparent;
        }
        
        .progress-marker:hover .progress-tooltip {
          opacity: 1;
          visibility: visible;
          margin-bottom: 14px;
        }
        
        /* 进度条下方增加装饰性刻度 */
        .progress-ticks {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
          padding: 0 6px;
        }
        
        .progress-tick {
          font-size: 10px;
          color: #8A9BA8;
          opacity: 0.7;
          position: relative;
        }
        
        .progress-tick::before {
          content: '';
          position: absolute;
          top: -18px;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          height: 6px;
          background: #D4AF37;
          opacity: 0.4;
        }
        
        /* 进度数字显示 */
        .progress-stats {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-top: 12px;
          font-size: 12px;
          color: #5A6B5A;
        }
        
        .progress-percentage {
          font-size: 20px;
          font-weight: bold;
          color: #D4AF37;
          font-family: 'Cormorant Garamond', serif;
          text-shadow: 0 1px 2px rgba(0,0,0,0.05);
          background: rgba(212, 175, 55, 0.1);
          padding: 2px 10px;
          border-radius: 30px;
        }
        
        .progress-label {
          opacity: 0.7;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .progress-label i {
          color: #D4AF37;
        }
        
        /* 完成时的庆祝效果 */
        .progress-bar-fill.completed {
          background: linear-gradient(90deg, #3E5A3C, #5A8A5A, #6A9A6A, #3E5A3C);
          background-size: 300% 100%;
          animation: shimmerFlow 2s ease-in-out infinite, celebratePulse 0.6s ease-out;
        }
        
        @keyframes celebratePulse {
          0% { transform: scaleX(1); box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.5); }
          50% { transform: scaleX(1.02); box-shadow: 0 0 0 8px rgba(212, 175, 55, 0.2); }
          100% { transform: scaleX(1); box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
        }
        
        .volume-section {
          margin-bottom: 40px;
          background: rgba(255, 250, 240, 0.92);
          backdrop-filter: blur(4px);
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(212, 175, 55, 0.2);
          transition: all 0.3s ease;
        }
        .volume-section:hover {
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          border-color: rgba(212, 175, 55, 0.4);
        }
        .volume-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 2px solid #D4AF37;
        }
        .volume-title {
          font-size: 18px;
          font-weight: bold;
          color: #3E5A3C;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Cormorant Garamond', serif;
        }
        .volume-icon { font-size: 24px; }
        .volume-stats { display: flex; gap: 12px; }
        .volume-stat {
          font-size: 12px;
          color: #5A6B5A;
          background: rgba(212, 175, 55, 0.12);
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 500;
        }
        .volume-progress {
          background: #EDE9E2;
          border-radius: 10px;
          height: 4px;
          margin-bottom: 20px;
          overflow: hidden;
        }
        .volume-progress-bar {
          background: linear-gradient(90deg, #D4AF37, #C52A1D);
          height: 100%;
          border-radius: 10px;
          transition: width 0.5s ease;
        }
        
        .table-wrapper { overflow-x: auto; border-radius: 12px; }
        .reading-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          table-layout: fixed;
        }
        .reading-table th {
          background: #F5F0E8;
          color: #3E5A3C;
          padding: 12px 8px;
          font-weight: 600;
          border-bottom: 2px solid #D4AF37;
          text-align: center;  
        }
        .reading-table td {
          padding: 10px 8px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.15);
          color: #2C2A29;
          word-break: break-all;
        }
        .reading-table tr:hover { background: rgba(212, 175, 55, 0.05); }
        .completed-row { opacity: 0.75; background: rgba(62, 90, 60, 0.03); }
        .text-center { text-align: center; }
        .chapter-link {
          color: #3E5A3C;
          text-decoration: none;
          transition: color 0.3s;
          font-weight: 500;
        }
        .chapter-link:hover { color: #D4AF37; text-decoration: underline; }
        
        .volume-pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 20px 0 20px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .volume-nav-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          background: rgba(62, 90, 60, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 40px;
          color: #3E5A3C;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .volume-nav-btn:hover:not(:disabled) {
          background: #3E5A3C;
          color: white;
          border-color: #3E5A3C;
        }
        .volume-nav-btn:hover:not(:disabled) i {
          color: white;
        }
        .volume-nav-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .volume-indicator { text-align: center; flex: 1; }
        .current-volume-name {
          font-size: 1.1rem;
          font-weight: bold;
          color: #3E5A3C;
          font-family: 'Cormorant Garamond', serif;
        }
        .volume-count {
          font-size: 0.8rem;
          color: #8A9BA8;
          margin-left: 8px;
        }
        .volume-dots {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin: 15px 0 10px;
          flex-wrap: wrap;
        }
        .volume-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #D1D1D1;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .volume-dot:hover { background: #D4AF37; transform: scale(1.2); }
        .volume-dot.active {
          width: 24px;
          border-radius: 10px;
          background: #3E5A3C;
        }
        
        .paginated-content-body {
          font-family: 'Noto Serif SC', 'Inter', serif;
          line-height: 1.85;
          color: #2C2A29;
        }
        .paginated-content-body h1,
        .paginated-content-body h2,
        .paginated-content-body h3 {
          color: #3E5A3C;
          border-left: 4px solid #D4AF37;
          padding-left: 15px;
          margin: 25px 0 15px;
        }
        .paginated-content-body p { margin: 1em 0; }
        
        .note-content {
          max-height: 42px;
          overflow: hidden;
          cursor: pointer;
          position: relative;
        }
        .note-content.collapsed::after {
          content: '...';
          position: absolute;
          right: 0;
          bottom: 0;
          background: rgba(255,250,240,0.9);
          padding-left: 4px;
        }
        .note-content.expanded { max-height: none !important; }
        .note-content.expanded::after { display: none; }
        
        .status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
          white-space: nowrap;
        }
        .status-badge.not-started { background: #F0EDE8; color: #8A9BA8; }
        .status-badge.reading { background: #FDF6E3; color: #D4AF37; }
        .status-badge.completed { background: #E8F5E9; color: #3E5A3C; }
        .status-badge.paused { background: #FFEBEE; color: #C52A1D; }
        .status-badge.thinking { background: #E3F2FD; color: #5A7A8A; }
        
        @media (max-width: 768px) {
          .volume-header { flex-direction: column; align-items: flex-start; gap: 10px; }
          .volume-stats { flex-wrap: wrap; }
          .stat-card { padding: 10px 20px; min-width: 70px; }
          .stat-number { font-size: 20px; }
          .reading-table th, .reading-table td { font-size: 11px; padding: 8px 4px; }
          .volume-pagination { justify-content: center; }
          .volume-indicator { order: -1; width: 100%; margin-bottom: 10px; }
          .volume-nav-btn { padding: 6px 16px; font-size: 0.75rem; }
          .progress-marker { width: 28px; height: 28px; }
          .progress-marker-inner { width: 22px; height: 22px; }
          .progress-marker-icon { font-size: 11px; }
          .progress-percentage { font-size: 16px; }
          .progress-tick { font-size: 8px; }
          .progress-tick::before { top: -14px; height: 4px; }
        }
        
        @media (max-width: 640px) {
          .volume-section { padding: 15px; }
          .volume-title { font-size: 16px; }
          .volume-stat { font-size: 10px; padding: 3px 8px; }
        }
      </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
  }
};