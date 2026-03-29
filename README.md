# InitiaLink

Link-in-bio, but on-chain. Your `.init` username is your profile URL.

**Track:** Gaming & Consumer (digital identity)

## What is this

InitiaLink lets you create a profile page tied to your Initia username. Add your links and bio, set an avatar. Other users can tip you (native tokens, no platform cut) and follow you. One Move module stores everything, no backend, no database.

Visit `initialink.xyz/alice.init` and you see Alice's profile. She doesn't need to be online, and the visitor doesn't need a wallet to view it.

## Why not just use Linktree

Linktree owns your profile. They host it and charge you for premium features. If they go down or change their terms, your page disappears.

Linktree also doesn't know anything about crypto. You can't tip someone, follow them on-chain, or verify their identity through their wallet. A list of links on someone else's server.

InitiaLink stores everything in a Move module on a dedicated Initia MiniMove appchain. Your profile is yours. Tips go straight to your wallet, and the follow graph is on-chain too. Because it runs on its own appchain, transaction fees become app revenue.

Other alternatives and why they don't fit:
- **Bento** -- same centralized problem as Linktree, just prettier
- **ENS profiles** -- Ethereum only, no social features, no tipping
- **Lens/Farcaster** -- locked to their own ecosystems, not Initia-native

## How it works

One Move module (`profile_registry`) handles everything:
- Profile CRUD (bio, avatar, up to 10 labeled links)
- Tipping via `coin::transfer` (min 1 GAS, sent directly to the profile owner)
- Social graph (follow/unfollow, follower and following lists, paginated queries)
- Discovery feed (newest profiles on-chain, popular sorted client-side by follower count)
- Tip history stored on-chain (view function, no event log parsing needed)

The server resolves `.init` usernames by calling L1 Move view functions (BCS-encoded, over REST) and renders profile pages with Open Graph meta tags. Share a link on Twitter or Discord and it shows the right preview.

## Initia integration

Four native features used:

1. **Initia Usernames (.init)** -- your username is your URL. Forward resolution (name to address) and reverse resolution (address to name) both work, so even if someone shares a raw address link, the page still shows the `.init` name.

2. **MiniMove Appchain** -- the profile registry runs as a Move module on a dedicated MiniMove rollup. Move's resource ownership model and the Aptos-variant MoveVM give type safety and composability that Solidity can't match.

3. **Auto-signing** -- session-based auto-signing through InterwovenKit. Enable it once from the wallet dropdown, approve in your wallet, and all subsequent transactions (editing, following, tipping) go through without confirmation dialogs. Uses `/initia.move.v1.MsgExecute` permissions. Only possible on MiniMove (not MiniEVM).

4. **InterwovenKit** -- wallet connection and transaction signing. Supports Initia Wallet, Keplr, MetaMask, and others. Contract writes go through Cosmos `MsgExecute` via `requestTxBlock`, with BCS-encoded arguments.

## Running locally

### Prerequisites

- Node.js 18+
- An Initia MiniMove appchain (minimove binary)

### 1. Start the appchain node

```bash
export LD_LIBRARY_PATH=/root/.weave/data/minimove@v1.1.11
/root/.weave/data/minimove@v1.1.11/minitiad start --home /root/.minitia-move &
```

Wait a few seconds for blocks to start producing. Verify with:

```bash
curl -s http://localhost:26657/status | python3 -c "import sys,json; print(json.load(sys.stdin)['result']['sync_info']['latest_block_height'])"
```

The node exposes two endpoints:
- Cosmos RPC: `http://localhost:26657`
- Cosmos REST: `http://localhost:1317`

Do not use `weave initia start` on WSL (requires systemd). Run `minitiad` directly.

### 2. Install and configure

```bash
npm install
cp .env.example .env
# fill in MODULE_ADDRESS, GAS_METADATA, and other values
```

### 3. Deploy the Move module

```bash
export LD_LIBRARY_PATH=/root/.weave/data/minimove@v1.1.11
minitiad move deploy \
  --path contracts/move/profile_registry \
  --upgrade-policy COMPATIBLE \
  --from deployer \
  --gas auto --gas-adjustment 1.5 \
  --gas-prices 0GAS \
  --chain-id initialink-1 \
  --node http://localhost:26657 \
  --home /root/.minitia-move \
  --keyring-backend test -y
```

Copy the module address to `NEXT_PUBLIC_MODULE_ADDRESS` in `.env`.

### 4. Start the frontend

```bash
npm run dev                        # starts on localhost:3000
```

Open `http://localhost:3000`. Connect your wallet via InterwovenKit to create a profile.

### Getting GAS tokens

The appchain uses `GAS` as its native fee token (0 decimals). Click your username in the navbar to open the wallet dropdown, then click **"Get GAS"**. The built-in faucet sends 1000 GAS per request. One hour cooldown between requests.

## Tech

- Next.js 16, TypeScript, Tailwind CSS v4
- Move (Aptos-variant MoveVM on MiniMove rollup)
- BCS encoding for Move view function calls and transaction args
- InterwovenKit (`@initia/interwovenkit-react`) for wallet and tx
- Initia L1 REST API for `.init` username resolution
- sonner for toast notifications

## Pages

| Route | What it does |
|---|---|
| `/` | Landing page |
| `/edit` | Create or edit your profile (requires wallet) |
| `/discover` | Browse profiles, search by username, sort by new or popular (followers, tip count, total tipped) |
| `/dashboard` | Your stats, recent tips received, who you follow |
| `/alice.init` | Public profile page (server-rendered, no wallet needed) |

## Move Module

`profile_registry` deployed at `0xE6638AB1AD3530282D4FA9E13D5BC1189EC6125D` on the InitiaLink MiniMove appchain (`initialink-1`).

## Features worth noting

- Platform icons with URL auto-detection (Twitter, GitHub, Instagram, YouTube, LinkedIn, Discord, Telegram, TikTok)
- Discover feed with username search, Load More pagination, and multi-criteria sort
- Navbar adapts: "Create Profile" becomes "My Profile" linking to your profile page once you have one
- Share profiles to X, Telegram, or copy link; QR code for each profile
- Dynamic Open Graph images for rich previews when sharing on Discord, X, Telegram
- Dashboard with recent tip history (on-chain records) and following list with resolved usernames
- Follow/Tip buttons hidden on your own profile, follow state checked on-chain
- Auto-sign for frictionless transactions (MiniMove only)
- Skeleton loading placeholders while data fetches
- Scroll-triggered animations via Intersection Observer
- Animated gradient avatar rings, hover effects, shimmer buttons

## Who this is for

Crypto-native creators, builders, and community members who want a single landing page tied to their on-chain identity. Someone who already has an `.init` username and wants to share all their socials, receive tips, and build a follower base without trusting a centralized platform.

Linktree and Bento own your data and know nothing about crypto. ENS profiles are Ethereum-only with no social features. Lens and Farcaster are locked to their own ecosystems. InitiaLink combines link-in-bio with on-chain tipping, a follow graph, and Initia username identity, all running on a dedicated appchain where the app controls its own fees and throughput.

## Structure

```
contracts/move/profile_registry/  Move module (profile_registry.move)
contracts/archive/                old Solidity contract (reference)
src/app/             pages (/, /edit, /discover, /dashboard, /[username])
src/components/      UI components (ConnectButton w/ wallet dropdown, ProfileCard, EditProfileForm, DiscoverFeed, Skeleton, etc.)
src/hooks/           useContractWrite (MsgExecute writes), useScrollReveal (Intersection Observer)
src/lib/             contract reads, BCS encoding, constants, username resolution, platform icons
```
