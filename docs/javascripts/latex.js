
window.MathJax = {
  tex: {
    packages: {'[+]': ['ams']},  // 启用 amsmath 宏包（支持 aligned, align 等）
    inlineMath: [['$', '$'], ['\$', '\$']],  // 行内公式
    displayMath: [['$$', '$$'], ['\$$', '\$$']] // 行间公式
  },
  options: {
    enableMenu: false  // 可选：禁用右键菜单
  }
};