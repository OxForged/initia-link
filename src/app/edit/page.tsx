"use client";

import { useState, useEffect } from "react";
import { useInterwovenKit, useHexAddress } from "@initia/interwovenkit-react";
import { getProfile, type Profile } from "@/lib/contract";
import EditProfileForm from "@/components/EditProfileForm";
export default function EditPage() {
  const { isConnected, openConnect, username, initiaAddress } = useInterwovenKit();
  const hexAddress = useHexAddress();
  const account = hexAddress as string | undefined;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!account) return;
    setLoading(true);
    getProfile(account)
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [account]);

  if (!isConnected || !account) {
    return (
      <div className="text-center py-16 animate-fade-in-up">
        <h1
          className="text-3xl font-bold mb-4 text-[var(--foreground)] font-heading"
          >
          Create Your Profile
        </h1>
        <p className="text-[var(--muted)] mb-8">Connect your wallet to get started.</p>
        <button
          onClick={openConnect}
          className="btn-shimmer gradient-primary text-white px-6 py-3 rounded-xl font-semibold shadow-[0_4px_16px_rgba(8,145,178,0.3)] hover:shadow-[0_8px_28px_rgba(8,145,178,0.4)] hover:scale-105 transition-all duration-300"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (!username) {
    return (
      <div className="text-center py-16 animate-fade-in-up">
        <h1
          className="text-3xl font-bold mb-4 text-[var(--foreground)] font-heading"
          >
          Register Your .init Username
        </h1>
        <p className="text-[var(--muted)] mb-4 max-w-md mx-auto">
          You need a .init username to create your InitiaLink profile.
          Your username becomes your profile URL.
        </p>
        <p className="text-sm text-[var(--muted)] mb-8">
          Connected: {initiaAddress?.slice(0, 10)}...{initiaAddress?.slice(-4)}
        </p>
        <a
          href="https://app.testnet.initia.xyz/usernames"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-shimmer gradient-primary text-white px-6 py-3 rounded-xl font-semibold shadow-[0_4px_16px_rgba(8,145,178,0.3)] hover:shadow-[0_8px_28px_rgba(8,145,178,0.4)] hover:scale-105 transition-all duration-300 inline-block"
        >
          Register Username
        </a>
        <p className="text-xs text-[var(--muted)] mt-4">
          After registering, refresh this page.
        </p>
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
      <h1
        className="animate-fade-in-up delay-0 text-2xl font-bold mb-6 text-[var(--foreground)] font-heading"
      >
        {profile?.exists ? "Edit Profile" : "Create Profile"}
      </h1>
      <p className="animate-fade-in-up delay-1 text-sm text-[var(--muted)] mb-6">
        {username} / {initiaAddress?.slice(0, 10)}...{initiaAddress?.slice(-4)}
      </p>
      <div className="animate-fade-in-up delay-2">
        <EditProfileForm
          existingProfile={profile}
          onSaved={() => window.location.reload()}
        />
      </div>
    </div>
  );
}
