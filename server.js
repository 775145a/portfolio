const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT_HTTPS = 443;
const PORT_HTTP = 80;
const ROOT = __dirname;
const PFX = path.join(ROOT, 'server.pfx');
const PASS = 'mohammed';

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
};

function serve(req, res) {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(ROOT, urlPath);
  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 - الصفحة غير موجودة</h1><a href="/">العودة للرئيسية</a>');
      } else {
        res.writeHead(500);
        res.end('500 Server Error');
      }
      return;
    }
    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    });
    res.end(data);
  });
}

// HTTPS Server
const sslOptions = {
  pfx: fs.readFileSync(PFX),
  passphrase: PASS,
};

https.createServer(sslOptions, serve).listen(PORT_HTTPS, () => {
  console.log(`🔒 HTTPS Server running on https://mohammedpro.com:${PORT_HTTPS}`);
});

// HTTP → HTTPS redirect
http.createServer((req, res) => {
  const host = req.headers.host || 'mohammedpro.com';
  res.writeHead(301, { Location: `https://${host}${req.url}` });
  res.end();
}).listen(PORT_HTTP, () => {
  console.log(`↪️ HTTP → HTTPS redirect active on port ${PORT_HTTP}`);
});

console.log(`📂 Serving: ${ROOT}`);
