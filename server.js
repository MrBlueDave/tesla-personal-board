/**
 * PRODUCTION HTTP & API SERVER FOR TESLA PERSONAL BOARD
 * Serves built static assets from /dist or root and persists multi-user profiles (/api/profiles) to disk.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Auto-detect static files directory (either ./dist if built, or current directory)
const DIST_DIR = fs.existsSync(path.join(__dirname, 'dist'))
  ? path.join(__dirname, 'dist')
  : __dirname;

const DATA_DIR = path.join(__dirname, 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const PROFILES_FILE = path.join(DATA_DIR, 'user_profiles.json');

function getMasterPassword() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const cfg = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      if (cfg && cfg.masterPassword) return String(cfg.masterPassword).trim();
    } else {
      const defaultCfg = { masterPassword: 'tesla' };
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultCfg, null, 2), 'utf-8');
      console.log('🔑 Created default data/config.json with password "tesla"');
      return 'tesla';
    }
  } catch (e) {}
  return 'tesla';
}

function generateAuthToken(password) {
  let hash = 0;
  const str = `tesla_token_${password}_salt_v1`;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return 'token_' + Math.abs(hash).toString(36);
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  // Allow CORS headers for cross-origin and proxy access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const reqUrl = req.url.split('?')[0];

  // API Endpoint: /api/auth/status
  if (reqUrl === '/api/auth/status') {
    const expectedToken = generateAuthToken(getMasterPassword());
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ required: true, validToken: expectedToken }));
    return;
  }

  // API Endpoint: /api/auth/login
  if (reqUrl === '/api/auth/login') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          const inputPass = String(parsed.password || '').trim();
          const masterPass = getMasterPassword();
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          if (inputPass === masterPass) {
            const token = generateAuthToken(masterPass);
            console.log('🔑 [POST /api/auth/login] Successful authentication from browser');
            res.end(JSON.stringify({ success: true, token }));
          } else {
            console.log('🔒 [POST /api/auth/login] Failed authentication attempt');
            res.statusCode = 401;
            res.end(JSON.stringify({ success: false, error: 'Password non corretta' }));
          }
        } catch (e) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }
  }

  // API Endpoint: /api/profiles
  if (reqUrl === '/api/profiles') {
    if (req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      try {
        if (fs.existsSync(PROFILES_FILE)) {
          const data = fs.readFileSync(PROFILES_FILE, 'utf-8');
          console.log(`[GET /api/profiles] Serving profiles file (${data.length} bytes)`);
          res.end(data || '{}');
        } else {
          console.log('[GET /api/profiles] File does not exist yet, returning empty object');
          res.end('{}');
        }
      } catch (err) {
        console.error('❌ Error reading user_profiles.json:', err.message);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
          }
          fs.writeFileSync(PROFILES_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
          console.log(`✅ [POST /api/profiles] Profiles saved successfully to disk! Active PIN: ${parsed.activePin || 'N/A'}`);
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ success: true }));
        } catch (err) {
          console.error('❌ Error saving user_profiles.json:', err.message);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }
  }

  // Static File Serving
  let filePath = path.join(DIST_DIR, reqUrl === '/' ? 'index.html' : reqUrl);

  // Security check against directory traversal
  if (!filePath.startsWith(DIST_DIR) && DIST_DIR !== __dirname) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA / client-side routing
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Tesla Board Production Server listening on http://0.0.0.0:${PORT}`);
  console.log(`📁 Static files folder: ${DIST_DIR}`);
  console.log(`💾 Profiles file path: ${PROFILES_FILE}`);
});
