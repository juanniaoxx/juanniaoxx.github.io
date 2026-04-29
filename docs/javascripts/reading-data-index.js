// ==================== 阅读数据索引 ====================
window.readingDataIndex = {
    "古文观止": "/javascripts/阅读记录/古文观止.js",
    "国史大纲": "/javascripts/阅读记录/国史大纲.js",
    "汉书": "/javascripts/阅读记录/汉书.js",
    "后汉书": "/javascripts/阅读记录/后汉书.js",
    "聊斋志异": "/javascripts/阅读记录/聊斋志异.js",
    "列宁选集": "/javascripts/阅读记录/列宁选集.js",
    "马恩选集": "/javascripts/阅读记录/马恩选集.js",
    "毛选": "/javascripts/阅读记录/毛选.js",
    "三国志": "/javascripts/阅读记录/三国志.js",
    "史记": "/javascripts/阅读记录/史记.js",
    "昭明文选": "/javascripts/阅读记录/昭明文选.js",
    "中国历代政治得失": "/javascripts/阅读记录/中国历代政治得失.js",
    "晋书": "/javascripts/阅读记录/晋书.js",
    "宋书": "/javascripts/阅读记录/宋书.js",
};

window.readingData = window.readingData || {};

window.loadBookData = function(bookName) {
    var path = window.readingDataIndex[bookName];
    if (!path) {
        return Promise.reject('no index for: ' + bookName);
    }
    if (window.readingData[bookName]) {
        return Promise.resolve(window.readingData[bookName]);
    }
    return new Promise(function(resolve, reject) {
        var s = document.createElement('script');
        s.src = path;
        s.onload = function() {
            if (window.readingData[bookName]) {
                resolve(window.readingData[bookName]);
            } else {
                reject('data not registered');
            }
        };
        s.onerror = function() {
            reject('load error: ' + path);
        };
        document.head.appendChild(s);
    });
};