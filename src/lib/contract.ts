import { createPublicClient, http, formatEther, parseEther, type Address } from "viem";
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

// Read functions (use viem public client - these work fine via eth_call)

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

export type TipEvent = {
  from: Address;
  to: Address;
  amount: bigint;
  blockNumber: bigint;
};

export async function getTipsReceived(address: Address): Promise<TipEvent[]> {
  const client = getPublicClient();
  const logs = await client.getContractEvents({
    ...contractConfig,
    eventName: "TipReceived",
    args: { to: address },
    fromBlock: 0n,
    toBlock: "latest",
  });
  return logs.map((log) => ({
    from: (log.args as any).from as Address,
    to: (log.args as any).to as Address,
    amount: (log.args as any).amount as bigint,
    blockNumber: log.blockNumber,
  })).reverse(); // newest first
}

export { formatEther, parseEther };
