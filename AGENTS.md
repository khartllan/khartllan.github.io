# Khartllan repository conventions

- This is the owner's Korean worldbuilding and constructed-language website,
  separate from their academic site. The owner explicitly approved migration
  from Quartz to Astro. Keep a white background, a restrained reading layout,
  self-hosted Noto Sans/KR, and responsive keyboard-accessible navigation.
- Active application code is under `src/`. Legacy Quartz sources, configuration,
  docs, and upstream-only workflows are retained unchanged for reference and
  rollback, and excluded from Astro's build/typecheck. Do not edit or run them
  for normal site work. `.github/workflows/deploy.yml` is the active Pages flow.
- `content/` is the source of truth. Preserve the author's Korean prose,
  fictional names, IPA, footnotes, external links, and hierarchy. Do not invent
  world lore, species descriptions, grammar rules, or vocabulary. Add translations
  only when requested. The dictionary keeps the original Google Sheets link;
  no Drive API or credentials are needed.
- Add Markdown with a YAML `title`. Folder landing pages use `index.md`; add one
  for each new folder. Numeric `order` sorts sibling chapters, with folder pages
  first. Lists, breadcrumbs, reading order, search, and feeds derive from these
  documents. Empty chapters are marked as in progress; do not invent body text.
- Exclude `draft: true` documents and `private`, `templates`, and `.obsidian`
  folders from all public pages, search, and feeds. Never commit credentials or
  private source material. The migration leaves all six original Markdown files
  unchanged, replacing presentation and navigation only.
- Keep the origin `https://www.khartllan.com` and exact `public/CNAME` value.
  Preserve Quartz routes: spaces become hyphens, folder indexes end in `/`, and
  leaf canonical URLs do not. `npm run build` also creates legacy leaf `.html`
  files using `scripts/legacy-paths.mjs`. Preserve heading and footnote IDs.
- The page supplies h1. The Markdown processor raises article heading levels
  without changing text or anchor slugs. Keep footnotes localized in Korean.
- Search filters public title/body text in the browser. Reading, navigation, and
  the document list work without JavaScript. Do not add analytics, external fonts,
  or hosted search services without a request.
- Use the checked-in Node version and lockfile. Run `npm ci`, `npm run check`,
  `npm run build`, and `npm test` for migrations, route, rendering, or layout work.
  Tests cover routes, anchors, IPA, footnotes, Sheets links, hierarchy, search,
  mobile overflow, feeds, keyboard access, and reading without JavaScript.
- Changes go through PRs. Keep GitHub Pages at the existing `github-pages`
  environment and domain. PRs validate without deploying; `main` merges deploy
  `dist/`. The owner's standing instruction is to merge and deploy requested
  changes after review and passing checks, without repeated confirmation.
  Monitor deployment and verify the live site before reporting completion.
