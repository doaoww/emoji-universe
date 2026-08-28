import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { emojisQueryOptions } from "@/lib/emoji-queries";
import { SurpriseMe } from "@/components/emoji/SurpriseMe";

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(emojisQueryOptions());
  },
  head: () => ({
    meta: [
      { title: "Emoji Hub — emojis have vibes" },
      {
        name: "description",
        content:
          "Explore emojis, discover their meanings, and find the perfect one for every moment.",
      },
      { property: "og:title", content: "Emoji Hub — emojis have vibes" },
      {
        property: "og:description",
        content: "A place for every mood. Browse, search, copy and save emojis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const HERO_EMOJIS = ["😂", "🪩", "🥹", "🔥", "👀", "🦋", "💀", "✨"];

const CATEGORY_CARDS = [
  { label: "Smileys", emoji: "😀", category: "smileys and people", tilt: "-3deg" },
  { label: "Animals", emoji: "🐶", category: "animals and nature", tilt: "2deg" },
  { label: "Food", emoji: "🍕", category: "food and drink", tilt: "-1deg" },
  { label: "Travel", emoji: "🚀", category: "travel and places", tilt: "3deg" },
  { label: "Activities", emoji: "⚽", category: "activities", tilt: "-2deg" },
  { label: "Objects", emoji: "💡", category: "objects", tilt: "1deg" },
  { label: "Symbols", emoji: "✨", category: "symbols", tilt: "-2.5deg" },
  { label: "Flags", emoji: "🏁", category: "flags", tilt: "2deg" },
];

function HeroEmoji() {
  const [index, setIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [pop, setPop] = useState(false);

  useEffect(() => {
    if (!pop) return;
    const id = setTimeout(() => setPop(false), 400);
    return () => clearTimeout(id);
  }, [pop]);

  return (
    <button
      type="button"
      aria-label="Change the hero emoji"
      onClick={() => {
        setIndex((value) => (value + 1) % HERO_EMOJIS.length);
        setPop(true);
      }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setTilt({
          x: (event.clientX - rect.left) / rect.width - 0.5,
          y: (event.clientY - rect.top) / rect.height - 0.5,
        });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative mx-auto block cursor-pointer select-none"
    >
      <span
        className={`animate-drift block text-[9rem] leading-none sm:text-[13rem] ${pop ? "animate-wobble" : ""}`}
        style={{
          rotate: `${tilt.x * 14}deg`,
          translate: `${tilt.x * 18}px ${tilt.y * 18}px`,
          transition: "rotate 300ms ease-out, translate 300ms ease-out",
        }}
      >
        {HERO_EMOJIS[index]}
      </span>
      <span className="label-mono mt-2 block text-muted-foreground">tap me — I change</span>
    </button>
  );
}

function Home() {
  const { data } = useSuspenseQuery(emojisQueryOptions());

  return (
    <div className="mx-auto max-w-6xl px-5">
      <section className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="label-mono rounded-full border border-ink/25 px-3 py-1 inline-block text-muted-foreground">
            A place for every mood
          </p>
          <h1 className="mt-6 text-5xl font-black uppercase leading-[0.92] sm:text-7xl">
            Emojis
            <br />
            have
            <br />
            vibes.
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            Explore emojis, discover their meanings, and find the perfect one for every moment.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/explore"
              className="label-mono rounded-full bg-ink px-6 py-3 text-background transition-transform hover:-rotate-2 hover:scale-105"
            >
              Explore emojis →
            </Link>
            <SurpriseMe />
          </div>
          <p className="label-mono mt-8 text-muted-foreground">
            {data.total.toLocaleString()} emotions indexed
          </p>
        </div>
        <HeroEmoji />
      </section>

      <section className="py-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-black uppercase sm:text-5xl">Find your vibe</h2>
          <p className="label-mono hidden text-muted-foreground sm:block">
            {data.categories.length} categories
          </p>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {CATEGORY_CARDS.map((card) => (
            <li key={card.category}>
              <Link
                to="/explore"
                className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-ink bg-card px-4 py-7 text-center hard-shadow-sm transition-all duration-200 hover:-translate-y-1 hover:hard-shadow hover:bg-sticker-yellow/40"
                style={{ rotate: card.tilt }}
              >
                <span className="text-5xl transition-transform duration-200 group-hover:scale-125 group-hover:rotate-12">
                  {card.emoji}
                </span>
                <span className="label-mono">{card.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="my-12 grid gap-6 rounded-3xl border border-ink bg-card p-8 hard-shadow sm:p-12 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 className="text-3xl font-black uppercase">Can&apos;t decide?</h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            Roll the dice and let the emoji jar pick your mood for you. It even explains itself.
          </p>
          <div className="mt-6">
            <SurpriseMe className="bg-sticker-pink/60" />
          </div>
        </div>
        <p className="text-center text-6xl sm:text-8xl">
          🎲 <span className="animate-wobble inline-block">👀</span>
        </p>
      </section>

      <section className="mb-20 grid gap-5 sm:grid-cols-3">
        {[
          { emoji: "🔍", title: "Search anything", text: "Type a word, get the emoji that fits." },
          { emoji: "💛", title: "Save your picks", text: "Favorites stay in your browser, no login." },
          { emoji: "✨", title: "Read the vibe", text: "A machine writes a tiny mood note per emoji." },
        ].map((item) => (
          <article key={item.title} className="rounded-2xl border border-ink/20 bg-card p-6">
            <p className="text-4xl">{item.emoji}</p>
            <h3 className="mt-4 font-bold uppercase">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
