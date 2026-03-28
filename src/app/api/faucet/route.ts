import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { defineChain } from "viem";
import { NextRequest, NextResponse } from "next/server";

const chain = defineChain({
  id: Number(process.env.NEXT_PUBLIC_EVM_CHAIN_ID || "2274399553167629"),
  name: "InitiaLink",
  nativeCurrency: { name: "GAS", symbol: "GAS", decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_RPC_URL || "http://localhost:8545"] },
  },
});

const DRIP_AMOUNT = "1"; // 1 GAS per request
const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour per address

const lastDrip = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }

    const pk = process.env.FAUCET_PRIVATE_KEY;
    if (!pk) {
      return NextResponse.json({ error: "Faucet not configured" }, { status: 500 });
    }

    // Rate limit
    const lower = address.toLowerCase();
    const last = lastDrip.get(lower);
    if (last && Date.now() - last < COOLDOWN_MS) {
      const remaining = Math.ceil((COOLDOWN_MS - (Date.now() - last)) / 60000);
      return NextResponse.json(
        { error: `Try again in ${remaining} minutes` },
        { status: 429 }
      );
    }

    const account = privateKeyToAccount(pk as `0x${string}`);
    const client = createWalletClient({
      account,
      chain,
      transport: http(),
    });

    const hash = await client.sendTransaction({
      to: address as `0x${string}`,
      value: parseEther(DRIP_AMOUNT),
    });

    lastDrip.set(lower, Date.now());

    return NextResponse.json({ hash, amount: DRIP_AMOUNT });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message?.slice(0, 200) || "Faucet error" },
      { status: 500 }
    );
  }
}
