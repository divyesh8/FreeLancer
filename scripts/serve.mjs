import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve(process.argv.includes('--dist') ? 'dist' : '.');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' };
createServer(async (req, res) => {
  try { const url = new URL(req.url, 'http://localhost'); const path = resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname)); if (!path.startsWith(root + sep)) { res.writeHead(403).end(); return; } const data = await readFile(path); res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-cache' }); res.end(data); }
  catch { res.writeHead(404, {'Content-Type':'text/html; charset=utf-8'}); try { res.end(await readFile(resolve(root,'404.html'))); } catch { res.end('Not found'); } }
}).listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));
