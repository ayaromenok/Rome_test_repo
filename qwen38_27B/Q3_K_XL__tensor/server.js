/* server.js - tiny static web server for the Rome game.
   Serves the current directory on http://192.168.1.103:7998 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const HOST = '192.168.1.103';
const PORT = 7998;
const ROOT = __dirname;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/plain; charset=utf-8',
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const file = path.join(ROOT, path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, ''));
  if (!file.startsWith(ROOT)) { res.writeHead(403); res.end('Forbidden'); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('404 Not Found'); return; }
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
}).listen(PORT, HOST, () => {
  console.log(`Ancient Rome server running:`);
  console.log(`  http://${HOST}:${PORT}`);
  console.log(`  http://127.0.0.1:${PORT}`);
});
