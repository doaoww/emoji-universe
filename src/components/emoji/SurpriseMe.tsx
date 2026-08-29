import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { getRandomEmoji } from "@/lib/emoji.functions";
import { titleCase } from "@/lib/emoji-utils";
import type { Emoji } from "@/types/emoji";

export function SurpriseMe({
  className = "",
  label = "🎲 Random",
}: {
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [emoji, setEmoji] = useState<Emoji | null>(null);

  async function roll() {
    setOpen(true);
    setRolling(true);
    const result = await getRandomEmoji();
    setTimeout(() => {
      setEmoji(result);
      setRolling(false);
    }, 500);
  }

  return (
    <>
      <button
        type="button"
        onClick={roll}
        className={`inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 text-base font-semibold transition-colors hover:bg-secondary ${className}`}
      >
        {label}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Random emoji"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 text-center soft-shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="label-mono text-muted-foreground">Random pick</p>
            <div className="my-6 text-8xl leading-none">
              {rolling || !emoji ? "🎲" : emoji.char}
            </div>
            {emoji && !rolling ? (
              <>
                <h2 className="text-2xl font-bold">{titleCase(emoji.name)}</h2>
                <p className="mt-2 text-base text-muted-foreground">{emoji.description}</p>
                <div className="mt-6 flex flex-col gap-2">
                  <Link
                    to="/emoji/$slug"
                    params={{ slug: emoji.slug }}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl bg-ink px-5 py-3 text-base font-semibold text-background transition-opacity hover:opacity-90"
                  >
                    Open details →
                  </Link>
                  <button
                    type="button"
                    onClick={roll}
                    className="rounded-2xl border border-border px-5 py-3 text-base font-semibold transition-colors hover:bg-secondary"
                  >
                    Roll again
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="py-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <p className="text-base text-muted-foreground">Shaking the emoji jar…</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
