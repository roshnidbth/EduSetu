const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const BASE_DIR = path.join(__dirname, 'Mentor-1.0.0');
const USERS_FILE = path.join(__dirname, 'users.json');

// Ensure users file exists and is empty as requested
try {
  fs.writeFileSync(USERS_FILE, '[]', { encoding: 'utf8' });
  console.log('Initialized empty users database at', USERS_FILE);
} catch (err) {
  console.error('Failed to initialize users database', err);
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.map': 'application/json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf'
};

function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJSON(res, obj, status = 200) {
  const data = JSON.stringify(obj);
  setCORS(res);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(data);
}

function hashPassword(password, salt = null) {
  salt = salt || crypto.randomBytes(16).toString('hex');
  const derived = crypto.pbkdf2Sync(password, salt, 310000, 64, 'sha256').toString('hex');
  return { salt, hash: derived };
}

function readUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const safe = path.normalize(decoded).replace(/^([/\\])+/, '');
  return path.join(BASE_DIR, safe);
}

function serveFile(res, filePath, status = 200) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) {
      setCORS(res);
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }
    setCORS(res);
    res.writeHead(status, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  // Handle CORS preflight requests early
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }
  // API: signup
  if (req.method === 'POST' && req.url === '/api/signup') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { fullname, username, email, password } = payload;
        if (!fullname || !username || !email || !password) {
          return sendJSON(res, { ok: false, error: 'Missing fields' }, 400);
        }
        const users = readUsers();
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
          return sendJSON(res, { ok: false, error: 'Email already registered' }, 409);
        }
        if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
          return sendJSON(res, { ok: false, error: 'Username already taken' }, 409);
        }
        const { salt, hash } = hashPassword(password);
        const id = crypto.randomBytes(12).toString('hex');
        const user = { id, fullname, username, email, salt, hash, createdAt: new Date().toISOString() };
        users.push(user);
        writeUsers(users);
        return sendJSON(res, { ok: true, id });
      } catch (err) {
        console.error('Signup error', err);
        return sendJSON(res, { ok: false, error: 'Invalid request' }, 400);
      }
    });
    return;
  }

  // API: login
  if (req.method === 'POST' && req.url === '/api/login') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { email, password } = payload;
        if (!email || !password) {
          return sendJSON(res, { ok: false, error: 'Missing credentials' }, 400);
        }
        const users = readUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) return sendJSON(res, { ok: false, error: 'Invalid email or password' }, 401);
        const { hash } = hashPassword(password, user.salt);
        if (hash !== user.hash) return sendJSON(res, { ok: false, error: 'Invalid email or password' }, 401);
        // Authentication successful - return basic user info (no sensitive data)
        return sendJSON(res, { ok: true, user: { id: user.id, fullname: user.fullname, username: user.username, email: user.email } });
      } catch (err) {
        console.error('Login error', err);
        return sendJSON(res, { ok: false, error: 'Invalid request' }, 400);
      }
    });
    return;
  }

  // API: Chat (proxy to OpenAI ChatCompletion)
  if (req.method === 'POST' && req.url === '/api/chat') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const message = payload.message || (payload.messages && payload.messages.slice(-1)[0]?.content) || '';
        if (!message) return sendJSON(res, { ok: false, error: 'Missing message' }, 400);
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) return sendJSON(res, { ok: false, error: 'OpenAI key not configured' }, 500);
        const chatResp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: message }], max_tokens: 500 })
        });
        const chatJson = await chatResp.json();
        const reply = chatJson?.choices?.[0]?.message?.content || (chatJson?.error?.message) || '';
        return sendJSON(res, { ok: true, reply, raw: chatJson });
      } catch (err) {
        console.error('Chat error', err);
        return sendJSON(res, { ok: false, error: 'Chat failed' }, 500);
      }
    });
    return;
  }

  // API: TTS - generate speech for given text via OpenAI (returns audio/mpeg)
  if (req.method === 'POST' && req.url === '/api/tts') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const text = payload.text || '';
        if (!text) return sendJSON(res, { ok: false, error: 'Missing text' }, 400);
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) return sendJSON(res, { ok: false, error: 'OpenAI key not configured' }, 500);
        // Call OpenAI TTS endpoint
        const ttsResp = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg'
          },
          body: JSON.stringify({ model: 'gpt-4o-mini-tts', voice: 'alloy', input: text })
        });
        if (!ttsResp.ok) {
          const txt = await ttsResp.text();
          console.error('TTS error', txt);
          return sendJSON(res, { ok: false, error: 'TTS failed', raw: txt }, 500);
        }
        // Stream audio back
        res.writeHead(200, { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-cache' });
        const arrayBuffer = await ttsResp.arrayBuffer();
        res.end(Buffer.from(arrayBuffer));
      } catch (err) {
        console.error('TTS error', err);
        return sendJSON(res, { ok: false, error: 'TTS failed' }, 500);
      }
    });
    return;
  }

  // API: STT - accept base64 audio and transcribe via OpenAI Whisper
  if (req.method === 'POST' && req.url === '/api/stt') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const b64 = payload.audio || '';
        if (!b64) return sendJSON(res, { ok: false, error: 'Missing audio' }, 400);
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) return sendJSON(res, { ok: false, error: 'OpenAI key not configured' }, 500);
        const buffer = Buffer.from(b64, 'base64');
        const form = new FormData();
        const blob = new Blob([buffer]);
        form.append('file', blob, 'audio.webm');
        form.append('model', 'whisper-1');
        const sttResp = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}` },
          body: form
        });
        const sttJson = await sttResp.json();
        return sendJSON(res, { ok: true, text: sttJson.text, raw: sttJson });
      } catch (err) {
        console.error('STT error', err);
        return sendJSON(res, { ok: false, error: 'STT failed' }, 500);
      }
    });
    return;
  }

  // Serve static files
  if (!req.url) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad Request');
    return;
  }

  let requestedPath = safePath(req.url);

  fs.stat(requestedPath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      const indexPath = path.join(requestedPath, 'index.html');
      return serveFile(res, indexPath);
    }

    if (err || !stats || !stats.isFile()) {
      // Fallback to index.html for SPA-like navigation and root
      const fallback = path.join(BASE_DIR, 'index.html');
      return serveFile(res, fallback);
    }

    return serveFile(res, requestedPath);
  });
});

function startServer(port, attemptsLeft = 10) {
  const listener = server.listen(port);
  listener.on('listening', () => {
    console.log(`Thales static server running on http://localhost:${port} serving ${BASE_DIR}`);
  });
  listener.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE' && attemptsLeft > 0) {
      console.warn(`Port ${port} in use, trying ${port + 1}...`);
      setTimeout(() => startServer(port + 1, attemptsLeft - 1), 250);
      return;
    }
    console.error('Server failed to start:', err);
    process.exit(1);
  });
}

startServer(PORT);
