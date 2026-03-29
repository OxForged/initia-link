import { NextRequest, NextResponse } from "next/server";
import { RESTClient, Wallet, MsgSend, Coin, RawKey } from "@initia/initia.js";

const REST_URL = process.env.NEXT_PUBLIC_COSMOS_REST || "http://localhost:1317";
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID || "initialink-1";
const DRIP_AMOUNT = "1000"; // 1000 GAS (0 decimals)
const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

const lastDrip = new Map<string, number>();

function getWallet() {
  const pk = process.env.FAUCET_PRIVATE_KEY;
  if (!pk) throw new Error("Faucet not configured");

  const rest = new RESTClient(REST_URL, { chainId: CHAIN_ID, gasPrices: "0GAS", gasAdjustment: "1.5" });
  const key = new RawKey(Buffer.from(pk.replace(/^0x/, ""), "hex"));
  return new Wallet(rest, key);
}

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();

    if (!address) {
      return NextResponse.json({ error: "Address required" }, { status: 400 });
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

    const wallet = getWallet();
    const sender = wallet.key.accAddress;

    const msg = new MsgSend(sender, address, [new Coin("GAS", DRIP_AMOUNT)]);
    const tx = await wallet.createAndSignTx({ msgs: [msg] });
    const result = await wallet.rest.tx.broadcast(tx);

    lastDrip.set(lower, Date.now());

    return NextResponse.json({
      hash: result.txhash,
      amount: DRIP_AMOUNT,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message.slice(0, 200) : "Faucet error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
