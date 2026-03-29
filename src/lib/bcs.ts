/**
 * BCS (Binary Canonical Serialization) encoding helpers for Move view functions and MsgExecute.
 *
 * Two variants:
 * - base64 functions (for REST API view function args)
 * - bytes functions (for MsgExecute args, converted to base64 at call site)
 */

// ========== ULEB128 helper ==========

function uleb128Encode(value: number): number[] {
  const bytes: number[] = [];
  let v = value;
  do {
    let byte = v & 0x7f;
    v >>= 7;
    if (v > 0) byte |= 0x80;
    bytes.push(byte);
  } while (v > 0);
  return bytes;
}

// ========== Bytes encoders (return Uint8Array) ==========

export function bcsStringBytes(str: string): Uint8Array {
  const utf8 = new TextEncoder().encode(str);
  const lenBytes = uleb128Encode(utf8.length);
  const result = new Uint8Array(lenBytes.length + utf8.length);
  result.set(lenBytes, 0);
  result.set(utf8, lenBytes.length);
  return result;
}

export function bcsAddressBytes(hexAddr: string): Uint8Array {
  const hex = hexAddr.replace(/^0x/, "").toLowerCase();
  const bytes = new Uint8Array(32);
  const addrBytes = hex.match(/.{2}/g)!.map((b) => parseInt(b, 16));
  // For 20-byte EVM addresses, left-pad with 12 zeros
  if (addrBytes.length === 20) {
    bytes.set(addrBytes, 12);
  } else {
    // For 32-byte Move addresses, use directly
    bytes.set(addrBytes, 32 - addrBytes.length);
  }
  return bytes;
}

export function bcsU64Bytes(n: number | bigint): Uint8Array {
  const bytes = new Uint8Array(8);
  let val = BigInt(n);
  for (let i = 0; i < 8; i++) {
    bytes[i] = Number(val & 0xffn);
    val >>= 8n;
  }
  return bytes;
}

export function bcsBoolBytes(b: boolean): Uint8Array {
  return new Uint8Array([b ? 1 : 0]);
}

export function bcsVectorStringBytes(strs: string[]): Uint8Array {
  const lenBytes = uleb128Encode(strs.length);
  const encoded = strs.map(bcsStringBytes);
  const totalLen = lenBytes.length + encoded.reduce((sum, b) => sum + b.length, 0);
  const result = new Uint8Array(totalLen);
  let offset = 0;
  result.set(lenBytes, offset);
  offset += lenBytes.length;
  for (const b of encoded) {
    result.set(b, offset);
    offset += b.length;
  }
  return result;
}

// ========== Base64 encoders (for REST API view function calls) ==========

function toBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

export function bcsEncodeString(str: string): string {
  return toBase64(bcsStringBytes(str));
}

export function bcsEncodeAddress(hexAddr: string): string {
  return toBase64(bcsAddressBytes(hexAddr));
}

export function bcsEncodeU64(n: number | bigint): string {
  return toBase64(bcsU64Bytes(n));
}

export function bcsEncodeBool(b: boolean): string {
  return toBase64(bcsBoolBytes(b));
}

// ========== Arg-to-base64 for MsgExecute ==========

export function bytesToBase64(bytes: Uint8Array): string {
  return toBase64(bytes);
}
