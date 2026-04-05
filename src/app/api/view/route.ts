import { NextRequest, NextResponse } from "next/server";
import { REST_URL, MODULE_ADDRESS, MODULE_NAME } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const { fnName, args } = await req.json();
    const url = `${REST_URL}/initia/move/v1/accounts/${MODULE_ADDRESS}/modules/${MODULE_NAME}/view_functions/${fnName}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type_args: [], args: args || [] }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: `View function ${fnName} failed: ${res.status}` }, { status: res.status });
    }
    const json = await res.json();
    return NextResponse.json(json);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "View function failed" }, { status: 500 });
  }
}
