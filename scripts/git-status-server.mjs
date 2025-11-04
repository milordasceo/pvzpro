import http from 'http';
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

const PORT = 7070;
const CWD = process.cwd();

function run(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: CWD }, (err, stdout, stderr) => {
      if (err) return reject(stderr || err.message);
      resolve(stdout.trim());
    });
  });
}

function mapStatus(code) {
  const c = code.replace(/\d+/g, '');
  switch (c) {
    case 'A':
      return { code: 'A', label: 'added' };
    case 'M':
      return { code: 'M', label: 'modified' };
    case 'D':
      return { code: 'D', label: 'deleted' };
    case 'R':
      return { code: 'R', label: 'renamed' };
    default:
      return { code: c || '?', label: 'changed' };
  }
}

function parseNameStatus(output) {
  if (!output) return [];
  const lines = output.split(/\r?\n/).filter(Boolean);
  return lines.map((line) => {
    const parts = line.split(/\t/);
    const statusRaw = parts[0];
    const status = mapStatus(statusRaw);
    if (status.code === 'R') {
      const oldPath = parts[1];
      const newPath = parts[2] || parts[1];
      return { status: status.label, code: status.code, path: newPath, oldPath };
    }
    const filePath = parts[1] || '';
    return { status: status.label, code: status.code, path: filePath };
  });
}

async function getUntracked() {
  const list = await run('git ls-files --others --exclude-standard');
  const files = list ? list.split(/\r?\n/).filter(Boolean) : [];
  const items = [];
  for (const p of files) {
    try {
      const st = await fs.stat(path.join(CWD, p));
      items.push({ path: p, size: st.size });
    } catch {
      items.push({ path: p, size: null });
    }
  }
  return items;
}

async function getBranch() {
  const sb = await run('git status -sb');
  // Examples: "## main" or "## main...origin/main [ahead 1, behind 2]"
  const m = sb.match(/^##\s+([^\.\s]+)(?:\.\.\.([^\s]+))?(?:\s+\[(?:ahead\s+(\d+))?(?:,\s*)?(?:behind\s+(\d+))?\])?/);
  const name = m?.[1] || 'unknown';
  const tracking = m?.[2] || null;
  const ahead = m?.[3] ? Number(m[3]) : 0;
  const behind = m?.[4] ? Number(m[4]) : 0;
  const clean = (await run('git status --porcelain')).length === 0;
  return { name, tracking, ahead, behind, clean };
}

function nowRu() {
  try {
    return new Date().toLocaleString('ru-RU', {
      year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit'
    }).replace(',', '').replace(' г.', '').replace(':', ':');
  } catch {
    return new Date().toISOString();
  }
}

async function buildStatus() {
  const [stagedRaw, unstagedRaw, untracked, branch] = await Promise.all([
    run('git diff --cached --name-status'),
    run('git diff --name-status'),
    getUntracked(),
    getBranch(),
  ]);
  const staged = parseNameStatus(stagedRaw);
  const unstaged = parseNameStatus(unstagedRaw);
  return {
    timestamp: nowRu(),
    branch,
    staged,
    unstaged,
    untracked,
    counts: {
      staged: staged.length,
      unstaged: unstaged.length,
      untracked: untracked.length,
    },
  };
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/status') {
      const data = await buildStatus();
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(data));
      return;
    }
    // Serve HTML file for convenience
    if (req.method === 'GET' && (req.url === '/' || req.url === '/git-status.html')) {
      try {
        const html = await fs.readFile(path.join(CWD, 'git-status.html'), 'utf8');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(html);
      } catch (e) {
        res.statusCode = 404;
        res.end('git-status.html not found');
      }
      return;
    }
    res.statusCode = 404;
    res.end('Not Found');
  } catch (e) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: String(e) }));
  }
});

server.listen(PORT, () => {
  console.log(`Git Status server: http://localhost:${PORT}/`);
});

