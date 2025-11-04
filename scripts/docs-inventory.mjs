#!/usr/bin/env node

/**
 * Documentation Inventory Script
 *
 * Создаёт полную инвентаризацию всей проектной документации.
 * Сканирует корень репозитория и папку docs/ для сбора информации о:
 * - .md файлах
 * - .txt файлах
 * - .cursorrules
 * - .gitmessage
 * - README файлах в подкаталогах docs/
 *
 * Выходные форматы:
 * - reports/documentation_inventory.md (русскоязычная сводка с таблицами)
 * - reports/documentation_inventory.csv (для обработки в Excel/таблицах)
 *
 * Использование:
 *   npm run docs:inventory
 *   или
 *   node scripts/docs-inventory.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const REPORTS_DIR = path.join(PROJECT_ROOT, 'reports');

const IGNORED_DIR_NAMES = new Set([
  'node_modules',
  '.git',
  '.expo',
  '.expo-shared',
  'build',
  'dist',
  'coverage',
  '.gradle',
  '.DS_Store',
]);

const DOC_EXTENSIONS = new Set(['.md', '.txt']);
const DOC_SPECIAL_FILENAMES = new Set(['.cursorrules', '.gitmessage']);

const MAX_DESCRIPTION_LENGTH = 120;

/**
 * Проверяет, находится ли файл внутри docs/ и является ли README
 */
function isDocsReadme(filePath) {
  const relativePath = path.relative(PROJECT_ROOT, filePath);
  if (!relativePath || relativePath.startsWith('..')) {
    return false;
  }

  const segments = relativePath.split(path.sep);
  if (segments.length === 0 || segments[0] !== 'docs') {
    return false;
  }

  const baseName = path.basename(filePath).toLowerCase();
  return baseName === 'readme' || baseName.startsWith('readme.');
}

/**
 * Проверяет, является ли файл документацией
 */
function isDocumentationFile(filePath) {
  const baseName = path.basename(filePath);
  const lowerName = baseName.toLowerCase();
  const ext = path.extname(baseName).toLowerCase();

  if (DOC_EXTENSIONS.has(ext)) {
    return true;
  }

  if (DOC_SPECIAL_FILENAMES.has(lowerName)) {
    return true;
  }

  return isDocsReadme(filePath);
}

/**
 * Проверяет, нужно ли игнорировать директорию
 */
function shouldIgnoreDir(dirPath) {
  const relativePath = path.relative(PROJECT_ROOT, dirPath);
  if (!relativePath) {
    return false;
  }

  if (relativePath.startsWith('..')) {
    return true;
  }

  const parts = relativePath.split(path.sep);
  return parts.some(part => IGNORED_DIR_NAMES.has(part));
}

/**
 * Рекурсивно сканирует директорию и собирает документы
 */
function scanDirectory(dirPath, documents = []) {
  if (shouldIgnoreDir(dirPath)) {
    return documents;
  }

  let entries = [];
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch (error) {
    console.error(`Ошибка при чтении директории ${dirPath}: ${error.message}`);
    return documents;
  }

  entries.sort((a, b) => a.name.localeCompare(b.name, 'ru'));

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      scanDirectory(fullPath, documents);
    } else if (entry.isFile() && isDocumentationFile(fullPath)) {
      documents.push(fullPath);
    }
  }

  return documents;
}

/**
 * Преобразует путь к POSIX-формату для отчётов
 */
function toPosixPath(filePath) {
  return filePath.split(path.sep).join('/');
}

/**
 * Получает размер файла в КБ (число)
 */
function getFileSizeKB(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size / 1024;
  } catch (error) {
    return NaN;
  }
}

/**
 * Получает дату последнего изменения файла (YYYY-MM-DD)
 */
function getLastModified(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime.toISOString().split('T')[0];
  } catch (error) {
    return 'N/A';
  }
}

/**
 * Получает дату последнего коммита для файла (YYYY-MM-DD)
 */
