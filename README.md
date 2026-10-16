# Portfolio — desktop

Personal portfolio of Alina Pipchenkova built as a desktop OS: projects are icons, case studies open in
windows, the dock holds contacts and an AI assistant. On phones it turns into a home screen.

## Stack

- **Next.js 16 (App Router), static export** — every page is prerendered HTML served from a CDN, no server.
- **TypeScript strict**, **Tailwind CSS v4**
- **Effector** — window manager state (one scope per page, so the window from the URL is server-rendered)
- **zod** — content schema, validated at build time
- **Vitest** (window-manager logic) + **Playwright** (desktop and mobile e2e)

## URLs

| Path                     | What                                                   |
| ------------------------ | ------------------------------------------------------ |
| `/`                      | redirects to `/en/` or `/ru/` by browser language      |
| `/{locale}/`             | desktop                                                |
| `/{locale}/work/{slug}/` | desktop with the case window open (shareable, indexed) |
| `/{locale}/about/`       | desktop with `about.txt` open                          |
| `/{locale}/cv/`          | recruiter mode: plain list of projects                 |
| `/{locale}/cv/{slug}/`   | recruiter mode: case page                              |

Opening windows updates the URL with `history.pushState`; browser Back closes the window.

## Content

- Projects: `src/content/projects.ts` (EN + RU fields, schema in `src/content/schema.ts`)
- Profile and contacts: `src/content/profile.ts`
- UI strings: `src/i18n/dictionaries.ts`
- Media: `public/media/{slug}/cover.avif`, `public/media/{slug}/loop.mp4`; resume: `public/resume.pdf`

`result: null` marks a case without a metric yet — shown as a TODO only in dev, hidden in production.

## Scripts

```bash
npm run dev        # local dev server
npm run check      # lint + typecheck + unit tests + build
npm run test:e2e   # Playwright against the built `out/`
npm run preview    # serve `out/` on :3000
```

## Hosting

Static `out/` folder → Yandex Object Storage + Cloud CDN (fast in Russia, no Cloudflare/Vercel blocking),
own domain. Deploy job will be added once the bucket and domain exist.

## Architecture

```
src/
  app/[locale]/…            routes (server components, static params)
  content/                  typed content + zod schema
  i18n/                     locales and dictionaries
  features/
    windows/                logic.ts (pure, unit-tested) · model.ts (Effector) · Window.tsx (chrome, drag, resize, zoom)
    desktop/                Desktop shell: menu bar, icons, dock, spotlight, notifications
    apps/                   window contents: ProjectView, AskView, TerminalView
    assistant/              Answerer interface — local demo now, LLM later
    recruiter/              recruiter-mode pages
    notifications/, spotlight/
```
