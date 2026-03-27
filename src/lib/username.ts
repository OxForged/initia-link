import { L1_REST_URL, USERNAME_MODULE_ADDRESS } from "./constants";

/**
 * Resolve a .init username to an address via L1 REST API.
 * Uses base64-encoded args as required by the Move view function endpoint.
 */
export async function resolveUsernameToAddress(username: string): Promise<string | null> {
  const name = username.replace(/\.init$/, "");

  try {
    // Move view function args must be base64-encoded JSON strings
    const encoded = btoa(name);
    const res = await fetch(
      `${L1_REST_URL}/initia/move/v1/accounts/${USERNAME_MODULE_ADDRESS}/modules/usernames/view_functions/get_address_from_name`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          args: [encoded],
          type_args: [],
        }),
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    if (data.data) {
      const addr = JSON.parse(data.data);
      return addr;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Reverse lookup: resolve an initia address to its .init username.
 */
export async function resolveAddressToUsername(initiaAddress: string): Promise<string | null> {
  try {
    const encoded = btoa(initiaAddress);
    const res = await fetch(
      `${L1_REST_URL}/initia/move/v1/accounts/${USERNAME_MODULE_ADDRESS}/modules/usernames/view_functions/get_name_from_address`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          args: [encoded],
          type_args: [],
        }),
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    if (data.data) {
      return JSON.parse(data.data);
    }
    return null;
  } catch {
    return null;
  }
}
