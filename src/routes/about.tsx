import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Emoji Hub — how this emoji catalog works" },
      {
        name: "description",
        content:
          "Emoji Hub is an open emoji catalog: search by name, browse categories, copy any emoji and save favorites in your browser.",
      },
      { property: "og:title", content: "About Emoji Hub" },
      {
        property: "og:description",
        content: "How Emoji Hub works: our own backend, the EmojiHub data source and local favorites.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const FACTS = [
  {
    emoji: "🔍",
    title: "Search that works",
    text: "Type a word and find the emoji by name, or narrow things down by category.",
  },
  {
    emoji: "🗂️",
    title: "Our own backend",
    text: "The browser talks to our API, which fetches and caches data from the EmojiHub project.",
  },
  {
    emoji: "💛",
    title: "Favorites, no account",
    text: "Saved emojis live in your browser's local storage. Nothing is sent anywhere.",
  },
  {
    emoji: "✨",
    title: "Today's vibe",
    text: "Each emoji page gets a short, machine-written mood note generated on the server.",
  },
];

function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8">
      <div className="max-w-2xl">
        <p className="label-mono text-muted-foreground">About</p>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          A calm, fast catalog for every emoji
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Emoji Hub collects every emoji in one place so you can find the right one in seconds —
          search it, read what it means, copy it and keep the ones you love.
        </p>
      </div>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {FACTS.map((fact) => (
          <li key={fact.title} className="rounded-2xl border border-border bg-card p-6">
            <span className="text-3xl">{fact.emoji}</span>
            <h2 className="mt-4 text-lg font-bold">{fact.title}</h2>
            <p className="mt-2 text-base text-muted-foreground">{fact.text}</p>
          </li>
        ))}
      </ul>

      <Link
        to="/explore"
        className="mt-10 inline-flex rounded-2xl bg-ink px-6 py-3.5 text-base font-semibold text-background transition-opacity hover:opacity-90"
      >
        Browse the catalog →
      </Link>
    </div>
  );
}
