"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

export function CopyShareButton({ shareUrl }: { shareUrl: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark"
    >
      <Copy className="h-4 w-4" />
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
