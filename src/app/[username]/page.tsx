import { Metadata } from "next";
import { AccAddress } from "@initia/initia.js";
import { resolveUsernameToAddress, resolveAddressToUsername } from "@/lib/username";
import { getProfile, formatGas } from "@/lib/contract";
import LinkButton from "@/components/LinkButton";
import TipButton from "@/components/TipButton";
import FollowButton from "@/components/FollowButton";
import EditProfileButton from "@/components/EditProfileButton";
import ShareButton from "@/components/ShareButton";
import QRButton from "@/components/QRButton";
import L1IdentityCard from "@/components/L1Identity";
import FollowStats from "@/components/FollowStats";
import ThemedProfileWrapper from "@/components/ThemedProfileWrapper";
import { parseBioTheme, getThemeById } from "@/lib/themes";
type Props = {
  params: Promise<{ username: string }>;
};

function isHexAddress(s: string): boolean {
  return s.startsWith("0x") && s.length === 42;
}

function hexToBech32(hex: string): string {
  try {
    return AccAddress.fromHex(hex.replace("0x", ""));
  } catch {
    return "";
  }
}

async function resolveAddress(username: string): Promise<string | null> {
  if (isHexAddress(username)) {
    return username;
  }
  return await resolveUsernameToAddress(username).catch(() => null);
}

async function resolveDisplayName(decoded: string, address: string): Promise<string> {
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
    const { cleanBio } = parseBioTheme(profile.bio);
    return {
      title: `${displayName} | InitiaLink`,
      description: cleanBio || `Check out ${displayName} on InitiaLink`,
      openGraph: {
        title: `${displayName} | InitiaLink`,
        description: cleanBio || `Check out ${displayName} on InitiaLink`,
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
  const { cleanBio, themeId } = parseBioTheme(profile.bio);
  const theme = getThemeById(themeId);
  const createdDate = new Date(Number(profile.createdAt) * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <ThemedProfileWrapper theme={theme}>
      <div className="max-w-sm mx-auto text-center py-4 sm:py-8 px-2 sm:px-0 relative">
        {/* Themed background orbs */}
        <div
          className="orb w-32 h-32 sm:w-48 sm:h-48 -top-10 left-1/2 -translate-x-1/2 opacity-20"
          style={{ background: `radial-gradient(circle, var(--theme-orb1), transparent)`, animation: "orbDrift1 12s ease-in-out infinite" }}
          aria-hidden="true"
        />

        {/* Avatar with themed rotating gradient ring */}
        <div className="animate-scale-in delay-0 flex justify-center mb-4">
          <div className="themed-avatar-ring">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={displayName}
                className="w-24 h-24 rounded-full object-cover select-none pointer-events-none"
                draggable="false"
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full"
                style={{ background: `linear-gradient(135deg, var(--theme-gradient-from), var(--theme-gradient-to))` }}
              />
            )}
          </div>
        </div>

        {/* Name */}
        <h1 className="animate-fade-in-up delay-1 text-xl sm:text-2xl font-bold text-[var(--foreground)] font-heading">
          {displayName}
        </h1>

        {/* Stats (clickable, opens follower/following list) */}
        <FollowStats
          profileOwner={address}
          followerCount={profile.followerCount}
          followingCount={profile.followingCount}
        />

        {/* Bio */}
        {cleanBio && (
          <p className="animate-fade-in-up delay-2 text-[#666] mb-6">{cleanBio}</p>
        )}

        {/* Links with staggered entrance */}
        <div className="flex flex-col gap-3 mb-6">
          {profile.links.map((url, i) => (
            <LinkButton key={i} url={url} label={profile.linkLabels[i] || url} index={i} themed />
          ))}
        </div>

        {/* Action buttons */}
        <div className="animate-fade-in-up delay-4 flex flex-col items-center gap-3 mb-6">
          <div className="flex flex-col sm:flex-row justify-center gap-3 w-full sm:w-auto">
            <TipButton profileOwner={address} />
            <FollowButton profileOwner={address} />
            <EditProfileButton profileOwner={address} />
          </div>
        </div>

        {/* L1 Cross-Rollup Identity */}
        <L1IdentityCard initAddress={hexToBech32(address)} />

        {/* Share + QR */}
        <div className="animate-fade-in-up delay-5 flex justify-center gap-2 mb-6">
          <ShareButton username={displayName} />
          <QRButton username={displayName} />
        </div>

        {/* Footer info */}
        <div className="animate-fade-in delay-6 text-xs text-[var(--muted)] space-y-1">
          <p>On-chain since {createdDate}</p>
          <p>{formatGas(profile.totalTips)} GAS received ({profile.tipCount} tips)</p>
        </div>
      </div>
    </ThemedProfileWrapper>
  );
}
