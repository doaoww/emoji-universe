import type { Emoji, RawEmoji } from "@/types/emoji";
import { describeEmoji, slugify, unicodeToChar } from "@/lib/emoji-utils";

const EMOJIHUB_URL = "https://emojihub.yurace.pro/api/all";

let cache: { data: Emoji[]; at: number } | null = null;
const TTL = 1000 * 60 * 60; // 1 hour

function normalize(raw: RawEmoji[]): Emoji[] {
  const seen = new Map<string, number>();
  return raw.map((item) => {
    const base = slugify(item.name) || "emoji";
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    return {
      slug: count === 1 ? base : `${base}-${count}`,
      name: item.name,
      char: unicodeToChar(item.unicode ?? []),
      category: item.category,
      group: item.group,
      description: describeEmoji(item.name, item.category, item.group),
      unicode: (item.unicode ?? []).join(" "),
      htmlCode: (item.htmlCode ?? []).join(""),
    };
  });
}

/** Server-only fetch of the external EmojiHub API, with an in-memory cache. */
export async function loadEmojis(): Promise<Emoji[]> {
  if (cache && Date.now() - cache.at < TTL) return cache.data;

  const res = await fetch(EMOJIHUB_URL, { headers: { accept: "application/json" } });
  if (!res.ok) {
    if (cache) return cache.data;
    throw new Error(`EmojiHub responded with ${res.status}`);
  }
  const raw = (await res.json()) as RawEmoji[];
  const data = normalize(raw).filter((e) => e.char.length > 0);
  cache = { data, at: Date.now() };
  return data;
}

export async function findEmoji(slug: string): Promise<Emoji | null> {
  const all = await loadEmojis();
  return all.find((e) => e.slug === slug) ?? null;
}

const VIBE_FALLBACKS = [
  "unbothered energy. says the thing everyone was already thinking.",
  "soft chaos. the kind of mood that shows up uninvited and stays.",
  "quietly iconic. small character, very large presence.",
];

/** Server-only LLM call for the "Today's Vibe" section. */
export async function generateVibe(emoji: Emoji): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) return VIBE_FALLBACKS[emoji.name.length % VIBE_FALLBACKS.length]!;

  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "google/gemini-3.7-flash",
        messages: [
          {
            role: "system",
            content:
              "You write tiny internet-poetry mood readings for emojis. Reply with 1-2 short lowercase lines, max 20 words total. No quotes, no emojis, no explanation.",
          },
          {
            role: "user",
            content: `Emoji: ${emoji.char} (${emoji.name}), category ${emoji.category}. Describe its vibe.`,
          },
        ],
      }),
    });
    if (!res.ok) throw new Error(String(res.status));
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = json.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("empty");
    return text;
  } catch {
    return VIBE_FALLBACKS[emoji.name.length % VIBE_FALLBACKS.length]!;
  }
}
