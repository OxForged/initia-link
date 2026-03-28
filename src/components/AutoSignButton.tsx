"use client";

import { useInterwovenKit } from "@initia/interwovenkit-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { APPCHAIN_ID } from "@/lib/constants";

export default function AutoSignButton() {
  const { autoSign, initiaAddress } = useInterwovenKit();

  const isEnabled = autoSign?.isEnabledByChain?.[APPCHAIN_ID] ?? false;

  const enable = useMutation({
    mutationFn: () => autoSign.enable(APPCHAIN_ID),
    onSuccess: () => toast.success("Auto-sign enabled"),
    onError: (err: Error) => toast.error(err.message || "Failed to enable auto-sign"),
  });

  const disable = useMutation({
    mutationFn: () => autoSign.disable(APPCHAIN_ID),
    onSuccess: () => toast.success("Auto-sign disabled"),
    onError: (err: Error) => toast.error(err.message || "Failed to disable auto-sign"),
  });

  if (!initiaAddress) return null;

  const loading = autoSign?.isLoading || enable.isPending || disable.isPending;

  return (
    <button
      onClick={() => (isEnabled ? disable.mutate() : enable.mutate())}
      disabled={loading}
      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-opacity disabled:opacity-50 min-h-[40px] ${
        isEnabled
          ? "bg-[var(--accent)] text-white shadow-[0_2px_10px_rgba(8,145,178,0.25)] hover:opacity-90"
          : "border border-[var(--accent)] text-[var(--accent)] hover:bg-[rgba(8,145,178,0.06)]"
      }`}
    >
      {loading ? "..." : isEnabled ? "Auto-Sign ON" : "Auto-Sign OFF"}
    </button>
  );
}
