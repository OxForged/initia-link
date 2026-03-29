import { L1_REST_URL } from "./constants";

export type L1Balance = {
  denom: string;
  amount: string;
};

export type L1Delegation = {
  validatorAddress: string;
  balances: { denom: string; amount: string }[];
};

export type L1Identity = {
  balances: L1Balance[];
  initBalance: number; // INIT in human-readable (divided by 1e6)
  delegations: L1Delegation[];
  totalStaked: number; // total uinit staked, in human-readable
  validatorCount: number;
};

const UINIT_DECIMALS = 6;

function uinitToInit(amount: string): number {
  return Number(amount) / 10 ** UINIT_DECIMALS;
}

/**
 * Fetch L1 bank balances for an init1... bech32 address.
 */
async function getL1Balances(initAddress: string): Promise<L1Balance[]> {
  const res = await fetch(
    `${L1_REST_URL}/cosmos/bank/v1beta1/balances/${initAddress}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.balances || []) as L1Balance[];
}

/**
 * Fetch L1 mstaking delegations for an init1... bech32 address.
 * Initia uses multi-asset staking (mstaking), not standard cosmos staking.
 */
async function getL1Delegations(initAddress: string): Promise<L1Delegation[]> {
  const res = await fetch(
    `${L1_REST_URL}/initia/mstaking/v1/delegations/${initAddress}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  const responses = data.delegation_responses || [];
  return responses.map((r: { delegation: { validator_address: string }; balance: { denom: string; amount: string }[] }) => ({
    validatorAddress: r.delegation.validator_address,
    balances: r.balance || [],
  }));
}

/**
 * Fetch full L1 identity: balances + staking info.
 * Returns null if both queries fail or return empty.
 */
export async function getL1Identity(initAddress: string): Promise<L1Identity | null> {
  try {
    const [balances, delegations] = await Promise.all([
      getL1Balances(initAddress),
      getL1Delegations(initAddress),
    ]);

    const uinitBalance = balances.find((b) => b.denom === "uinit");
    const initBalance = uinitBalance ? uinitToInit(uinitBalance.amount) : 0;

    // Sum all uinit staked across validators
    let totalStakedUinit = 0;
    for (const del of delegations) {
      const uinit = del.balances.find((b) => b.denom === "uinit");
      if (uinit) totalStakedUinit += Number(uinit.amount);
    }
    const totalStaked = totalStakedUinit / 10 ** UINIT_DECIMALS;

    const hasActivity = initBalance > 0 || delegations.length > 0 || balances.length > 0;
    if (!hasActivity) return null;

    return {
      balances,
      initBalance,
      delegations,
      totalStaked,
      validatorCount: delegations.length,
    };
  } catch {
    return null;
  }
}
