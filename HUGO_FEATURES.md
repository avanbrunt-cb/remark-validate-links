# Hugo Static Site Generator Support

This document describes the Hugo-specific features available in `remark-validate-links`.

## Overview

The plugin now includes built-in support for Hugo static site generators through configurable options, allowing you to validate links in Hugo projects without modifying the core codebase.

## Features

### 1. Extra Landmarks

Define static pages or resources that should be considered valid even if they don't exist as markdown files.

**Configuration:**
```json
{
  "extraLandmarks": [
    "/blog",
    "/showcase",
    "/resources/query_overview.pdf"
  ]
}
```

**Use Case:** Your Hugo site has generated pages (like `/blog` index) or static resources that aren't markdown files but should be valid link targets.

### 2. Extension-Agnostic Links

Strip `.md` extensions from file paths to allow linking with or without the extension.

**Configuration:**
```json
{
  "stripMarkdownExtensions": true
}
```

**Result:**
- `/docs/guide` and `/docs/guide.md` are treated identically
- Matches Hugo's behavior where URLs don't include file extensions

### 3. Trailing Slash Normalization

Remove trailing slashes from paths for consistent link validation.

**Configuration:**
```json
{
  "normalizeTrailingSlash": true
}
```

**Result:**
- `/docs/guide/` and `/docs/guide` are treated identically
- Prevents false positives from trailing slash variations

### 4. Hugo Aliases

Parse and validate aliases defined in Hugo front matter.

**Configuration:**
```json
{
  "hugoConfig": {
    "enabled": true,
    "parseFrontmatterAliases": true
  }
}
```

**Front Matter Example:**
```yaml
---
title: "Installation Guide"
aliases: ["/install", "/getting-started/install"]
---
```

**Result:**
- Links to `/install` or `/getting-started/install` resolve to this file
- All landmarks (headings) from the original file are available via aliases
- Invalid JSON format throws a clear error message

### 5. Content Directory Mapping

Map Hugo's content directory structure to validate absolute paths correctly.

**Configuration:**
```json
{
  "hugoConfig": {
    "enabled": true,
    "contentDirectory": "content"
  }
}
```

**Result:**
- `/docs/guide` resolves to `content/docs/guide.md`
- Matches Hugo's URL structure to filesystem structure

### 6. Blog Date URLs

Support Hugo's date-based blog URL patterns.

**Configuration:**
```json
{
  "hugoConfig": {
    "enabled": true,
    "contentDirectory": "content",
    "blogConfig": {
      "enabled": true,
      "directory": "blog",
      "dateInUrl": true
    }
  }
}
```

**Result:**
- `/2022/03/my-post` resolves to `content/blog/my-post.md`
- Matches Hugo's `:year/:month/:filename` permalink structure

### 7. Auto-Generated Blog Aliases

Automatically create URL aliases from blog post titles.

**Configuration:**
```json
{
  "hugoConfig": {
    "enabled": true,
    "contentDirectory": "content",
    "blogConfig": {
      "enabled": true,
      "directory": "blog",
      "autoGenerateAliases": true,
      "compressMultipleDashes": true
    }
  }
}
```

**Front Matter Example:**
```yaml
---
title: "My  Test  Post"
---
```

**Result:**
- Auto-generates alias: `/my-test-post` (from title)
- Multiple spaces/dashes compressed to single dashes
- Works alongside explicit aliases

### 8. Resource Path Handling

Treat certain paths as static resources that pass through without content directory mapping.

**Configuration:**
```json
{
  "hugoConfig": {
    "enabled": true,
    "resourcePaths": ["/resources/", "/static/"]
  }
}
```

**Result:**
- `/resources/image.png` validates as-is
- Not mapped to `content/resources/image.png`
- Matches Hugo's static file handling

## Complete Configuration Example

```json
{
  "plugins": [
    ["remark-validate-links", {
      "repository": "https://github.com/your-org/your-repo",
      "root": "./",
      
      "stripMarkdownExtensions": true,
      "normalizeTrailingSlash": true,
      
      "extraLandmarks": [
        "/blog",
        "/showcase",
        "/resources/query_overview.pdf"
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
    }]
  ]
}
```

## Hugo Project Structure

Typical Hugo project structure that works with this configuration:

