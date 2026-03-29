"use client";

import { useHexAddress } from "@initia/interwovenkit-react";
type Props = {
  profileOwner: string;
};

export default function EditProfileButton({ profileOwner }: Props) {
  const hexAddress = useHexAddress();

  if (!hexAddress || hexAddress.toLowerCase() !== profileOwner.toLowerCase()) return null;

  return (
    <a
      href="/edit"
      className="btn-press btn-shimmer bg-white border-2 border-[var(--card-border)] text-[#555] px-5 py-2.5 rounded-xl text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] hover:scale-105 transition-all duration-300 min-h-[44px] inline-flex items-center"
    >
      Edit Profile
    </a>
  );
}
