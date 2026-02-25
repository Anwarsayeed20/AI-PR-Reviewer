/* ============================================================
   PR GUARDIAN AI — Frontend Application Logic
   SPA routing, API client, animations, terminal effects
   ============================================================ */

// ==========================
// CONFIG
// ==========================
const DEFAULT_API_BASE = 'http://localhost:8000';

function getApiBase() {
  // If served from the backend (Render, etc.), use same origin
  const loc = window.location;
  if (loc.pathname.startsWith('/app') || loc.pathname.startsWith('/static')) {
    return loc.origin;
  }
  const el = document.getElementById('apiBaseUrl');
  return (el ? el.value : localStorage.getItem('apiBaseUrl') || DEFAULT_API_BASE).replace(/\/$/, '');
}

function setApiBase(url) {
  localStorage.setItem('apiBaseUrl', url);
}

// ==========================
// SPA ROUTER
// ==========================
const PAGES = ['home', 'dashboard', 'setup', 'status', 'docs', 'privacy', 'terms', 'support'];

function navigateTo(page) {
  if (!PAGES.includes(page)) page = 'home';

  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Show target page
  const target = document.getElementById(`page-${page}`);
  if (target) target.classList.add('active');

  // Update nav links
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });

  // Update hash
  window.location.hash = page;

  // Close mobile menu
  document.getElementById('navLinks')?.classList.remove('open');

  // Scroll to top
  window.scrollTo(0, 0);

  // Page-specific init
  if (page === 'status') initStatusPage();
}

function handleHashChange() {
  const hash = window.location.hash.replace('#', '') || 'home';
  navigateTo(hash);
}

// ==========================
// MOBILE NAV TOGGLE
// ==========================
function toggleNav() {
  document.getElementById('navLinks')?.classList.toggle('open');
}

// ==========================
// API CLIENT
// ==========================
async function apiCall(path, options = {}) {
  const base = getApiBase();
  const url = `${base}${path}`;

  try {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(`Cannot reach server at ${base}. Is the backend running?`);
    }
    throw err;
  }
}

// ==========================
// TOAST NOTIFICATIONS
// ==========================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span> ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ==========================
// MATRIX RAIN BACKGROUND
// ==========================
function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF{}[]<>/\\|';
  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff41';
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(draw, 50);
}

// ==========================
// HERO TERMINAL TYPING
// ==========================
function initHeroTerminal() {
  const terminal = document.getElementById('heroTerminal');
  if (!terminal) return;

  const lines = [
    { type: 'cmd', text: '$ pr-guardian --init' },
    { type: 'output', text: '⟩ Connecting to GitHub App...' },
    { type: 'success', text: '✓ GitHub App authenticated (Installation #2752024)' },
    { type: 'cmd', text: '$ pr-guardian --providers' },
    { type: 'info', text: '⟩ Available LLM providers:' },
    { type: 'output', text: '  [1] 🤗 HuggingFace  (Qwen2.5-Coder-7B)' },
    { type: 'output', text: '  [2] ⚡ Groq         (Llama-3.3-70B)' },
    { type: 'output', text: '  [3] 💎 Gemini       (Gemini-2.0-Flash)' },
    { type: 'output', text: '  [4] 🧠 Cerebras     (Llama-3.1-8B)' },
    { type: 'output', text: '  [5] 🔀 OpenRouter   (Auto-select)' },
    { type: 'cmd', text: '$ pr-guardian --watch' },
    { type: 'success', text: '✓ Watching for pull requests...' },
    { type: 'info', text: '⟩ Ready. AI reviews will be posted automatically.' },
  ];

  let lineIndex = 0;

  function addLine() {
    if (lineIndex >= lines.length) return;

    const line = lines[lineIndex];
    const div = document.createElement('div');

    if (line.type === 'cmd') {
      div.className = 'line';
      div.innerHTML = `<span class="prompt">❯</span><span class="cmd">${escapeHtml(line.text)}</span>`;
    } else {
      div.className = `line ${line.type}`;
      div.textContent = line.text;
    }

    div.style.opacity = '0';
    div.style.transform = 'translateY(5px)';
    terminal.appendChild(div);

    requestAnimationFrame(() => {
      div.style.transition = 'all 0.2s ease';
      div.style.opacity = '1';
      div.style.transform = 'translateY(0)';
    });

    terminal.scrollTop = terminal.scrollHeight;
    lineIndex++;

    const delay = line.type === 'cmd' ? 600 : 250;
    setTimeout(addLine, delay);
  }

  setTimeout(addLine, 800);
}

