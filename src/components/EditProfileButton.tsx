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
      className="btn-fizz btn-fizz-ghost font-heading inline-flex items-center"
      style={isHero ? {} : { fontSize: "13px", padding: "10px 18px" }}
    >
      Edit Profile
    </a>
  );
}
