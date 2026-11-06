import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';

export default defineConfig({
  site: 'https://www.khartllan.com',
  output: 'static',
  trailingSlash: 'ignore',
  markdown: {
    processor: satteri({
      features: {
        smartPunctuation: false,
        gfm: { footnotes: { label: '각주', backLabel: '각주 {reference}의 본문으로 돌아가기' } },
      },
      // The page owns h1; keep original Markdown and heading IDs unchanged.
      hastPlugins: [{
        name: 'article-heading-levels',
        element: {
          filter: ['h1', 'h2', 'h3', 'h4', 'h5'],
          visit(node, context) {
            if (node.properties?.id !== 'footnote-label') context.setField(node, 'tagName', `h${Number(node.tagName[1]) + 1}`);
          },
        },
      }],
    }),
  },
});
