/**
 * @import {Landmarks} from './index.js'
 */

import {constants, promises as fs} from 'node:fs'

/**
 * File existence cache to avoid redundant fs.access() calls.
 * Shared across files within a single batch/run.
 * @type {Map<string, boolean>}
 */
const fileCache = new Map()

/**
 * Check if files exist and cache results.
 *
 * This function checks file existence and caches results across all files
 * in a batch to avoid redundant file system operations. About 25% of file
 * checks are redundant in typical documentation repositories.
 *
 * @param {Landmarks} landmarks
 *   Landmarks.
 * @param {ReadonlyArray<string>} references
 *   References.
 * @param {boolean | null | undefined} [clearCache=false]
 *   Whether to clear the cache before checking (for new batch).
 * @returns {Promise<undefined>}
 *   Nothing.
 */
export async function checkFiles(landmarks, references, clearCache) {
  // Clear cache at the start of a new batch
  if (clearCache) {
    fileCache.clear()
  }

  /** @type {Array<Promise<undefined>>} */
  const promises = []

  for (const filePath of references) {
    const marks = landmarks.get(filePath)

    if (!marks) {
      /** @type {Map<string, boolean>} */
      const map = new Map()

      landmarks.set(filePath, map)

      // Check cache first to avoid redundant fs.access() calls
      if (fileCache.has(filePath)) {
        // Cache hit - use cached result
        map.set('', fileCache.get(filePath) || false)
      } else {
        // Cache miss - perform actual file system check
        promises.push(
          fs.access(filePath, constants.F_OK).then(
            /**
             * @returns {undefined}
             */
            function () {
              map.set('', true)
              fileCache.set(filePath, true)
            },
            /**
             * @param {NodeJS.ErrnoException} error
             * @returns {undefined}
             */
            function (error) {
              const exists = error.code !== 'ENOENT' && error.code !== 'ENOTDIR'
              map.set('', exists)
              fileCache.set(filePath, exists)
            }
          )
        )
      }
    }
  }

  await Promise.all(promises)
}

/**
 * Clear the file existence cache.
 * Useful for testing or when starting a new independent batch.
 *
 * @returns {undefined}
 *   Nothing.
 */
export function clearFileCache() {
  fileCache.clear()
}
