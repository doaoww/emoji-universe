import { createServerFn } from "@tanstack/react-start";
import type { Emoji, EmojiListResponse } from "@/types/emoji";

export const getEmojis = createServerFn({ method: "GET" }).handler(
  async (): Promise<EmojiListResponse> => {
    const { loadEmojis } = await import("@/lib/emojihub.server");
    const emojis = await loadEmojis();
    const categories = [...new Set(emojis.map((e) => e.category))].sort();
    return { emojis, categories, total: emojis.length };
  },
);

export const getEmoji = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<Emoji | null> => {
    const { findEmoji } = await import("@/lib/emojihub.server");
    return findEmoji(data.slug);
  });

export const getRandomEmoji = createServerFn({ method: "GET" }).handler(
  async (): Promise<Emoji> => {
    const { loadEmojis } = await import("@/lib/emojihub.server");
    const all = await loadEmojis();
    return all[Math.floor(Math.random() * all.length)]!;
  },
);

export const getEmojiVibe = createServerFn({ method: "POST" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<{ vibe: string }> => {
    const { findEmoji, generateVibe } = await import("@/lib/emojihub.server");
    const emoji = await findEmoji(data.slug);
    if (!emoji) return { vibe: "no vibe found for a stranger." };
    return { vibe: await generateVibe(emoji) };
  });
