import { createWalletClient, createPublicClient, http, defineChain } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { readFileSync } from "fs";
import { resolve } from "path";

const chain = defineChain({
  id: 2274399553167629,
  name: "InitiaLink Appchain",
  nativeCurrency: { name: "INIT", symbol: "INIT", decimals: 18 },
  rpcUrls: { default: { http: ["http://localhost:8545"] } },
});

const account = privateKeyToAccount(process.env.DEPLOYER_PRIVATE_KEY);

const walletClient = createWalletClient({
  account,
  chain,
  transport: http(),
});

const publicClient = createPublicClient({
  chain,
  transport: http(),
});

const artifact = JSON.parse(
  readFileSync(resolve("artifacts/contracts/ProfileRegistry.sol/ProfileRegistry.json"), "utf-8")
);

const hash = await walletClient.deployContract({
  abi: artifact.abi,
  bytecode: artifact.bytecode,
});

console.log(`Deploy tx: ${hash}`);

const receipt = await publicClient.waitForTransactionReceipt({ hash });
console.log(`ProfileRegistry deployed to: ${receipt.contractAddress}`);
