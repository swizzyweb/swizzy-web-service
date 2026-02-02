// AI Slop!
export function trimSlashes(path: string): string {
  return path.replace(/^\/+|\/+$/g, "");
}
