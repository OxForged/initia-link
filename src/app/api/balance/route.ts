import { NextRequest, NextResponse } from "next/server";
import { REST_URL } from "@/lib/constants";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "address required" }, { status: 400 });
  }
  try {
    const res = await fetch(`${REST_URL}/cosmos/bank/v1beta1/balances/${address}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
