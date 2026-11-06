# Khartllan · 카르틀란

[www.khartllan.com](https://www.khartllan.com/) — 개인 세계관과 인공어 기록.
Astro로 생성하는 정적 사이트이며 GitHub Pages로 배포합니다.

## 개발과 검증

Node.js 24를 사용합니다 (`.node-version`).

```sh
npm ci
npm run dev
```

PR 전에는 다음을 실행합니다.

```sh
npm run check
npm run build
npx playwright install chromium
npm test
```

새 Linux 환경에서는 `npx playwright install --with-deps chromium`이 필요할 수
있습니다. `npm run preview`는 빌드한 `dist/`를 보여줍니다.

## 글과 구조

- `content/`: 기존 한국어 Markdown 원문. YAML의 `title`은 문서 제목,
  `order`는 같은 폴더 안의 순서입니다. 새 폴더 첫 문서는 `index.md`로 만듭니다.
  `draft: true`와 `private`, `templates`, `.obsidian` 폴더는 공개하지 않습니다.
- `src/lib/documents.ts`: 문서 경로, 탐색 순서, 요약과 검색 텍스트를 구성합니다.
- `src/components/`: 첫 화면, 본문, 문서 트리. 상위 경로, 목차, 이전·다음
  문서와 하위 문서 목록을 제공합니다.
- `src/pages/search.astro`: 제목과 본문을 브라우저 안에서 검색합니다.
  JavaScript 없이도 전체 문서 목록과 모든 본문을 읽을 수 있습니다.
- `src/styles/global.css`: 흰 배경, 반응형 레이아웃과 자체 호스팅 Noto Sans/KR.
  폰트 라이선스는 `public/fonts/licenses/`에 있습니다.
- `public/CNAME`: 기존 도메인 `www.khartllan.com`. DNS나 Pages 환경은 유지합니다.
- `scripts/legacy-paths.mjs`: 기존 Quartz의 `.html` 문서 주소도 빌드합니다.

새 글은 `content/`에 추가하면 목록·탐색·검색·사이트맵·RSS에 자동 반영됩니다.
새 폴더에는 `index.md`를 함께 추가합니다. 원문의 각주와 발음 기호를 보존하며,
단어장은 기존 Google Sheets 링크를 사용합니다. 서버나 Drive 인증은 없습니다.

## 배포와 이전

모든 변경은 `main` 대상 PR에서 검사합니다. PR은 배포하지 않으며, 병합하면
기존 GitHub Pages 워크플로가 `dist/`를 `github-pages` 환경에 배포합니다.

Quartz에서 옮기면서 기존 Markdown 6개를 변경하지 않았습니다. 한글 경로,
공백을 하이픈으로 바꾼 주소, 폴더 끝의 `/`, 본문 제목·각주 앵커를 유지합니다.
Astro의 디렉터리 주소와 기존 `.html` 주소도 함께 열립니다. 사이트맵은
`/sitemap.xml`, RSS는 기존과 같은 `/index.xml`에 있습니다.

Quartz 구현(`quartz/`, `quartz.config.ts`, `quartz.layout.ts`), 기존 `docs/`와
상위 프로젝트 전용 워크플로는 참고·복구용으로 그대로 보관합니다. Astro의
빌드·타입 검사·공개 페이지에는 포함되지 않습니다. 실제 사이트 코드는
`src/`, 활성 배포는 `.github/workflows/deploy.yml`을 사용합니다.
번역이나 새로운 세계관 내용은 생성하지 않습니다. 외부 폰트, 분석 스크립트,
검색 서비스 없이 정적으로 작동합니다. 저장소별 작업 규칙은 `AGENTS.md`를
따릅니다.
