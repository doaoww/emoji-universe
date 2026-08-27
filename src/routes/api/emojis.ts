import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/emojis")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { loadEmojis } = await import("@/lib/emojihub.server");
        const url = new URL(request.url);
        const q = (url.searchParams.get("q") ?? "").toLowerCase().trim();
        const category = url.searchParams.get("category");

        let emojis = await loadEmojis();
        if (q) emojis = emojis.filter((e) => e.name.toLowerCase().includes(q));
        if (category) emojis = emojis.filter((e) => e.category === category);

        return Response.json(
          { emojis, total: emojis.length },
          { headers: { "cache-control": "public, max-age=300" } },
        );
      },
    },
  },
});
