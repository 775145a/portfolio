const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT_HTTPS = 443;
const PORT_HTTP = 80;
const ROOT = __dirname;
const PFX = path.join(ROOT, 'server.pfx');
const PASS = 'mohammed';
const DATA_DIR = path.join(ROOT, 'data');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const SYNC_FILE = path.join(DATA_DIR, 'sync.json');

// Ensure data dirs exist
[DATA_DIR, BACKUP_DIR].forEach(function(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

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

function parseBody(req) {
  return new Promise(function(resolve) {
    var chunks = [];
    req.on('data', function(c) { chunks.push(c); });
    req.on('end', function() {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
      catch(e) { resolve(null); }
    });
  });
}

function serveStatic(req, res) {
  var urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';
  var filePath = path.join(ROOT, urlPath);
  var ext = path.extname(filePath).toLowerCase();
  fs.readFile(filePath, function(err, data) {
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
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    });
    res.end(data);
  });
}

function writeJSON(res, code, data) {
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(data));
}

function handleAPI(req, res) {
  var urlPath = req.url.split('?')[0];

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  // POST /api/backup - Create a backup
  if (req.method === 'POST' && urlPath === '/api/backup') {
    parseBody(req).then(function(body) {
      if (!body || !body.data) return writeJSON(res, 400, { error: 'Missing data' });
      var id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      var backup = {
        id: id,
        pharmacyName: body.pharmacyName || '',
        date: new Date().toISOString(),
        data: body.data,
      };
      fs.writeFile(path.join(BACKUP_DIR, id + '.json'), JSON.stringify(backup, null, 2), function(err) {
        if (err) return writeJSON(res, 500, { error: 'Write failed' });
        // Keep only last 50 backups
        fs.readdir(BACKUP_DIR, function(_, files) {
          var backups = files.filter(function(f) { return f.endsWith('.json'); }).sort();
          while (backups.length > 50) {
            var old = backups.shift();
            try { fs.unlinkSync(path.join(BACKUP_DIR, old)); } catch(e) {}
          }
        });
        writeJSON(res, 200, { success: true, id: id, date: backup.date });
      });
    });
    return;
  }

  // GET /api/backup - List backups
  if (req.method === 'GET' && urlPath === '/api/backup') {
    fs.readdir(BACKUP_DIR, function(err, files) {
      if (err) return writeJSON(res, 200, { backups: [] });
      var backups = files.filter(function(f) { return f.endsWith('.json'); }).sort().reverse().slice(0, 50);
      var result = [];
      var pending = backups.length;
      if (pending === 0) return writeJSON(res, 200, { backups: [] });
      backups.forEach(function(f) {
        fs.readFile(path.join(BACKUP_DIR, f), function(_, data) {
          try {
            var b = JSON.parse(data);
            result.push({ id: b.id, pharmacyName: b.pharmacyName, date: b.date });
          } catch(e) {}
          pending--;
          if (pending === 0) writeJSON(res, 200, { backups: result });
        });
      });
    });
    return;
  }

  // GET /api/backup/:id - Get specific backup
  var matchBackup = urlPath.match(/^\/api\/backup\/([a-z0-9]+)$/);
  if (req.method === 'GET' && matchBackup) {
    var bid = matchBackup[1];
    fs.readFile(path.join(BACKUP_DIR, bid + '.json'), function(err, data) {
      if (err) return writeJSON(res, 404, { error: 'Backup not found' });
      try { writeJSON(res, 200, JSON.parse(data)); }
      catch(e) { writeJSON(res, 500, { error: 'Corrupted backup' }); }
    });
    return;
  }

  // DELETE /api/backup/:id - Delete a backup
  if (req.method === 'DELETE' && matchBackup) {
    var did = matchBackup[1];
    fs.unlink(path.join(BACKUP_DIR, did + '.json'), function(err) {
      if (err) return writeJSON(res, 404, { error: 'Backup not found' });
      writeJSON(res, 200, { success: true });
    });
    return;
  }

  // POST /api/sync - Sync data to cloud
  if (req.method === 'POST' && urlPath === '/api/sync') {
    parseBody(req).then(function(body) {
      if (!body || !body.data) return writeJSON(res, 400, { error: 'Missing data' });
      var syncRecord = {
        pharmacyName: body.pharmacyName || '',
        date: new Date().toISOString(),
        data: body.data,
      };
      fs.writeFile(SYNC_FILE, JSON.stringify(syncRecord, null, 2), function(err) {
        if (err) return writeJSON(res, 500, { error: 'Sync failed' });
        writeJSON(res, 200, { success: true, date: syncRecord.date });
      });
    });
    return;
  }

  // GET /api/sync - Get synced data
  if (req.method === 'GET' && urlPath === '/api/sync') {
    fs.readFile(SYNC_FILE, function(err, data) {
      if (err) return writeJSON(res, 404, { error: 'No synced data' });
      try { writeJSON(res, 200, JSON.parse(data)); }
      catch(e) { writeJSON(res, 500, { error: 'Corrupted sync data' }); }
    });
    return;
  }

  // Fallback to static
  serveStatic(req, res);
}

// HTTPS Server
var sslOptions;
try {
  sslOptions = { pfx: fs.readFileSync(PFX), passphrase: PASS };
  https.createServer(sslOptions, handleAPI).listen(PORT_HTTPS, function() {
    console.log('\uD83D\uDD12 HTTPS Server running on https://mohammedpro.com:' + PORT_HTTPS);
  });
} catch(e) {
  console.log('HTTPS certificate not found, fallback to HTTP only');
  // Use HTTP-only mode if no cert
  var server = http.createServer(handleAPI);
  server.listen(3000, function() {
    console.log('HTTP Server running on http://localhost:3000');
  });
  // Try HTTPS anyway
  try {
    https.createServer(sslOptions, handleAPI).listen(PORT_HTTPS, function() {
      console.log('\uD83D\uDD12 HTTPS also active on port ' + PORT_HTTPS);
    });
  } catch(e2) {}
}

// HTTP -> HTTPS redirect
http.createServer(function(req, res) {
  var host = req.headers.host || 'mohammedpro.com';
  res.writeHead(301, { Location: 'https://' + host + req.url });
  res.end();
}).listen(PORT_HTTP, function() {
  console.log('HTTP -> HTTPS redirect active on port ' + PORT_HTTP);
});

console.log('Server root: ' + ROOT);
console.log('Backups: ' + BACKUP_DIR);
