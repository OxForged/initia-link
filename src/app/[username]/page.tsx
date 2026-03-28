import { Metadata } from "next";
import { resolveUsernameToAddress, resolveAddressToUsername } from "@/lib/username";
import { getProfile, formatEther } from "@/lib/contract";
import LinkButton from "@/components/LinkButton";
import TipButton from "@/components/TipButton";
import FollowButton from "@/components/FollowButton";
import type { Address } from "viem";

type Props = {
  params: Promise<{ username: string }>;
};

function isHexAddress(s: string): boolean {
  return s.startsWith("0x") && s.length === 42;
}

async function resolveAddress(username: string): Promise<Address | null> {
  if (isHexAddress(username)) {
    return username as Address;
  }
  return (await resolveUsernameToAddress(username)) as Address | null;
}

async function resolveDisplayName(decoded: string, address: Address): Promise<string> {
  if (!isHexAddress(decoded)) return decoded;
  try {
    const name = await resolveAddressToUsername(address);
    if (name) return `${name}.init`;
  } catch {}
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const decoded = decodeURIComponent(username);
  const address = await resolveAddress(decoded);

  if (!address) {
    return { title: "Profile Not Found | InitiaLink" };
  }

  try {
    const profile = await getProfile(address);
    if (!profile.exists) {
      return { title: "Profile Not Found | InitiaLink" };
    }
    const displayName = await resolveDisplayName(decoded, address);
    return {
      title: `${displayName} | InitiaLink`,
      description: profile.bio || `Check out ${displayName} on InitiaLink`,
      openGraph: {
        title: `${displayName} | InitiaLink`,
        description: profile.bio || `Check out ${displayName} on InitiaLink`,
        ...(profile.avatarUrl ? { images: [profile.avatarUrl] } : {}),
      },
    };
  } catch {
    return { title: `${decoded} | InitiaLink` };
  }
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const decoded = decodeURIComponent(username);
  const address = await resolveAddress(decoded);

  if (!address) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <h1 className="text-2xl font-bold mb-2 text-[var(--foreground)]">Profile Not Found</h1>
        <p className="text-[var(--muted)]">Could not resolve &quot;{decoded}&quot; to an address.</p>
      </div>
    );
  }

  let profile;
  try {
    profile = await getProfile(address);
  } catch {
    return (
      <div className="text-center py-16 animate-fade-in">
        <h1 className="text-2xl font-bold mb-2 text-[var(--foreground)]">Error Loading Profile</h1>
        <p className="text-[var(--muted)]">Could not fetch profile data. Make sure the appchain is running.</p>
      </div>
    );
  }

  if (!profile.exists) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <h1 className="text-2xl font-bold mb-2 text-[var(--foreground)]">No Profile</h1>
        <p className="text-[var(--muted)]">This address has not created a profile yet.</p>
      </div>
    );
  }

  const displayName = await resolveDisplayName(decoded, address);
  const createdDate = new Date(Number(profile.createdAt) * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="max-w-sm mx-auto text-center py-8 relative">
      {/* Subtle background orb */}
      <div className="orb orb-pink w-48 h-48 -top-10 left-1/2 -translate-x-1/2 opacity-20" aria-hidden="true" />

      {/* Avatar with rotating gradient ring */}
      <div className="animate-scale-in delay-0 flex justify-center mb-4">
        <div className="avatar-ring-gradient">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={displayName}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full gradient-animated" />
          )}
        </div>
      </div>

      {/* Name */}
      <h1
        className="animate-fade-in-up delay-1 text-2xl font-bold text-[var(--foreground)] font-heading"
      >
        {displayName}
      </h1>

      {/* Stats */}
      <div className="animate-fade-in-up delay-2 flex justify-center gap-4 text-sm mt-1 mb-4">
        <span><b className="text-[var(--foreground)]">{profile.followerCount.toString()}</b> <span className="text-[var(--muted)]">followers</span></span>
        <span><b className="text-[var(--foreground)]">{profile.followingCount.toString()}</b> <span className="text-[var(--muted)]">following</span></span>
      </div>

      {/* Bio */}
      {profile.bio && (
        <p className="animate-fade-in-up delay-2 text-[#666] mb-6">{profile.bio}</p>
      )}

      {/* Links with staggered entrance */}
      <div className="flex flex-col gap-3 mb-6">
        {profile.links.map((url, i) => (
          <LinkButton key={i} url={url} label={profile.linkLabels[i] || url} index={i} />
        ))}
      </div>

      {/* Action buttons */}
      <div className="animate-fade-in-up delay-4 flex flex-col items-center gap-3 mb-6">
        <div className="flex justify-center gap-3">
          <TipButton profileOwner={address} />
          <FollowButton profileOwner={address} initialFollowing={false} />
        </div>
      </div>

      {/* Footer info */}
      <div className="animate-fade-in delay-5 text-xs text-[var(--muted)] space-y-1">
        <p>On-chain since {createdDate}</p>
        <p>{formatEther(profile.totalTips)} INIT received ({profile.tipCount.toString()} tips)</p>
      </div>
    </div>
  );
}
