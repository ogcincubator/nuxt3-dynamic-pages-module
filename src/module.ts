import {
  addImports,
  createResolver,
  defineNuxtModule,
  extendPages,
  updateRuntimeConfig,
  useLogger,
  useRuntimeConfig,
} from '@nuxt/kit';
import fm from 'front-matter';
import fs from 'node:fs';
import type {FrontMatterResult} from 'front-matter';
import {marked} from 'marked';
import type {DynamicPageAttributes, DynamicPagesPublicOptions} from "./types";

marked.use({
  renderer: {
    code: (code) =>
      code.lang === 'mermaid' ? `<pre class="mermaid">${code.text}</pre>` : `<pre>${code.text}</pre>`
  },
});

declare module '@nuxt/schema' {
	interface PublicRuntimeConfig {
		dynamicPages: DynamicPagesPublicOptions,
	}
}

export default defineNuxtModule({
  meta: {
    name: 'dynamic-pages',
  },
  async setup() {
    const config = useRuntimeConfig();
    const logger = useLogger('dynamic-pages');
    const resolver = createResolver(import.meta.url);
    const pages: Array<DynamicPageAttributes> = [];

    const pagesDir = config.dynamicPagesPath;
    if (pagesDir) {
      logger.info(`Dynamic pages will be loaded from ${pagesDir}`);

      const path = await import('node:path');

      let filenames: Array<string>;
      try {
        filenames = await fs.promises.readdir(pagesDir.toString());
        filenames.sort();
        for (const filename of filenames) {
          const fullPath = path.join(pagesDir.toString(), filename);
          if (!filename.match(/\.(html|md)$/) || !fs.lstatSync(fullPath).isFile()) {
            continue;
          }
          logger.info(`Loading dynamic page from ${filename}`);
          const data = await fs.promises.readFile(fullPath, 'utf-8');
          const contents: FrontMatterResult<DynamicPageAttributes> = fm(data, {allowUnsafe: true});

          if (contents.attributes.title) {
            if (!contents.attributes.path) {
              contents.attributes.path = '/' + filename.replace(/\.[^.]+$/, '');
            } else if (!contents.attributes.path.startsWith('/')) {
              contents.attributes.path = '/' + contents.attributes.path;
            }
            if (filename.endsWith('.md')) {
              contents.attributes.html = await marked.parse(contents.body);
            } else {
              contents.attributes.html = contents.body;
            }
            pages.push(contents.attributes);
          }
        }

        if (pages.length) {
          extendPages((nuxtPages) => {
            pages.forEach(page => nuxtPages.unshift({
              path: page.path,
              file: resolver.resolve('runtime/components/DynamicPage.vue'),
              meta: {
                dynamicPage: {
                  html: page.html,
                  toc: page.toc,
                  title: page.title,
                },
              },
            }));
          });
        }

      } catch (e) {
        logger.error('Error loading dynamic pages', e);
      }
    } else {
      logger.info('Dynamic pages are not configured');
    }

    await updateRuntimeConfig({
      public: {
        dynamicPages: {
          enabled: true,
          pages: pages.map(page => {
            const { html, toc, ...rest } = page;
            return rest;
          }),
        },
      },
    });

    addImports({
      name: 'useDynamicPages',
      from: resolver.resolve('runtime/composables/useDynamicPages'),
    });

  },
});
