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
  // If it looks like an address, use directly
  if (username.startsWith("0x") && username.length === 42) {
    return username as Address;
  }
  // Otherwise resolve .init username
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
        <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
        <p className="text-[var(--muted)]">Could not resolve "{decoded}" to an address.</p>
      </div>
    );
  }

  let profile;
  try {
    profile = await getProfile(address);
  } catch {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-2">Error Loading Profile</h1>
        <p className="text-[var(--muted)]">Could not fetch profile data. Make sure the appchain is running.</p>
      </div>
    );
  }

  if (!profile.exists) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-2">No Profile</h1>
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
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-[var(--accent)] mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
          {decoded[0]?.toUpperCase()}
        </div>
      )}

      <h1 className="text-2xl font-bold">{decoded}</h1>

      <div className="flex justify-center gap-4 text-sm text-[var(--muted)] mt-1 mb-4">
        <span>{profile.followerCount.toString()} followers</span>
        <span>{profile.followingCount.toString()} following</span>
      </div>

      {profile.bio && (
        <p className="text-[var(--muted)] mb-6">{profile.bio}</p>
      )}

      <div className="flex flex-col gap-3 mb-6">
        {profile.links.map((url, i) => (
          <LinkButton key={i} url={url} label={profile.linkLabels[i] || url} />
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
