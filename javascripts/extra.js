// Wrap every letter in a span
var textWrapper = document.querySelector('.ml3');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: true})
  .add({
    targets: '.ml3 .letter',
    opacity: [0,1],
    easing: "easeInOutQuad",
    duration: 2250,
    delay: (el, i) => 150 * (i+1)
  }).add({
    targets: '.ml3',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });

  
// ========== 与书库导航页一致的特效 ==========

// 墨韵粒子特效
function createInkParticle(x, y) {
  const particle = document.createElement('div');
  particle.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9998;
    background: rgba(62, 90, 60, 0.3);
    border-radius: 50%;
    filter: blur(2px);
    width: ${8 + Math.random() * 20}px;
    height: ${8 + Math.random() * 20}px;
    left: ${x - (8 + Math.random() * 20) / 2}px;
    top: ${y - (8 + Math.random() * 20) / 2}px;
    animation: particleFade 1s ease-out forwards;
  `;
  document.body.appendChild(particle);
  
  setTimeout(() => particle.remove(), 1000);
}

// 添加动画样式
const particleStyle = document.createElement('style');
particleStyle.textContent = `
  @keyframes particleFade {
    0% { transform: scale(0.2); opacity: 0.5; }
    100% { transform: scale(1.6) translateY(-30px); opacity: 0; }
  }
`;
document.head.appendChild(particleStyle);

// 点击标题时触发墨韵效果
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
  
  // 为代码块添加复制按钮
  const codeBlocks = document.querySelectorAll('.highlight');
  codeBlocks.forEach(block => {
    const copyBtn = document.createElement('button');
    copyBtn.innerHTML = '<i class="fa fa-copy"></i>';
    copyBtn.className = 'copy-code-btn';
    copyBtn.style.cssText = `
      position: absolute;
      right: 8px;
      top: 8px;
      background: var(--gold);
      border: none;
      border-radius: 4px;
      padding: 4px 8px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s;
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

//全屏视频
var video = document.getElementById("video1");
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
  video.style.display = "none";
  video.muted = true;
} else {
  video.volume = 0.5; // 或者根据需要设置适当的音量值，例如 0.5 表示 50% 的音量
}

// 优化
// const container = document.querySelector('.container');
// const boxes = document.querySelectorAll('p');

// // Read a layout property
// const newWidth = container.offsetWidth;

// for (var i = 0; i < boxes.length; i++) {    
//     // Then invalidate layouts with writes.
//     boxes[i].style.width = newWidth + 'px';
// }
// const width = box.offsetWidth;
// box.classList.add('big');

// // When the user clicks on a link/button:
// async function navigateToSettingsPage() {
//   // Capture and visually freeze the current state.
//   await document.documentTransition.prepare({
//     rootTransition: 'cover-up',
//     sharedElements: [element1, element2, element3],
//   });
//   // This is a function within the web app:
//   updateDOMForSettingsPage();
//   // Start the transition.
//   await document.documentTransition.start({
//     sharedElements: [element1, element4, element5],
//   });
//   // Transition complete!
// }
// 优化end


