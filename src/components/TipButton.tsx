"use client";

import { useState } from "react";
import { tipProfile } from "@/lib/contract";
import type { Address } from "viem";

type Props = {
  profileOwner: Address;
};

export default function TipButton({ profileOwner }: Props) {
  const [amount, setAmount] = useState("0.01");
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function handleTip() {
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
          className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
        className="bg-[var(--background)] border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm w-24"
      />
      <button
        onClick={handleTip}
        disabled={loading}
        className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send"}
      </button>
      <button
        onClick={() => setShowInput(false)}
        className="text-[var(--muted)] text-sm hover:text-white"
      >
        Cancel
      </button>
    </div>
  );
}
