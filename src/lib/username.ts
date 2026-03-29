import { L1_REST_URL, USERNAME_MODULE_ADDRESS } from "./constants";
import { bcsEncodeString, bcsEncodeAddress } from "./bcs";

const VIEW_URL = `${L1_REST_URL}/initia/move/v1/accounts/${USERNAME_MODULE_ADDRESS}/modules/usernames/view_functions`;

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
