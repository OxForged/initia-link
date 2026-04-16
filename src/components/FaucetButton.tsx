"use client";

import { useState } from "react";
import { useInterwovenKit } from "@initia/interwovenkit-react";
import { toast } from "sonner";

export default function FaucetButton() {
  const { initiaAddress } = useInterwovenKit();
  const [loading, setLoading] = useState(false);

  async function handleDrip() {
    if (!initiaAddress) {
      toast.error("Connect wallet first");
      return;
    }

    setLoading(true);

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

      toast.success(`Received ${data.amount} GAS!`);
    } catch {
      toast.error("Faucet request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDrip}
      disabled={loading}
      className="btn-fizz btn-fizz-primary font-heading disabled:opacity-50"
      style={{ fontSize: '13px', padding: '8px 16px' }}
    >
      {loading ? "..." : "Get GAS"}
    </button>
  );
}
