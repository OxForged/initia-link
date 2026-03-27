# InitiaLink

Link-in-bio, but on-chain. Your `.init` username is your profile URL.

**Track:** Gaming & Consumer (digital identity)

## What is this

InitiaLink lets you create a profile page tied to your Initia username. Add your links, write a bio, set an avatar. Other users can tip you directly (native tokens, no platform cut) and follow you. Everything is stored in a single smart contract, no backend, no database.

Visit `initialink.xyz/alice.init` and you see Alice's profile. She doesn't need to be online, and the visitor doesn't need a wallet to view it.

## Why not just use Linktree

Linktree owns your profile. They host it, they control it, they charge you for premium features. If they go down or change their terms, your page disappears.

More importantly, Linktree doesn't know anything about crypto. You can't tip someone, follow them on-chain, or verify their identity through their wallet. It's just a list of links on someone else's server.

InitiaLink stores everything in a contract on a dedicated Initia appchain. Your profile is yours. Tips go straight to your wallet. The social graph lives on-chain. And because it runs on its own appchain, every transaction is revenue for the app, not gas burned on a shared L1.

Other alternatives and why they don't fit:
- **Bento** -- same centralized problem as Linktree, just prettier
- **ENS profiles** -- Ethereum only, no social features, no tipping
- **Lens/Farcaster** -- locked to their own ecosystems, not Initia-native

## How it works

One Solidity contract (`ProfileRegistry`) handles everything:
- Profile CRUD (bio, avatar, up to 10 labeled links)
- Tipping with reentrancy protection (min 0.001 INIT, sent directly to the profile owner)
- Social graph (follow/unfollow, follower and following lists, paginated queries)
- Discovery feed (newest and most popular profiles)

The frontend resolves `.init` usernames by calling the L1 Move username module directly (BCS-encoded view functions over REST). This happens server-side, so profile pages are server-rendered with Open Graph meta tags. Share a link on Twitter or Discord and it shows the right preview.

## Initia integration

Three native features used:

1. **Initia Usernames (.init)** -- your username is your URL. Forward resolution (name to address) and reverse resolution (address to name) both work, so even if someone shares a raw address link, the page still shows the `.init` name.

2. **Auto-signing** -- `enableAutoSign` through InterwovenKit. Editing your profile, following someone, tipping -- none of these pop up a confirmation dialog. It just works.

3. **InterwovenKit** -- all wallet connection and transaction signing. Supports Initia Wallet, Keplr, MetaMask, and others. Contract writes go through Cosmos `MsgCall` via `requestTxBlock`, not through the EVM provider directly.

## Running locally

```bash
npm install
cp .env.example .env
# fill in your values
```

Start your Initia EVM appchain ([docs](https://docs.initia.xyz/hackathon/get-started)), then:

```bash
npm run compile                    # compile the contract
node scripts/deploy-viem.js        # deploy (not hardhat, ESM conflicts)
# copy the deployed address to NEXT_PUBLIC_CONTRACT_ADDRESS in .env
npm run dev                        # start frontend on localhost:3000
```

## Tech

- Next.js 16, TypeScript, Tailwind CSS v4
- Solidity 0.8.20, OpenZeppelin ReentrancyGuard
- viem for contract reads and deploy scripts
- InterwovenKit (`@initia/interwovenkit-react`) for wallet and tx
- Initia L1 REST API for `.init` username resolution

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

## Structure

```
contracts/           smart contract
src/app/             pages (/, /edit, /discover, /dashboard, /[username])
src/components/      UI components
src/hooks/           useContractWrite (MsgCall writes), useScrollReveal
src/lib/             contract reads, ABI, constants, username resolution, platform icons
scripts/             deploy script
.initia/             submission metadata
```