// ==========================
// ESCAPE HTML
// ==========================
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ==========================
// DASHBOARD LOGIC
// ==========================
async function lookupInstallation() {
  const instId = document.getElementById('dashInstId')?.value;
  if (!instId) { showToast('Enter an Installation ID', 'error'); return; }

  const btn = document.getElementById('dashLookupBtn');
  btn.innerHTML = '<span class="spinner spinner-sm"></span> Loading...';
  btn.disabled = true;

  try {
    const data = await apiCall(`/installations/${instId}`);
    displayInstallationData(data, instId);
  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
    document.getElementById('dashResults').innerHTML = renderEmptyState('Error loading installation data');
  } finally {
    btn.innerHTML = '⟩ Fetch';
    btn.disabled = false;
  }
}

async function lookupUserInstallations() {
  const userId = document.getElementById('dashUserId')?.value;
  if (!userId) { showToast('Enter a User ID', 'error'); return; }

  const btn = document.getElementById('dashUserLookupBtn');
  btn.innerHTML = '<span class="spinner spinner-sm"></span> Loading...';
  btn.disabled = true;

  try {
    const data = await apiCall(`/users/${userId}/installations`);
    displayUserInstallations(data, userId);
  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
    document.getElementById('dashResults').innerHTML = renderEmptyState('Error loading user installations');
  } finally {
    btn.innerHTML = '⟩ Fetch';
    btn.disabled = false;
  }
}

