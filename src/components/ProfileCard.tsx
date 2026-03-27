"use client";

import { type Profile, formatEther } from "@/lib/contract";
import type { Address } from "viem";

type Props = {
  address: Address;
  profile: Profile;
  username?: string;
};

export default function ProfileCard({ address, profile, username }: Props) {
  const displayName = username || `${address.slice(0, 6)}...${address.slice(-4)}`;
  const href = username ? `/${username}` : `/${address}`;

  return (
    <a
      href={href}
      className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5 hover:border-[var(--accent)] transition-colors block"
    >
      <div className="flex items-center gap-3 mb-3">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={displayName}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center text-lg font-bold">
            {displayName[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <h3 className="font-semibold">{displayName}</h3>
          <p className="text-xs text-[var(--muted)]">
            {profile.followerCount.toString()} followers
          </p>
        </div>
      </div>
      {profile.bio && (
        <p className="text-sm text-[var(--muted)] line-clamp-2">{profile.bio}</p>
      )}
      <div className="flex gap-4 mt-3 text-xs text-[var(--muted)]">
        <span>{profile.links.length} links</span>
        <span>{formatEther(profile.totalTips)} INIT tipped</span>
      </div>
    </a>
  );
}
