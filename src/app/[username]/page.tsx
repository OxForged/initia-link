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
import Avatar from "@/components/Avatar";
import { parseBioTheme, resolveTheme } from "@/lib/themes";
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
    return { title: "Profile Not Found | initiaLink" };
  }

  try {
    const profile = await getProfile(address);
    if (!profile.exists) {
      return { title: "Profile Not Found | initiaLink" };
    }
    const displayName = await resolveDisplayName(decoded, address);
    const { cleanBio } = parseBioTheme(profile.bio);
    return {
      title: `${displayName} | initiaLink`,
      description: cleanBio || `Check out ${displayName} on initiaLink`,
      openGraph: {
        title: `${displayName} | initiaLink`,
        description: cleanBio || `Check out ${displayName} on initiaLink`,
        ...(profile.avatarUrl ? { images: [profile.avatarUrl] } : {}),
      },
    };
  } catch {
    return { title: `${decoded} | initiaLink` };
  }
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const decoded = decodeURIComponent(username);
  const address = await resolveAddress(decoded);

  if (!address) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <h1 className="font-heading text-2xl mb-2 text-[var(--foreground)]" style={{ fontWeight: 900 }}>Profile Not Found</h1>
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
        <h1 className="font-heading text-2xl mb-2 text-[var(--foreground)]" style={{ fontWeight: 900 }}>Error Loading Profile</h1>
        <p className="text-[var(--muted)]">Could not fetch profile data. Make sure the appchain is running.</p>
      </div>
    );
  }

  if (!profile.exists) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <h1 className="font-heading text-2xl mb-2 text-[var(--foreground)]" style={{ fontWeight: 900 }}>No Profile</h1>
        <p className="text-[var(--muted)]">This address has not created a profile yet.</p>
      </div>
    );
  }

  const displayName = await resolveDisplayName(decoded, address);
  const { cleanBio, themeId, customColors } = parseBioTheme(profile.bio);
  const theme = resolveTheme(themeId, customColors);
  const createdDate = new Date(Number(profile.createdAt) * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <ThemedProfileWrapper theme={theme}>
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Unified profile block */}
        <div className="profile-block rounded-2xl overflow-visible" style={{ border: '2px solid var(--foreground)', boxShadow: '8px 8px 0 var(--foreground)' }}>

          {/* === BANNER (avatar only) === */}
          <div
            className="relative rounded-t-2xl overflow-hidden text-center"
            style={{
              padding: '32px 24px 20px',
              background: `linear-gradient(165deg, var(--theme-gradient-from, #0891b2) 0%, var(--theme-gradient-to, #8b5cf6) 100%)`,
            }}
          >
            {/* Mesh overlay — static, no infinite animation */}
            <div
              className="absolute inset-0 z-[1] pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 80% 50% at 20% 40%, rgba(6,182,212,0.3) 0%, transparent 70%), radial-gradient(ellipse 60% 60% at 85% 15%, rgba(139,92,246,0.35) 0%, transparent 70%)`,
              }}
            />

            {/* Avatar only in banner */}
            <div className="relative z-10">
              <div className="animate-scale-in" style={{ display: 'inline-block' }}>
                <div style={{
                  borderRadius: '50%',
                  border: '3px solid white',
                  boxShadow: '4px 4px 0 rgba(0,0,0,0.25)',
                  display: 'inline-flex',
                  padding: '3px',
                  background: `linear-gradient(135deg, ${theme.gradient[0]}, ${theme.gradient[1]})`,
                }}>
                  <Avatar
                    src={profile.avatarUrl}
                    initial={(displayName.replace(/\.init$/, "")[0] || "?").toUpperCase()}
                    size={96}
                    gradient={theme.gradient}
                    alt={displayName}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* === IDENTITY SECTION === */}
          <div className="bg-[var(--card)] text-center" style={{ padding: '16px 24px 20px', borderTop: '2px solid var(--foreground)' }}>
            <h1
              className="animate-fade-in-up delay-1 font-heading text-[var(--foreground)]"
              style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-0.025em' }}
            >
              {displayName}
            </h1>

            {cleanBio && (
              <p className="animate-fade-in-up delay-1 font-heading text-[var(--muted)] max-w-xs mx-auto mt-2" style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.6, fontStyle: 'italic' }}>{cleanBio}</p>
            )}

            <div className="mx-auto mt-4 mb-3" style={{ width: 40, height: 2, borderRadius: 1, background: 'linear-gradient(90deg, var(--theme-gradient-from, #0891b2), var(--theme-gradient-to, #8b5cf6))' }} />

            <div>
              <FollowStats
                profileOwner={address}
                followerCount={profile.followerCount}
                followingCount={profile.followingCount}
              />
            </div>

            {/* Action buttons — fizz style */}
            <div className="flex justify-center gap-2 mt-4 flex-wrap">
              <TipButton profileOwner={address} />
              <FollowButton profileOwner={address} />
              <EditProfileButton profileOwner={address} />
            </div>
          </div>

          {/* === LINKS SECTION === */}
          {profile.links.length > 0 && (
            <div className="bg-[var(--card)]" style={{ padding: '16px 20px', borderTop: '2px solid var(--foreground)' }}>
              <div
                className="font-heading"
                style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '10px' }}
              >
                Links
              </div>
              <div className="flex flex-col gap-2">
                {profile.links.map((url, i) => (
                  <LinkButton key={i} url={url} label={profile.linkLabels[i] || url} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* === ON-CHAIN + L1 IDENTITY SECTION === */}
          <div className="bg-[var(--card)]" style={{ padding: '16px 20px', borderTop: '2px solid var(--foreground)' }}>
            <div
              className="font-heading"
              style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '10px' }}
            >
              On-chain
            </div>
            <div className="flex gap-2 mb-3">
              <div
                className="flex-1 text-center"
                style={{
                  padding: '10px 8px',
                  border: '2px solid var(--foreground)',
                  borderRadius: '12px',
                  boxShadow: '3px 3px 0 var(--foreground)',
                  background: 'rgba(8,145,178,0.05)',
                }}
              >
                <div className="font-heading" style={{ fontSize: '18px', fontWeight: 900, color: '#0891b2' }}>{formatGas(profile.totalTips)}</div>
                <div className="font-heading" style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>GAS received</div>
              </div>
              <div
                className="flex-1 text-center"
                style={{
                  padding: '10px 8px',
                  border: '2px solid var(--foreground)',
                  borderRadius: '12px',
                  boxShadow: '3px 3px 0 var(--foreground)',
                  background: 'rgba(139,92,246,0.05)',
                }}
              >
                <div className="font-heading" style={{ fontSize: '18px', fontWeight: 900, color: '#8b5cf6' }}>{profile.tipCount.toString()}</div>
                <div className="font-heading" style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>Tips</div>
              </div>
            </div>
            <L1IdentityCard initAddress={hexToBech32(address)} variant="compact" />
          </div>

          {/* === FOOTER BAR === */}
          <div
            className="bg-[var(--card)] flex items-center justify-between"
            style={{ padding: '10px 20px', borderRadius: '0 0 24px 24px', borderTop: '2px solid var(--foreground)' }}
          >
            <div
              className="font-heading"
              style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted)', fontStyle: 'italic' }}
            >
              On-chain since {createdDate}
            </div>
            <div className="flex gap-1.5">
              <ShareButton username={displayName} variant="compact" />
              <QRButton username={displayName} variant="compact" />
            </div>
          </div>

        </div>
      </div>
    </ThemedProfileWrapper>
  );
}
