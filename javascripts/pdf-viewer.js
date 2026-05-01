// PDF 内嵌阅读器
document.addEventListener('DOMContentLoaded', function() {
  // 查找所有 PDF 链接
  const pdfLinks = document.querySelectorAll('a[href$=".pdf"]');
  
  pdfLinks.forEach(link => {
    // 跳过已经有阅读器的链接
    if (link.classList.contains('pdf-processed')) return;
    link.classList.add('pdf-processed');
    
    // 创建容器
    const container = document.createElement('div');
    container.className = 'pdf-viewer-container';
    container.style.display = 'none';
    
    // 创建 canvas
    const canvas = document.createElement('canvas');
    canvas.id = `pdf-canvas-${Date.now()}-${Math.random()}`;
    container.appendChild(canvas);
    
// 创建控制栏
    const controls = document.createElement('div');
    controls.className = 'pdf-controls';
    controls.innerHTML = `
      <button class="pdf-prev" disabled>◀ 上一页</button>
      <span class="pdf-page-info">第 <span class="pdf-current-page">1</span> / <span class="pdf-total-pages">0</span> 页</span>
      <button class="pdf-next" disabled>下一页 ▶</button>
      <button class="pdf-close">✕ 关闭</button>
    `;

    // 先插入控制栏（在顶部）
    container.appendChild(controls);
    // 再插入 canvas（在下面）
    container.appendChild(canvas);
    
    // 插入到链接后面
    link.insertAdjacentElement('afterend', container);
    
    // PDF 渲染相关变量
    let pdfDoc = null;
    let currentPage = 1;
    let totalPages = 0;
    let scale = 1.5;
    let canvasContext = canvas.getContext('2d');
    
    // 渲染页面
    function renderPage(pageNum) {
      pdfDoc.getPage(pageNum).then(page => {
        const viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
          canvasContext: canvasContext,
          viewport: viewport
        };
        page.render(renderContext);
        
        document.querySelector('.pdf-current-page').textContent = pageNum;
        
        // 更新按钮状态
        const prevBtn = container.querySelector('.pdf-prev');
        const nextBtn = container.querySelector('.pdf-next');
        prevBtn.disabled = (pageNum === 1);
        nextBtn.disabled = (pageNum === totalPages);
      });
    }
    
    // 加载 PDF
    function loadPDF(url) {
      pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
        pdfDoc = pdfDoc_;
        totalPages = pdfDoc.numPages;
        container.querySelector('.pdf-total-pages').textContent = totalPages;
        renderPage(currentPage);
        
        // 启用翻页按钮
        const prevBtn = container.querySelector('.pdf-prev');
        const nextBtn = container.querySelector('.pdf-next');
        prevBtn.disabled = false;
        nextBtn.disabled = false;
      }).catch(function(error) {
        console.error('PDF 加载失败:', error);
        container.innerHTML = '<div class="pdf-error">PDF 加载失败，请检查文件路径。</div>';
      });
    }
    
    // 绑定点击事件：点击链接时显示 PDF
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // 隐藏其他 PDF 容器
      document.querySelectorAll('.pdf-viewer-container.show').forEach(c => {
        c.classList.remove('show');
        c.style.display = 'none';
      });
      
      // 显示当前容器
      container.classList.add('show');
      container.style.display = 'block';
      
      // 如果还没加载，加载 PDF
      if (!pdfDoc) {
        loadPDF(link.href);
      } else {
        renderPage(currentPage);
        container.style.display = 'block';
      }
    });
    
    // 翻页事件
    container.querySelector('.pdf-prev').addEventListener('click', function() {
      if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
      }
    });
    
    container.querySelector('.pdf-next').addEventListener('click', function() {
      if (currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage);
      }
    });
    
    // 关闭事件
    container.querySelector('.pdf-close').addEventListener('click', function() {
      container.style.display = 'none';
      container.classList.remove('show');
    });
  });
});