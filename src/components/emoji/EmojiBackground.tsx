/**
 * Very light atmosphere: two soft blurred shapes, nothing animated.
 * Kept intentionally simple so the interface stays the main event.
 */
export function EmojiBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-brand/20 blur-3xl" />
      <div className="absolute -right-32 top-1/3 h-[22rem] w-[22rem] rounded-full bg-sticker-pink/15 blur-3xl" />
    </div>
  );
}
