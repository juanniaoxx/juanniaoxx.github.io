// ==================== 基础渲染函数 ====================
window.readingBase = {
  // 生成星星HTML
  generateStars(rating) {
    let starsHtml = '';
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<i class="fa fa-star star-fill" style="color: #E6B349;"></i>';
    }
    if (hasHalf) {
      starsHtml += '<i class="fa fa-star-half-o" style="color: #E6B349;"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<i class="fa fa-star-o" style="color: #D1D1D1;"></i>';
    }
    return starsHtml;
  },

  // 状态徽章样式
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
    
    // 添加样式
    this.addStyles();
  },
  
  // 添加CSS样式
  addStyles() {
    if (document.getElementById('reading-table-styles')) return;
    
    const styles = `
      <style id="reading-table-styles">
        /* 统计卡片 */
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
          background: linear-gradient(135deg, #36454F 0%, #2c3e50 100%);
          border-radius: 12px;
          color: white;
          min-width: 100px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .stat-number {
          font-size: 28px;
          font-weight: bold;
        }
        .stat-label {
          font-size: 12px;
          opacity: 0.9;
          margin-top: 5px;
        }
        
        /* 进度条 */
        .progress-bar-container {
          background: #e0e0e0;
          border-radius: 10px;
          height: 8px;
          margin: 20px 0 40px;
          overflow: hidden;
        }
        .progress-bar-fill {
          background: linear-gradient(90deg, #36454F, #5a7a8a);
          height: 100%;
          border-radius: 10px;
          transition: width 0.5s ease;
        }
        
        /* 卷分组样式 */
        .volume-section {
          margin-bottom: 40px;
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }
        .volume-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 2px solid #36454F;
        }
        .volume-title {
          font-size: 18px;
          font-weight: bold;
          color: #36454F;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .volume-icon {
          font-size: 24px;
        }
        .volume-stats {
          display: flex;
          gap: 15px;
        }
        .volume-stat {
          font-size: 12px;
          color: #666;
          background: #f5f5f5;
          padding: 4px 10px;
          border-radius: 20px;
        }
        .volume-progress {
          background: #e0e0e0;
          border-radius: 10px;
          height: 4px;
          margin-bottom: 20px;
          overflow: hidden;
        }
        .volume-progress-bar {
          background: linear-gradient(90deg, #667eea, #764ba2);
          height: 100%;
          border-radius: 10px;
          transition: width 0.5s ease;
        }
        
        /* 表格样式 */
        .table-wrapper {
          overflow-x: auto;
        }
        .reading-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .reading-table th {
          background: #f8f9fa;
          color: #333;
          padding: 12px 8px;
          font-weight: 600;
          border-bottom: 2px solid #36454F;
        }
        .reading-table td {
          padding: 10px 8px;
          border-bottom: 1px solid #eee;
        }
        .reading-table tr:hover {
          background: #fafafa;
        }
        .completed-row {
          opacity: 0.8;
          background: #f9f9f9;
        }
        .text-center {
          text-align: center;
        }
        .chapter-link {
          color: #36454F;
          text-decoration: none;
          transition: color 0.3s;
        }
        .chapter-link:hover {
          color: #667eea;
          text-decoration: underline;
        }
        
        /* 状态徽章 */
        .status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
          white-space: nowrap;
        }
        .status-badge.not-started {
          background: #f0f0f0;
          color: #666;
        }
        .status-badge.reading {
          background: #fff3e0;
          color: #f39c12;
        }
        .status-badge.completed {
          background: #e8f5e9;
          color: #27ae60;
        }
        .status-badge.paused {
          background: #ffebee;
          color: #e74c3c;
        }
        .status-badge.thinking {
          background: #e3f2fd;
          color: #2196f3;
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
        }
      </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
  }
};