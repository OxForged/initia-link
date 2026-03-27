## Initia Hackathon Submission

- **Project Name**: InitiaLink

### Project Overview

InitiaLink is a decentralized link-in-bio platform built on an Initia EVM appchain. Your .init username becomes your profile URL. Create a profile, add links, receive tips, follow other creators, and explore the community. All data lives on-chain with no backend.

### Implementation Detail

- **The Custom Implementation**: A single Solidity contract (ProfileRegistry) handles profile CRUD, a social graph (follow/unfollow), direct tipping with reentrancy protection, and paginated discovery. No off-chain storage or indexer needed.
- **The Native Feature**: Initia Usernames (.init) are used as profile URL paths and displayed identity throughout the app. The L1 Move view function API resolves usernames to addresses server-side, enabling SEO-friendly profile pages. InterwovenKit provides the wallet connect modal with support for Initia Wallet, Keplr, MetaMask, and more. Auto-signing keeps edit and follow actions frictionless.

### How to Run Locally

1. Clone the repo and install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in the values.
3. Start your Initia EVM appchain (see [Initia docs](https://docs.initia.xyz/hackathon/get-started)).
4. Compile the contract:
   ```
   npm run compile
   ```
5. Deploy the contract using a viem script (not Hardhat, due to ESM conflicts):
   ```
   node scripts/deploy-viem.js
   ```
6. Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env` with the deployed address.
7. Start the frontend:
   ```
   npm run dev
   ```
8. Open `http://localhost:3000`.

### Tech Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Solidity 0.8.20 + OpenZeppelin ReentrancyGuard
- viem for all contract interaction (frontend and deploy scripts)
- Hardhat for contract compilation only
- InterwovenKit for multi-wallet connect and auto-signing
- Initia L1 REST API for .init username resolution

### Features

- **Profiles**: Bio, avatar URL, and up to 10 labeled links stored on-chain
- **Tipping**: Send native tokens directly to any profile (min 0.001, reentrancy-protected)
- **Social graph**: Follow and unfollow with on-chain follower/following lists
- **Discover**: Browse new and popular profiles with paginated feeds
- **Dashboard**: View your tip stats, follower count, and who you follow
- **Username routing**: Visit `/<username>` to view any profile by their .init name
- **Public profiles**: Server-rendered pages viewable without a wallet, with Open Graph meta tags for social sharing
- **Multi-wallet**: InterwovenKit supports Initia Wallet, Keplr, MetaMask, Privy, and others

### Contract

- **ProfileRegistry.sol** at `contracts/ProfileRegistry.sol`
- Deployed to the InitiaLink appchain at `0xdccc0dd916e38a4b2ada84694749ca8960618de8`

### Project Structure

```
contracts/           Solidity smart contracts
src/app/             Next.js pages (/, /edit, /discover, /dashboard, /[username])
src/components/      React components (ProfileCard, TipButton, FollowButton, etc.)
src/lib/             Contract helpers, ABI, constants, username resolution
scripts/             Deploy scripts
artifacts/           Compiled contract artifacts (gitignored)
```
