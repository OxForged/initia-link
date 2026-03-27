export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

export const CHAIN_CONFIG = {
  chainId: process.env.NEXT_PUBLIC_EVM_CHAIN_ID || "2274399553167629",
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "http://localhost:8545",
  chainName: "InitiaLink Appchain",
  nativeCurrency: {
    name: "INIT",
    symbol: "INIT",
    decimals: 18,
  },
};

export const L1_REST_URL = process.env.NEXT_PUBLIC_L1_REST_URL || "https://rest.testnet.initia.xyz";

export const USERNAME_MODULE_ADDRESS = "0x42cd8467b1c86e59bf319e5664a09b6b5840bb3fac64f5ce690b5041c530565a";
