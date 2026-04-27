// ==================== 墨点粒子特效 ====================
(function initParticleEffect() {
  // 添加粒子动画样式
  if (!document.querySelector('#ink-particle-style')) {
    const style = document.createElement('style');
    style.id = 'ink-particle-style';
    style.textContent = `
      .ink-particle {
        position: fixed;
        pointer-events: none;
        z-index: 9998;
        background: rgba(62, 90, 60, 0.4);
        border-radius: 50%;
        filter: blur(2px);
        animation: particleFadeOut 1s ease-out forwards;
      }
      @keyframes particleFadeOut {
        0% { transform: scale(0.2) translateY(0); opacity: 0.6; }
        100% { transform: scale(1.5) translateY(-30px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  function createInkParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'ink-particle';
    const size = 8 + Math.random() * 16;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = (x - size/2) + 'px';
    particle.style.top = (y - size/2) + 'px';
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 1000);
  }

  // 点击标题时触发
  document.addEventListener('DOMContentLoaded', function() {
    const headers = document.querySelectorAll('h1, h2, h3');
    headers.forEach(header => {
      header.addEventListener('click', function(e) {
        for(let i = 0; i < 6; i++) {
          setTimeout(() => {
            createInkParticle(e.clientX + (Math.random() - 0.5) * 40, e.clientY + (Math.random() - 0.5) * 30);
          }, i * 50);
        }
      });
    });
  });
})();

// ==================== 水墨涟漪拖尾特效 ====================
(function initWaterInkTrail() {
  // 确保样式存在
  if (!document.querySelector('#ink-ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ink-ripple-style';
    style.textContent = `
      @keyframes inkRipple {
        0% { transform: scale(0.3); opacity: 0.5; }
        100% { transform: scale(2); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  let lastX = 0, lastY = 0;
  let active = false;
  let timeoutId = null;

  function createInkDrop(x, y) {
    const drop = document.createElement('div');
    const size = 10 + Math.random() * 14;
    drop.style.position = 'fixed';
    drop.style.left = (x - size / 2) + 'px';
    drop.style.top = (y - size / 2) + 'px';
    drop.style.width = size + 'px';
    drop.style.height = size + 'px';
    drop.style.borderRadius = '50%';
    drop.style.background = `radial-gradient(circle, rgba(62,90,60,0.4) 0%, rgba(84,70,42,0.15) 70%, transparent 100%)`;
    drop.style.pointerEvents = 'none';
    drop.style.zIndex = '9998';
    drop.style.filter = 'blur(2px)';
    drop.style.opacity = '0.8';
    drop.style.animation = 'inkRipple 0.8s ease-out forwards';
    document.body.appendChild(drop);
    setTimeout(() => drop.remove(), 800);
  }

  document.addEventListener('mousemove', (e) => {
    if (!active) active = true;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > 6) {
      createInkDrop(e.clientX, e.clientY);
    }
    
    lastX = e.clientX;
    lastY = e.clientY;
    
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => { active = false; }, 150);
  });
})();

// ==================== 代码块复制按钮 ====================
document.addEventListener('DOMContentLoaded', function() {
  const codeBlocks = document.querySelectorAll('.highlight');
  codeBlocks.forEach(block => {
    const copyBtn = document.createElement('button');
    copyBtn.innerHTML = '<i class="fa fa-copy"></i>';
    copyBtn.className = 'copy-code-btn';
    copyBtn.style.cssText = `
      position: absolute;
      right: 8px;
      top: 8px;
      background: #D4AF37;
      border: none;
      border-radius: 4px;
      padding: 4px 8px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 10;
    `;
    block.style.position = 'relative';
    block.appendChild(copyBtn);
    
    block.addEventListener('mouseenter', () => copyBtn.style.opacity = '1');
    block.addEventListener('mouseleave', () => copyBtn.style.opacity = '0');
    
    copyBtn.addEventListener('click', () => {
      const code = block.querySelector('code').innerText;
      navigator.clipboard.writeText(code);
      copyBtn.innerHTML = '<i class="fa fa-check"></i>';
      setTimeout(() => copyBtn.innerHTML = '<i class="fa fa-copy"></i>', 2000);
    });
  });
});

// ==================== 正在阅读记录 ====================
const READING_KEY = 'weary_current_reading';

// 保存当前正在阅读的文章
function saveCurrentReading() {
  const title = document.querySelector('h1')?.innerText || document.title;
  const path = window.location.pathname;
  
  if (path !== '/' && !path.includes('/index.html') && path !== '/docs/') {
    const readingData = {
      title: title,
      path: path,
      timestamp: new Date().getTime(),
      expire: new Date().getTime() + (7 * 24 * 60 * 60 * 1000) // 7天过期
    };
    localStorage.setItem(READING_KEY, JSON.stringify(readingData));
  }
}

// 获取正在阅读的文章
function getCurrentReading() {
  try {
    const data = localStorage.getItem(READING_KEY);
    if (!data) return null;
    
    const reading = JSON.parse(data);
    // 检查是否过期（7天）
    if (reading.expire && reading.expire < new Date().getTime()) {
      localStorage.removeItem(READING_KEY);
      return null;
    }
    return reading;
  } catch(e) {
    return null;
  }
}

// 清除正在阅读记录
function clearCurrentReading() {
  localStorage.removeItem(READING_KEY);
}

// 自动保存（文章页面加载时）
if (document.querySelector('.md-content')) {
  setTimeout(saveCurrentReading, 500);
  // 页面关闭时也保存一次
  window.addEventListener('beforeunload', saveCurrentReading);
}

// 导出供主页使用
window.getCurrentReading = getCurrentReading;
window.clearCurrentReading = clearCurrentReading;