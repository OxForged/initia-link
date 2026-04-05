"use client";

import { type Profile, formatGas } from "@/lib/contract";
import { parseBioTheme } from "@/lib/themes";

type Props = {
  address: string;
  profile: Profile;
  username?: string;
};

export default function ProfileCard({ address, profile, username }: Props) {
  const displayName = username || `${address.slice(0, 6)}...${address.slice(-4)}`;
  const href = username ? `/${username}` : `/${address}`;

  return (
    <a
      href={href}
      className="card-tilt bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] block h-full flex flex-col"
    >
      <div className="flex items-center gap-3 mb-3">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={displayName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-[var(--card-border)] select-none pointer-events-none"
            draggable="false"
          />
        ) : (
          <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center text-lg font-bold text-white ring-2 ring-white/50">
            {displayName[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-[var(--foreground)]">{displayName}</h3>
          <p className="text-xs text-[var(--muted)]">
            {profile.followerCount} followers
          </p>
        </div>
      </div>
      {profile.bio && (
        <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{parseBioTheme(profile.bio).cleanBio}</p>
      )}
      <div className="flex gap-4 mt-auto pt-3 text-xs text-[var(--muted)]">
        <span>{profile.links.length} links</span>
        <span>{formatGas(profile.totalTips)} GAS tipped</span>
      </div>
    </a>
  );
}
