export const CATEGORY_EMOJI: Record<string, string> = {
  "smileys and people": "😀",
  "animals and nature": "🐶",
  "food and drink": "🍕",
  "travel and places": "🚀",
  activities: "⚽",
  objects: "💡",
  symbols: "✨",
  flags: "🏳️‍🌈",
};

export function categoryEmoji(category: string): string {
  return CATEGORY_EMOJI[category.toLowerCase()] ?? "🔮";
}

export function titleCase(value: string): string {
  return value.replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Turn ["U+1F602"] into the actual emoji character. */
export function unicodeToChar(unicode: string[]): string {
  return unicode
    .map((point) => {
      const hex = point.replace(/^U\+/i, "").trim();
      const code = Number.parseInt(hex, 16);
      return Number.isNaN(code) ? "" : String.fromCodePoint(code);
    })
    .join("");
}

const CATEGORY_BLURB: Record<string, string> = {
  "smileys and people": "a face for the feelings that don't fit in words",
  "animals and nature": "a small piece of the living world",
  "food and drink": "for cravings, plans and late-night messages",
  "travel and places": "for going somewhere, or just dreaming about it",
  activities: "for play, sport and everything worth doing",
  objects: "an everyday thing, shrunk down to pocket size",
  symbols: "a tiny sign that carries a lot of meaning",
  flags: "a place, a people, a piece of identity",
};

/**
 * EmojiHub ships name/category/group but no prose. We compose a short,
 * stable, human description from those fields so every card reads well.
 */
export function describeEmoji(name: string, category: string, group: string): string {
  const base = CATEGORY_BLURB[category.toLowerCase()] ?? "a little character with its own energy";
  const groupText = group.replace(/-/g, " ");
  return `${titleCase(name)} — ${base}. Filed under ${groupText}.`;
}