function displayInstallationData(data, instId) {
  const results = document.getElementById('dashResults');

  if (data.exists === false || !data.installationId) {
    results.innerHTML = `
      <div class="card">
        <h3 class="card-title" style="color: var(--neon-orange);">⚠ No configuration found</h3>
        <p class="card-desc" style="margin-top: var(--space-sm);">Installation #${instId} exists on GitHub but hasn't been configured yet.</p>
        <button class="btn btn-primary btn-sm" style="margin-top: var(--space-md);" onclick="navigateTo('setup'); document.getElementById('setupInstId').value='${instId}';">
          ⚙ Configure Now
        </button>
      </div>`;
    return;
  }

  const repos = data.selectedRepos || [];
  const reviewer = data.reviewer || {};

  results.innerHTML = `
    <div class="card" style="margin-bottom: var(--space-lg);">
      <div class="card-header">
        <h3 class="card-title">📋 Installation #${data.installationId}</h3>
        <span class="status-badge status-ok"><span class="dot"></span> Configured</span>
      </div>
      <table class="data-table" style="margin-top: var(--space-md);">
        <tr><td style="color:var(--text-muted); width:140px;">User ID</td><td>${escapeHtml(data.userId)}</td></tr>
        <tr><td style="color:var(--text-muted);">Provider</td><td style="text-transform:capitalize;">${escapeHtml(reviewer.provider || '—')}</td></tr>
        <tr><td style="color:var(--text-muted);">Model</td><td><code style="color:var(--neon-cyan);">${escapeHtml(reviewer.model || '—')}</code></td></tr>
        <tr><td style="color:var(--text-muted);">Created</td><td>${data.createdAt ? new Date(data.createdAt).toLocaleString() : '—'}</td></tr>
        <tr><td style="color:var(--text-muted);">Updated</td><td>${data.updatedAt ? new Date(data.updatedAt).toLocaleString() : '—'}</td></tr>
      </table>
    </div>

    <div class="card">
      <h3 class="card-title" style="margin-bottom: var(--space-md);">📂 Selected Repositories (${repos.length})</h3>
      ${repos.length === 0 ? '<p class="card-desc">No repositories selected.</p>' : `
        <table class="data-table">
          <thead><tr><th>Repo Name</th><th>ID</th></tr></thead>
          <tbody>
            ${repos.map(r => `
              <tr>
                <td><a href="https://github.com/${r.fullName}" target="_blank">${escapeHtml(r.fullName)}</a></td>
                <td style="color:var(--text-muted);">${r.repoId || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>`;
}

function displayUserInstallations(data, userId) {
  const results = document.getElementById('dashResults');

  if (!data || data.length === 0) {
    results.innerHTML = renderEmptyState(`No installations found for user "${userId}"`);
    return;
  }

  results.innerHTML = `
    <h3 style="margin-bottom: var(--space-md); font-size: 1rem;">
      Installations for <span style="color:var(--neon-green);">${escapeHtml(userId)}</span> (${data.length})
    </h3>
    ${data.map(inst => `
      <div class="card" style="margin-bottom: var(--space-md); cursor:pointer;" onclick="document.getElementById('dashInstId').value='${inst.installationId}'; lookupInstallation();">
        <div class="card-header">
          <span class="card-title"># ${inst.installationId}</span>
          <span class="status-badge status-ok"><span class="dot"></span> Active</span>
        </div>
        <p class="card-desc">
          Provider: <strong style="text-transform:capitalize;">${inst.reviewer?.provider || '—'}</strong> ·
          Model: <code style="color:var(--neon-cyan);">${inst.reviewer?.model || '—'}</code> ·
          Repos: ${(inst.selectedRepos || []).length}
        </p>
      </div>
    `).join('')}`;
}

function renderEmptyState(msg) {
  return `<div class="empty-state"><div class="empty-icon">◧</div><p>${msg}</p></div>`;
}

// ==========================
// SETUP WIZARD LOGIC
// ==========================
let setupState = {
  installationId: null,
  username: null,
  repos: [],
  selectedRepos: [],
};

async function setupFetchInfo() {
  const instId = document.getElementById('setupInstId')?.value;
  if (!instId) { showToast('Enter an Installation ID', 'error'); return; }

  const btn = document.getElementById('setupFetchBtn');
  const status = document.getElementById('setupStep1Status');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner spinner-sm"></span> Fetching...';
  status.style.display = 'inline-flex';

  try {
    // Fetch GitHub user info
    const username = await apiCall(`/installations/${instId}/info`);
    setupState.installationId = parseInt(instId);
    setupState.username = typeof username === 'string' ? username : JSON.stringify(username);

    // Show username
    document.getElementById('setupUsername').textContent = setupState.username;
    document.getElementById('setupUserInfo').style.display = 'block';
    status.className = 'status-badge status-ok';
    status.innerHTML = '<span class="dot"></span> Connected';

    showToast(`Connected as ${setupState.username}`, 'success');

    // Now fetch repos
    await setupFetchRepos(instId);

  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
    status.className = 'status-badge status-error';
    status.innerHTML = '<span class="dot"></span> Failed';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '⟩ Fetch Installation Info';
  }
}

async function setupFetchRepos(instId) {
  const step2 = document.getElementById('setupStep2');
  const step2Status = document.getElementById('setupStep2Status');
  step2.style.display = 'block';
  step2Status.style.display = 'inline-flex';

  try {
    const data = await apiCall(`/api/repos/${instId}`);
    const repos = data.repositories || [];
    setupState.repos = repos;

    const list = document.getElementById('setupRepoList');
    if (repos.length === 0) {
      list.innerHTML = '<p style="color:var(--text-muted); padding:var(--space-md);">No repositories found for this installation.</p>';
    } else {
      list.innerHTML = repos.map((r, i) => `
        <div class="checkbox-item">
          <input type="checkbox" id="repo-${i}" value="${r.id}" data-fullname="${r.full_name}" checked>
          <label for="repo-${i}">${escapeHtml(r.full_name)}</label>
        </div>
      `).join('');
    }

    step2Status.className = 'status-badge status-ok';
    step2Status.innerHTML = `<span class="dot"></span> ${repos.length} repos`;

    // Show steps 3 & 4
    document.getElementById('setupStep3').style.display = 'block';
    document.getElementById('setupStep4').style.display = 'block';

  } catch (err) {
    step2Status.className = 'status-badge status-error';
    step2Status.innerHTML = '<span class="dot"></span> Failed to load';

    // Still show steps 3 & 4 so user can type repos manually
    document.getElementById('setupStep3').style.display = 'block';
    document.getElementById('setupStep4').style.display = 'block';

    showToast(`Could not load repos: ${err.message}`, 'error');
  }
}

function updateModelOptions() {
  const provider = document.getElementById('setupProvider')?.value;
  const modelInput = document.getElementById('setupModel');

  const defaults = {
    huggingface: 'Qwen/Qwen2.5-Coder-7B-Instruct',
    groq: 'llama-3.3-70b-versatile',
    gemini: 'gemini-2.0-flash',
    cerebras: 'llama-3.1-8b',
    openrouter: 'auto',
  };

  if (modelInput) {
    modelInput.value = defaults[provider] || '';
  }
}

async function saveSetup() {
  const btn = document.getElementById('setupSaveBtn');
  btn.innerHTML = '<span class="spinner spinner-sm"></span> Saving...';
  btn.disabled = true;

  try {
    // Gather selected repos
    const checkboxes = document.querySelectorAll('#setupRepoList input[type="checkbox"]:checked');
    const selectedRepos = Array.from(checkboxes).map(cb => ({
      repoId: parseInt(cb.value),
      fullName: cb.dataset.fullname,
    }));

    const provider = document.getElementById('setupProvider')?.value;
    const model = document.getElementById('setupModel')?.value;

    const body = {
      userId: setupState.username || 'unknown',
      selectedRepos: selectedRepos,
      reviewer: {
        provider: provider,
        model: model,
      },
    };

    await apiCall(`/installations/${setupState.installationId}/settings`, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    showToast('Configuration saved successfully!', 'success');
    document.getElementById('setupResult').innerHTML = `
      <div class="card" style="border-color: rgba(0,255,65,0.3);">
        <h3 class="card-title" style="color: var(--neon-green);">✓ Setup Complete</h3>
        <p class="card-desc" style="margin-top: var(--space-sm);">
          Installation #${setupState.installationId} is now configured with
          <strong style="text-transform:capitalize;">${provider}</strong> (${model}).
          AI reviews will start automatically on your next PR.
        </p>
        <button class="btn btn-secondary btn-sm" style="margin-top: var(--space-md);" onclick="navigateTo('dashboard'); document.getElementById('dashInstId').value='${setupState.installationId}'; lookupInstallation();">
          ◧ View in Dashboard
        </button>
      </div>`;

  } catch (err) {
    showToast(`Save failed: ${err.message}`, 'error');
  } finally {
    btn.innerHTML = '⟩ Save Configuration';
    btn.disabled = false;
  }
}

// ==========================
// STATUS PAGE LOGIC
// ==========================
const LLM_PROVIDERS = [
  { id: 'huggingface', name: 'HuggingFace', icon: '🤗', defaultModel: 'Qwen/Qwen2.5-Coder-7B' },
  { id: 'groq', name: 'Groq', icon: '⚡', defaultModel: 'llama-3.3-70b-versatile' },
  { id: 'gemini', name: 'Gemini', icon: '💎', defaultModel: 'gemini-2.0-flash' },
  { id: 'cerebras', name: 'Cerebras', icon: '🧠', defaultModel: 'llama-3.1-8b' },
  { id: 'openrouter', name: 'OpenRouter', icon: '🔀', defaultModel: 'auto' },
];

function initStatusPage() {
  const grid = document.getElementById('providerGrid');
  if (!grid) return;

  grid.innerHTML = LLM_PROVIDERS.map(p => `
    <div class="provider-card" id="provider-${p.id}">
      <div class="provider-header">
        <div>
          <span style="font-size:1.2rem; margin-right:6px;">${p.icon}</span>
          <span class="provider-name">${p.name}</span>
          <div class="provider-model" id="provider-${p.id}-model">Default: ${p.defaultModel}</div>
        </div>
        <span class="status-badge status-loading" id="provider-${p.id}-status">
          <span class="dot"></span> Untested
        </span>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="testProvider('${p.id}')" id="provider-${p.id}-btn">
        Test
      </button>
      <div class="provider-response" id="provider-${p.id}-response" style="display:none;"></div>
    </div>
  `).join('');

  checkBackendHealth();
}

async function checkBackendHealth() {
  const badge = document.getElementById('backendStatus');
  badge.className = 'status-badge status-loading';
  badge.innerHTML = '<span class="dot"></span> Checking...';

  try {
    const data = await apiCall('/');
    badge.className = 'status-badge status-ok';
    badge.innerHTML = `<span class="dot"></span> ${data.app || 'Online'}`;
    setApiBase(getApiBase());
    showToast('Backend connected', 'success');
  } catch (err) {
    badge.className = 'status-badge status-error';
    badge.innerHTML = '<span class="dot"></span> Offline';
    showToast(`Backend unreachable: ${err.message}`, 'error');
  }
}

async function testProvider(providerId) {
  const card = document.getElementById(`provider-${providerId}`);
  const badge = document.getElementById(`provider-${providerId}-status`);
  const btn = document.getElementById(`provider-${providerId}-btn`);
  const modelEl = document.getElementById(`provider-${providerId}-model`);
  const responseEl = document.getElementById(`provider-${providerId}-response`);

  card.className = 'provider-card provider-loading';
  badge.className = 'status-badge status-loading';
  badge.innerHTML = '<span class="dot"></span> Testing...';
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner spinner-sm"></span>';

  try {
    const data = await apiCall(`/test-llm/${providerId}`);

    card.className = 'provider-card provider-ok';
    badge.className = 'status-badge status-ok';
    badge.innerHTML = '<span class="dot"></span> OK';
    modelEl.textContent = `Model: ${data.model || '—'}`;

    responseEl.style.display = 'block';
    responseEl.textContent = typeof data.response === 'string'
      ? data.response.substring(0, 200)
      : JSON.stringify(data.response).substring(0, 200);

  } catch (err) {
    card.className = 'provider-card provider-error';
    badge.className = 'status-badge status-error';
    badge.innerHTML = '<span class="dot"></span> Failed';
    responseEl.style.display = 'block';
    responseEl.textContent = err.message;
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Retest';
  }
}

async function testAllProviders() {
  const btn = document.getElementById('testAllBtn');
  btn.innerHTML = '<span class="spinner spinner-sm"></span> Testing all...';
  btn.disabled = true;

  for (const p of LLM_PROVIDERS) {
    await testProvider(p.id);
  }

  // Update stats
  const working = document.querySelectorAll('.provider-card.provider-ok').length;
  const failed = document.querySelectorAll('.provider-card.provider-error').length;

  document.getElementById('statWorking').textContent = working;
  document.getElementById('statFailed').textContent = failed;
  document.getElementById('statTotal').textContent = LLM_PROVIDERS.length;
  document.getElementById('statusStats').style.display = 'grid';

  btn.innerHTML = '◉ Test All Providers';
  btn.disabled = false;

  showToast(`Status: ${working}/${LLM_PROVIDERS.length} providers working`, working > 0 ? 'success' : 'error');
}

// ==========================
// DOCS — TOGGLE ENDPOINTS
// ==========================
function toggleEndpoint(headerEl) {
  const body = headerEl.nextElementSibling;
  if (body) {
    body.classList.toggle('open');
  }
}

// ==========================
// INIT
// ==========================
document.addEventListener('DOMContentLoaded', () => {
  // Restore saved API base URL
  const savedBase = localStorage.getItem('apiBaseUrl');
  if (savedBase) {
    const el = document.getElementById('apiBaseUrl');
    if (el) el.value = savedBase;
  }

  // Restore saved installation ID
  const savedInstId = localStorage.getItem('installationId');
  if (savedInstId) {
    const el = document.getElementById('dashInstId');
    if (el) el.value = savedInstId;
    const el2 = document.getElementById('setupInstId');
    if (el2) el2.value = savedInstId;
  }

  // Init matrix rain
  initMatrixRain();

  // Init hero terminal
  initHeroTerminal();

  // Handle hash routing
  handleHashChange();
  window.addEventListener('hashchange', handleHashChange);
});
