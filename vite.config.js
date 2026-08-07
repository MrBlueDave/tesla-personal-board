import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

function profilesStoragePlugin() {
  const dataDir = path.resolve(__dirname, 'data');
  const filePath = path.resolve(dataDir, 'user_profiles.json');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const configPath = path.resolve(dataDir, 'config.json');

  function getMasterPassword() {
    try {
      if (fs.existsSync(configPath)) {
        const cfg = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        if (cfg && cfg.masterPassword) return String(cfg.masterPassword).trim();
      } else {
        const defaultCfg = { masterPassword: 'tesla' };
        fs.writeFileSync(configPath, JSON.stringify(defaultCfg, null, 2), 'utf-8');
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

  function handleMiddleware(req, res, next) {
    const reqUrl = req.url.split('?')[0];

    if (reqUrl === '/api/auth/status') {
      const expectedToken = generateAuthToken(getMasterPassword());
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ required: true, validToken: expectedToken }));
      return;
    }

    if (reqUrl === '/api/auth/login') {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            const inputPass = String(parsed.password || '').trim();
            const masterPass = getMasterPassword();
            res.setHeader('Content-Type', 'application/json');
            if (inputPass === masterPass) {
              const token = generateAuthToken(masterPass);
              res.end(JSON.stringify({ success: true, token }));
            } else {
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

    if (reqUrl === '/api/profiles') {
      if (req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json');
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          res.end(content || '{}');
        } else {
          res.end('{}');
        }
        return;
      }

      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } catch (err) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
          }
        });
        return;
      }
    }
    next();
  }

  return {
    name: 'profiles-storage-plugin',
    configureServer(server) {
      server.middlewares.use(handleMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleMiddleware);
    }
  };
}

export default defineConfig({
  plugins: [profilesStoragePlugin()],
  server: {
    port: 3000,
    host: true
  },
  preview: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
