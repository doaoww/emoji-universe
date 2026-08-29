import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { emojisQueryOptions } from "@/lib/emoji-queries";
import { EmojiCard } from "@/components/emoji/EmojiCard";
import { categoryEmoji } from "@/lib/emoji-utils";
import { formatCount } from "@/lib/home-data";

type ExploreSearch = { q?: string; category?: string };

export const Route = createFileRoute("/explore")({
  validateSearch: (search: Record<string, unknown>): ExploreSearch => ({
    q: typeof search["q"] === "string" && search["q"] ? search["q"] : undefined,
    category:
      typeof search["category"] === "string" && search["category"]
        ? search["category"]
        : undefined,
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(emojisQueryOptions());
  },
  head: () => ({
    meta: [
      { title: "Emoji catalog — search 1,700+ emojis | Emoji Hub" },
      {
        name: "description",
        content:
          "Search emojis by name, filter by category and sort them your way. Copy any emoji in one click.",
      },
      { property: "og:title", content: "Emoji catalog — Emoji Hub" },
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
  const { q, category } = Route.useSearch();
  const navigate = useNavigate({ from: "/explore" });
  const [sort, setSort] = useState<Sort>("az");
  const [limit, setLimit] = useState(60);

  const query = q ?? "";

  function setSearch(next: ExploreSearch) {
    setLimit(60);
    navigate({ search: (prev: ExploreSearch) => ({ ...prev, ...next }) });
  }

  const results = useMemo(() => {
    const needle = query.toLowerCase().trim();
    const list = data.emojis.filter(
      (e) =>
        (!needle || e.name.toLowerCase().includes(needle)) &&
        (!category || e.category.toLowerCase() === category.toLowerCase()),
    );
    return [...list].sort((a, b) => {
      if (sort === "za") return b.name.localeCompare(a.name);
      if (sort === "category")
        return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });
  }, [data.emojis, query, category, sort]);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-5 py-14 sm:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Emoji catalog</h1>
      <p className="mt-4 max-w-lg text-lg text-muted-foreground">
        Find the tiny character that says it better than words.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search emojis</span>
          <span
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg"
          >
            🔍
          </span>
          <input
            value={query}
            onChange={(event) => setSearch({ q: event.target.value || undefined })}
            placeholder="Search emojis…"
            className="w-full rounded-[18px] border border-border bg-card py-4 pl-12 pr-4 text-base outline-none placeholder:text-muted-foreground focus:border-ink/30"
          />
        </label>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as Sort)}
          className="rounded-[18px] border border-border bg-card px-4 py-4 text-base font-medium"
          aria-label="Sort emojis"
        >
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
          <option value="category">By category</option>
        </select>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSearch({ category: undefined })}
          className={`rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors ${
            !category ? "bg-ink text-background" : "bg-card hover:bg-secondary"
          }`}
        >
          All
        </button>
        {data.categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setSearch({ category: item === category ? undefined : item })}
            className={`rounded-full border border-border px-4 py-2 text-sm font-semibold capitalize transition-colors ${
              category === item ? "bg-ink text-background" : "bg-card hover:bg-secondary"
            }`}
          >
            {categoryEmoji(item)} {item}
          </button>
        ))}
      </div>

      <p className="mt-6 text-base text-muted-foreground">
        {formatCount(results.length)} emojis found
      </p>

      {results.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-6xl">🔍</p>
          <p className="mt-4 text-lg text-muted-foreground">
            Nothing matched that. Try a simpler word, like &ldquo;cat&rdquo;.
          </p>
        </div>
      ) : (
        <>
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {results.slice(0, limit).map((emoji) => (
              <EmojiCard key={emoji.slug} emoji={emoji} />
            ))}
          </ul>
          {limit < results.length && (
            <div className="mt-12 text-center">
              <button
                type="button"
                onClick={() => setLimit((value) => value + 60)}
                className="rounded-2xl border border-border bg-card px-6 py-3.5 text-base font-semibold transition-colors hover:bg-secondary"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
