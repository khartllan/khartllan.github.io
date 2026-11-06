import { orderedDocuments, xmlEscape } from '../lib/documents';
export function GET() {
  const items = orderedDocuments.filter((doc) => doc.slug).map((doc) => {
    const url = xmlEscape(new URL(doc.href, 'https://www.khartllan.com').href);
    return `<item><title>${xmlEscape(doc.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${xmlEscape(doc.summary)}</description></item>`;
  }).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Khartllan</title><link>https://www.khartllan.com/</link><description>카르틀란의 언어와 이야기</description><language>ko</language>${items}</channel></rss>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
