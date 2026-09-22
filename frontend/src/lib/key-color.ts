export function keyColor(key: string): string {
  let hash = 0
  for (const char of key) {
    hash = (hash * 31 + char.charCodeAt(0)) % 360
  }
  return `hsl(${hash} 55% 52%)`
}
