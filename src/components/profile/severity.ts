/**
 * Maps the 'low | medium | high' severity buckets used across the
 * profile cards to consistent Tailwind classes.
 */
export const severityColor = (s: string) =>
  s === "high" ? "text-red-400 bg-red-400/10 border-red-400/20" :
  s === "medium" ? "text-amber-400 bg-amber-400/10 border-amber-400/20" :
  "text-blue-400 bg-blue-400/10 border-blue-400/20";
