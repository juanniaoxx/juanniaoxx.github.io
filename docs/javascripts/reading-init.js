// reading-init.js
document.addEventListener('DOMContentLoaded', function() {
    var title = (document.querySelector('h1') || {}).innerText || document.title || '';
    title = title.replace(/[^\u4e00-\u9fa5a-zA-Z0-9()（）《》]/g, '').trim();
    
    console.log('Title:', title);
    
    if (!window.readingDataIndex) {
        console.error('readingDataIndex is undefined! Check reading-data-index.js');
        return;
    }
    
    console.log('Index keys:', Object.keys(window.readingDataIndex));
    
    var book = null;
    var len = 0;
    for (var key in window.readingDataIndex) {
        if (title.indexOf(key) !== -1 && key.length > len) {
            book = key;
            len = key.length;
        }
    }
    
    if (!book) {
        console.warn('No match for:', title);
        return;
    }
    
    console.log('Loading:', book);
    
    window.loadBookData(book).then(function(data) {
        if (window.readingBase) {
            window.readingBase.renderTable('reading-list', data);
            console.log('OK:', data.length, 'chapters');
        }
    }).catch(function(err) {
        console.error('Fail:', err);
    });
});