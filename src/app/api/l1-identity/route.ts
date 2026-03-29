import { NextRequest, NextResponse } from "next/server";
import { getL1Identity } from "@/lib/l1-identity";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");

  if (!address || !address.startsWith("init1")) {
    return NextResponse.json(null, { status: 400 });
  }

  const identity = await getL1Identity(address);
  if (!identity) {
    return NextResponse.json(null, { status: 404 });
  }

  return NextResponse.json(identity, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
  });
}
