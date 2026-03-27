import { createPublicClient, http, createWalletClient, custom, formatEther, parseEther, type Address } from "viem";
import { PROFILE_REGISTRY_ABI } from "./abi";
import { CONTRACT_ADDRESS, CHAIN_CONFIG } from "./constants";

export const initiaChain = {
  id: parseInt(CHAIN_CONFIG.chainId) || 1,
  name: CHAIN_CONFIG.chainName,
  nativeCurrency: CHAIN_CONFIG.nativeCurrency,
  rpcUrls: {
    default: { http: [CHAIN_CONFIG.rpcUrl] },
  },
} as const;

export function getPublicClient() {
  return createPublicClient({
    chain: initiaChain,
    transport: http(CHAIN_CONFIG.rpcUrl),
  });
}

export function getWalletClient() {
  if (typeof window === "undefined" || !window.ethereum) return null;
  return createWalletClient({
    chain: initiaChain,
    transport: custom(window.ethereum),
  });
}

const contractConfig = {
  address: CONTRACT_ADDRESS as Address,
  abi: PROFILE_REGISTRY_ABI,
} as const;

export type Profile = {
  owner: Address;
  bio: string;
  avatarUrl: string;
  links: string[];
  linkLabels: string[];
  totalTips: bigint;
  tipCount: bigint;
  followerCount: bigint;
  followingCount: bigint;
  createdAt: bigint;
  exists: boolean;
};

// Read functions

export async function getProfile(address: Address): Promise<Profile> {
  const client = getPublicClient();
  const result = await client.readContract({
    ...contractConfig,
    functionName: "getProfile",
    args: [address],
  });
  return result as unknown as Profile;
}

export async function getRecentProfiles(offset: bigint, limit: bigint): Promise<Address[]> {
  const client = getPublicClient();
  const result = await client.readContract({
    ...contractConfig,
    functionName: "getRecentProfiles",
    args: [offset, limit],
  });
  return result as Address[];
}

export async function getTotalProfiles(): Promise<bigint> {
  const client = getPublicClient();
  return await client.readContract({
    ...contractConfig,
    functionName: "totalProfiles",
  }) as bigint;
}

export async function isFollowing(follower: Address, followed: Address): Promise<boolean> {
  const client = getPublicClient();
  return await client.readContract({
    ...contractConfig,
    functionName: "isFollowing",
    args: [follower, followed],
  }) as boolean;
}

export async function getFollowers(address: Address, offset: bigint, limit: bigint): Promise<Address[]> {
  const client = getPublicClient();
  return await client.readContract({
    ...contractConfig,
    functionName: "getFollowers",
    args: [address, offset, limit],
  }) as Address[];
}

export async function getFollowing(address: Address, offset: bigint, limit: bigint): Promise<Address[]> {
  const client = getPublicClient();
  return await client.readContract({
    ...contractConfig,
    functionName: "getFollowing",
    args: [address, offset, limit],
  }) as Address[];
}

// Write functions

export async function createProfile(account: Address, bio: string, avatarUrl: string, links: string[], linkLabels: string[]) {
  const wallet = getWalletClient();
  if (!wallet) throw new Error("No wallet connected");
  return wallet.writeContract({
    ...contractConfig,
    functionName: "createProfile",
    args: [bio, avatarUrl, links, linkLabels],
    account,
  });
}

export async function updateBio(account: Address, newBio: string) {
  const wallet = getWalletClient();
  if (!wallet) throw new Error("No wallet connected");
  return wallet.writeContract({
    ...contractConfig,
    functionName: "updateBio",
    args: [newBio],
    account,
  });
}

export async function updateAvatar(account: Address, newAvatarUrl: string) {
  const wallet = getWalletClient();
  if (!wallet) throw new Error("No wallet connected");
  return wallet.writeContract({
    ...contractConfig,
    functionName: "updateAvatar",
    args: [newAvatarUrl],
    account,
  });
}

export async function updateLinks(account: Address, links: string[], linkLabels: string[]) {
  const wallet = getWalletClient();
  if (!wallet) throw new Error("No wallet connected");
  return wallet.writeContract({
    ...contractConfig,
    functionName: "updateLinks",
    args: [links, linkLabels],
    account,
  });
}

export async function tipProfile(account: Address, profileOwner: Address, amount: string) {
  const wallet = getWalletClient();
  if (!wallet) throw new Error("No wallet connected");
  return wallet.writeContract({
    ...contractConfig,
    functionName: "tipProfile",
    args: [profileOwner],
    account,
    value: parseEther(amount),
  });
}

export async function followProfile(account: Address, profileOwner: Address) {
  const wallet = getWalletClient();
  if (!wallet) throw new Error("No wallet connected");
  return wallet.writeContract({
    ...contractConfig,
    functionName: "followProfile",
    args: [profileOwner],
    account,
  });
}

export async function unfollowProfile(account: Address, profileOwner: Address) {
  const wallet = getWalletClient();
  if (!wallet) throw new Error("No wallet connected");
  return wallet.writeContract({
    ...contractConfig,
    functionName: "unfollowProfile",
    args: [profileOwner],
    account,
  });
}

export { formatEther, parseEther };
