"use client";

import { useState } from "react";
import { useContractWrite } from "@/hooks/useContractWrite";
import type { Address } from "viem";

type Props = {
  profileOwner: Address;
};

export default function TipButton({ profileOwner }: Props) {
  const { tipProfile, isConnected } = useContractWrite();
  const [amount, setAmount] = useState("0.01");
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function handleTip() {
    if (!isConnected) { setStatus("Connect wallet first"); return; }
    setLoading(true);
    setStatus(null);
    try {
      await tipProfile(profileOwner, amount);
      setStatus("Tip sent!");
      setShowInput(false);
    } catch (e: any) {
      setStatus(e.message?.slice(0, 100) || "Failed to send tip");
    } finally {
      setLoading(false);
    }
  }

  if (!showInput) {
    return (
      <button
        onClick={() => setShowInput(true)}
        className="btn-press btn-shimmer gradient-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-[0_2px_10px_rgba(8,145,178,0.25)] hover:shadow-[0_6px_20px_rgba(8,145,178,0.35)] hover:scale-105 transition-all duration-300"
      >
        Tip INIT
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <input
          type="number"
          step="0.001"
          min="0.001"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-white border border-[var(--card-border)] rounded-xl px-3 py-2 text-sm w-24 input-glow outline-none"
        />
        <button
          onClick={handleTip}
          disabled={loading}
          className="btn-press gradient-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
        <button
          onClick={() => { setShowInput(false); setStatus(null); }}
          className="text-[var(--muted)] text-sm hover:text-[var(--foreground)] transition-colors"
        >
          Cancel
        </button>
      </div>
      {status && (
        <p className={`status-slide-in text-xs ${status.includes("!") ? "text-green-500" : "text-[var(--muted)]"}`}>
          {status}
        </p>
      )}
    </div>
  );
}
