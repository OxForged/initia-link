"use client";

import { useState, useRef, useEffect } from "react";
import { useInterwovenKit, useHexAddress } from "@initia/interwovenkit-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { APPCHAIN_ID, REST_URL } from "@/lib/constants";
import DarkModeToggle from "./DarkModeToggle";

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
  const [gasBalance, setGasBalance] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Fetch GAS balance when dropdown opens
  useEffect(() => {
    if (!open || !initiaAddress) return;
    const url = typeof window !== "undefined"
      ? `/api/balance?address=${initiaAddress}`
      : `${REST_URL}/cosmos/bank/v1beta1/balances/${initiaAddress}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        const balances = d.balances || [];
        const gas = balances.find((b: any) => b.denom === "GAS");
        setGasBalance(gas ? gas.amount : "0");
      })
      .catch(() => setGasBalance(null));
  }, [open, initiaAddress]);

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
        className="btn-fizz btn-fizz-primary font-heading"
        style={{ fontSize: '13px', padding: '10px 20px' }}
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
        className="btn-fizz btn-fizz-ghost font-heading flex items-center gap-2"
        style={{ fontSize: '13px', padding: '8px 14px', boxShadow: '3px 3px 0 var(--foreground)' }}
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
        <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--card)] animate-scale-in z-50" style={{ border: '2px solid var(--foreground)', borderRadius: '16px', boxShadow: '5px 5px 0 var(--foreground)', padding: '6px 0' }}>
          {/* GAS Balance */}
          {gasBalance !== null && (
            <div className="px-4 py-2.5 flex items-center justify-between text-sm">
              <span className="text-[var(--foreground)] font-medium">Balance</span>
              <span className="font-bold text-[var(--accent)]">{gasBalance} GAS</span>
            </div>
          )}

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
                  : "bg-[var(--surface)] text-[var(--muted)]"
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

          {/* Theme toggle */}
          <div className="w-full px-4 py-2.5 flex items-center justify-between">
            <span className="font-heading text-[var(--foreground)]" style={{ fontSize: '12px', fontWeight: 700 }}>Theme</span>
            <DarkModeToggle />
          </div>

          <div className="mx-3 my-1" style={{ borderTop: '2px solid var(--foreground)' }} />

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
