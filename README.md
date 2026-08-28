# ✦ Emoji Hub

**Emojis have vibes.** Emoji Hub is a small digital world for discovering emojis: browse them, search them, read what they mean, copy them in one tap, and keep the ones that feel like you.

---

## Project Overview

Emoji Hub is an emoji discovery platform. It pulls the full emoji set from the public [EmojiHub API](https://github.com/cheatsnake/emojihub), enriches every entry with a readable description, and presents the whole thing as a sticker-wall interface rather than a database table.

The emojis are not just content — they are the visual language of the interface: floating background characters, sticker-shaped category cards, emoji-based empty states and illustrations.

## Features

- **Home** — hero with an interactive emoji that floats, tilts toward the cursor and swaps on click, plus a playful "Find your vibe" category wall.
- **Explorer** (`/explore`) — search by name, filter by category, sort A→Z / Z→A / by category, live result count, incremental loading.
- **Emoji grid** — sticker cards with subtle rotations, alternating paper colors, hover lift + emoji scale, inline copy and favorite actions.
- **Emoji details** (`/emoji/:slug`) — large animated emoji, name, category, group, description, Unicode, HTML entity, and copy buttons for each.
- **Favorites** (`/favorites`) — saved in `localStorage`, with a friendly empty state.
- **Surprise me** — a dice-roll modal that draws a random emoji server-side and lets you jump into its details.
- **Today's Vibe ✨** — a short, machine-written mood reading generated per emoji by an LLM, called strictly from the server.

## Tech Stack

| Tech | Why |
| --- | --- |
| **TanStack Start (React 19 + Vite 7)** | Full-stack React with SSR, file-based routing and typed server functions. This is the framework the project runs on; it covers the same needs the brief described for Next.js (server API routes, SSR, server-only secrets) with end-to-end type safety. |
| **TypeScript** | Shared `Emoji` model between server and client; the API shape can't drift silently. |
| **Tailwind CSS v4** | CSS-first design tokens in `src/styles.css`; the whole cream/charcoal identity lives in one place. |
| **TanStack Query** | Caching, dedupe and SSR hydration for the emoji dataset (fetched once, filtered client-side). |
| **shadcn/ui + sonner** | Used only where it earns its place (toasts for the copy confirmation). The custom sticker UI is hand-built so it doesn't look like a default component kit. |
| **Lovable AI Gateway** | Server-side LLM access for "Today's Vibe" without shipping a key to the browser. |
| **localStorage** | Favorites without an account. |

## Architecture

```text
Browser (React)
      │  typed RPC / fetch — same origin only
      ▼
Our backend  (src/lib/emoji.functions.ts  +  src/routes/api/emojis*.ts)
      │  server-only fetch, in-memory cache
      ▼
EmojiHub API  (https://emojihub.yurace.pro/api/all)
      │
      └── LLM (Lovable AI Gateway) for the vibe text
```

The frontend **never** calls EmojiHub or the LLM directly. Two server-side entry points exist:

- `src/lib/emoji.functions.ts` — typed server functions (`getEmojis`, `getEmoji`, `getRandomEmoji`, `getEmojiVibe`) used by routes and components.
- `src/routes/api/emojis.ts` and `src/routes/api/emojis.$slug.ts` — plain HTTP JSON endpoints (`GET /api/emojis?q=&category=`, `GET /api/emojis/:slug`) for external consumers.

Both delegate to `src/lib/emojihub.server.ts`, the only module that talks to the outside world.

**Why not call the external API from the client?**

- API keys (the LLM key) stay on the server and are never exposed.
- One normalization point: slugs, emoji characters, descriptions and categories are computed once, server-side.
- An in-memory cache means one upstream request per hour per instance instead of one per visitor.
- The upstream contract can change without touching a single component.
- No CORS dependency on a third party, and no third-party outage leaking straight into the UI.

## Project Structure

```text
src/
  components/emoji/   EmojiCard, EmojiBackground, SurpriseMe, copy hook
  hooks/              useFavorites (localStorage)
  lib/
    emojihub.server.ts   external services (EmojiHub + LLM) — server only
    emoji.functions.ts   server functions (our API)
    emoji-queries.ts     TanStack Query options
    emoji-utils.ts       slugs, unicode → char, descriptions
  routes/             index, explore, favorites, emoji.$slug, api/*
  types/emoji.ts      shared types
```

## Installation

```bash
git clone <repo-url>
cd emoji-hub
npm install       # or bun install
npm run dev       # http://localhost:8080
```

Environment variables:

| Variable | Required | Purpose |
| --- | --- | --- |
| `LOVABLE_API_KEY` | optional | Server-side LLM key for "Today's Vibe". Provisioned automatically on Lovable. Without it the app falls back to hand-written vibe lines. |

No `VITE_`-prefixed secrets exist — anything prefixed with `VITE_` would be bundled into the browser.

Build for production:

```bash
npm run build
npm run preview
```

## Development Process

1. **Data first.** Inspected the EmojiHub payload (1,791 usable emojis, 8 categories), then designed the normalized `Emoji` model around what the API actually returns.
2. **Server boundary second.** Built `emojihub.server.ts` with caching and slug generation before any UI existed, so the client only ever saw a clean shape.
3. **Identity third.** Locked the cream/charcoal palette, Space Grotesk + JetBrains Mono pairing, and the hard-shadow sticker language in the design tokens.
4. **Screens last**, reusing one card component across the explorer and favorites.

## Unique Design Approach

The core idea: **the emojis are the illustration**. There is no stock art, no abstract 3D blob, no gradient mesh. Instead:

- The hero is a single giant emoji that drifts, tilts toward the cursor and changes on click.
- Background atmosphere is built from slowly drifting emojis and `✦` sparkles with cursor parallax (dimmed and reduced on mobile).
- Categories are sticker cards whose icon is the emoji itself, each rotated a degree or two.
- Empty and loading states are emoji compositions (`🔍 👀 😶‍🌫️`, `💛`, `🎲`).
- Cards carry small imperfections — ±1–3° rotations, alternating paper tints, offset hard shadows — so the grid reads as a sticker wall rather than a table.

The interface chrome stays deliberately calm — cream paper, black ink, monospace technical labels like `EMOJI_HUB / 001` and `1,791 EMOTIONS INDEXED` — so all the color in the page comes from the emojis themselves.

## Trade-offs

- **localStorage instead of authentication.** Favorites are personal and low-stakes; an account system would add friction and a database for no user benefit. The cost: favorites don't sync across devices.
- **Fetch-all-then-filter.** The whole dataset (~1,791 entries, a few hundred KB) is loaded once and filtered in memory. Search feels instant and the upstream API gets one request per hour, at the cost of a slightly heavier first payload than paginated server-side search.
- **In-memory cache, not a database.** Zero infrastructure, but the cache is per server instance and resets on redeploy.
- **Descriptions are composed, not curated.** EmojiHub ships no prose, so descriptions are generated deterministically from name + category + group. Predictable and free, but less colorful than handwritten copy — the LLM "vibe" section covers the personality.
- **Custom UI over a component library.** shadcn/ui is used only for toasts; the rest is hand-built to avoid a default-looking product.

## Known Issues

- Emoji glyphs render per platform, so the same emoji looks different on macOS, Windows and Android. A few flag and ZWJ sequences fall back to boxes on systems without the font.
- The AI vibe is generated on each detail visit (no persistent cache), so it can differ between visits and takes a moment to appear.
- Cursor-parallax background is desktop-only by design; on mobile the floaters are static and faded.
- Search matches names only, not synonyms — searching "happy" won't find "grinning face".
- Slugs are derived from names, so duplicates get a numeric suffix (`heart-2`); if upstream reorders its data, a suffixed slug could shift.

## Deployment

The project is deployed from Lovable — open the project and use **Publish**. Preview and production builds are served from stable URLs, and server functions run on the edge runtime automatically.

To deploy elsewhere (including Vercel), the app builds to a standard TanStack Start output:

```bash
npm run build
```

Set `LOVABLE_API_KEY` (or swap `generateVibe` in `src/lib/emojihub.server.ts` for another provider's key) as a **server-side** environment variable in the hosting dashboard — never as a `VITE_` variable.
