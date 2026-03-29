"use client";

import { useState, useRef, useEffect } from "react";
import { useInterwovenKit, useHexAddress } from "@initia/interwovenkit-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { APPCHAIN_ID } from "@/lib/constants";

export default function ConnectButton() {
  const {
    isConnected,
    openConnect,
    address,
    username,
    disconnect,
    autoSign,
    initiaAddress,
  } = useInterwovenKit();

  const hexAddress = useHexAddress();
  const [open, setOpen] = useState(false);
  const [faucetLoading, setFaucetLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isAutoSign = autoSign?.isEnabledByChain?.[APPCHAIN_ID] ?? false;

  const enableAutoSign = useMutation({
    mutationFn: () => autoSign.enable(APPCHAIN_ID),
    onSuccess: () => toast.success("Auto-sign enabled"),
    onError: (err: Error) =>
      toast.error(err.message || "Failed to enable auto-sign"),
  });

  const disableAutoSign = useMutation({
    mutationFn: () => autoSign.disable(APPCHAIN_ID),
    onSuccess: () => toast.success("Auto-sign disabled"),
    onError: (err: Error) =>
      toast.error(err.message || "Failed to disable auto-sign"),
  });

  const autoSignLoading =
    autoSign?.isLoading || enableAutoSign.isPending || disableAutoSign.isPending;

  async function handleFaucet() {
    if (!initiaAddress) return;
    setFaucetLoading(true);
    try {
      const res = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: initiaAddress }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Faucet request failed");
        return;
      }
      toast.success(`Received ${data.amount} GAS!`, {
        description: `Tx: ${data.hash}`,
        duration: 6000,
      });
    } catch {
      toast.error("Faucet request failed");
    } finally {
      setFaucetLoading(false);
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  if (!isConnected) {
    return (
      <button
        onClick={openConnect}
        className="gradient-primary text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-[0_2px_10px_rgba(8,145,178,0.25)] hover:opacity-90 transition-opacity btn-shimmer"
      >
        Connect Wallet
      </button>
    );
  }

  const displayName = username
    ? username
    : `${address?.slice(0, 6)}...${address?.slice(-4)}`;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border border-[var(--card-border)] bg-white hover:border-[var(--accent)] transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
        <span className="gradient-text-animated">{displayName}</span>
        <svg
          className={`w-3.5 h-3.5 text-[var(--muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-[0_8px_32px_rgba(8,145,178,0.12)] border border-[var(--card-border)] py-2 animate-scale-in z-50">
          {/* Auto-Sign toggle */}
          <button
            onClick={() =>
              isAutoSign ? disableAutoSign.mutate() : enableAutoSign.mutate()
            }
            disabled={autoSignLoading}
            className="w-full px-4 py-2.5 flex items-center justify-between text-sm hover:bg-[rgba(8,145,178,0.04)] transition-colors disabled:opacity-50"
          >
            <span className="text-[var(--foreground)] font-medium">Auto-Sign</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                isAutoSign
                  ? "bg-[rgba(8,145,178,0.1)] text-[var(--accent)]"
                  : "bg-[#f0f0f0] text-[var(--muted)]"
              }`}
            >
              {autoSignLoading ? "..." : isAutoSign ? "ON" : "OFF"}
            </span>
          </button>

          {/* Faucet */}
          <button
            onClick={handleFaucet}
            disabled={faucetLoading}
            className="w-full px-4 py-2.5 flex items-center justify-between text-sm hover:bg-[rgba(8,145,178,0.04)] transition-colors disabled:opacity-50"
          >
            <span className="text-[var(--foreground)] font-medium">Get GAS</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[rgba(139,92,246,0.1)] text-[#8b5cf6]">
              {faucetLoading ? "..." : "Faucet"}
            </span>
          </button>

          <div className="mx-3 my-1 border-t border-[var(--card-border)]" />

          {/* Disconnect */}
          <button
            onClick={() => {
              disconnect();
              setOpen(false);
            }}
            className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
