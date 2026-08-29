import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { emojisQueryOptions } from "@/lib/emoji-queries";
import {
  CATEGORY_CARDS,
  POPULAR,
  POPULAR_SEARCHES,
  countByCategory,
  findByChar,
  formatCount,
} from "@/lib/home-data";

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(emojisQueryOptions());
  },
  head: () => ({
    meta: [
      { title: "Emoji Hub — find the right emoji in seconds" },
      {
        name: "description",
        content:
          "Search a catalog of 1,700+ emojis by name, browse categories, copy any emoji in one click and save your favorites.",
      },
      { property: "og:title", content: "Emoji Hub — find the right emoji in seconds" },
      {
        property: "og:description",
        content: "A clean emoji catalog: search, categories, one-click copy and favorites.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { data } = useSuspenseQuery(emojisQueryOptions());
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const counts = countByCategory(data.emojis);

  function search(value: string) {
    navigate({ to: "/explore", search: value.trim() ? { q: value.trim() } : {} });
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8">
      {/* Hero */}
      <section className="grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium">
            🎉 Welcome to Emoji Hub
          </p>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Find your
            <br />
            mood emoji
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
            A big collection of emojis for every occasion. Search, copy and share the feeling.
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              search(query);
            }}
            className="mt-8 flex w-full items-center gap-2 rounded-[20px] border border-border bg-card p-2 soft-shadow focus-within:border-ink/30"
          >
            <span aria-hidden className="pl-3 text-xl text-muted-foreground">
              🔍
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search emojis…"
              aria-label="Search emojis"
              className="min-w-0 flex-1 bg-transparent px-2 py-3 text-base outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="shrink-0 rounded-2xl bg-brand px-6 py-3 text-base font-semibold text-brand-foreground transition-opacity hover:opacity-90"
            >
              Search
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Popular:</span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => search(term)}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium capitalize transition-colors hover:bg-secondary"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Simple decorative emoji composition */}
        <div className="relative mx-auto hidden aspect-square w-full max-w-md place-items-center lg:grid">
          <div className="absolute inset-6 rounded-[42%] bg-brand/25" />
          <span className="relative text-[11rem] leading-none">😄</span>
          <span className="absolute left-2 top-10 grid h-16 w-16 place-items-center rounded-2xl border border-border bg-card text-3xl soft-shadow">
            😍
          </span>
          <span className="absolute right-2 top-24 grid h-16 w-16 place-items-center rounded-2xl border border-border bg-card text-3xl soft-shadow">
            🔥
          </span>
          <span className="absolute bottom-12 left-8 grid h-16 w-16 place-items-center rounded-2xl border border-border bg-card text-3xl soft-shadow">
            😂
          </span>
          <span className="absolute bottom-4 right-12 grid h-16 w-16 place-items-center rounded-2xl border border-border bg-card text-3xl soft-shadow">
            ❤️
          </span>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Categories</h2>
          <Link
            to="/explore"
            className="text-base font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            See all →
          </Link>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_CARDS.map((card) => (
            <li key={card.category}>
              <Link
                to="/explore"
                search={{ category: card.category }}
                className="flex h-full items-center gap-4 rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/25 hover:soft-shadow"
              >
                <span className="shrink-0 text-4xl leading-none">{card.emoji}</span>
                <span className="min-w-0">
                  <span className="block truncate text-base font-bold">{card.label}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {formatCount(counts[card.category] ?? 0)} emojis
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Popular */}
      <section className="py-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Popular</h2>
          <p className="text-base text-muted-foreground">
            {formatCount(data.total)} emojis indexed
          </p>
        </div>

        <ul className="-mx-5 mt-8 flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 lg:grid-cols-8">
          {POPULAR.map((item) => {
            const match = findByChar(data.emojis, item.char);
            const content = (
              <>
                <span className="text-4xl leading-none">{item.char}</span>
                <span className="mt-3 text-sm font-semibold">{item.label}</span>
              </>
            );
            return (
              <li key={item.char} className="w-28 shrink-0 snap-start sm:w-auto">
                {match ? (
                  <Link
                    to="/emoji/$slug"
                    params={{ slug: match.slug }}
                    className="flex h-full flex-col items-center rounded-2xl border border-border bg-card px-3 py-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/25 hover:soft-shadow"
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="flex h-full flex-col items-center rounded-2xl border border-border bg-card px-3 py-6 text-center">
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
