import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { emojisQueryOptions } from "@/lib/emoji-queries";
import { EmojiCard } from "@/components/emoji/EmojiCard";
import { categoryEmoji } from "@/lib/emoji-utils";

export const Route = createFileRoute("/explore")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(emojisQueryOptions());
  },
  head: () => ({
    meta: [
      { title: "Emoji Explorer — search 1,700+ emojis | Emoji Hub" },
      {
        name: "description",
        content:
          "Search emojis by name, filter by category and sort them your way. Copy any emoji in one tap.",
      },
      { property: "og:title", content: "Emoji Explorer — Emoji Hub" },
      {
        property: "og:description",
        content: "Find the tiny character that says it better than words.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExplorePage,
});

type Sort = "az" | "za" | "category";

function ExplorePage() {
  const { data } = useSuspenseQuery(emojisQueryOptions());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("az");
  const [limit, setLimit] = useState(60);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    const list = data.emojis.filter(
      (e) => (!q || e.name.toLowerCase().includes(q)) && (!category || e.category === category),
    );
    return [...list].sort((a, b) => {
      if (sort === "za") return b.name.localeCompare(a.name);
      if (sort === "category")
        return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });
  }, [data.emojis, query, category, sort]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="label-mono text-muted-foreground">Emoji_hub / explorer</p>
      <h1 className="mt-3 text-4xl font-black uppercase leading-none sm:text-6xl">
        Emoji Explorer
      </h1>
      <p className="mt-4 max-w-lg text-muted-foreground">
        Find the tiny character that says it better than words.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search an emoji</span>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
            🔍
          </span>
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setLimit(60);
            }}
            placeholder="Search an emoji..."
            className="w-full rounded-full border border-ink bg-card py-3 pl-12 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:hard-shadow-sm"
          />
        </label>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as Sort)}
          className="label-mono rounded-full border border-ink bg-card px-4 py-3"
          aria-label="Sort emojis"
        >
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
          <option value="category">Category</option>
        </select>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={`label-mono rounded-full border border-ink px-3 py-2 transition-transform hover:-rotate-2 ${
            category === null ? "bg-ink text-background" : "bg-card"
          }`}
        >
          ✦ All
        </button>
        {data.categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setCategory(item === category ? null : item);
              setLimit(60);
            }}
            className={`label-mono rounded-full border border-ink px-3 py-2 transition-transform hover:-rotate-2 ${
              category === item ? "bg-ink text-background" : "bg-card"
            }`}
          >
            {categoryEmoji(item)} {item}
          </button>
        ))}
      </div>

      <p className="label-mono mt-6 text-muted-foreground">
        {results.length.toLocaleString()} emojis found
      </p>

      {results.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-6xl">🔍 👀 😶‍🌫️</p>
          <p className="mt-4 text-muted-foreground">
            Nothing matched that. Try a simpler word, like &ldquo;cat&rdquo;.
          </p>
        </div>
      ) : (
        <>
          <ul className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {results.slice(0, limit).map((emoji, index) => (
              <EmojiCard key={emoji.slug} emoji={emoji} index={index} />
            ))}
          </ul>
          {limit < results.length && (
            <div className="mt-12 text-center">
              <button
                type="button"
                onClick={() => setLimit((value) => value + 60)}
                className="label-mono rounded-full border border-ink bg-card px-6 py-3 hard-shadow-sm transition-transform hover:scale-105"
              >
                Load more ✨
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
