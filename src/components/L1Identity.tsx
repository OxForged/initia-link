"use client";

import { useState, useEffect } from "react";
import type { L1Identity } from "@/lib/l1-identity";

type Props = {
  initAddress: string;
  variant?: "default" | "compact";
};

function formatInit(amount: number): string {
  if (amount === 0) return "0";
  if (amount < 0.01) return "<0.01";
  return amount.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export default function L1IdentityCard({ initAddress, variant = "default" }: Props) {
  const [data, setData] = useState<L1Identity | null>(null);
  const [loading, setLoading] = useState(true);
  const isCompact = variant === "compact";

  useEffect(() => {
    if (!initAddress) return;

    fetch(`/api/l1-identity?address=${encodeURIComponent(initAddress)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => setData(json))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [initAddress]);

  if (loading) {
    if (isCompact) {
      return (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="skeleton w-[18px] h-[18px] rounded-full" />
            <div className="skeleton h-3 w-16 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="skeleton h-10 flex-1 rounded-[10px]" />
            <div className="skeleton h-10 flex-1 rounded-[10px]" />
            <div className="skeleton h-10 flex-1 rounded-[10px]" />
          </div>
        </div>
      );
    }
    return (
      <div className="animate-fade-in-up delay-5 mb-6">
        <div className="bg-[var(--card)] rounded-2xl p-4" style={{ border: '2px solid var(--foreground)', boxShadow: '4px 4px 0 var(--foreground)' }}>
          <div className="skeleton h-4 w-32 mb-3 rounded" />
          <div className="grid grid-cols-3 gap-3">
            <div className="skeleton h-12 rounded-xl" />
            <div className="skeleton h-12 rounded-xl" />
            <div className="skeleton h-12 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  if (isCompact) {
    return (
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0891b2, #8b5cf6)' }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-[11px] font-bold text-[var(--foreground)]">initia L1</span>
          <span className="text-[9px] text-[var(--muted)] bg-[var(--background)] px-1.5 py-0.5 rounded" style={{ lineHeight: 1 }}>Cross-Rollup</span>
        </div>
        <div className="flex gap-2">
          <div
            className="flex-1 text-center"
            style={{ padding: '8px 6px', border: '2px solid var(--foreground)', borderRadius: '10px', boxShadow: '3px 3px 0 var(--foreground)', background: 'rgba(8,145,178,0.04)' }}
          >
            <div className="font-heading" style={{ fontSize: '15px', fontWeight: 900, color: '#0891b2' }}>{formatInit(data.initBalance)}</div>
            <div className="font-heading" style={{ fontSize: '8px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>INIT</div>
          </div>
          <div
            className="flex-1 text-center"
            style={{ padding: '8px 6px', border: '2px solid var(--foreground)', borderRadius: '10px', boxShadow: '3px 3px 0 var(--foreground)', background: 'rgba(99,102,241,0.04)' }}
          >
            <div className="font-heading" style={{ fontSize: '15px', fontWeight: 900, color: '#6366f1' }}>{formatInit(data.totalStaked)}</div>
            <div className="font-heading" style={{ fontSize: '8px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>Staked</div>
          </div>
          <div
            className="flex-1 text-center"
            style={{ padding: '8px 6px', border: '2px solid var(--foreground)', borderRadius: '10px', boxShadow: '3px 3px 0 var(--foreground)', background: 'rgba(139,92,246,0.04)' }}
          >
            <div className="font-heading" style={{ fontSize: '15px', fontWeight: 900, color: '#8b5cf6' }}>{data.validatorCount}</div>
            <div className="font-heading" style={{ fontSize: '8px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>Validators</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up delay-5 mb-6">
      <div className="bg-[var(--card)] rounded-2xl p-4" style={{ border: '2px solid var(--foreground)', boxShadow: '4px 4px 0 var(--foreground)' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full gradient-accent flex items-center justify-center">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-[var(--foreground)] font-heading tracking-wide uppercase">
            initia L1
          </span>
          <span className="text-[10px] text-[var(--muted)]">Cross-Rollup</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="l1-chip c1 rounded-xl p-2.5 text-center">
            <p className="text-sm sm:text-base font-bold text-[var(--foreground)]">
              {formatInit(data.initBalance)}
            </p>
            <p className="text-[10px] text-[var(--muted)]">INIT</p>
          </div>
          <div className="l1-chip c2 rounded-xl p-2.5 text-center">
            <p className="text-sm sm:text-base font-bold text-[var(--foreground)]">
              {formatInit(data.totalStaked)}
            </p>
            <p className="text-[10px] text-[var(--muted)]">Staked</p>
          </div>
          <div className="l1-chip c3 rounded-xl p-2.5 text-center">
            <p className="text-sm sm:text-base font-bold text-[var(--foreground)]">
              {data.validatorCount}
            </p>
            <p className="text-[10px] text-[var(--muted)]">Validators</p>
          </div>
        </div>
      </div>
    </div>
  );
}
