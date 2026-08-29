import type { Emoji } from "@/types/emoji";

/** Locale-independent thousands formatting (keeps SSR and client output identical). */
export function formatCount(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const CATEGORY_CARDS = [
  { label: "Smileys & People", emoji: "😀", category: "smileys and people" },
  { label: "Animals & Nature", emoji: "🐶", category: "animals and nature" },
  { label: "Food & Drink", emoji: "🍕", category: "food and drink" },
  { label: "Travel & Places", emoji: "✈️", category: "travel and places" },
  { label: "Activities", emoji: "⚽", category: "activities" },
  { label: "Objects", emoji: "💡", category: "objects" },
  { label: "Symbols", emoji: "✨", category: "symbols" },
  { label: "Flags", emoji: "🚩", category: "flags" },
];

export const POPULAR = [
  { char: "😂", label: "Laughing" },
  { char: "❤️", label: "Love" },
  { char: "🔥", label: "Fire" },
  { char: "😭", label: "Crying" },
  { char: "💀", label: "Dead" },
  { char: "👀", label: "Eyes" },
  { char: "🚀", label: "Rocket" },
  { char: "🎉", label: "Party" },
];

export const POPULAR_SEARCHES = ["love", "fire", "cat", "food"];

/** Match by first code point so variation selectors don't break lookups. */
export function findByChar(emojis: Emoji[], char: string): Emoji | undefined {
  const base = char.codePointAt(0);
  return emojis.find((e) => e.char.codePointAt(0) === base);
}

export function countByCategory(emojis: Emoji[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const emoji of emojis) {
    const key = emoji.category.toLowerCase();
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}
