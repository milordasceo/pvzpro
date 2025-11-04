import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync, appendFileSync } from 'node:fs';

const CONFIG_PATH = './scripts/git-sync.config.json';

function run(cmd) {
  try {
    const out = execSync(cmd, { stdio: 'pipe' }).toString().trim();
    return { ok: true, out };
  } catch (e) {
    const out = e.stdout ? e.stdout.toString() : '';
    const err = e.stderr ? e.stderr.toString() : e.message;
    return { ok: false, out, err };
  }
}

function now() {
  try {
    return execSync('powershell -NoProfile -Command "Get-Date -Format \"yyyy-MM-dd HH:mm:ss zzz\""', { stdio: 'pipe' }).toString().trim();
  } catch {
    return new Date().toISOString();
  }
}

function getConfig() {
  const def = {
    workflow: 'github-flow',
    protectedBranches: ['main', 'dev'],
    enableBidirectional: true,
    pollIntervalSeconds: 5,
    autoSyncApproved: false,
    approvalFile: 'auto-approve.flag',
    logFilePath: 'logs/sync.log',
    checkMerges: true,
  };
  try {
    const cfg = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
    return { ...def, ...cfg };
  } catch {
    return def;
  }
}

function parseOrigin() {
  const r = run('git remote get-url origin');
  if (!r.ok) return null;
  const url = r.out.trim();
  const mHttps = url.match(/github\.com\/(.+?)\/(.+?)\.git$/);
  const mSsh = url.match(/github\.com:(.+?)\/(.+?)\.git$/);
  const m = mHttps || mSsh;
  if (!m) return null;
  return { owner: m[1], repo: m[2], url };
}

function ensureLogs(cfg) {
  const dir = (cfg.logFilePath || 'logs/sync.log').split('/').slice(0, -1).join('/') || 'logs';
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function logLine(cfg, msg) {
  ensureLogs(cfg);
  const line = `[${now()}] ${msg}\n`;
  try { appendFileSync(cfg.logFilePath, line, 'utf-8'); } catch {}
}

function branchAheadBehind(branch) {
  const r = run(`git rev-list --left-right --count origin/${branch}...${branch}`);
  if (!r.ok) return { remoteAhead: 0, localAhead: 0, raw: r.err || r.out };
  const [left, right] = r.out.trim().split(/\s+/).map(n => parseInt(n, 10) || 0);
  return { remoteAhead: left, localAhead: right, raw: r.out.trim() };
}

function syncBranch(cfg, branch) {
  // Checkout target branch (create local if missing)
  const hasLocal = run(`git show-ref --verify --quiet refs/heads/${branch}`).ok;
  if (!hasLocal) {
    const hasRemote = run(`git ls-remote --heads origin ${branch}`).out.trim() !== '';
    if (hasRemote) run(`git checkout -B ${branch} origin/${branch}`);
    else run(`git checkout -B ${branch}`);
  } else {
    run(`git checkout ${branch}`);
  }

  // Fetch latest refs
  run('git fetch --all --prune');

  const { remoteAhead, localAhead } = branchAheadBehind(branch);

  if (remoteAhead > 0 && localAhead === 0) {
    const m = run('git pull --ff-only');
    logLine(cfg, `pull ${branch}: ${m.ok ? 'ok' : 'error'}${m.ok ? '' : ' ' + (m.err || m.out)}`);
  } else if (localAhead > 0 && remoteAhead === 0) {
    const approved = cfg.autoSyncApproved || existsSync(cfg.approvalFile);
    if (approved) {
      const p = run('git push');
      logLine(cfg, `push ${branch}: ${p.ok ? 'ok' : 'error'}${p.ok ? '' : ' ' + (p.err || p.out)}`);
    } else {
      logLine(cfg, `push ${branch}: skipped (awaiting approval)`);
    }
  } else if (remoteAhead > 0 && localAhead > 0) {
    logLine(cfg, `diverged ${branch}: manual resolution required`);
  } else {
    logLine(cfg, `up-to-date ${branch}`);
  }
}

function latestMergesViaGit(branch, limit = 5) {
  const r = run(`git log origin/${branch} --merges --pretty=format:"%h|%ad|%s" --date=iso-strict -n ${limit}`);
  if (!r.ok) return [];
  return r.out.split('\n').filter(Boolean).map(line => {
    const [sha, date, subject] = line.split('|');
    return { branch, sha, date, subject };
  });
}

async function latestMergesViaAPI(cfg, origin, branch, limit = 5) {
  const token = process.env.GITHUB_TOKEN;
  if (!token || !origin) return [];
  try {
    const url = `https://api.github.com/repos/${origin.owner}/${origin.repo}/pulls?state=closed&per_page=${limit}&sort=updated&direction=desc`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'trae-bidir-sync'
      }
    });
    const items = await res.json();
    return (items || []).filter(x => !!x.merged_at).slice(0, limit).map(x => ({
      branch,
      sha: x.merge_commit_sha || (x.head && x.head.sha) || '',
      date: x.merged_at,
      subject: `PR #${x.number}: ${x.title}`,
    }));
  } catch {
    return [];
  }
}

function appendMergesToStatusHtml(cfg, merges) {
  try {
    const path = './git-status.html';
    if (!existsSync(path)) return;
    let html = readFileSync(path, 'utf-8');
    const section = `\n<section style="font-family:system-ui; margin:16px 24px;">\n<h2>Последние мерджи (GitHub)</h2>\n<ul>\n${merges.map(m => `<li><code>${m.sha.slice(0,7)}</code> — ${m.subject} — <small>${m.date}</small> [${m.branch}]</li>`).join('\n')}\n</ul>\n</section>\n`;
    if (html.includes('</body>')) {
      html = html.replace('</body>', `${section}</body>`);
    } else {
      html += section;
    }
    writeFileSync(path, html, 'utf-8');
  } catch {}
}

async function checkMerges(cfg) {
  const origin = parseOrigin();
  const branches = cfg.protectedBranches || ['main'];
  const list = [];
  for (const b of branches) {
    const api = await latestMergesViaAPI(cfg, origin, b, 5);
    const git = latestMergesViaGit(b, 5);
    list.push(...(api.length ? api : git));
  }
  logLine(cfg, `merges check: ${list.length} entries`);
  appendMergesToStatusHtml(cfg, list);
  return list;
}

async function syncOnce() {
  const cfg = getConfig();
  // Pull/push for protected branches
  for (const b of cfg.protectedBranches) {
    syncBranch(cfg, b);
  }
  // Optional merges check
  if (cfg.checkMerges) await checkMerges(cfg);
}

async function main() {
  const args = process.argv.slice(2);
  const cfg = getConfig();
  const once = async () => { await syncOnce(); console.log(`[bidir-sync] ${now()} — завершено.`); };
  if (args.includes('--check-merges')) { await checkMerges(cfg); return; }
  const watch = args.includes('--watch');
  if (!watch) { await once(); return; }
  await once();
  const ms = Math.max(1, cfg.pollIntervalSeconds || 5) * 1000;
  setInterval(() => { void once(); }, ms);
}

await main();
