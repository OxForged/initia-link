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
      <div>
        <button
          onClick={() => setShowInput(true)}
          className="btn-shimmer gradient-primary text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-[0_2px_10px_rgba(244,63,94,0.25)] hover:shadow-[0_6px_20px_rgba(244,63,94,0.35)] hover:scale-105 transition-all duration-300"
        >
          Tip INIT
        </button>
        {status && <p className="text-xs text-[var(--muted)] mt-1">{status}</p>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        step="0.001"
        min="0.001"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="bg-white border border-[var(--card-border)] rounded-xl px-3 py-2 text-sm w-24 focus:border-[#f472b6] outline-none"
      />
      <button
        onClick={handleTip}
        disabled={loading}
        className="gradient-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send"}
      </button>
      <button
        onClick={() => setShowInput(false)}
        className="text-[var(--muted)] text-sm hover:text-[var(--foreground)]"
      >
        Cancel
      </button>
    </div>
  );
}
