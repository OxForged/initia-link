# InitiaLink

Link-in-bio, but on-chain. Your `.init` username is your profile URL.

**Track:** Gaming & Consumer (digital identity)

## What is this

InitiaLink lets you create a profile page tied to your Initia username. Add your links and bio, set an avatar. Other users can tip you (native tokens, no platform cut) and follow you. One smart contract stores everything, no backend, no database.

Visit `initialink.xyz/alice.init` and you see Alice's profile. She doesn't need to be online, and the visitor doesn't need a wallet to view it.

## Why not just use Linktree

Linktree owns your profile. They host it and charge you for premium features. If they go down or change their terms, your page disappears.

Linktree also doesn't know anything about crypto. You can't tip someone, follow them on-chain, or verify their identity through their wallet. A list of links on someone else's server.

InitiaLink stores everything in a contract on a dedicated Initia appchain. Your profile is yours. Tips go straight to your wallet, and the follow graph is on-chain too. Because it runs on its own appchain, transaction fees become app revenue.

Other alternatives and why they don't fit:
- **Bento** -- same centralized problem as Linktree, just prettier
- **ENS profiles** -- Ethereum only, no social features, no tipping
- **Lens/Farcaster** -- locked to their own ecosystems, not Initia-native

## How it works

One Solidity contract (`ProfileRegistry`) handles everything:
- Profile CRUD (bio, avatar, up to 10 labeled links)
- Tipping with reentrancy protection (min 0.001 native token, sent to the profile owner)
- Social graph (follow/unfollow, follower and following lists, paginated queries)
- Discovery feed (newest profiles on-chain, popular sorted client-side by follower count)

The server resolves `.init` usernames by calling L1 Move view functions (BCS-encoded, over REST) and renders profile pages with Open Graph meta tags. Share a link on Twitter or Discord and it shows the right preview.

## Initia integration

Three native features used:

1. **Initia Usernames (.init)** -- your username is your URL. Forward resolution (name to address) and reverse resolution (address to name) both work, so even if someone shares a raw address link, the page still shows the `.init` name.

2. **Auto-signing** -- `enableAutoSign` through InterwovenKit. Editing your profile, following someone, tipping -- no confirmation dialogs.

3. **InterwovenKit** -- wallet connection and transaction signing. Supports Initia Wallet, Keplr, MetaMask, and others. Contract writes go through Cosmos `MsgCall` via `requestTxBlock`.

## Running locally

### Prerequisites

- Node.js 18+
- An Initia MiniEVM appchain (created via `weave init`)

### 1. Start the appchain node

```bash
/root/.weave/data/minievm@v1.2.15/minitiad start --home /root/.minitia &
```

Wait a few seconds for blocks to start producing. Verify with:

```bash
curl -s http://localhost:8545 -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
```

You should see `"result":"0x8148de971a10d"` (chain ID `2274399553167629`).

The node exposes three endpoints:
- EVM RPC: `http://localhost:8545`
- Cosmos RPC: `http://localhost:26657`
- Cosmos REST: `http://localhost:1317`

Do not use `weave initia start` on WSL (requires systemd). Run `minitiad` directly.

### 2. Install and configure

```bash
npm install
cp .env.example .env
# fill in DEPLOYER_PRIVATE_KEY and other values
```

### 3. Deploy the contract

```bash
npm run compile                    # compile with Hardhat
node scripts/deploy-viem.js        # deploy via viem (not hardhat run, ESM conflicts)
```

Copy the deployed address to `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env`.

### 4. Start the frontend

```bash
npm run dev                        # starts on localhost:3000
```

Open `http://localhost:3000`. Connect your wallet via InterwovenKit to create a profile.

### Getting GAS tokens

The appchain uses `GAS` as its native fee token. Click the **"Get GAS"** button in the navbar after connecting your wallet. The built-in faucet sends 1 GAS per request (enough for 30+ transactions). One hour cooldown between requests.

### Live deployment

The node runs on a dedicated VPS with a systemd service for auto-restart. The frontend is deployed on Vercel. RPC endpoints are configured via environment variables (`NEXT_PUBLIC_RPC_URL`, `NEXT_PUBLIC_COSMOS_RPC`, `NEXT_PUBLIC_COSMOS_REST`).

## Tech

- Next.js 16, TypeScript, Tailwind CSS v4
- Solidity 0.8.20, OpenZeppelin ReentrancyGuard
- viem for contract reads and deploy scripts
- InterwovenKit (`@initia/interwovenkit-react`) for wallet and tx
- Initia L1 REST API for `.init` username resolution
- sonner for toast notifications

## Pages

| Route | What it does |
|---|---|
| `/` | Landing page |
| `/edit` | Create or edit your profile (requires wallet) |
| `/discover` | Browse profiles, sort by new or popular |
| `/dashboard` | Your stats, tip history, who you follow |
| `/alice.init` | Public profile page (server-rendered, no wallet needed) |

## Contract

`ProfileRegistry.sol` deployed at `0xdccc0dd916e38a4b2ada84694749ca8960618de8` on the InitiaLink appchain (`initialink-1`).

## Features worth noting

- Platform icons with URL auto-detection (Twitter, GitHub, Instagram, YouTube, LinkedIn, Discord, Telegram, TikTok)
- Skeleton loading placeholders while data fetches
- Scroll-triggered animations via Intersection Observer
- Animated gradient avatar rings, hover effects, shimmer buttons

## Structure

```
contracts/           smart contract (ProfileRegistry.sol)
src/app/             pages (/, /edit, /discover, /dashboard, /[username])
src/components/      UI components (ProfileCard, EditProfileForm, DiscoverFeed, Skeleton, etc.)
src/hooks/           useContractWrite (MsgCall writes), useScrollReveal (Intersection Observer)
src/lib/             contract reads, ABI, constants, username resolution, platform icons
scripts/             deploy scripts (deploy-viem.js for production, deploy.cts legacy)
.initia/             submission metadata
```
