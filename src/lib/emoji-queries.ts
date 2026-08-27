import { queryOptions } from "@tanstack/react-query";
import { getEmoji, getEmojis } from "@/lib/emoji.functions";

export const emojisQueryOptions = () =>
  queryOptions({
    queryKey: ["emojis"],
    queryFn: () => getEmojis(),
    staleTime: 1000 * 60 * 30,
  });

export const emojiQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["emoji", slug],
    queryFn: () => getEmoji({ data: { slug } }),
    staleTime: 1000 * 60 * 30,
  });
