import { MODULE_ADDRESS, MODULE_NAME, REST_URL } from "./constants";
import { bcsEncodeAddress, bcsEncodeU64 } from "./bcs";

const VIEW_URL = `${REST_URL}/initia/move/v1/accounts/${MODULE_ADDRESS}/modules/${MODULE_NAME}/view_functions`;

async function viewFunction(fnName: string, args: string[] = []): Promise<string> {
  // In browser, use API proxy to avoid mixed content (HTTPS -> HTTP)
  if (typeof window !== "undefined") {
    const res = await fetch("/api/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fnName, args }),
    });
    if (!res.ok) {
      throw new Error(`View function ${fnName} failed: ${res.status}`);
    }
    const json = await res.json();
    return json.data;
  }

  // Server-side: direct call
  const res = await fetch(`${VIEW_URL}/${fnName}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type_args: [], args }),
  });
  if (!res.ok) {
    throw new Error(`View function ${fnName} failed: ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}

// ========== Types ==========

export type Profile = {
  owner: string;
  bio: string;
  avatarUrl: string;
  links: string[];
  linkLabels: string[];
  totalTips: number;
  tipCount: number;
  followerCount: number;
  followingCount: number;
  createdAt: number;
  exists: boolean;
};

export type TipEvent = {
  from: string;
  to: string;
  amount: number;
  timestamp: number;
};

// ========== Parsers ==========

function parseProfile(data: string): Profile {
  const raw = JSON.parse(data);
  return {
    owner: raw.owner,
    bio: raw.bio,
    avatarUrl: raw.avatar_url,
    links: raw.links || [],
    linkLabels: raw.link_labels || [],
    totalTips: Number(raw.total_tips),
    tipCount: Number(raw.tip_count),
    followerCount: Number(raw.follower_count),
    followingCount: Number(raw.following_count),
    createdAt: Number(raw.created_at),
    exists: raw.exists,
  };
}

function parseTipRecords(data: string): TipEvent[] {
  const raw: Array<{ from: string; to: string; amount: string; timestamp: string }> = JSON.parse(data);
  return raw.map((r) => ({
    from: r.from,
    to: r.to,
    amount: Number(r.amount),
    timestamp: Number(r.timestamp),
  }));
}

// ========== Read functions ==========

export async function getProfile(address: string): Promise<Profile> {
  const data = await viewFunction("get_profile", [bcsEncodeAddress(address)]);
  return parseProfile(data);
}

export async function getRecentProfiles(offset: number, limit: number): Promise<string[]> {
  const data = await viewFunction("get_recent_profiles", [
    bcsEncodeU64(offset),
    bcsEncodeU64(limit),
  ]);
  return JSON.parse(data) as string[];
}

export async function getTotalProfiles(): Promise<number> {
  const data = await viewFunction("total_profiles");
  return Number(JSON.parse(data));
}

export async function isFollowing(follower: string, followed: string): Promise<boolean> {
  const data = await viewFunction("is_following", [
    bcsEncodeAddress(follower),
    bcsEncodeAddress(followed),
  ]);
  return JSON.parse(data) as boolean;
}

export async function getFollowers(address: string, offset: number, limit: number): Promise<string[]> {
  const data = await viewFunction("get_followers", [
    bcsEncodeAddress(address),
    bcsEncodeU64(offset),
    bcsEncodeU64(limit),
  ]);
  return JSON.parse(data) as string[];
}

export async function getFollowing(address: string, offset: number, limit: number): Promise<string[]> {
  const data = await viewFunction("get_following", [
    bcsEncodeAddress(address),
    bcsEncodeU64(offset),
    bcsEncodeU64(limit),
  ]);
  return JSON.parse(data) as string[];
}

export async function getTipsReceived(address: string): Promise<TipEvent[]> {
  try {
    const data = await viewFunction("get_tips_received", [
      bcsEncodeAddress(address),
      bcsEncodeU64(0),
      bcsEncodeU64(20),
    ]);
    return parseTipRecords(data);
  } catch {
    return [];
  }
}

// ========== Formatting helpers ==========

export function formatGas(amount: number | bigint): string {
  return String(amount);
}

export function parseGas(amount: string): number {
  return Math.floor(Number(amount));
}
