document.addEventListener('DOMContentLoaded', () => {
  async function parseResponseSafely(resp) {
    try {
      const ct = resp.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        try {
          return await resp.clone().json();
        } catch (e) {
          try { const txt = await resp.clone().text(); return { __rawText: txt, __parseError: e.message }; } catch (e2) { return { __parseError: e.message }; }
        }
      }
      try { const txt = await resp.clone().text(); return { __rawText: txt }; } catch (e) { return { __parseError: e.message }; }
    } catch (err) {
      return { __parseError: String(err) };
    }
  }

  async function postWithPortFallback(path, payload) {
    // Try relative path first (same origin)
    async function tryFetch(url) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      try {
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        clearTimeout(timeout);
        return resp;
      } catch (err) {
        clearTimeout(timeout);
        throw err;
      }
    }

    // 1) try same-origin relative request
    try {
      const resp = await tryFetch(path);
      return { resp, base: window.location.origin };
    } catch (err) {
      console.warn('Relative fetch failed, will try known origins:', err.message || err);
    }

    // 2) try explicit origins (ports and protocol combinations)
    const knownPorts = ['3000', '8080', '48752'];
    const origins = [];
    const hostname = window.location.hostname || 'localhost';
    const currentProtocol = window.location.protocol || 'http:';
    // prefer current protocol, but also try the other one
    const protocols = [currentProtocol, currentProtocol === 'https:' ? 'http:' : 'https:'];

    for (const proto of protocols) {
      for (const p of [window.location.port, ...knownPorts].filter(Boolean)) {
        const portSegment = p === window.location.port ? '' : `:${p}`;
        origins.push(`${proto}//${hostname}${portSegment}`);
      }
    }

    // ensure unique
    const tried = new Set();
    const errors = [];
    for (const base of origins) {
      if (tried.has(base)) continue;
      tried.add(base);
      try {
        const resp = await tryFetch(`${base}${path}`);
        return { resp, base };
      } catch (err) {
        errors.push({ base, message: err.message || String(err) });
        // try next
      }
    }

    const summary = errors.map(e => `${e.base}: ${e.message}`).join('; ');
    throw new Error('Unable to contact API on known origins. Attempts: ' + summary);
  }

  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const { resp, base } = await postWithPortFallback('/api/login', { email, password });
      const data = await parseResponseSafely(resp);
      if (!resp.ok) {
        const errMsg = data && (data.error || data.__rawText || data.__parseError) || 'Invalid credentials';
        alert('❌ Login failed: ' + String(errMsg));
        return;
      }
      alert('✅ Login successful!');
      try { sessionStorage.setItem('user', JSON.stringify(data.user)); } catch(e) {}
      // redirect to the Dashboard page (relative path up to Thales/Dashboard)
      window.location.href = '../../Dashboard/dashboard.html';
    } catch (err) {
      alert('❌ Login failed: ' + err.message);
    }
  });
});
