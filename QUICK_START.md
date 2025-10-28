# Quick Start Guide

## 5-Minute Setup for Hugo Sites

### 1. Install the Plugin

In your Hugo documentation repository:

```bash
npm install --save-dev remark-cli remark-validate-links
```

Or if using this custom branch:

```bash
npm install --save-dev remark-cli remarkjs/remark-validate-links#custom-code
```

### 2. Create `.remarkrc` Configuration

Create a `.remarkrc` file in your project root:

```json
{
  "plugins": [
    ["remark-validate-links", {
      "repository": "https://github.com/your-org/your-repo",
      "root": "./",
      "stripMarkdownExtensions": true,
      "normalizeTrailingSlash": true,
      "extraLandmarks": ["/blog", "/showcase"],
      "hugoConfig": {
        "enabled": true,
        "parseFrontmatterAliases": true,
        "contentDirectory": "content",
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

### 3. Add NPM Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "lint:links": "remark . --use remark-validate-links",
    "lint:links:verbose": "remark . --use remark-validate-links --frail"
  }
}
```

### 4. Run Validation

```bash
npm run lint:links
```

## Configuration Levels

### Minimal (Basic Link Checking)

```json
{
  "plugins": ["remark-validate-links"]
}
```

Uses auto-detection for repository and root. Only checks local links.

### Standard (Hugo Site)

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

Basic Hugo support with extension-agnostic links.

### Advanced (Full Features)

```json
{
  "plugins": [
    ["remark-validate-links", {
      "repository": "https://github.com/your-org/your-repo",
      "root": "./",
      "stripMarkdownExtensions": true,
      "normalizeTrailingSlash": true,
      "extraLandmarks": ["/blog", "/resources/file.pdf"],
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

All Hugo features enabled.

## Common Link Patterns

### Content Links

```markdown
[Guide](/docs/guide)           ← Works
[Guide](/docs/guide.md)        ← Works (if stripMarkdownExtensions: true)
[Guide](/docs/guide/)          ← Works (if normalizeTrailingSlash: true)
```

### Blog Links

```markdown
[Post](/2022/03/my-post)       ← Works (if blogConfig.dateInUrl: true)
```

### Aliases

In your markdown file:
```yaml
---
title: "Installation"
aliases: ["/install", "/setup"]
---
```

In other files:
```markdown
[Install](/install)            ← Works
[Setup](/setup)                ← Works
```

### Resources

```markdown
[PDF](/resources/guide.pdf)    ← Works (if in extraLandmarks or resourcePaths)
```

## Troubleshooting

### "Cannot find file"

**Check:**
- Is `contentDirectory` correct? (default: `"content"`)
- Is `root` set? (try `"root": "./"`)
- Does file exist at expected path?

**Try:**
```bash
# See what path it's looking for
remark your-file.md --use remark-validate-links --frail
```

### "Cannot find remote origin"

**Fix:** Set explicit repository:
```json
{
  "repository": "https://github.com/your-org/your-repo"
}
```

### Aliases not working

**Check:**
- Is `parseFrontmatterAliases: true`?
- Is aliases format JSON array: `["alias1", "alias2"]`?
- Not YAML array format (won't work)

## Next Steps

- See [CONFIGURATION_EXAMPLE.md](CONFIGURATION_EXAMPLE.md) for more examples

## Example CI/CD Integration

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

