import { useEffect, useState } from "react";

const FLOATERS = [
  { e: "😂", top: "8%", left: "4%", size: 46, delay: 0, depth: 22 },
  { e: "✨", top: "18%", left: "88%", size: 34, delay: 1.4, depth: 34 },
  { e: "🪩", top: "44%", left: "92%", size: 42, delay: 2.2, depth: 18 },
  { e: "❤️", top: "68%", left: "6%", size: 38, delay: 0.8, depth: 28 },
  { e: "👀", top: "80%", left: "84%", size: 40, delay: 3.1, depth: 24 },
  { e: "🚀", top: "30%", left: "12%", size: 36, delay: 2.6, depth: 30 },
  { e: "🦋", top: "58%", left: "76%", size: 32, delay: 1.1, depth: 40 },
  { e: "💀", top: "88%", left: "38%", size: 30, delay: 3.6, depth: 20 },
  { e: "🌈", top: "6%", left: "58%", size: 30, delay: 2.9, depth: 26 },
  { e: "🥹", top: "52%", left: "2%", size: 30, delay: 4.2, depth: 32 },
];

const SPARKS = ["✦", "✦", "✧", "·", "✦", "✧", "·", "✦", "✧", "·", "✦", "·"];

export function EmojiBackground() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(max-width: 768px)").matches) return;
    let frame = 0;
    const onMove = (event: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setOffset({
          x: event.clientX / window.innerWidth - 0.5,
          y: event.clientY / window.innerHeight - 0.5,
        });
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {SPARKS.map((spark, index) => (
        <span
          key={`spark-${index}`}
          className="animate-drift absolute text-muted-foreground/40"
          style={{
            top: `${(index * 37) % 95}%`,
            left: `${(index * 61) % 96}%`,
            fontSize: 12 + (index % 3) * 4,
            animationDelay: `${index * 0.7}s`,
          }}
        >
          {spark}
        </span>
      ))}
      {FLOATERS.map((item) => (
        <span
          key={item.e + item.top}
          className="animate-drift absolute select-none opacity-70 max-sm:opacity-40"
          style={{
            top: item.top,
            left: item.left,
            fontSize: item.size,
            animationDelay: `${item.delay}s`,
            translate: `${offset.x * item.depth}px ${offset.y * item.depth}px`,
            transition: "translate 500ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {item.e}
        </span>
      ))}
    </div>
  );
}
