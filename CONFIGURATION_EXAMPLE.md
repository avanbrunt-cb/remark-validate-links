# Configuration Example: DevNetwork Hugo Setup

This document shows exactly how to configure `remark-validate-links` for your DevNetwork Hugo site once the recommended changes are implemented.

## Your Current `.remarkrc` File Location

Place this in your **consuming repository** (the DevNetwork documentation repo), not in this plugin repo.

## Complete Configuration Example

```json
{
  "plugins": [
    ["remark-validate-links", {
      "repository": "https://github.com/your-org/devnetwork-docs",
      "root": "./",
      
      "stripMarkdownExtensions": true,
      "normalizeTrailingSlash": true,
      
      "extraLandmarks": [
        "/blog",
        "/showcase",
        "/resources/query_overview.pdf",
        "/resources/5.2-process-document.png",
        "/resources/6.1-process-document.png"
      ],
      
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
    }],
    
    ["remark-lint-no-dead-urls", {
      "deadOrAliveOptions": {
        "maxRetries": 3,
        "maxRedirects": 5,
        "sleep": 2000,
        "timeout": 5000,
        "findUrls": false,
        "checkAnchor": false,
        "followMetaHttpEquiv": false
      },
      "skipOffline": true,
      "skipUrlPatterns": [
        "yyyy-mm-ddthh:mm:ssZ",
        ".*support@bit9.com.*",
        ".*postman.*",
        "https://splunkbase.splunk.com/app/.*",
        "https://apps.xforce.ibmcloud.com/hub/extension/.*",
        "https://developers.facebook.com/docs/threat-exchange",
        "https://techdocs.broadcom.com/bin/gethidpage.*",
        "https://community.broadcom.com/symantecenterprise/communities/communityhomeblogs.*",
        "https://www.ibm.com/docs/.*",
        "https://www.security.com/feature-stories/carbon-black-here-stay-and-stronger-ever",
        "https://help.splunk.com/en/splunk-enterprise/get-started/get-data-in/9.4/get-data-with-http-event-collector/set-up-and-use-http-event-collector-in-splunk-web",
        "https://www.vultr.com/resources/ipv4-converter/",
        "https://github.com/carbonblack/.*",
        "https://github.com/cbcommunity/.*",
        "https://docs.splunk.com/Documentation/.*",
        "https://myevents.vmware.com/widget/.*",
        "https://automatetheboringstuff.com",
        "https://cbapi.readthedocs.io",
        "https://docs.broadcom.com/docs/getting-started-with-vmware-carbon-black-apis"
      ]
    }]
  ]
}
```

## Configuration Breakdown

### 1. Basic Repository Settings

```json
{
  "repository": "https://github.com/your-org/devnetwork-docs",
  "root": "./"
}
```

**What it does**: 
- Points to your GitHub repository
- Sets the root directory for resolving paths

**Replace**: Update `repository` with your actual repo URL

---

### 2. Extension and Path Normalization

```json
{
  "stripMarkdownExtensions": true,
  "normalizeTrailingSlash": true
}
```

**What it does**:
- `stripMarkdownExtensions`: Makes `/guide` and `/guide.md` equivalent
- `normalizeTrailingSlash`: Makes `/guide/` and `/guide` equivalent

**Equivalent to**: Original commit's extension stripping and trailing slash removal

---

### 3. Extra Landmarks (Static Pages)

```json
{
  "extraLandmarks": [
    "/blog",
    "/showcase",
    "/resources/query_overview.pdf",
    "/resources/5.2-process-document.png",
    "/resources/6.1-process-document.png"
  ]
}
```

**What it does**: Marks these paths as valid even if they don't exist as markdown files

**Equivalent to**: Original commit's hardcoded landmarks (lines 69-74)

**To customize**: Add/remove paths based on your static pages and resources

---

### 4. Hugo Configuration

```json
{
  "hugoConfig": {
    "enabled": true,
    "parseFrontmatterAliases": true,
    "contentDirectory": "content",
    "resourcePaths": ["/resources/"]
  }
}
```

**What it does**:
- `enabled`: Activates Hugo-specific features
- `parseFrontmatterAliases`: Reads `aliases: [...]` from front matter
- `contentDirectory`: Points to Hugo's content folder
- `resourcePaths`: Paths treated as static resources (pass through as-is)

**Equivalent to**: Original commit's alias parsing and resources handling

---

### 5. Blog Configuration

```json
{
  "blogConfig": {
    "enabled": true,
    "directory": "blog",
    "autoGenerateAliases": true,
    "dateInUrl": true,
    "compressMultipleDashes": true
  }
}
```

**What it does**:
- `enabled`: Activates blog-specific features
- `directory`: Blog folder within content directory (`content/blog/`)
- `autoGenerateAliases`: Creates URL aliases from blog post titles
- `dateInUrl`: Resolves `/2022/03/post` to `content/blog/post`
- `compressMultipleDashes`: Converts `hello--world` to `hello-world` in slugs

**Equivalent to**: Original commit's blog auto-alias generation and date URL handling

---

## Hugo Front Matter Examples

### Example 1: Explicit Aliases

**File**: `content/docs/installation.md`

