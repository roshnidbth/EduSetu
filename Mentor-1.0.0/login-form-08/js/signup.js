const form = document.querySelector('form');
const messageDiv = document.getElementById('signup-message');

function showMessage(text, type = 'error') {
  if (!messageDiv) return;
  messageDiv.textContent = text;
  messageDiv.className = `alert-message visible ${type}`;
}

function clearMessage() {
  if (!messageDiv) return;
  messageDiv.textContent = '';
  messageDiv.className = 'alert-message';
}

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

form && form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearMessage();

  const fullname = document.getElementById('fullname').value.trim();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm_password').value;
  const termsChecked = document.querySelector('.control input[type="checkbox"]')?.checked;

  if (!fullname || !username || !email || !password || !confirm) {
    showMessage('Please fill out all fields.', 'error');
    return;
  }
  if (password !== confirm) {
    showMessage('Passwords do not match.', 'error');
    return;
  }
  if (!termsChecked) {
    showMessage('You must accept the Terms & Conditions.', 'error');
    return;
  }

  showMessage('Creating your account...', 'success');

  try {
    // try multiple ports in case frontend and backend are on different ports
    async function tryFetch(url, payload) {
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

    async function postWithFallback(path, payload) {
      // 1) try same-origin relative path first
      try {
        const resp = await tryFetch(path, payload);
        return { resp, base: window.location.origin };
      } catch (err) {
        console.warn('Relative fetch failed, will try known origins:', err.message || err);
      }

      const knownPorts = ['3000', '8080', '48752'];
      const hostname = window.location.hostname || 'localhost';
      const currentProtocol = window.location.protocol || 'http:';
      const protocols = [currentProtocol, currentProtocol === 'https:' ? 'http:' : 'https:'];

      const origins = [];
      for (const proto of protocols) {
        for (const p of [window.location.port, ...knownPorts].filter(Boolean)) {
          const portSegment = p === window.location.port ? '' : `:${p}`;
          origins.push(`${proto}//${hostname}${portSegment}`);
        }
      }

      const tried = new Set();
      const errors = [];
      for (const base of origins) {
        if (tried.has(base)) continue;
        tried.add(base);
        try {
          const resp = await tryFetch(`${base}${path}`, payload);
          return { resp, base };
        } catch (err) {
          errors.push({ base, message: err.message || String(err) });
        }
      }

      const summary = errors.map(e => `${e.base}: ${e.message}`).join('; ');
      throw new Error('Unable to contact API on known origins. Attempts: ' + summary);
    }

    const { resp, base } = await postWithFallback('/api/signup', { fullname, username, email, password });
    const data = await parseResponseSafely(resp);
    if (!resp.ok) {
      const errMsg = data && (data.error || data.__rawText || data.__parseError) || 'Registration failed.';
      showMessage(String(errMsg).trim(), 'error');
      return;
    }

    showMessage('Registration successful. Redirecting to login...', 'success');
    setTimeout(() => {
      window.location.href = `${base}/login-form-08/login.html`;
    }, 1000);
  } catch (err) {
    showMessage(err.message || 'Unexpected error. Please try again later.', 'error');
  }
});
