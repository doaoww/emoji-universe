import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

export function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(async (value: string, label = "Copied") => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      toast("Your browser blocked the clipboard 😵‍💫");
      return;
    }
    setCopied(value);
    toast(`✓ ${label}!`, { description: value });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 1400);
  }, []);

  return { copy, copied };
}
