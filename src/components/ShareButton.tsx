"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

type Props = {
  username: string;
  variant?: "default" | "compact";
};

export default function ShareButton({ username, variant = "default" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isCompact = variant === "compact";

  const url = typeof window !== "undefined"
    ? `${window.location.origin}/${username}`
    : `/${username}`;

  const text = `Check out my on-chain profile on InitiaLink!`;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function copyLink() {
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={isCompact
          ? "btn-footer-compact bg-[#f4f9fb] border border-[#d1e8ed] text-[#888] py-1.5 px-3 rounded-[7px] text-[10px] font-medium hover:border-[var(--theme-accent,#0891b2)] hover:text-[var(--theme-accent,#0891b2)] transition-all duration-200 inline-flex items-center gap-1"
          : "btn-press bg-white border-2 border-[var(--card-border)] text-[#555] px-5 py-2.5 rounded-xl text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] hover:scale-105 transition-all duration-300 min-h-[44px] inline-flex items-center gap-1.5"
        }
      >
        <svg className={isCompact ? "w-3 h-3" : "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share
      </button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-[0_8px_32px_rgba(8,145,178,0.12)] border border-[var(--card-border)] py-1.5 animate-scale-in z-50">
          <a
            href={`https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="w-full px-4 py-2 flex items-center gap-2.5 text-sm text-[var(--foreground)] hover:bg-[rgba(8,145,178,0.04)] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Post on X
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="w-full px-4 py-2 flex items-center gap-2.5 text-sm text-[var(--foreground)] hover:bg-[rgba(8,145,178,0.04)] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            Share on Telegram
          </a>
          <button
            onClick={copyLink}
            className="w-full px-4 py-2 flex items-center gap-2.5 text-sm text-[var(--foreground)] hover:bg-[rgba(8,145,178,0.04)] transition-colors text-left"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Copy Link
          </button>
        </div>
      )}
    </div>
  );
}
