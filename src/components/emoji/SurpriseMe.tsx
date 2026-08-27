import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { getRandomEmoji } from "@/lib/emoji.functions";
import { titleCase } from "@/lib/emoji-utils";
import type { Emoji } from "@/types/emoji";

export function SurpriseMe({ className = "" }: { className?: string }) {
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
    }, 650);
  }

  return (
    <>
      <button
        type="button"
        onClick={roll}
        className={`label-mono rounded-full border border-ink px-6 py-3 transition-transform hover:-rotate-2 hover:scale-105 active:scale-95 ${className}`}
      >
        🎲 Surprise me
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Random emoji"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        >
          <div
            className="animate-scale-in w-full max-w-sm rounded-2xl border border-ink bg-card p-8 text-center hard-shadow"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="label-mono text-muted-foreground">Random draw / 001</p>
            <div className={`my-6 text-8xl ${rolling ? "animate-wobble" : "animate-drift"}`}>
              {rolling || !emoji ? "🎲" : emoji.char}
            </div>
            {emoji && !rolling ? (
              <>
                <h2 className="text-xl font-bold">{titleCase(emoji.name)}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{emoji.description}</p>
                <div className="mt-6 flex flex-col gap-2">
                  <Link
                    to="/emoji/$slug"
                    params={{ slug: emoji.slug }}
                    onClick={() => setOpen(false)}
                    className="label-mono rounded-full bg-ink px-5 py-3 text-background transition-transform hover:scale-105"
                  >
                    Open details →
                  </Link>
                  <button
                    type="button"
                    onClick={roll}
                    className="label-mono rounded-full border border-ink px-5 py-3 transition-transform hover:scale-105"
                  >
                    🎲 Roll again
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="label-mono py-1 text-muted-foreground hover:text-foreground"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <p className="label-mono text-muted-foreground">Shaking the emoji jar…</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
