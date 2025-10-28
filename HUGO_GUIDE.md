# Hugo Support Guide

Complete guide for using `remark-validate-links` with Hugo static sites.

## Contents

- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Features](#features)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Migration](#migration)

---

## Quick Start

### 1. Install

```bash
npm install --save-dev remark-cli remark-validate-links
```

### 2. Create Configuration

Create `.remarkrc` in your project root:

```json
{
  "plugins": [
    ["remark-validate-links", {
      "repository": "https://github.com/your-org/your-repo",
      "stripMarkdownExtensions": true,
      "normalizeTrailingSlash": true,
      "hugoConfig": {
        "enabled": true,
        "parseFrontmatterAliases": true,
        "contentDirectory": "content",
        "blogConfig": {
          "enabled": true,
          "directory": "blog",
          "autoGenerateAliases": true,
          "dateInUrl": true
        }
      }
    }]
  ]
}
```

### 3. Add NPM Script

```json
{
  "scripts": {
    "lint:links": "remark . --use remark-validate-links"
  }
}
```

### 4. Run

```bash
npm run lint:links
```

---

## Configuration

### Minimal Setup

```json
{
  "plugins": ["remark-validate-links"]
}
```

Uses auto-detection. Only checks basic links.

### Standard Hugo

```json
{
  "plugins": [
    ["remark-validate-links", {
      "stripMarkdownExtensions": true,
      "hugoConfig": {
        "enabled": true
      }
    }]
  ]
}
```

### Full Featured

```json
{
  "plugins": [
    ["remark-validate-links", {
      "repository": "https://github.com/your-org/repo",
      "root": "./",
      "stripMarkdownExtensions": true,
      "normalizeTrailingSlash": true,
      "extraLandmarks": ["/blog", "/showcase"],
      "hugoConfig": {
        "enabled": true,
        "parseFrontmatterAliases": true,
        "contentDirectory": "content",
        "resourcePaths": ["/resources/"],
        "blogConfig": {
          "enabled": true,
          "directory": "blog",
          "autoGenerateAliases": true,
          "dateInUrl": true,
          "compressMultipleDashes": true
        }
      }
    }]
  ]
}
```

---

## Features

### 1. Extension-Agnostic Links

**Configuration:**
```json
{
  "stripMarkdownExtensions": true
}
```

**Result:** `/docs/guide` and `/docs/guide.md` are treated identically.

### 2. Trailing Slash Normalization

**Configuration:**
```json
{
  "normalizeTrailingSlash": true
}
```

**Result:** `/docs/guide/` and `/docs/guide` are treated identically.

### 3. Extra Landmarks

**Configuration:**
```json
{
  "extraLandmarks": ["/blog", "/showcase", "/resources/file.pdf"]
}
```

**Result:** These paths are always considered valid, even if they don't exist as markdown files.

### 4. Hugo Aliases

**Configuration:**
```json
{
  "hugoConfig": {
    "enabled": true,
    "parseFrontmatterAliases": true
  }
}
```

**Front Matter:**
```yaml
---
title: "Installation"
aliases: ["/install", "/setup"]
---
```

**Result:** Links to `/install` or `/setup` resolve to this file.

### 5. Content Directory Mapping

**Configuration:**
```json
{
  "hugoConfig": {
    "enabled": true,
    "contentDirectory": "content"
  }
}
```

**Result:** `/docs/guide` resolves to `content/docs/guide.md`.

### 6. Blog Date URLs

**Configuration:**
```json
{
  "hugoConfig": {
    "blogConfig": {
      "enabled": true,
      "directory": "blog",
      "dateInUrl": true
    }
  }
}
```

**Result:** `/2022/03/my-post` resolves to `content/blog/my-post.md`.

### 7. Auto-Generated Blog Aliases

**Configuration:**
```json
{
  "hugoConfig": {
    "blogConfig": {
      "enabled": true,
      "autoGenerateAliases": true,
      "compressMultipleDashes": true
    }
  }
}
```

**Front Matter:**
```yaml
---
title: "My  Test  Post"
---
```

**Result:** Auto-generates alias `/my-test-post` (compressed dashes).

### 8. Resource Paths

**Configuration:**
```json
{
  "hugoConfig": {
    "resourcePaths": ["/resources/", "/static/"]
  }
}
```

**Result:** Resources validate as-is, not mapped to content directory.

---

## Examples

### Link Patterns

```markdown
<!-- Content links -->
[Guide](/docs/guide)           <!-- Works -->
[Guide](/docs/guide.md)        <!-- Works (if stripMarkdownExtensions: true) -->
[Guide](/docs/guide/)          <!-- Works (if normalizeTrailingSlash: true) -->

<!-- Blog date links -->
[Post](/2022/03/my-post)       <!-- Works (if blogConfig.dateInUrl: true) -->

<!-- Alias links -->
[Install](/install)            <!-- Works (if aliases defined) -->

<!-- Resources -->
[PDF](/resources/guide.pdf)    <!-- Works (if in extraLandmarks or resourcePaths) -->
```

### Front Matter Examples

**Explicit Aliases:**
```yaml
---
title: "Installation Guide"
aliases: ["/install", "/getting-started/install"]
---
```

**Blog Post with Auto-Alias:**
```yaml
---
title: "Hello World Example"
date: 2022-03-07
---
```

Auto-generates `/hello-world-example` alias.

**Combined:**
```yaml
---
title: "API Reference"
aliases: ["/api", "/reference/api"]
---
```

Three ways to link: `/docs/api-reference`, `/api`, `/reference/api`.

---

## Troubleshooting

### "Cannot find file"

**Check:**
- Is `contentDirectory` correct? (default: `"content"`)
- Is `root` set correctly? (try `"root": "./"`)
- Does file exist at expected path?

**Try:**
```bash
remark your-file.md --use remark-validate-links --frail
```

### "Cannot find remote origin"

**Fix:** Set explicit repository:
```json
{
  "repository": "https://github.com/your-org/your-repo"
}
```

### Aliases Not Working

**Check:**
- Is `parseFrontmatterAliases: true`?
- Is aliases format correct?

```yaml
# ❌ Wrong (YAML array)
aliases:
  - /old-path

# ✅ Correct (JSON array)
aliases: ["/old-path", "/another-path"]
```

### Blog Date URLs Not Resolving

**Check:**
- Is `blogConfig.enabled` and `blogConfig.dateInUrl` true?
- Pattern must be exactly `/YYYY/MM/...` (4-digit year, 2-digit month)
- Is `blogConfig.directory` correct?

### Auto-Generated Aliases Not Working

**Check:**
- Is `blogConfig.autoGenerateAliases: true`?
- Is file in blog directory (`content/blog/`)?
- Is title quoted: `title: "My Title"`?

---

## Migration

### From Standard remark-validate-links

Just add Hugo configuration to your existing `.remarkrc`:

```json
{
  "plugins": [
    ["remark-validate-links", {
      "hugoConfig": {
        "enabled": true
      }
    }]
  ]
}
```

### Progressive Enhancement

Start simple and add features:

**Step 1 - Basic:**
```json
{
  "repository": "..."
}
```

**Step 2 - Extension Stripping:**
```json
{
  "repository": "...",
  "stripMarkdownExtensions": true
}
```

**Step 3 - Hugo Basics:**
```json
{
  "repository": "...",
  "stripMarkdownExtensions": true,
  "hugoConfig": {
    "enabled": true,
    "contentDirectory": "content"
  }
}
```

**Step 4 - Full Features:**
```json
{
  "repository": "...",
  "stripMarkdownExtensions": true,
  "hugoConfig": {
    "enabled": true,
    "parseFrontmatterAliases": true,
    "contentDirectory": "content",
    "blogConfig": {
      "enabled": true,
      "directory": "blog",
      "autoGenerateAliases": true,
      "dateInUrl": true
    }
  }
}
```

### Checklist

- [ ] Create `.remarkrc` in project root
- [ ] Copy configuration
- [ ] Update `repository` URL
- [ ] Adjust `extraLandmarks` for static pages
- [ ] Test with a few files
- [ ] Run validation across all docs
- [ ] Verify aliases work
- [ ] Test blog URLs
- [ ] Validate resources

---

## CI/CD Integration

### GitHub Actions

```yaml
name: Validate Links

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint:links
```

### GitLab CI

```yaml
validate-links:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm run lint:links
```

---

## Advanced Usage

### Custom Structure

```json
{
  "hugoConfig": {
    "contentDirectory": "src/content",
    "blogConfig": {
      "directory": "posts"
    }
  }
}
```

### Multiple Resources

```json
{
  "hugoConfig": {
    "resourcePaths": ["/static/", "/assets/", "/resources/"]
  }
}
```

### Selective Features

```json
{
  "stripMarkdownExtensions": true,
  "normalizeTrailingSlash": false,
  "hugoConfig": {
    "enabled": true,
    "parseFrontmatterAliases": true,
    "blogConfig": {
      "enabled": true,
      "autoGenerateAliases": false
    }
  }
}
```

---

## Configuration Reference

### Options

```typescript
{
  // Basic
  repository?: string | false;
  root?: string;
  skipPathPatterns?: Array<RegExp | string>;
  
  // Hugo-specific
  stripMarkdownExtensions?: boolean;
  normalizeTrailingSlash?: boolean;
  extraLandmarks?: Array<string>;
  hugoConfig?: HugoConfig;
}
```

### HugoConfig

```typescript
{
  enabled?: boolean;
  parseFrontmatterAliases?: boolean;
  contentDirectory?: string;     // default: "content"
  blogConfig?: BlogConfig;
  resourcePaths?: Array<string>;
}
```

### BlogConfig

```typescript
{
  enabled?: boolean;
  directory?: string;             // default: "blog"
  autoGenerateAliases?: boolean;
  dateInUrl?: boolean;
  compressMultipleDashes?: boolean;
}
```

---

## Tips

1. **Start minimal** - Add features incrementally
2. **Test early** - Validate with a few files first
3. **Use CI/CD** - Catch broken links automatically
4. **Document aliases** - Keep track of your URL mappings
5. **Monitor performance** - Large repos benefit from caching

---

## Compatibility

- **Hugo:** All versions (uses standard front matter)
- **Node.js:** 16+
- **remark:** 14+

---

## See Also

- [Main README](readme.md) - Complete API documentation
- [remark-cli](https://github.com/remarkjs/remark/tree/main/packages/remark-cli) - CLI documentation

