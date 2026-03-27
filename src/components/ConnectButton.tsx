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
          className="text-sm hover:text-[var(--accent)] transition-colors"
        >
          {username ? username : `${address?.slice(0, 6)}...${address?.slice(-4)}`}
        </button>
        <button
          onClick={disconnect}
          className="text-xs text-[var(--muted)] hover:text-red-400 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={openConnect}
      className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    >
      Connect Wallet
    </button>
  );
}
