import { L1_REST_URL, USERNAME_MODULE_ADDRESS } from "./constants";

const VIEW_URL = `${L1_REST_URL}/initia/move/v1/accounts/${USERNAME_MODULE_ADDRESS}/modules/usernames/view_functions`;

/**
 * BCS-encode a Move String: ULEB128(length) + UTF-8 bytes, then base64.
 */
function bcsEncodeString(str: string): string {
  const utf8 = new TextEncoder().encode(str);
  // ULEB128 encode the length
  const lenBytes: number[] = [];
  let len = utf8.length;
  do {
    let byte = len & 0x7f;
    len >>= 7;
    if (len > 0) byte |= 0x80;
    lenBytes.push(byte);
  } while (len > 0);
  const bcs = new Uint8Array(lenBytes.length + utf8.length);
  bcs.set(lenBytes, 0);
  bcs.set(utf8, lenBytes.length);
  return btoa(String.fromCharCode(...bcs));
}

/**
 * BCS-encode a Move address from a hex EVM address:
 * 20-byte address left-padded to 32 bytes, then base64.
 */
function bcsEncodeAddress(hexAddr: string): string {
  const hex = hexAddr.replace(/^0x/, "").toLowerCase();
  const bytes = new Uint8Array(32); // 32 bytes, pre-filled with zeros
  const addrBytes = hex.match(/.{2}/g)!.map((b) => parseInt(b, 16));
  bytes.set(addrBytes, 12); // left-pad: 12 zero bytes + 20 address bytes
  return btoa(String.fromCharCode(...bytes));
}

/**
 * Resolve a .init username to an EVM hex address via L1 Move view function.
 */
export async function resolveUsernameToAddress(username: string): Promise<string | null> {
  const name = username.replace(/\.init$/, "");

  try {
    const res = await fetch(`${VIEW_URL}/get_address_from_name`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ args: [bcsEncodeString(name)], type_args: [] }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data.data) return JSON.parse(data.data);
    return null;
  } catch {
    return null;
  }
}

/**
 * Reverse lookup: resolve an EVM hex address to its .init username.
 */
export async function resolveAddressToUsername(hexAddress: string): Promise<string | null> {
  try {
    const res = await fetch(`${VIEW_URL}/get_name_from_address`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ args: [bcsEncodeAddress(hexAddress)], type_args: [] }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data.data) return JSON.parse(data.data);
    return null;
  } catch {
    return null;
  }
}
