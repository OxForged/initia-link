"use client";

import { useInterwovenKit } from "@initia/interwovenkit-react";

export default function ConnectButton() {
  const { isConnected, openConnect, openWallet, address, username, disconnect } =
    useInterwovenKit();

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={openWallet}
          className="text-sm font-semibold gradient-primary gradient-text hover:opacity-80 transition-opacity"
        >
          {username ? username : `${address?.slice(0, 6)}...${address?.slice(-4)}`}
        </button>
        <button
          onClick={disconnect}
          className="text-xs text-[var(--muted)] hover:text-red-500 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={openConnect}
      className="gradient-primary text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-[0_2px_10px_rgba(244,63,94,0.25)] hover:opacity-90 transition-opacity"
    >
      Connect Wallet
    </button>
  );
}
