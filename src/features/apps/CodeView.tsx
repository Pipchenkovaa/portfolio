'use client';

import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { profile } from '@/content/profile';
import { pick } from '@/i18n/config';
import { useI18n } from '@/shared/i18n-context';

type SourceFile = {
  id: string;
  path: string;
  lang: string;
  lines: number;
  note: { en: string; ru: string };
};
type SourceIndex = { commit: string | null; files: SourceFile[] };

type Tree = { name: string; path: string; dirs: Tree[]; files: SourceFile[] };

const DEFAULT_FILE = 'src/features/windows/Window.tsx';
const LANG_LABEL: Record<string, string> = {
  ts: 'TypeScript',
  tsx: 'TypeScript JSX',
  css: 'CSS',
  js: 'JavaScript',
};

function buildTree(files: SourceFile[]): Tree {
  const root: Tree = { name: 'portfolio', path: '', dirs: [], files: [] };
  for (const f of files) {
    const parts = f.path.split('/');
    let node = root;
    for (const part of parts.slice(0, -1)) {
      const path = node.path ? `${node.path}/${part}` : part;
      let next = node.dirs.find((d) => d.name === part);
      if (!next) {
        next = { name: part, path, dirs: [], files: [] };
        node.dirs.push(next);
      }
      node = next;
    }
    node.files.push(f);
  }
  const sort = (t: Tree) => {
    t.dirs.sort((a, b) => a.name.localeCompare(b.name));
    t.files.sort((a, b) => a.path.localeCompare(b.path));
    t.dirs.forEach(sort);
  };
  sort(root);
  return root;
}

// Снимок исходников не меняется до следующей сборки — кешируем на всю сессию.
let indexCache: Promise<SourceIndex> | null = null;
const fileCache = new Map<string, Promise<string>>();
const loadIndex = () =>
  (indexCache ??= fetch('/source/index.json').then((r) => {
    if (!r.ok) throw new Error(String(r.status));
    return r.json() as Promise<SourceIndex>;
  }));
const loadFile = (id: string) => {
  let p = fileCache.get(id);
  if (!p) {
    p = fetch(`/source/${id}.html`).then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.text();
    });
    fileCache.set(id, p);
  }
  return p;
};

/**
 * «VS Code» с настоящим исходником сайта, только чтение. Подсветка сделана shiki при сборке
 * (scripts/source-snapshot.mjs) — в браузер приходит готовый HTML нужного файла.
 */
