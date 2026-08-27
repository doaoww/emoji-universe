import { Link } from "@tanstack/react-router";
import type { Emoji } from "@/types/emoji";
import { useCopy } from "@/components/emoji/copy";
import { useFavorites } from "@/hooks/useFavorites";
import { titleCase } from "@/lib/emoji-utils";

const TILTS = ["-2deg", "1deg", "-1deg", "2deg", "0deg", "-1.5deg"];
const PAPER = [
  "bg-card",
  "bg-sticker-yellow/35",
  "bg-card",
  "bg-sticker-pink/30",
  "bg-card",
  "bg-sticker-blue/30",
  "bg-card",
  "bg-sticker-green/30",
];

export function EmojiCard({ emoji, index }: { emoji: Emoji; index: number }) {
  const { copy } = useCopy();
  const { isFavorite, toggle } = useFavorites();
  const favorite = isFavorite(emoji.slug);
  const tilt = TILTS[index % TILTS.length];
  const paper = PAPER[index % PAPER.length];
  const tall = index % 7 === 3;

  return (
    <li
      className={`group relative rounded-xl border border-ink/15 ${paper} hard-shadow-sm p-4 transition-all duration-200 hover:-translate-y-1 hover:hard-shadow`}
      style={{ rotate: tilt }}
    >
      <Link
        to="/emoji/$slug"
        params={{ slug: emoji.slug }}
        className="block focus-visible:outline-none"
      >
        <span
          className={`block text-center ${tall ? "text-6xl" : "text-5xl"} transition-transform duration-200 group-hover:scale-125 group-hover:-rotate-6`}
        >
          {emoji.char}
        </span>
        <h3 className="mt-4 text-sm font-semibold leading-snug">{titleCase(emoji.name)}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{emoji.description}</p>
        <span className="label-mono mt-3 inline-block rounded-full border border-ink/20 px-2 py-0.5 text-muted-foreground">
          {emoji.category}
        </span>
      </Link>

      <div className="mt-3 flex items-center gap-2 opacity-70 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={() => copy(emoji.char, "Copied emoji")}
          className="label-mono flex-1 rounded-md border border-ink/25 bg-background/60 px-2 py-1.5 transition-colors hover:bg-ink hover:text-background"
        >
          Copy
        </button>
        <button
          type="button"
          aria-pressed={favorite}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          onClick={() => toggle(emoji.slug)}
          className={`rounded-md border border-ink/25 px-2.5 py-1.5 text-sm transition-transform hover:scale-110 active:scale-90 ${
            favorite ? "bg-sticker-pink/70" : "bg-background/60"
          }`}
        >
          {favorite ? "♥" : "♡"}
        </button>
      </div>
    </li>
  );
}
