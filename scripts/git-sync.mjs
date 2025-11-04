import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const CONFIG_PATH = './scripts/git-sync.config.json';

function psNow() {
  try {
    const out = execSync('powershell -NoProfile -Command "Get-Date -Format \"yyyy-MM-dd HH:mm:ss zzz\""', { stdio: 'pipe' }).toString().trim();
    return out;
  } catch {
    return new Date().toISOString();
  }
}

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

function getConfig() {
  const def = {
    workflow: 'github-flow',
    protectedBranches: ['main', 'dev'],
    mirrorProtected: true,
    autoDeleteMergedLocal: true,
    autoDeleteMergedRemote: false,
    notifyOnConflicts: true,
    writeStatusHtml: true,
    statusHtmlPath: 'git-status.html',
    pollIntervalMinutes: 30,
  };
  if (!existsSync(CONFIG_PATH)) return def;
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

function ensureBranchLocal(branch) {
  const hasLocal = run(`git show-ref --verify --quiet refs/heads/${branch}`).ok;
  if (!hasLocal) {
    const hasRemote = run(`git ls-remote --heads origin ${branch}`).out.trim() !== '';
    if (hasRemote) run(`git checkout -B ${branch} origin/${branch}`);
  }
}

function alignProtectedBranch(branch, status) {
  ensureBranchLocal(branch);
  const checkout = run(`git checkout ${branch}`);
  if (!checkout.ok) {
    status.actions.push({ type: 'checkout_failed', branch, err: checkout.err });
    return;
  }
  run(`git fetch origin ${branch}`);
  const aheadBehind = run(`git rev-list --left-right --count origin/${branch}...${branch}`);
  let ab = [0,0];
  if (aheadBehind.ok && aheadBehind.out) {
    const parts = aheadBehind.out.split('\t');
    ab = parts.map(x => parseInt(x, 10));
  }
  status.branches[branch] = { ahead: ab[1] || 0, behind: ab[0] || 0 };
  if (status.config.mirrorProtected) {
    const rs = run(`git reset --hard origin/${branch}`);
    status.actions.push({ type: 'mirror', branch, ok: rs.ok });
  } else {
    const pull = run('git pull --ff-only');
    status.actions.push({ type: 'ff_pull', branch, ok: pull.ok });
  }
}

function deleteMergedLocal(baseBranch, status) {
  const checkout = run(`git checkout ${baseBranch}`);
  if (!checkout.ok) return;
  const r = run('git branch --merged');
  if (!r.ok) return;
  const lines = r.out.split('\n').map(s => s.trim()).filter(Boolean);
  for (const l of lines) {
    const b = l.replace('* ', '').trim();
    if (b === baseBranch) continue;
    if (status.config.protectedBranches.includes(b)) continue;
    const del = run(`git branch -d ${b}`);
    status.actions.push({ type: 'delete_local_merged', base: baseBranch, branch: b, ok: del.ok });
  }
}

function deleteMergedRemote(baseBranch, status) {
  const r = run(`git branch -r --merged origin/${baseBranch}`);
  if (!r.ok) return;
  const lines = r.out.split('\n').map(s => s.trim()).filter(Boolean);
  for (const l of lines) {
    const m = l.match(/^origin\/(.+)$/);
    if (!m) continue;
    const b = m[1];
    if (b === baseBranch) continue;
    if (status.config.protectedBranches.includes(b)) continue;
    const del = run(`git push origin --delete ${b}`);
    status.actions.push({ type: 'delete_remote_merged', base: baseBranch, branch: b, ok: del.ok });
  }
}

function getDirty() {
  const r = run('git status --porcelain');
  return r.ok && r.out.trim().length > 0;
}

function htmlReport(status) {
  const dt = status.datetime;
  const br = Object.entries(status.branches).map(([b, ab]) => `\n      <tr><td>${b}</td><td>${ab.behind}</td><td>${ab.ahead}</td></tr>`).join('');
  const actions = status.actions.map(a => `<li>${a.type} — ${a.branch ?? ''} ${a.base ? `(base: ${a.base})` : ''} ${a.ok === false ? '❌' : '✅'}</li>`).join('\n');
  const origin = status.origin?.url || 'unknown';
  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <title>Git Status Report</title>
  <style>body{font-family:system-ui,Segoe UI,Arial;padding:24px;}table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:6px 10px}</style>
</head>
<body>
  <h1>Состояние репозитория</h1>
  <p><strong>Время:</strong> ${dt}</p>
  <p><strong>origin:</strong> ${origin}</p>
  <h2>Ветки</h2>
  <table>
    <thead><tr><th>Ветка</th><th>Позади</th><th>Впереди</th></tr></thead>
    <tbody>${br}</tbody>
  </table>
  <h2>Действия</h2>
  <ul>${actions}</ul>
  <h2>Конфликт-алерты</h2>
  <p>${status.conflict ? 'Обнаружены конфликты при синхронизации. См. советы ниже.' : 'Конфликтов не зафиксировано.'}</p>
  <details><summary>Как решать конфликты</summary>
    <ol>
      <li>Остановите фоновые синки, выполните <code>git status</code>.</li>
      <li>Разрешите файлы в конфликте, затем <code>git add .</code>.</li>
      <li>Завершите ребейз/мердж: <code>git rebase --continue</code> или <code>git commit</code>.</li>
      <li>Запустите синхронизацию заново: <code>SYNC_GIT.bat</code>.</li>
    </ol>
  </details>
</body>
</html>`;
}

function syncOnce() {
  const config = getConfig();
  const status = { datetime: psNow(), config, origin: parseOrigin(), branches: {}, actions: [], conflict: false };
  run('git fetch --all --prune');

  const current = run('git rev-parse --abbrev-ref HEAD');
  const currentBranch = current.ok ? current.out.trim() : 'unknown';

  if (getDirty()) {
    status.actions.push({ type: 'dirty_changes_detected', branch: currentBranch });
  }

  const bases = ['main'];
  for (const b of config.protectedBranches) {
    if (!bases.includes(b)) bases.push(b);
  }

  for (const b of bases) {
    const hasRemote = run(`git ls-remote --heads origin ${b}`).out.trim() !== '';
    if (!hasRemote) continue;
    alignProtectedBranch(b, status);
    if (config.autoDeleteMergedLocal) deleteMergedLocal(b, status);
    if (config.autoDeleteMergedRemote) deleteMergedRemote(b, status);
  }

  if (currentBranch && currentBranch !== 'unknown') {
    const hasLocal = run(`git show-ref --verify --quiet refs/heads/${currentBranch}`).ok;
    if (hasLocal) run(`git checkout ${currentBranch}`);
  }

  if (config.writeStatusHtml) {
    const html = htmlReport(status);
    writeFileSync(config.statusHtmlPath, html, 'utf-8');
  }

  return status;
}

function main() {
  const watch = process.argv.includes('--watch');
  const once = () => {
    const s = syncOnce();
    console.log(`[git-sync] ${s.datetime} — завершено.`);
  };
  if (!watch) return once();
  once();
  const cfg = getConfig();
  const ms = Math.max(1, cfg.pollIntervalMinutes) * 60 * 1000;
  setInterval(once, ms);
}

main();

