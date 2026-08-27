# Emoji Hub — build plan

A playful emoji discovery site: sticker-wall catalog, atmospheric floating-emoji background, detail views with an AI "Today's Vibe" blurb, and localStorage favorites.

One note up front: this project runs on TanStack Start (React + TypeScript + Vite + Tailwind), not Next.js. It gives the same things you asked for — server-side API routes, SSR, typed server functions — so all external calls (EmojiHub + LLM) still happen on the server and no keys touch the browser. Deployment is through Lovable's hosting rather than Vercel; the README will document both the architecture and how to run/deploy it.

## Pages

- `/` — Home. `✦ EMOJI HUB` logo, label `A PLACE FOR EVERY MOOD`, headline `EMOJIS HAVE VIBES.`, subtitle, `EXPLORE EMOJIS →` + `🎲 SURPRISE ME`. Giant hero emoji that floats, tilts toward the cursor, and swaps on click. Below: `FIND YOUR VIBE` sticker categories (Smileys, Love, Animals, Food, Travel, Activities, Objects, Symbols) that grow and rotate on hover.
- `/explore` — `EMOJI EXPLORER`. Search by name, category filter chips, sort (A→Z, Z→A, Category), live result count (`128 emojis found`). Masonry-ish grid of sticker cards with varied sizes and ±1–2° rotations, hover lift/bounce, copy + favorite buttons.
- `/emoji/$slug` — Detail. Large animated emoji, name, category, description, Unicode (`U+1F602`), HTML entity, four copy/favorite buttons, and the `TODAY'S VIBE ✨` AI section with the `interpreted by the machine` label.
- `/favorites` — `♡ MY FAVORITES` from localStorage, with the empty state `No favorites yet 💛`.
- `🎲 SURPRISE ME` opens a full-screen random-emoji moment (dice-roll animation, big emoji, name, description, link to details).

## Design direction

Warm cream background, charcoal/black type, no gradients or glassmorphism. Clean sans for UI, monospace for technical labels (`EMOJI_HUB / 001`, `1,791 EMOTIONS INDEXED`). Color comes from the emojis themselves, not the chrome. Slow-drifting background emojis and ✦ sparkles with subtle parallax, reduced on mobile. Animations via Motion: float, wobble, hover rotate, heart pop, `✓ Copied!` toast, loading skeletons.

## Technical section

- **Backend proxy**: server routes under `src/routes/api/` fetch `https://emojihub.yurace.pro/api` on the server, normalize to a typed `Emoji` model (name, category, group, unicode, htmlCode, slug), cache in memory per instance, and serve list/detail to the client. The browser never touches EmojiHub.
- **Descriptions**: EmojiHub provides name/category/group but no prose description; a small deterministic generator composes a short human description from category + group + name so every card has one.
- **AI vibe**: a server function calls the Lovable AI gateway (`google/gemini-3-flash`) with the emoji name/category, returns 1–2 lowercase lines, cached per emoji, with a graceful fallback if it fails. Requires enabling Lovable Cloud so the AI key stays server-side.
- **Favorites**: localStorage via a `useFavorites` hook, hydration-safe (read in effect, not during SSR).
- **Structure**: `src/components/emoji/*` (UI), `src/lib/emojihub.server.ts` (external service), `src/lib/emoji.functions.ts` (server functions), `src/types/emoji.ts`, `src/lib/emoji-utils.ts`. TanStack Query for fetching/caching.
- **SEO**: distinct `head()` per route, semantic HTML, single H1.
- **README.md**: overview, features, stack rationale, `Frontend → our API → EmojiHub` architecture and why, install/env/run, design process, emoji-as-illustration approach, trade-offs (localStorage over auth, in-memory cache), known issues, deployment.
