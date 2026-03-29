"use client";

import { useState, useEffect } from "react";
import type { L1Identity } from "@/lib/l1-identity";

type Props = {
  initAddress: string;
};

function formatInit(amount: number): string {
  if (amount === 0) return "0";
  if (amount < 0.01) return "<0.01";
  return amount.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export default function L1IdentityCard({ initAddress }: Props) {
  const [data, setData] = useState<L1Identity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initAddress) return;

    fetch(`/api/l1-identity?address=${encodeURIComponent(initAddress)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => setData(json))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [initAddress]);

  if (loading) {
    return (
      <div className="animate-fade-in-up delay-5 mb-6">
        <div className="bg-white border border-[var(--card-border)] rounded-2xl p-4">
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

  return (
    <div className="animate-fade-in-up delay-5 mb-6">
      <div className="bg-white border border-[var(--card-border)] rounded-2xl p-4 hover-pop">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full gradient-accent flex items-center justify-center">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-[var(--foreground)] font-heading tracking-wide uppercase">
            Initia L1
          </span>
          <span className="text-[10px] text-[var(--muted)]">Cross-Rollup</span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2">
          {/* INIT Balance */}
          <div className="bg-[linear-gradient(135deg,#f4f9fb,#e0f2fe)] rounded-xl p-2.5 text-center">
            <p className="text-sm sm:text-base font-bold text-[var(--foreground)]">
              {formatInit(data.initBalance)}
            </p>
            <p className="text-[10px] text-[var(--muted)]">INIT</p>
          </div>

          {/* Staked */}
          <div className="bg-[linear-gradient(135deg,#e0f2fe,#ede9fe)] rounded-xl p-2.5 text-center">
            <p className="text-sm sm:text-base font-bold text-[var(--foreground)]">
              {formatInit(data.totalStaked)}
            </p>
            <p className="text-[10px] text-[var(--muted)]">Staked</p>
          </div>

          {/* Validators */}
          <div className="bg-[linear-gradient(135deg,#ede9fe,#f4f9fb)] rounded-xl p-2.5 text-center">
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