export function CodeView() {
  const { locale, dict } = useI18n();
  const t = dict.code;
  const [index, setIndex] = useState<SourceIndex | null>(null);
  const [tabs, setTabs] = useState<string[]>([DEFAULT_FILE]);
  const [active, setActive] = useState(DEFAULT_FILE);
  const [html, setHtml] = useState<Record<string, string | 'error'>>({});
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    loadIndex().then(
      (i) => alive && setIndex(i),
      () => alive && setFailed(true),
    );
    return () => {
      alive = false;
    };
  }, []);

  const file = index?.files.find((f) => f.path === active);

  useEffect(() => {
    if (!file || html[file.id]) return;
    let alive = true;
    loadFile(file.id).then(
      (h) => alive && setHtml((m) => ({ ...m, [file.id]: h })),
      () => alive && setHtml((m) => ({ ...m, [file.id]: 'error' })),
    );
    return () => {
      alive = false;
    };
  }, [file, html]);

  const tree = useMemo(() => (index ? buildTree(index.files) : null), [index]);

  const openFile = (path: string) => {
    setTabs((ts) => (ts.includes(path) ? ts : [...ts, path]));
    setActive(path);
  };
  const closeTab = (path: string) => {
    setTabs((ts) => {
      const next = ts.filter((p) => p !== path);
      if (path === active) setActive(next[next.length - 1] ?? '');
      return next;
    });
  };

  const body = file ? html[file.id] : undefined;
  const githubHref = `${profile.repo}/blob/main/${active}`;

  return (
    <div className="vsc">
      <aside className="vsc-side" aria-label={t.explorer}>
        <div className="vsc-side-title">{t.explorer}</div>
        {tree ? (
          <TreeNode node={tree} depth={0} active={active} onOpen={openFile} locale={locale} />
        ) : (
          <p className="vsc-muted">{failed ? t.error : t.loading}</p>
        )}
      </aside>

      <section className="vsc-main">
        <div className="vsc-tabs">
          {tabs.map((p) => (
            <div key={p} className={clsx('vsc-tab', p === active && 'active')}>
              <button
                type="button"
                className="vsc-tab-name"
                aria-current={p === active ? 'page' : undefined}
                onClick={() => setActive(p)}
              >
                <FileGlyph path={p} />
                {p.split('/').pop()}
              </button>
              <button
                type="button"
                className="vsc-tab-close"
                aria-label={`${dict.window.close} ${p.split('/').pop()}`}
                onClick={() => closeTab(p)}
              >
                ×
              </button>
            </div>
          ))}
          <span className="flex-1" />
          {active && (
            <a className="vsc-gh" href={githubHref} target="_blank" rel="noopener noreferrer">
              {t.openGithub} ↗
            </a>
          )}
        </div>

        {file && (
          <div className="vsc-crumbs">
            {file.path.split('/').join(' › ')}
            <span className="vsc-crumb-note">{pick(file.note, locale)}</span>
          </div>
        )}

        <div className="vsc-editor">
          {!active ? (
            <p className="vsc-empty">{t.intro}</p>
          ) : body === 'error' || failed ? (
            <p className="vsc-empty">{t.error}</p>
          ) : body ? (
            // HTML собран из исходников этого же репозитория на этапе сборки — чужого содержимого тут нет.
            <div className="vsc-code" dangerouslySetInnerHTML={{ __html: body }} />
          ) : (
            <p className="vsc-empty">{t.loading}</p>
          )}
        </div>

        <footer className="vsc-status">
          <span>⎇ main{index?.commit ? ` · ${index.commit}` : ''}</span>
          <span className="flex-1" />
          {file && (
            <span>
              {file.lines} {t.lines}
            </span>
          )}
          {file && <span>{LANG_LABEL[file.lang] ?? file.lang}</span>}
          <span>{t.readOnly}</span>
        </footer>
      </section>
    </div>
  );
}

function TreeNode({
  node,
  depth,
  active,
  onOpen,
  locale,
}: {
  node: Tree;
  depth: number;
  active: string;
  onOpen: (path: string) => void;
  locale: 'en' | 'ru';
}) {
  return (
    <ul className="vsc-tree">
      <li>
        <span className="vsc-dir" style={{ paddingLeft: 8 + depth * 12 }}>
          <span aria-hidden="true">⌄</span> {depth === 0 ? node.name.toUpperCase() : node.name}
        </span>
        <ul>
          {node.dirs.map((d) => (
            <li key={d.path}>
              <TreeNode node={d} depth={depth + 1} active={active} onOpen={onOpen} locale={locale} />
            </li>
          ))}
          {node.files.map((f) => (
            <li key={f.path}>
              <button
                type="button"
                className={clsx('vsc-file', f.path === active && 'active')}
                aria-current={f.path === active ? 'page' : undefined}
                style={{ paddingLeft: 22 + depth * 12 }}
                title={pick(f.note, locale)}
                onClick={() => onOpen(f.path)}
              >
                <FileGlyph path={f.path} />
                {f.path.split('/').pop()}
              </button>
            </li>
          ))}
        </ul>
      </li>
    </ul>
  );
}

function FileGlyph({ path }: { path: string }) {
  const ext = path.split('.').pop() ?? '';
  const map: Record<string, [string, string]> = {
    tsx: ['⚛', '#1a8fd6'],
    ts: ['TS', '#3178c6'],
    css: ['#', '#a160d6'],
    mjs: ['JS', '#c9a200'],
    js: ['JS', '#c9a200'],
  };
  const [g, c] = map[ext] ?? ['·', '#888'];
  return (
    <span className="vsc-glyph" style={{ color: c }} aria-hidden="true">
      {g}
    </span>
  );
}
