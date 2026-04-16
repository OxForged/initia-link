"use client";

import { useState, useRef, useEffect } from "react";

type Props = {
  username: string;
  variant?: "default" | "compact";
};

// Minimal QR code generation using Canvas API + external service
export default function QRButton({ username, variant = "default" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const url = typeof window !== "undefined"
    ? `${window.location.origin}/${username}`
    : `/${username}`;
  const qrSrc = `https://quickchart.io/qr?text=${encodeURIComponent(url)}&size=300&margin=2&dark=1a1a1a&light=f4f9fb&ecLevel=L&format=png`;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="btn-fizz btn-fizz-ghost font-heading inline-flex items-center justify-center gap-1"
        style={{ fontSize: '11px', padding: '7px 10px', boxShadow: '3px 3px 0 var(--foreground)' }}
        title="QR Code"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
        </svg>
        QR
      </button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-[var(--card)] animate-scale-in z-50 w-[150px]" style={{ border: '2px solid var(--foreground)', borderRadius: '14px', boxShadow: '5px 5px 0 var(--foreground)', padding: '10px' }}>
          <img
            src={qrSrc}
            alt={`QR code for ${username}`}
            className="w-full aspect-square rounded-lg"
            draggable="false"
          />
          <p className="text-[10px] text-[var(--muted)] text-center mt-1.5 truncate">{username}</p>
        </div>
      )}
    </div>
  );
}
