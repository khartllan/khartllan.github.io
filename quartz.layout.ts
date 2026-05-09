import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// 커스텀 정렬 함수 — frontmatter의 order 필드 우선
const explorerSortFn = (a: any, b: any) => {
  // index.md는 항상 맨 위
  if (a.file?.slug?.endsWith("/index")) return -1
  if (b.file?.slug?.endsWith("/index")) return 1

  // 폴더 vs 파일 — 폴더 먼저
  if (a.file && !b.file) return 1
  if (!a.file && b.file) return -1

  // 둘 다 파일이거나 둘 다 폴더인 경우
  const orderA = a.file?.frontmatter?.order as number | undefined
  const orderB = b.file?.frontmatter?.order as number | undefined

  if (orderA !== undefined && orderB !== undefined) {
    return orderA - orderB
  }
  if (orderA !== undefined) return -1
  if (orderB !== undefined) return 1

  return a.displayName.localeCompare(b.displayName, "ko", { numeric: true })
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({ sortFn: explorerSortFn }),   // ← 변경
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({ sortFn: explorerSortFn }),   // ← 변경
  ],
  right: [],
}