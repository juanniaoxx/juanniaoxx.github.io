document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.href.includes(window.location.host)) {
            const img = document.createElement('img');
            img.src = `https://www.google.com/s2/favicons?domain=${new URL(link.href).hostname}`;
            img.style.cssText = 'width:16px;height:16px;margin-right:4px;vertical-align:middle';
            link.prepend(img);
        }
    });
});