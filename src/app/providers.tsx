"use client";

import { PropsWithChildren, useEffect } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  initiaPrivyWalletConnector,
  injectStyles,
  InterwovenKitProvider,
  TESTNET,
} from "@initia/interwovenkit-react";
import interwovenKitStyles from "@initia/interwovenkit-react/styles.js";
import { APPCHAIN_ID } from "@/lib/constants";
import { Toaster } from "sonner";

const COSMOS_RPC = process.env.NEXT_PUBLIC_COSMOS_RPC || "http://localhost:26657";
const COSMOS_REST = process.env.NEXT_PUBLIC_COSMOS_REST || "http://localhost:1317";

const wagmiConfig = createConfig({
  connectors: [initiaPrivyWalletConnector],
  chains: [mainnet],
  transports: { [mainnet.id]: http() },
});

const queryClient = new QueryClient();

const customChain = {
  chain_id: APPCHAIN_ID,
  chain_name: "InitiaLink",
  pretty_name: "InitiaLink Appchain",
  network_type: "testnet",
  bech32_prefix: "init",
  apis: {
    rpc: [{ address: COSMOS_RPC }],
    rest: [{ address: COSMOS_REST }],
    indexer: [{ address: COSMOS_REST }],
  },
  fees: {
    fee_tokens: [
      {
        denom: "GAS",
        fixed_min_gas_price: 0,
      },
    ],
  },
  metadata: {
    is_l1: false,
    minitia: {
      type: "minimove",
      l1: { chain_id: "initiation-2" },
    },
  },
};

export default function Providers({ children }: PropsWithChildren) {
  useEffect(() => {
    injectStyles(interwovenKitStyles);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <InterwovenKitProvider {...TESTNET} customChain={customChain} enableAutoSign={{ [APPCHAIN_ID]: ["/initia.move.v1.MsgExecute"] }}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: "var(--font-body), system-ui, sans-serif",
              },
            }}
            richColors
            closeButton
          />
        </InterwovenKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