```yaml
---
title: "Installation Guide"
aliases: ["/install", "/getting-started/install"]
---

# Installation Guide

Content here...
```

**Result**: Links to `/install` or `/getting-started/install` will resolve to this file

---

### Example 2: Blog Post with Auto-Generated Alias

**File**: `content/blog/2022-03-07-hello-world.md`

```yaml
---
title: "Hello World Example"
date: 2022-03-07
---

# Hello World Example

Content here...
```

**Results**:
1. **Date URL**: `/2022/03/hello-world-example` → resolves to this file
2. **Auto-alias**: `/hello-world-example` → also resolves to this file (from title)
3. **Multiple dashes**: Title with multiple spaces generates clean single-dash slugs

---

### Example 3: Combined Aliases

**File**: `content/docs/api-reference.md`

```yaml
---
title: "API Reference"
aliases: ["/api", "/reference/api"]
---

# API Reference

Content here...
```

**Result**: Three ways to link to this file:
- `/docs/api-reference` (actual path)
- `/api` (alias 1)
- `/reference/api` (alias 2)

---

## Link Examples That Will Work

Given the configuration above:

### Extension-Agnostic Links

```markdown
<!-- Both work the same -->
[Guide](/docs/guide.md)
[Guide](/docs/guide)
```

### Trailing Slash Normalization

```markdown
<!-- Both work the same -->
[Docs](/docs/)
[Docs](/docs)
```

### Blog Date URLs

```markdown
<!-- Links to content/blog/my-post.md -->
[My Post](/2022/03/my-post)
```

### Static Resources

```markdown
<!-- Direct resource links -->
[PDF](/resources/query_overview.pdf)
![Image](/resources/5.2-process-document.png)
```

### Aliases

```markdown
<!-- Links to content/docs/installation.md via alias -->
[Install](/install)
```

---

## Minimal Configuration

If you only need basic features:

```json
{
  "plugins": [
    ["remark-validate-links", {
      "repository": "https://github.com/your-org/repo",
      "stripMarkdownExtensions": true,
      "extraLandmarks": ["/blog", "/showcase"]
    }]
  ]
}
```

---

## Progressive Enhancement

Start minimal and add features as needed:

### Step 1: Basic Setup
```json
{
  "repository": "...",
  "root": "./"
}
```

### Step 2: Add Extension Stripping
```json
{
  "repository": "...",
  "stripMarkdownExtensions": true
}
```

### Step 3: Add Static Landmarks
```json
{
  "repository": "...",
  "stripMarkdownExtensions": true,
  "extraLandmarks": ["/blog"]
}
```

### Step 4: Enable Hugo Features
```json
{
  "repository": "...",
  "stripMarkdownExtensions": true,
  "extraLandmarks": ["/blog"],
  "hugoConfig": {
    "enabled": true,
    "parseFrontmatterAliases": true,
    "contentDirectory": "content"
  }
}
```

### Step 5: Full Hugo + Blog
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

---

## Troubleshooting

### Links Still Breaking?

1. **Check file paths**: Ensure `contentDirectory` matches your Hugo setup
2. **Verify aliases format**: Must be JSON array: `["alias1", "alias2"]`
3. **Test date URLs**: Pattern must be exactly `/YYYY/MM/...`
4. **Review extensions**: Only `.md` files get extension stripping

### Aliases Not Working?

```yaml
# ❌ Wrong (YAML array)
aliases:
  - /old-path
  - /another-path

# ✅ Correct (JSON array)
aliases: ["/old-path", "/another-path"]
```

### Blog Aliases Not Generated?

- Check `autoGenerateAliases` is `true`
- Ensure file is in correct directory (`content/blog/`)
- Verify title is properly formatted: `title: "My Title"`
- Title must be quoted

---

## Migration Checklist

When moving from hardcoded to configurable:

- [ ] Create `.remarkrc` in consuming repo
- [ ] Copy configuration from examples above
- [ ] Update `repository` URL
- [ ] Adjust `extraLandmarks` for your static pages
- [ ] Test with a few markdown files
- [ ] Run validation across full documentation
- [ ] Check all aliases resolve correctly
- [ ] Verify blog URLs work
- [ ] Test extension-agnostic links
- [ ] Validate resource paths

---

## package.json Script Example

Add to your **consuming repository**:

```json
{
  "scripts": {
    "lint:links": "remark . --use remark-validate-links",
    "lint:links:fix": "remark . --use remark-validate-links --output"
  },
  "devDependencies": {
    "remark-cli": "^12.0.0",
    "remark-validate-links": "^11.0.2"
  }
}
```

Then run:

```bash
npm run lint:links
```

---

## Advanced: Multiple Configurations

If you have different needs for different directories:

### Hugo Site Configuration
**`docs/.remarkrc`**:
```json
{
  "plugins": [
    ["remark-validate-links", {
      "hugoConfig": {
        "enabled": true,
        "parseFrontmatterAliases": true
      }
    }]
  ]
}
```

### Regular Markdown (GitHub)
**`.remarkrc`**:
```json
{
  "plugins": [
    ["remark-validate-links", {
      "repository": "https://github.com/your-org/repo"
    }]
  ]
}
```
