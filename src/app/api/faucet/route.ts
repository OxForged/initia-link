import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const COSMOS_RPC = process.env.NEXT_PUBLIC_COSMOS_RPC || "http://localhost:26657";
const DRIP_AMOUNT = "1000"; // 1000 GAS (0 decimals)
const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

const lastDrip = new Map<string, number>();

const MINITIAD = "/root/.weave/data/minimove@v1.1.11/minitiad";
const MOVE_HOME = "/root/.minitia-move";

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

    // minitiad tx bank send requires bech32 (init1...) address
    const recipient = address;

    const env = {
      ...process.env,
      LD_LIBRARY_PATH: "/root/.weave/data/minimove@v1.1.11:" + (process.env.LD_LIBRARY_PATH || ""),
    };

    const args = [
      "tx", "bank", "send",
      "deployer", recipient, `${DRIP_AMOUNT}GAS`,
      "--chain-id", "initialink-1",
      "--node", COSMOS_RPC,
      "--home", MOVE_HOME,
      "--keyring-backend", "test",
      "--gas", "auto",
      "--gas-adjustment", "1.5",
      "--gas-prices", "0GAS",
      "-y", "-o", "json",
    ];

    const { stdout } = await execFileAsync(MINITIAD, args, { env, timeout: 15000 });
    const txResult = JSON.parse(stdout);

    lastDrip.set(lower, Date.now());

    return NextResponse.json({
      hash: txResult.txhash,
      amount: DRIP_AMOUNT,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message.slice(0, 200) : "Faucet error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
