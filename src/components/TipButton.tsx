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
        className={isHero ? "btn-fizz btn-fizz-primary font-heading min-h-[44px]" : "btn-fizz btn-fizz-primary font-heading"}
        style={isHero ? {} : { fontSize: "13px", padding: "10px 18px" }}
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
          className="btn-fizz btn-fizz-primary font-heading min-h-[44px]"
        >
          Tip GAS
        </button>
        <div
          className="absolute top-full mt-2 left-1/2 -translate-x-1/2 animate-scale-in z-50"
          style={{
            background: "var(--card)",
            border: "2px solid var(--foreground)",
            borderRadius: "14px",
            boxShadow: "5px 5px 0 var(--foreground)",
            padding: "12px",
            minWidth: "220px",
          }}
        >
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="1"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="font-heading"
              style={{
                width: "72px",
                padding: "8px 10px",
                fontSize: "13px",
                fontWeight: 700,
                background: "var(--surface)",
                border: "2px solid var(--foreground)",
                borderRadius: "9px",
                outline: "none",
                color: "var(--foreground)",
              }}
            />
            <button
              onClick={handleTip}
              disabled={loading}
              className="btn-fizz btn-fizz-primary font-heading disabled:opacity-50"
              style={{ fontSize: "13px", padding: "8px 14px" }}
            >
              {loading ? "..." : "Send"}
            </button>
            <button
              onClick={() => setShowInput(false)}
              style={{ fontSize: "13px", color: "var(--muted)", background: "none", border: "none", cursor: "pointer" }}
            >
              ✕
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
          className="font-heading"
          style={{
            width: "80px",
            padding: "8px 10px",
            fontSize: "13px",
            fontWeight: 700,
            background: "var(--surface)",
            border: "2px solid var(--foreground)",
            borderRadius: "9px",
            outline: "none",
            color: "var(--foreground)",
          }}
        />
        <button
          onClick={handleTip}
          disabled={loading}
          className="btn-fizz btn-fizz-primary font-heading disabled:opacity-50"
          style={{ fontSize: "13px", padding: "8px 14px" }}
        >
          {loading ? "..." : "Send"}
        </button>
        <button
          onClick={() => setShowInput(false)}
          style={{ fontSize: "13px", color: "var(--muted)", background: "none", border: "none", cursor: "pointer" }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
