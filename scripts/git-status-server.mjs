// Простой Node.js сервер статуса Git с CORS и UI
import { createServer } from 'http';
import { exec } from 'child_process';
import { readFileSync, statSync } from 'fs';
import { resolve } from 'path';

const PORT = Number(process.env.PORT || 7070);
const ROOT = resolve(process.cwd());

function sh(cmd) {
  return new Promise((resolveP, rejectP) => {
    exec(cmd, { cwd: ROOT }, (err, stdout, stderr) => {
      if (err) return rejectP(err);
      resolveP(String(stdout || '').trim());
    });
  });
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function parseShort(raw) {
  const lines = String(raw || '').split('\n');
  const modified = [];
  const untracked = [];
  for (const ln of lines) {
    const s = ln.trim();
    if (!s) continue;
    // Формат: "XY path" или "?? path" или "R old -> new"
    let type = 'modified';
    let path = s.replace(/^\S+\s+/, '');
    if (s.startsWith('??')) {
      type = 'untracked';
    } else if (s[0] === 'D' || s[1] === 'D') {
      type = 'deleted';
    } else if (s[0] === 'R' || s.includes('->')) {
      type = 'renamed';
      const parts = s.split('->');
      path = parts[parts.length - 1].trim();
    } else if (s[0] === 'A' || s[1] === 'A') {
      type = 'added';
    }
    const item = { type, path };
    if (type === 'untracked') untracked.push(item); else modified.push(item);
  }
  return { modified, untracked };
}

async function collectStatus() {
  const branch = await sh('git rev-parse --abbrev-ref HEAD').catch(() => 'unknown');
  let ab = '0 0';
  try {
    ab = await sh(`git rev-list --left-right --count origin/${branch}...${branch}`);
  } catch {}
  const [behindStr, aheadStr] = String(ab).split(/\s+/);
  const behind = Number(behindStr || 0);
  const ahead = Number(aheadStr || 0);

  const raw = await sh('git status -s').catch(() => '');
  const parsed = parseShort(raw);

  // Стадженные новые файлы
  const stagedNewRaw = await sh('git diff --cached --name-only --diff-filter=A').catch(() => '');
  const stagedNew = stagedNewRaw
    .split('\n')
    .filter(Boolean)
    .map((p) => {
      let sizeBytes = null;
      try { sizeBytes = statSync(resolve(ROOT, p)).size; } catch {}
      return { path: p, sizeBytes };
    });

  // Неотслеживаемые
  const untrackedRaw = await sh('git ls-files --others --exclude-standard').catch(() => '');
  const untracked = untrackedRaw
    .split('\n')
    .filter(Boolean)
    .map((p) => {
      let sizeBytes = null;
      try { sizeBytes = statSync(resolve(ROOT, p)).size; } catch {}
      return { path: p, sizeBytes };
    });

  return {
    branch,
    ahead,
    behind,
    modified: parsed.modified,
    stagedNew,
    untracked,
    raw,
    updatedAt: new Date().toISOString(),
  };
}

const server = createServer(async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') {
    res.statusCode = 204; res.end(); return;
  }
  if (req.url === '/status') {
    try {
      const j = await collectStatus();
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(j));
    } catch (e) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: String(e.message || e) }));
    }
    return;
  }
  if (req.url === '/' || req.url === '/ui') {
    try {
      const html = readFileSync(resolve(ROOT, 'git-status.html'), 'utf-8');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(html);
    } catch {
      res.statusCode = 404;
      res.end('git-status.html not found');
    }
    return;
  }
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`[git-status-server] listening on http://localhost:${PORT}/`);
});