function getLastCommitDate(filePath) {
  try {
    const relativePath = path.relative(PROJECT_ROOT, filePath);
    const result = execSync(`git log -1 --format=%cs -- "${relativePath}"`, {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();

    return result || 'N/A';
  } catch (error) {
    return 'N/A';
  }
}

/**
 * Очищает Markdown-форматирование и ограничивает длину описания
 */
function sanitizeDescription(text) {
  return text
    .replace(/[#*_`>/\\\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_DESCRIPTION_LENGTH);
}

/**
 * Экранирует текст для таблицы Markdown
 */
function escapeForMarkdown(text) {
  return text.replace(/\|/g, '\\|');
}

/**
 * Извлекает краткое описание файла
 */
function extractBriefDescription(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    // Ищем первый непустой заголовок
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        continue;
      }

      if (trimmed.startsWith('#')) {
        return sanitizeDescription(trimmed.replace(/^#+\s*/, '')) || 'Без описания';
      }
    }

    // Если заголовок не найден, берём первые 1-2 непустые строки
    const informativeLines = lines.filter(line => line.trim()).slice(0, 2);
    if (informativeLines.length === 0) {
      return 'Пустой файл';
    }

    return sanitizeDescription(informativeLines.join(' ')) || 'Без описания';
  } catch (error) {
    return 'Ошибка чтения';
  }
}

/**
 * Определяет директорию верхнего уровня (root/dogs/src/...)
 */
function getTopLevelDir(filePath) {
  const relativePath = path.relative(PROJECT_ROOT, filePath);
  if (!relativePath) {
    return 'root';
  }

  const parts = relativePath.split(path.sep);
  return parts.length > 1 ? parts[0] : 'root';
}

/**
 * Форматирует размер файла для отчёта
 */
function formatSize(sizeKB) {
  if (Number.isNaN(sizeKB)) {
    return 'N/A';
  }
  return sizeKB.toFixed(2);
}

/**
 * Собирает информацию о документе
 */
function collectDocumentInfo(filePath) {
  const relativePath = toPosixPath(path.relative(PROJECT_ROOT, filePath));

  return {
    path: relativePath,
    absolutePath: filePath,
    topLevelDir: getTopLevelDir(filePath),
    sizeKB: getFileSizeKB(filePath),
    lastModified: getLastModified(filePath),
    lastCommit: getLastCommitDate(filePath),
    description: extractBriefDescription(filePath),
  };
}

/**
 * Группирует документы по директориям верхнего уровня
 */
function groupDocuments(documents) {
  const groups = {
    root: [],
    docs: [],
    other: new Map(),
  };

  for (const doc of documents) {
    if (doc.topLevelDir === 'root') {
      groups.root.push(doc);
    } else if (doc.topLevelDir === 'docs') {
      groups.docs.push(doc);
    } else {
      if (!groups.other.has(doc.topLevelDir)) {
        groups.other.set(doc.topLevelDir, []);
      }
      groups.other.get(doc.topLevelDir).push(doc);
    }
  }

  // Сортировка внутри групп по пути
  groups.root.sort((a, b) => a.path.localeCompare(b.path, 'ru'));
  groups.docs.sort((a, b) => a.path.localeCompare(b.path, 'ru'));
  for (const docs of groups.other.values()) {
    docs.sort((a, b) => a.path.localeCompare(b.path, 'ru'));
  }

  return groups;
}

/**
 * Вычисляет агрегированную статистику
 */
function calculateStatistics(documents) {
  const totalCount = documents.length;
  const totalSizeKB = documents.reduce((sum, doc) => {
    if (Number.isNaN(doc.sizeKB)) {
      return sum;
    }
    return sum + doc.sizeKB;
  }, 0);

  const topTenLargest = [...documents]
    .filter(doc => !Number.isNaN(doc.sizeKB))
    .sort((a, b) => b.sizeKB - a.sizeKB)
    .slice(0, 10);

  return {
    totalCount,
    totalSizeKB,
    topTenLargest,
  };
}

/**
 * Генерирует Markdown-таблицу по документам
 */
function generateMarkdownTable(documents) {
  if (documents.length === 0) {
    return 'Не найдено документов.\n\n';
  }

  let markdown = '| Путь | Размер (КБ) | Последнее изменение | Последний коммит | Краткое содержание |\n';
  markdown += '|------|-------------|---------------------|------------------|--------------------|\n';

  for (const doc of documents) {
    const description = escapeForMarkdown(doc.description || '—');
    markdown += `| ${doc.path} | ${formatSize(doc.sizeKB)} | ${doc.lastModified} | ${doc.lastCommit} | ${description} |\n`;
  }

  markdown += '\n';
  return markdown;
}

/**
 * Формирует текстовый список документов для CSV
 */
function generateCSVReport(documents) {
  const lines = ['Path,Top Level Dir,Size (KB),Last Modified,Last Commit,Description'];

  for (const doc of documents) {
    const escapedPath = `"${doc.path.replace(/"/g, '""')}"`;
    const escapedDir = `"${doc.topLevelDir}"`;
    const escapedSize = Number.isNaN(doc.sizeKB) ? '"N/A"' : doc.sizeKB.toFixed(2);
    const escapedModified = `"${doc.lastModified}"`;
    const escapedCommit = `"${doc.lastCommit}"`;
    const escapedDescription = `"${(doc.description || '').replace(/"/g, '""')}"`;

    lines.push(`${escapedPath},${escapedDir},${escapedSize},${escapedModified},${escapedCommit},${escapedDescription}`);
  }

  return `${lines.join('\n')}\n`;
}

/**
 * Проверяет, является ли строка валидной датой ISO (YYYY-MM-DD)
 */
function parseIsoDate(value) {
  if (!value || value === 'N/A') {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Формирует раздел "Особые замечания"
 */
function generateSpecialNotes(documents) {
  const notes = [];

  const largeFiles = documents.filter(doc => !Number.isNaN(doc.sizeKB) && doc.sizeKB > 100);
  if (largeFiles.length > 0) {
    const list = largeFiles
      .sort((a, b) => b.sizeKB - a.sizeKB)
      .map(doc => `- ${doc.path} — ${formatSize(doc.sizeKB)} КБ`)
      .join('\n');
    notes.push('### 📦 Большие документы (> 100 КБ)\n\n' + list + '\n');
  }

  const staleFiles = documents.filter(doc => {
    const commitDate = parseIsoDate(doc.lastCommit);
    const modifiedDate = parseIsoDate(doc.lastModified);
    if (!commitDate || !modifiedDate) {
      return false;
    }

    const diffDays = (modifiedDate.getTime() - commitDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > 30;
  });

  if (staleFiles.length > 0) {
    const list = staleFiles
      .map(doc => `- ${doc.path} — коммит: ${doc.lastCommit}, изменение: ${doc.lastModified}`)
      .join('\n');
    notes.push('### ⚠️ Несовпадение дат (изменены позднее коммита)\n\n' + list + '\n');
  }

  const withoutGitHistory = documents.filter(doc => doc.lastCommit === 'N/A');
  if (withoutGitHistory.length > 0) {
    const list = withoutGitHistory
      .map(doc => `- ${doc.path} — нет коммитов, обновлён ${doc.lastModified}`)
      .join('\n');
    notes.push('### 🆕 Файлы без истории коммитов\n\n' + list + '\n');
  }

  return notes.length > 0 ? notes.join('\n') : 'Особых замечаний не обнаружено.\n';
}

/**
 * Генерирует отчёт в формате Markdown
 */
function generateMarkdownReport(groups, stats) {
  const allDocuments = [
    ...groups.root,
    ...groups.docs,
    ...Array.from(groups.other.values()).flat(),
  ];

  const totalSizeKBFormatted = stats.totalSizeKB.toFixed(2);
  const totalSizeMBFormatted = (stats.totalSizeKB / 1024).toFixed(2);

  let report = '# Инвентаризация документации проекта\n\n';
  report += `**Дата формирования:** ${new Date().toISOString().split('T')[0]}\n\n`;
  report += '---\n\n';

  report += '## Общая статистика\n\n';
  report += `- **Всего документов:** ${stats.totalCount}\n`;
  report += `- **Суммарный объём:** ${totalSizeKBFormatted} КБ (${totalSizeMBFormatted} МБ)\n`;
  report += `- **Документов в корне:** ${groups.root.length}\n`;
  report += `- **Документов в docs/:** ${groups.docs.length}\n`;
  report += `- **Документов в других каталогах:** ${Array.from(groups.other.values()).flat().length}\n\n`;

  report += '---\n\n';

  report += '## Топ-10 самых больших файлов\n\n';
  report += generateMarkdownTable(stats.topTenLargest);
  report += '---\n\n';

  report += '## Документы в корне\n\n';
  report += generateMarkdownTable(groups.root);

  report += '## Документы внутри docs/\n\n';
  report += generateMarkdownTable(groups.docs);

  if (groups.other.size > 0) {
    report += '## Прочие каталоги\n\n';
    const sortedOtherKeys = Array.from(groups.other.keys()).sort((a, b) => a.localeCompare(b, 'ru'));
    for (const dir of sortedOtherKeys) {
      report += `### ${dir}/\n\n`;
      report += generateMarkdownTable(groups.other.get(dir));
    }
  }

  report += '---\n\n';
  report += '## Особые замечания\n\n';
  report += generateSpecialNotes(allDocuments);
  report += '\n---\n\n';

  report += '## Воспроизводимость\n\n';
  report += 'Для повторной генерации отчёта выполните:\n\n';
  report += '```bash\n';
  report += 'npm run docs:inventory\n';
  report += '```\n\n';
  report += 'или напрямую:\n\n';
  report += '```bash\n';
  report += 'node scripts/docs-inventory.mjs\n';
  report += '```\n\n';
  report += '**Ограничения:**\n';
  report += '- Игнорируются директории: `node_modules`, `.git`, `.expo`, `.expo-shared`, `build`, `dist`, `coverage`, `.gradle`\n';
  report += '- Обрабатываются файлы: `.md`, `.txt`, `.cursorrules`, `.gitmessage`, а также `README*` внутри `docs/`\n';
  report += '- Для получения дат последних коммитов требуется Git-репозиторий\n';

  return report;
}

/**
 * Главная функция
 */
function main() {
  console.log('🔍 Начинаем инвентаризацию документации...\n');

  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }

  console.log('📂 Сканирование файлов...');
  const documentPaths = scanDirectory(PROJECT_ROOT);
  documentPaths.sort((a, b) => a.localeCompare(b, 'ru'));
  console.log(`   Найдено документов: ${documentPaths.length}\n`);

  console.log('📊 Сбор информации о документах...');
  const documents = documentPaths.map(collectDocumentInfo);
  console.log('   Готово!\n');

  console.log('🗂️  Группировка документов...');
  const groups = groupDocuments(documents);
  console.log('   Готово!\n');

  console.log('📈 Расчёт статистики...');
  const stats = calculateStatistics(documents);
  console.log('   Готово!\n');

  console.log('📝 Генерация отчётов...');
  const markdownReport = generateMarkdownReport(groups, stats);
  const csvReport = generateCSVReport(documents);

  const mdPath = path.join(REPORTS_DIR, 'documentation_inventory.md');
  const csvPath = path.join(REPORTS_DIR, 'documentation_inventory.csv');

  fs.writeFileSync(mdPath, markdownReport, 'utf8');
  fs.writeFileSync(csvPath, csvReport, 'utf8');

  console.log(`   ✅ Markdown отчёт: ${path.relative(PROJECT_ROOT, mdPath)}`);
  console.log(`   ✅ CSV отчёт: ${path.relative(PROJECT_ROOT, csvPath)}\n`);

  console.log('✨ Инвентаризация завершена!\n');
  console.log('📊 Итоговая статистика:');
  console.log(`   - Всего документов: ${stats.totalCount}`);
  console.log(`   - Суммарный объём: ${stats.totalSizeKB.toFixed(2)} КБ`);
  console.log(`   - В корне: ${groups.root.length}`);
  console.log(`   - В docs/: ${groups.docs.length}`);
  console.log(`   - В других каталогах: ${Array.from(groups.other.values()).flat().length}`);
}

main();
