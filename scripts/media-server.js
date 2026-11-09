/**
 * Local media server — the same layout GitHub Pages will serve.
 *
 *   node scripts/media-server.js [port]
 *
 * Serves `media/` (catalog.json + videos/*.mp4) with byte-range support so the
 * browser can seek, and permissive CORS so the Expo dev server on :8081 can
 * read it. In production the identical directory is published to GitHub Pages
 * by .github/workflows/media.yml.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'media');
const PORT = Number(process.argv[2] || process.env.MEDIA_PORT || 8090);

const TYPES = {
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8',
};

function send(res, status, headers, body) {
  res.writeHead(status, headers);
  res.end(body);
}

const server = http.createServer((req, res) => {
  // Same-origin isolation does not apply here: the app runs on :8081.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');

  if (req.method === 'OPTIONS') {
    send(res, 204, {}, '');
    return;
  }

  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const rel = urlPath === '/' ? '/catalog.json' : urlPath;
  const file = path.join(ROOT, path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));

  if (!file.startsWith(ROOT)) {
    send(res, 403, { 'Content-Type': 'text/plain' }, 'Forbidden');
    return;
  }

  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) {
      send(res, 404, { 'Content-Type': 'text/plain' }, 'Not found: ' + rel);
      return;
    }

    const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
    const range = req.headers.range;

    // Byte ranges are what make <video> seeking work; GitHub Pages serves these
    // too, so local and hosted behaviour match.
    if (range) {
      const m = /bytes=(\d*)-(\d*)/.exec(range);
      const start = m && m[1] ? parseInt(m[1], 10) : 0;
      const end = m && m[2] ? parseInt(m[2], 10) : stat.size - 1;
      if (start >= stat.size || end >= stat.size || start > end) {
        send(
          res,
          416,
          { 'Content-Range': `bytes */${stat.size}` },
          ''
        );
        return;
      }
      const chunk = end - start + 1;
      res.writeHead(206, {
        'Content-Type': type,
        'Content-Length': chunk,
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache',
      });
      fs.createReadStream(file, { start, end }).pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Type': type,
      'Content-Length': stat.size,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-cache',
    });
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    fs.createReadStream(file).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Media server: http://127.0.0.1:${PORT}/  (root: ${ROOT})`);
});
