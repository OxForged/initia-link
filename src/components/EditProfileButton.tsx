"use client";

import { useHexAddress } from "@initia/interwovenkit-react";
type Props = {
  profileOwner: string;
  variant?: "default" | "hero";
};

export default function EditProfileButton({ profileOwner, variant = "default" }: Props) {
  const hexAddress = useHexAddress();

  if (!hexAddress || hexAddress.toLowerCase() !== profileOwner.toLowerCase()) return null;

  const isHero = variant === "hero";

  return (
    <a
      href="/edit"
      className={`btn-press px-5 py-2.5 rounded-xl text-sm font-semibold min-h-[44px] inline-flex items-center ${
        isHero
          ? "btn-hero-solid"
          : "btn-shimmer bg-[var(--card)] border-2 border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:scale-105 transition-all duration-300"
      }`}
    >
      Edit Profile
    </a>
  );
}
