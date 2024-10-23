# Nuxt3 Dynamic pages module

This module enables dynamic pages from a local directory.

## Usage

1. Install the npm module (`npm i @ogc/nuxt3-dynamic-pages-module`).
2. Add the module to `nuxt.config.ts`.
3. Set the `dynamicPagesPath` runtime configuration value (e.g., `NUXT_DYNAMIC_PAGES_PATH` env. variable) to a
   local path.
4. Create static `.md` or `.html` page files inside that directory.

## Static page file format

All dynamic pages need to include some front-matter metadata:

* `title`: title for the page
* `path`: application path (URL), starting with `/`.
* `toc` (optional): whether to automatically create a table of contents from headers (`true` or `false`)

### Sample Markdown page

```markdown
---
title: About
path: /about
navigationMenu: main
toc: true
---
# Hello
World.
```

### Sample HTML page

```html
---
title: About
path: /about
navigationMenu: main
toc: true
---
<h1>Hello</h1>
<p>World.</p>
```
