// ==================== 基础渲染函数 ====================
window.readingBase = {
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
      '思考观后感中': '<span class="status-badge thinking">💭 思考观后感中</span>'
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

  // 渲染表格（支持分卷）
  renderTable(containerId, articles) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('Container not found:', containerId);
      return;
    }
    
    // 按卷分组
    const grouped = this.groupByVolume(articles);
    const volumeList = Object.keys(grouped);
    
    // 统计总数
    let totalCount = articles.length;
    let completedCount = articles.filter(a => a.status === '已读').length;
    let readingCount = articles.filter(a => a.status === '阅读中' || a.status === '思考观后感中').length;
    let progressPercent = Math.round((completedCount / totalCount) * 100);
    
    // 生成分组表格HTML
    let tablesHtml = '';
    
    volumeList.forEach((volume, idx) => {
      const volumeArticles = grouped[volume];
      let volumeCompleted = volumeArticles.filter(a => a.status === '已读').length;
      let volumeProgress = Math.round((volumeCompleted / volumeArticles.length) * 100);
      
      tablesHtml += `
        <div class="volume-section">
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
                  <th width="5%">序号</th>
                  <th width="35%">章节名</th>
                  <th width="10%">作者</th>
                  <th width="12%">阅读状态</th>
                  <th width="10%">开始日期</th>
                  <th width="10%">结束日期</th>
                  <th width="10%">评分</th>
                  <th width="8%">备注</th>
                </tr>
              </thead>
              <tbody>
                ${volumeArticles.map(a => `
                  <tr class="reading-row ${a.status === '已读' ? 'completed-row' : ''}">
                    <td class="text-center">${a.id}</td>
                    <td><a href="${a.link}" class="chapter-link">${a.title}</a></td>
                    <td class="text-center">${a.author || '—'}</td>
                    <td class="text-center">${this.getStatusBadge(a.status || '未开始')}</td>
                    <td class="text-center">${a.startDate || '—'}</td>
                    <td class="text-center">${a.endDate || '—'}</td>
                    <td class="text-center">${a.rating ? this.generateStars(a.rating) : '—'}</td>
                    <td class="text-center">${a.notes || '—'}</td>
                   </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    });
    
    // 完整HTML
    container.innerHTML = `
      <!-- 总体阅读统计卡片 -->
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
      
      <!-- 总体进度条 -->
      <div class="progress-bar-container">
        <div class="progress-bar-fill" style="width: ${progressPercent}%"></div>
      </div>
      
      <!-- 各卷表格 -->
      ${tablesHtml}
    `;
    
    // 添加样式（主题统一）
    this.addStyles();
  },
  
  // 添加CSS样式（与主题统一）
  addStyles() {
    if (document.getElementById('reading-table-styles')) return;
    
    const styles = `
      <style id="reading-table-styles">
        /* 统计卡片 - 主题墨绿色 */
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
        .stat-card:hover {
          transform: translateY(-3px);
        }
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
        
        /* 进度条 - 主题金色 */
        .progress-bar-container {
          background: #EDE9E2;
          border-radius: 20px;
          height: 8px;
          margin: 20px 0 40px;
          overflow: hidden;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
        }
        .progress-bar-fill {
          background: linear-gradient(90deg, #D4AF37, #E8B553);
          height: 100%;
          border-radius: 20px;
          transition: width 0.5s ease;
        }
        
        /* 卷分组样式 - 玻璃卡片效果 */
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
        .volume-icon {
          font-size: 24px;
        }
        .volume-stats {
          display: flex;
          gap: 12px;
        }
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
        
        /* 表格样式 - 主题 */
        .table-wrapper {
          overflow-x: auto;
          border-radius: 12px;
        }
        .reading-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .reading-table th {
          background: #F5F0E8;
          color: #3E5A3C;
          padding: 12px 8px;
          font-weight: 600;
          border-bottom: 2px solid #D4AF37;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .reading-table td {
          padding: 10px 8px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.15);
          color: #2C2A29;
        }
        .reading-table tr:hover {
          background: rgba(212, 175, 55, 0.05);
        }
        .completed-row {
          opacity: 0.75;
          background: rgba(62, 90, 60, 0.03);
        }
        .text-center {
          text-align: center;
        }
        .chapter-link {
          color: #3E5A3C;
          text-decoration: none;
          transition: color 0.3s;
          font-weight: 500;
        }
        .chapter-link:hover {
          color: #D4AF37;
          text-decoration: underline;
        }
        
        /* 状态徽章 - 主题色系 */
        .status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
          white-space: nowrap;
        }
        .status-badge.not-started {
          background: #F0EDE8;
          color: #8A9BA8;
        }
        .status-badge.reading {
          background: #FDF6E3;
          color: #D4AF37;
        }
        .status-badge.completed {
          background: #E8F5E9;
          color: #3E5A3C;
        }
        .status-badge.paused {
          background: #FFEBEE;
          color: #C52A1D;
        }
        .status-badge.thinking {
          background: #E3F2FD;
          color: #5A7A8A;
        }
        
        /* 响应式 */
        @media (max-width: 768px) {
          .volume-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .volume-stats {
            flex-wrap: wrap;
          }
          .stat-card {
            padding: 10px 20px;
            min-width: 70px;
          }
          .stat-number {
            font-size: 20px;
          }
          .reading-table th,
          .reading-table td {
            font-size: 11px;
            padding: 8px 4px;
          }
        }
        
        @media (max-width: 640px) {
          .volume-section {
            padding: 15px;
          }
          .volume-title {
            font-size: 16px;
          }
          .volume-stat {
            font-size: 10px;
            padding: 3px 8px;
          }
        }
      </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
  }
};