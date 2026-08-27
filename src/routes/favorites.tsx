import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { emojisQueryOptions } from "@/lib/emoji-queries";
import { EmojiCard } from "@/components/emoji/EmojiCard";
import { useFavorites } from "@/hooks/useFavorites";

export const Route = createFileRoute("/favorites")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(emojisQueryOptions());
  },
  head: () => ({
    meta: [
      { title: "My Favorites — Emoji Hub" },
      {
        name: "description",
        content: "Your personal shelf of saved emojis, kept right in your browser.",
      },
      { property: "og:title", content: "My Favorites — Emoji Hub" },
      { property: "og:description", content: "The emojis that feel like you, saved in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { data } = useSuspenseQuery(emojisQueryOptions());
  const { favorites, ready } = useFavorites();
  const saved = data.emojis.filter((e) => favorites.includes(e.slug));

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="label-mono text-muted-foreground">Emoji_hub / saved</p>
      <h1 className="mt-3 text-4xl font-black uppercase leading-none sm:text-6xl">
        ♡ My Favorites
      </h1>

      {!ready ? null : saved.length === 0 ? (
        <div className="mt-20 text-center">
          <p className="animate-drift text-7xl">💛</p>
          <p className="mt-6 text-xl font-semibold">No favorites yet 💛</p>
          <p className="mt-2 text-muted-foreground">
            Find an emoji that feels like you and save it here.
          </p>
          <Link
            to="/explore"
            className="label-mono mt-8 inline-block rounded-full bg-ink px-6 py-3 text-background transition-transform hover:scale-105"
          >
            Explore emojis →
          </Link>
        </div>
      ) : (
        <>
          <p className="label-mono mt-6 text-muted-foreground">
            {saved.length} saved {saved.length === 1 ? "emoji" : "emojis"}
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {saved.map((emoji, index) => (
              <EmojiCard key={emoji.slug} emoji={emoji} index={index} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
