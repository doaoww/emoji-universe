import { Link } from "@tanstack/react-router";
import type { Emoji } from "@/types/emoji";
import { useCopy } from "@/components/emoji/copy";
import { useFavorites } from "@/hooks/useFavorites";
import { titleCase } from "@/lib/emoji-utils";

export function EmojiCard({ emoji }: { emoji: Emoji; index?: number }) {
  const { copy } = useCopy();
  const { isFavorite, toggle } = useFavorites();
  const favorite = isFavorite(emoji.slug);

  return (
    <li className="group relative flex flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/25 hover:soft-shadow">
      <button
        type="button"
        aria-pressed={favorite}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        onClick={() => toggle(emoji.slug)}
        className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-border text-base transition-colors ${
          favorite ? "bg-brand text-brand-foreground" : "bg-background hover:bg-secondary"
        }`}
      >
        {favorite ? "♥" : "♡"}
      </button>

      <Link
        to="/emoji/$slug"
        params={{ slug: emoji.slug }}
        className="block flex-1 focus-visible:outline-none"
      >
        <span className="block text-center text-5xl leading-none transition-transform duration-200 group-hover:scale-110">
          {emoji.char}
        </span>
        <h3 className="mt-5 text-base font-semibold leading-snug">{titleCase(emoji.name)}</h3>
        <p className="mt-1 text-sm capitalize text-muted-foreground">{emoji.category}</p>
      </Link>

      <button
        type="button"
        onClick={() => copy(emoji.char, "Copied emoji")}
        className="mt-4 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold transition-colors hover:bg-ink hover:text-background"
      >
        Copy
      </button>
    </li>
  );
}
