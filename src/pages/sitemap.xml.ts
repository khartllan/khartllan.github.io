import { documents, xmlEscape } from '../lib/documents';
export function GET() {
  const paths = [...documents.map((doc) => doc.href), '/search/'];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${xmlEscape(new URL(path, 'https://www.khartllan.com').href)}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
