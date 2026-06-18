/**
 * Removes leading and trailing slashes from a URL path segment.
 * @param path the raw path string
 * @returns the path with no leading or trailing `/` characters
 */
export function trimSlashes(path: string): string {
  return path.replace(/^\/+|\/+$/g, "");
}