```
your-hugo-site/
├── content/
│   ├── blog/
│   │   └── my-post.md
│   ├── docs/
│   │   └── guide.md
│   └── _index.md
├── static/
│   └── resources/
│       └── image.png
├── .remarkrc
└── package.json
```

## Link Examples

Given the complete configuration above, these links will validate:

### Standard Content Links
```markdown
[Guide](/docs/guide)           <!-- Resolves to content/docs/guide.md -->
[Guide](/docs/guide.md)        <!-- Same as above (extension stripped) -->
[Guide](/docs/guide/)          <!-- Same as above (trailing slash removed) -->
```

### Blog Date Links
```markdown
[Post](/2022/03/my-post)       <!-- Resolves to content/blog/my-post.md -->
```

### Alias Links
```markdown
<!-- File: content/docs/installation.md -->
<!-- Front matter: aliases: ["/install"] -->

[Install](/install)            <!-- Resolves to content/docs/installation.md -->
```

### Resource Links
```markdown
[PDF](/resources/guide.pdf)    <!-- Static resource, validated as-is -->
```

### Extra Landmark Links
```markdown
[Blog](/blog)                  <!-- Extra landmark, always valid -->
```

## Migration from Hardcoded Version

If you're migrating from a version with hardcoded Hugo support:

1. **Remove hardcoded values** from plugin code
2. **Create `.remarkrc`** in your project with desired configuration
3. **Test incrementally** by enabling one feature at a time
4. **Adjust paths** to match your Hugo project structure

See [`CUSTOM_REQUIREMENTS.md`](CUSTOM_REQUIREMENTS.md) for details on the original hardcoded implementation.

## Troubleshooting

### Links Not Resolving

**Problem:** Links to content files aren't found.

**Solutions:**
- Verify `contentDirectory` matches your Hugo setup (default: `'content'`)
- Check that `root` is set correctly (should point to Hugo project root)
- Enable `stripMarkdownExtensions` if links omit `.md`

### Aliases Not Working

**Problem:** Links to aliases fail validation.

**Solutions:**
- Ensure `parseFrontmatterAliases` is `true`
- Verify aliases use JSON array format: `["alias1", "alias2"]`
- Check error messages for JSON parsing issues

### Blog Date URLs Not Resolving

**Problem:** Date-based blog URLs (e.g., `/2022/03/post`) don't validate.

**Solutions:**
- Ensure `blogConfig.enabled` and `blogConfig.dateInUrl` are `true`
- Verify pattern matches exactly: `/YYYY/MM/...` (4-digit year, 2-digit month)
- Check `blogConfig.directory` matches your blog folder name

### Auto-Generated Aliases Not Created

**Problem:** Blog titles aren't generating aliases.

**Solutions:**
- Ensure `blogConfig.autoGenerateAliases` is `true`
- Verify file is in the blog directory (`content/blog/` by default)
- Check title format: `title: "My Title"` (must be quoted)
- Look at file path - must include the blog directory path

## Performance Considerations

- **Extension stripping** adds minimal overhead (simple string operations)
- **Alias processing** only runs when YAML nodes are encountered
- **Hugo path resolution** short-circuits before expensive URL parsing
- **Resource path checking** uses fast string prefix matching

## Compatibility

- **Hugo versions:** All versions (uses standard front matter format)
- **Node.js:** Requires Node.js 16+
- **remark:** Works with remark 14+

## Advanced Usage

### Custom Content Structure

If your Hugo site uses a non-standard structure:

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

### Multiple Resource Directories

```json
{
  "hugoConfig": {
    "resourcePaths": ["/static/", "/assets/", "/resources/"]
  }
}
```

### Disable Specific Features

```json
{
  "stripMarkdownExtensions": true,
  "normalizeTrailingSlash": false,  <!-- Keep trailing slash sensitive -->
  "hugoConfig": {
    "enabled": true,
    "parseFrontmatterAliases": true,
    "blogConfig": {
      "enabled": true,
      "autoGenerateAliases": false  <!-- Disable auto-generation -->
    }
  }
}
```

## Contributing

To add new Hugo features:

1. Add configuration option to `Options` typedef in `lib/index.js`
2. Implement logic (use `lib/hugo-utils.js` for Hugo-specific code)
3. Add tests in `test/fixtures/`
4. Document in README and this file

## See Also

- [Configuration Examples](CONFIGURATION_EXAMPLE.md)

