import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { emojiQueryOptions } from "@/lib/emoji-queries";
import { getEmojiVibe } from "@/lib/emoji.functions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { titleCase } from "@/lib/emoji-utils";
import { useCopy } from "@/components/emoji/copy";
import { useFavorites } from "@/hooks/useFavorites";

export const Route = createFileRoute("/emoji/$slug")({
  loader: async ({ context, params }) => {
    const emoji = await context.queryClient.ensureQueryData(emojiQueryOptions(params.slug));
    if (!emoji) throw notFound();
    return { name: emoji.name, char: emoji.char };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Emoji not found — Emoji Hub" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.char} ${titleCase(loaderData.name)} — Emoji Hub`;
    const description = `Meaning, unicode, HTML code and today's vibe for the ${loaderData.name} emoji.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: EmojiDetail,
});

function EmojiDetail() {
  const { slug } = Route.useParams();
  const { data: emoji } = useSuspenseQuery(emojiQueryOptions(slug));
  const { copy } = useCopy();
  const { isFavorite, toggle } = useFavorites();
  const [vibe, setVibe] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setVibe(null);
    getEmojiVibe({ data: { slug } }).then((res) => {
      if (active) setVibe(res.vibe);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (!emoji) return null;
  const favorite = isFavorite(emoji.slug);

  return (
    <article className="mx-auto max-w-4xl px-5 py-14">
      <Link to="/explore" className="label-mono text-muted-foreground hover:text-foreground">
        ← Back to explorer
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-[auto_1fr] md:items-start">
        <div className="rounded-3xl border border-ink bg-card px-10 py-12 text-center hard-shadow">
          <span className="animate-drift block text-[7rem] leading-none">{emoji.char}</span>
        </div>

        <div>
          <h1 className="text-3xl font-black uppercase leading-tight sm:text-4xl">
            {emoji.name}
          </h1>
          <p className="label-mono mt-3 inline-block rounded-full border border-ink/25 px-3 py-1 text-muted-foreground">
            {emoji.category} · {emoji.group}
          </p>
          <p className="mt-5 max-w-prose text-base text-muted-foreground">{emoji.description}</p>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-ink/20 bg-card p-3">
              <dt className="label-mono text-muted-foreground">Unicode</dt>
              <dd className="mt-1 font-mono text-sm">{emoji.unicode}</dd>
            </div>
            <div className="rounded-lg border border-ink/20 bg-card p-3">
              <dt className="label-mono text-muted-foreground">HTML</dt>
              <dd className="mt-1 font-mono text-sm">{emoji.htmlCode}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => copy(emoji.char, "Copied emoji")}
              className="label-mono rounded-full bg-ink px-5 py-3 text-background transition-transform hover:scale-105"
            >
              Copy emoji
            </button>
            <button
              type="button"
              onClick={() => copy(emoji.unicode, "Copied unicode")}
              className="label-mono rounded-full border border-ink px-5 py-3 transition-transform hover:scale-105"
            >
              Copy unicode
            </button>
            <button
              type="button"
              onClick={() => copy(emoji.htmlCode, "Copied HTML")}
              className="label-mono rounded-full border border-ink px-5 py-3 transition-transform hover:scale-105"
            >
              Copy HTML
            </button>
            <button
              type="button"
              aria-pressed={favorite}
              onClick={() => toggle(emoji.slug)}
              className={`label-mono rounded-full border border-ink px-5 py-3 transition-transform hover:scale-105 active:scale-90 ${
                favorite ? "bg-sticker-pink/70" : ""
              }`}
            >
              {favorite ? "♥ Favorited" : "♡ Favorite"}
            </button>
          </div>
        </div>
      </div>

      <section className="mt-12 rounded-2xl border border-ink bg-sticker-yellow/40 p-8 hard-shadow">
        <h2 className="text-xl font-black uppercase">Today&apos;s vibe ✨</h2>
        {vibe ? (
          <p className="mt-4 whitespace-pre-line text-lg leading-relaxed">{vibe}</p>
        ) : (
          <p className="mt-4 animate-pulse text-lg text-muted-foreground">reading the room…</p>
        )}
        <p className="label-mono mt-6 text-muted-foreground">interpreted by the machine</p>
      </section>
    </article>
  );
}
