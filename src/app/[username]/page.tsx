import { Metadata } from "next";
import { resolveUsernameToAddress } from "@/lib/username";
import { getProfile, formatEther } from "@/lib/contract";
import LinkButton from "@/components/LinkButton";
import TipButton from "@/components/TipButton";
import FollowButton from "@/components/FollowButton";
import type { Address } from "viem";

type Props = {
  params: Promise<{ username: string }>;
};

async function resolveAddress(username: string): Promise<Address | null> {
  if (username.startsWith("0x") && username.length === 42) {
    return username as Address;
  }
  return (await resolveUsernameToAddress(username)) as Address | null;
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
    return {
      title: `${decoded} | InitiaLink`,
      description: profile.bio || `Check out ${decoded} on InitiaLink`,
      openGraph: {
        title: `${decoded} | InitiaLink`,
        description: profile.bio || `Check out ${decoded} on InitiaLink`,
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
      <div className="text-center py-16">
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
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-2 text-[var(--foreground)]">Error Loading Profile</h1>
        <p className="text-[var(--muted)]">Could not fetch profile data. Make sure the appchain is running.</p>
      </div>
    );
  }

  if (!profile.exists) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-2 text-[var(--foreground)]">No Profile</h1>
        <p className="text-[var(--muted)]">This address has not created a profile yet.</p>
      </div>
    );
  }

  const createdDate = new Date(Number(profile.createdAt) * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="max-w-sm mx-auto text-center py-8">
      {profile.avatarUrl ? (
        <img
          src={profile.avatarUrl}
          alt={decoded}
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow-[0_4px_20px_rgba(244,114,182,0.3)]"
        />
      ) : (
        <div className="w-24 h-24 rounded-full gradient-accent mx-auto mb-4 shadow-[0_4px_20px_rgba(244,114,182,0.3)]"></div>
      )}

      <h1 className="text-2xl font-bold text-[var(--foreground)]">{decoded}</h1>

      <div className="flex justify-center gap-4 text-sm mt-1 mb-4">
        <span><b className="text-[var(--foreground)]">{profile.followerCount.toString()}</b> <span className="text-[var(--muted)]">followers</span></span>
        <span><b className="text-[var(--foreground)]">{profile.followingCount.toString()}</b> <span className="text-[var(--muted)]">following</span></span>
      </div>

      {profile.bio && (
        <p className="text-[#666] mb-6">{profile.bio}</p>
      )}

      <div className="flex flex-col gap-3 mb-6">
        {profile.links.map((url, i) => (
          <LinkButton key={i} url={url} label={profile.linkLabels[i] || url} index={i} />
        ))}
      </div>

      <div className="flex justify-center gap-3 mb-6">
        <TipButton profileOwner={address} />
        <FollowButton profileOwner={address} initialFollowing={false} />
      </div>

      <div className="text-xs text-[var(--muted)] space-y-1">
        <p>On-chain since {createdDate}</p>
        <p>{formatEther(profile.totalTips)} INIT received ({profile.tipCount.toString()} tips)</p>
      </div>
    </div>
  );
}
