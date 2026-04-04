"use client";

import { useState, useRef, useEffect } from "react";
import { useContractWrite } from "@/hooks/useContractWrite";
import { useHexAddress } from "@initia/interwovenkit-react";
import { toast } from "sonner";
type Props = {
  profileOwner: string;
  variant?: "default" | "hero";
};

export default function TipButton({ profileOwner, variant = "default" }: Props) {
  const { tipProfile, isConnected } = useContractWrite();
  const hexAddress = useHexAddress();

  // Hide if viewing own profile
  if (hexAddress && hexAddress.toLowerCase() === profileOwner.toLowerCase()) return null;
  const [amount, setAmount] = useState("10");
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const isHero = variant === "hero";

  useEffect(() => {
    if (!showInput || !isHero) return;
    function onClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) setShowInput(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [showInput, isHero]);

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
        className={`btn-press px-5 py-2.5 rounded-xl text-sm font-semibold min-h-[44px] ${
          isHero
            ? "btn-glass text-white"
            : "btn-shimmer gradient-primary text-white shadow-[0_2px_10px_rgba(8,145,178,0.25)] hover:shadow-[0_6px_20px_rgba(8,145,178,0.35)] hover:scale-105 transition-all duration-300"
        }`}
      >
        Tip GAS
      </button>
    );
  }

  if (isHero) {
    return (
      <div className="relative" ref={popoverRef}>
        <button
          onClick={() => setShowInput(false)}
          className="btn-glass btn-press text-white px-5 py-2.5 rounded-xl text-sm font-semibold min-h-[44px]"
        >
          Tip GAS
        </button>
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-[0_8px_32px_rgba(8,145,178,0.15)] border border-[var(--card-border)] p-3 animate-scale-in z-50 min-w-[220px]">
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="1"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-white border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm w-20 input-glow outline-none text-[var(--foreground)]"
            />
            <button
              onClick={handleTip}
              disabled={loading}
              className="btn-press gradient-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
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
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <input
          type="number"
          step="1"
          min="1"
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
