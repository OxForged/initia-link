"use client";

import { useState } from "react";
import { useContractWrite } from "@/hooks/useContractWrite";
import { useHexAddress } from "@initia/interwovenkit-react";
import { toast } from "sonner";
import type { Address } from "viem";

type Props = {
  profileOwner: Address;
};

export default function TipButton({ profileOwner }: Props) {
  const { tipProfile, isConnected } = useContractWrite();
  const hexAddress = useHexAddress();

  // Hide if viewing own profile
  if (hexAddress && hexAddress.toLowerCase() === profileOwner.toLowerCase()) return null;
  const [amount, setAmount] = useState("0.01");
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);

  async function handleTip() {
    if (!isConnected) { toast.error("Connect wallet first"); return; }
    setLoading(true);
    try {
      await tipProfile(profileOwner, amount);
      toast.success(`Tip of ${amount} GAS sent!`);
      setShowInput(false);
    } catch (e: any) {
      toast.error(e.message?.slice(0, 100) || "Failed to send tip");
    } finally {
      setLoading(false);
    }
  }

  if (!showInput) {
    return (
      <button
        onClick={() => setShowInput(true)}
        className="btn-press btn-shimmer gradient-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-[0_2px_10px_rgba(8,145,178,0.25)] hover:shadow-[0_6px_20px_rgba(8,145,178,0.35)] hover:scale-105 transition-all duration-300 min-h-[44px]"
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
          onClick={() => setShowInput(false)}
          className="text-[var(--muted)] text-sm hover:text-[var(--foreground)] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
