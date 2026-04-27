// 页面初始化 - 自动识别当前书籍并渲染表格
document.addEventListener('DOMContentLoaded', () => {
  // 获取当前页面标题（从Markdown的h1）
  const pageTitle = document.querySelector('h1')?.innerText || document.title;
  
  // 尝试匹配数据中的书籍 - 按书名长度降序排列，优先匹配更长的
  let currentBook = null;
  let matchedLength = 0;
  
  for (let bookName in window.readingData) {
    if (pageTitle.includes(bookName) && bookName.length > matchedLength) {
      currentBook = bookName;
      matchedLength = bookName.length;
    }
  }
  
  // 如果匹配到书籍，渲染表格
  if (currentBook && window.readingBase) {
    window.readingBase.renderTable('reading-list', window.readingData[currentBook]);
    console.log(`✅ 已加载《${currentBook}》的阅读记录，共 ${window.readingData[currentBook].length} 个章节`);
  } else {
    console.warn('⚠️ 未找到匹配的书籍数据，当前页面标题：', pageTitle);
    console.log('📚 可用书籍列表：', Object.keys(window.readingData));
  }
});