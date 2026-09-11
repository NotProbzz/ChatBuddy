const fs = require('fs');
const html = fs.readFileSync('frontend/index.html', 'utf8');
const script = `
    <script>
      (function() {
        try {
          const orig = window.fetch;
          Object.defineProperty(window, 'fetch', {
            get: () => orig,
            set: (v) => { console.log('Prevented fetch override'); },
            configurable: true
          });
        } catch (e) { console.error('fetch patch failed', e); }
      })();
    </script>
`;
const newHtml = html.replace('<head>', '<head>' + script);
fs.writeFileSync('frontend/index.html', newHtml);
