import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// Quartz exposed leaf articles as /article and /article.html. Preserve those
// files as well as Astro's /article/index.html, with one canonical URL.
async function preserveLegacyPaths(directory = 'content', parts = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (['private', 'templates', '.obsidian'].includes(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await preserveLegacyPaths(path, [...parts, entry.name]);
    } else if (entry.name.endsWith('.md') && entry.name !== 'index.md') {
      const slug = [...parts, entry.name.slice(0, -3)].join('/').replace(/\s/g, '-');
      try {
        const html = await readFile(join('dist', slug, 'index.html'));
        await writeFile(join('dist', `${slug}.html`), html);
      } catch (error) {
        // Drafts are intentionally absent from the public build.
        if (error.code !== 'ENOENT') throw error;
      }
    }
  }
}
await preserveLegacyPaths();
