"use client";

import { useState, useEffect } from "react";
import { useInterwovenKit, useHexAddress } from "@initia/interwovenkit-react";
import { getProfile, type Profile } from "@/lib/contract";
import { REST_URL } from "@/lib/constants";
import EditProfileForm from "@/components/EditProfileForm";
import { toast } from "sonner";

const STEPS = [
  { label: "Connect", short: "Wallet" },
  { label: "Get GAS", short: "Faucet" },
  { label: "Username", short: ".init" },
  { label: "Profile", short: "Create" },
];

export default function EditPage() {
  const { isConnected, openConnect, username, initiaAddress } = useInterwovenKit();
  const hexAddress = useHexAddress();
  const account = hexAddress as string | undefined;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceTick, setBalanceTick] = useState(0);
  const [faucetLoading, setFaucetLoading] = useState(false);

  // Fetch profile
  useEffect(() => {
    if (!account) return;
    setLoading(true);
    getProfile(account)
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [account]);

  // Fetch GAS balance (uses bech32 initiaAddress, not hex)
  useEffect(() => {
    if (!initiaAddress) return;
    fetch(`${REST_URL}/cosmos/bank/v1beta1/balances/${initiaAddress}`)
      .then((r) => r.json())
      .then((data) => {
        const gas = data.balances?.find((b: { denom: string }) => b.denom === "GAS");
        setBalance(gas ? Number(gas.amount) : 0);
      })
      .catch(() => setBalance(null));
  }, [initiaAddress, balanceTick]);

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
      toast.success(`Received ${data.amount} GAS!`);
      setTimeout(() => setBalanceTick((t) => t + 1), 1500);
    } catch {
      toast.error("Faucet request failed");
    } finally {
      setFaucetLoading(false);
    }
  }

  // Determine current step
  const hasWallet = isConnected && !!account;
  const hasGas = balance !== null && balance > 0;
  const hasUsername = !!username;
  const hasProfile = profile?.exists === true;

  let currentStep = 0;
  if (hasWallet) currentStep = 1;
  if (hasWallet && hasGas) currentStep = 2;
  if (hasWallet && hasGas && hasUsername) currentStep = 3;
  if (hasWallet && hasProfile) currentStep = 3; // skip to form if already has profile

  // If user has wallet + username but we're still loading balance, don't block
  if (hasWallet && hasUsername && balance === null) currentStep = 3;

  const isEditing = hasProfile;

  // Skip stepper for returning users OR new users who reached step 4
  if ((isEditing || currentStep === 3) && !loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="animate-fade-in-up delay-0 text-2xl font-bold text-[var(--foreground)] font-heading">
            {isEditing ? "Edit Profile" : "Create Profile"}
          </h1>
          <p className="animate-fade-in-up delay-1 text-sm text-[var(--muted)] mt-1">
            {username} / {initiaAddress?.slice(0, 10)}...{initiaAddress?.slice(-4)}
          </p>
        </div>
        <div className="animate-fade-in-up delay-2">
          <EditProfileForm
            existingProfile={profile}
            onSaved={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <h1 className="animate-fade-in-up delay-0 text-2xl sm:text-3xl font-bold text-center text-[var(--foreground)] font-heading mb-2">
        Get Started
      </h1>
      <p className="animate-fade-in-up delay-1 text-sm text-[var(--muted)] text-center mb-8">
        Set up your on-chain profile in a few steps
      </p>

      {/* Progress stepper */}
      <div className="animate-fade-in-up delay-2 flex items-center justify-between mb-10 px-2">
        {STEPS.map((step, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                    done
                      ? "gradient-accent text-white shadow-[0_2px_10px_rgba(8,145,178,0.3)]"
                      : active
                        ? "border-2 border-[var(--accent)] text-[var(--accent)] bg-[var(--card)]"
                        : "border-2 border-[var(--card-border)] text-[var(--muted)] bg-[var(--card)]"
                  }`}
                >
                  {done ? (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`text-[10px] mt-1.5 font-medium ${active ? "text-[var(--accent)]" : done ? "text-[var(--foreground)]" : "text-[var(--muted)]"}`}>
                  {step.short}
                </span>
              </div>

              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-[2px] mx-2 mt-[-16px] rounded-full overflow-hidden bg-[var(--card-border)]">
                  <div
                    className="h-full gradient-accent transition-all duration-700 ease-out"
                    style={{ width: done ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="animate-fade-in-up delay-3">
        {currentStep === 0 && (
          <StepCard
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="3" />
                <path d="M12 12h.01" />
                <path d="M7 12h.01" />
                <path d="M17 12h.01" />
              </svg>
            }
            title="Connect Your Wallet"
            description="Link your Initia wallet to get started. Supports Initia Wallet, Keplr, and more."
          >
            <button
              onClick={openConnect}
              className="btn-press btn-shimmer gradient-primary text-white px-8 py-3 rounded-xl font-semibold shadow-[0_4px_16px_rgba(8,145,178,0.3)] hover:shadow-[0_8px_28px_rgba(8,145,178,0.4)] hover:scale-105 transition-all duration-300"
            >
              Connect Wallet
            </button>
          </StepCard>
        )}

        {currentStep === 1 && (
          <StepCard
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v6m0 0l3-3m-3 3L9 5" />
                <path d="M2 12h6m0 0L5 9m3 3l-3 3" />
                <circle cx="12" cy="12" r="3" />
                <path d="M12 19a7 7 0 100-14" />
              </svg>
            }
            title="Get GAS Tokens"
            description="You need GAS tokens to create your profile and pay for transactions. Tap the button to receive free tokens from the faucet."
            badge={balance !== null ? `Balance: ${balance} GAS` : undefined}
          >
            <button
              onClick={handleFaucet}
              disabled={faucetLoading}
              className="btn-press btn-shimmer gradient-primary text-white px-8 py-3 rounded-xl font-semibold shadow-[0_4px_16px_rgba(8,145,178,0.3)] hover:shadow-[0_8px_28px_rgba(8,145,178,0.4)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
            >
              {faucetLoading ? (
                <span className="flex items-center gap-2">
                  <span className="spinner !w-4 !h-4 !border-2 !border-white/30 !border-t-white" />
                  Requesting...
                </span>
              ) : (
                "Get Free GAS"
              )}
            </button>
            <p className="text-xs text-[var(--muted)] mt-3">
              Connected: {initiaAddress?.slice(0, 12)}...{initiaAddress?.slice(-4)}
            </p>
          </StepCard>
        )}

        {currentStep === 2 && (
          <StepCard
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            }
            title="Register Your .init Username"
            description="Your username becomes your profile URL. Register one on the Initia testnet, then come back here."
          >
            <a
              href="https://app.testnet.initia.xyz/usernames"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press btn-shimmer gradient-primary text-white px-8 py-3 rounded-xl font-semibold shadow-[0_4px_16px_rgba(8,145,178,0.3)] hover:shadow-[0_8px_28px_rgba(8,145,178,0.4)] hover:scale-105 transition-all duration-300 inline-block"
            >
              Register Username
            </a>
            <p className="text-xs text-[var(--muted)] mt-3">
              After registering, refresh this page
            </p>
          </StepCard>
        )}

      </div>
    </div>
  );
}

// ── Step Card Component ──

function StepCard({
  icon,
  title,
  description,
  badge,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 sm:p-8 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
      <div className="w-14 h-14 rounded-2xl gradient-accent text-white flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-[var(--foreground)] font-heading mb-2">{title}</h2>
      <p className="text-sm text-[var(--muted)] mb-6 max-w-sm mx-auto">{description}</p>
      {badge && (
        <div className="inline-block bg-[var(--surface)] border border-[var(--card-border)] rounded-full px-3 py-1 text-xs font-medium text-[var(--foreground)] mb-4">
          {badge}
        </div>
      )}
      {children}
    </div>
  );
}
