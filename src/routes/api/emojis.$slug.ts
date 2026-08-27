import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/emojis/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { findEmoji } = await import("@/lib/emojihub.server");
        const emoji = await findEmoji(params.slug);
        if (!emoji) return Response.json({ error: "Not found" }, { status: 404 });
        return Response.json(emoji, { headers: { "cache-control": "public, max-age=300" } });
      },
    },
  },
});
