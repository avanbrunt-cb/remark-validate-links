/**
 * @import {BlogConfig, HugoConfig} from './index.js'
 */

/**
 * Parse Hugo aliases from front matter.
 *
 * @param {string} content
 *   YAML front matter content.
 * @returns {Array<string> | undefined}
 *   Parsed aliases or undefined if not found.
 */
export function parseAliases(content) {
  if (!content.includes('aliases:')) {
    return undefined
  }

  const start = content.indexOf('[', content.indexOf('aliases:'))
  const end = content.indexOf(']', start)

  if (start === -1 || end === -1) {
    return undefined
  }

  try {
    return JSON.parse(content.substring(start, end + 1))
  } catch {
    throw new Error(
      'Invalid aliases format: expected JSON array like ["alias1", "alias2"]. ' +
        'Got: ' +
        content.substring(start, end + 1)
    )
  }
}

/**
 * Extract title from Hugo front matter.
 *
 * @param {string} content
 *   YAML front matter content.
 * @returns {string | undefined}
 *   Title or undefined if not found.
 */
export function extractTitle(content) {
  if (!content.includes('title:')) {
    return undefined
  }

  const titleLine = content.substring(
    content.indexOf('title:'),
    content.indexOf('\n', content.indexOf('title:'))
  )

  const match = titleLine.match(/title:\s*["']([^"']+)["']/)
  return match ? match[1] : undefined
}

/**
 * Check if path matches blog date pattern (/YYYY/MM/).
 *
 * @param {string} value
 *   URL path.
 * @returns {boolean}
 *   Whether the path matches the blog date pattern.
 */
export function isBlogDatePath(value) {
  if (value.length < 9 || value.charAt(0) !== '/') {
    return false
  }

  const year = value.substring(1, 5)
  const slash1 = value.charAt(5)
  const month = value.substring(6, 8)
  const slash2 = value.charAt(8)

  return (
    slash1 === '/' &&
    slash2 === '/' &&
    !isNaN(Number(year)) &&
    !isNaN(Number(month))
  )
}

/**
 * Compress multiple consecutive dashes.
 *
 * @param {string} slug
 *   Slug to compress.
 * @returns {string}
 *   Compressed slug.
 */
export function compressDashes(slug) {
  return slug.replace(/-+/g, '-')
}

/**
 * Resolve Hugo content path.
 *
 * @param {string} value
 *   URL path.
 * @param {string} contentDir
 *   Content directory.
 * @param {string} blogDir
 *   Blog directory.
 * @returns {string}
 *   Resolved path.
 */
export function resolveHugoPath(value, contentDir, blogDir) {
  // Blog date pattern: /YYYY/MM/post-name -> content/blog/post-name
  if (isBlogDatePath(value)) {
    return contentDir + '/' + blogDir + value.substring(8)
  }

  // General content: /docs/guide -> content/docs/guide
  return contentDir + value
}

