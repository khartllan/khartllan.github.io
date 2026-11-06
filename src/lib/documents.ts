import type { MarkdownInstance } from 'astro';

type Frontmatter = { title: string; order?: number; draft?: boolean };
export type Document = {
  slug: string; href: string; title: string; summary: string; text: string;
  parent: string | null; order: number; isIndex: boolean;
  markdown: MarkdownInstance<Frontmatter>;
};
const modules = import.meta.glob<MarkdownInstance<Frontmatter>>([
  '../../content/**/*.md', '!../../content/**/private/**',
  '!../../content/**/templates/**', '!../../content/**/.obsidian/**',
], { eager: true });

function plainText(markdown: string): string {
  return markdown.replace(/\[\^[^\]]+\]/g, '')
    .replace(/\\(["'])/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#*_`>]/g, '').replace(/\s+/g, ' ').trim();
}
export const documents: Document[] = Object.entries(modules)
  .filter(([, markdown]) => markdown.frontmatter.draft !== true)
  .map(([file, markdown]) => {
    if (!markdown.frontmatter.title) throw new Error(`Missing document title: ${file}`);
    const path = file.replace('../../content/', '').replace(/\.md$/, '');
    const isIndex = path === 'index' || path.endsWith('/index');
    const slug = (isIndex ? path.replace(/(^|\/)index$/, '') : path).replace(/\s/g, '-');
    const raw = markdown.rawContent();
    const paragraph = raw.replace(/^#{1,6}\s+.*$/gm, '').split(/\n\s*\n/)
      .find((part) => part.trim() && !/^\[\^/.test(part.trim()));
    return {
      slug, href: slug ? `/${slug}${isIndex ? '/' : ''}` : '/',
      title: markdown.frontmatter.title,
      summary: paragraph ? plainText(paragraph).slice(0, 155) : '작성 중인 문서입니다.',
      text: plainText(raw), parent: slug ? slug.split('/').slice(0, -1).join('/') : null,
      order: Number.isFinite(markdown.frontmatter.order) ? Number(markdown.frontmatter.order) : Infinity,
      isIndex, markdown,
    };
  });
export function childrenOf(slug: string): Document[] {
  return documents.filter((doc) => doc.parent === slug)
    .sort((a, b) => Number(b.isIndex) - Number(a.isIndex) || a.order - b.order || a.title.localeCompare(b.title, 'ko'));
}
export function descendantsOf(slug: string): Document[] {
  return childrenOf(slug).flatMap((doc) => [doc, ...descendantsOf(doc.slug)]);
}
export const home = documents.find((doc) => doc.slug === '')!;
export const orderedDocuments = [home, ...descendantsOf('')];
export function ancestorsOf(doc: Document): Document[] {
  const parts = doc.slug.split('/');
  return [home, ...parts.slice(0, -1).map((_, i) => documents.find((item) => item.slug === parts.slice(0, i + 1).join('/'))).filter((item): item is Document => !!item)];
}
export const xmlEscape = (value: string) => value.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[c]!);
