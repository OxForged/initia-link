## Initia Hackathon Submission

- **Project Name**: InitiaLink

### Project Overview
InitiaLink is a decentralized link-in-bio platform where your .init username is your profile URL. Create a profile, add links, receive INIT tips from anyone, and discover other creators -- all on your own Initia appchain.

### Implementation Detail
- **The Custom Implementation**: On-chain profile registry with social graph (follow system), direct INIT tipping, and a discover feed. All profile data lives on-chain with no backend required. Single Solidity contract handles profiles, links, tips, follows, and discovery.
- **The Native Feature**: Initia Usernames (.init) serve as the profile URL path and displayed identity. Profile pages are server-rendered so anyone can view them without a wallet. Auto-signing enables frictionless profile editing. Interwoven Bridge enables cross-chain tipping.

### How to Run Locally
1. Clone repo and install dependencies: `npm install`
2. Compile the smart contract: `npm run compile`
3. Deploy contract: `npm run deploy` (requires appchain running)
4. Copy contract address to `.env` (see `.env.example`)
5. Start frontend: `npm run dev` and visit `http://localhost:3000`

### Tech Stack
- Next.js 16 (App Router) with TypeScript and Tailwind CSS
- Solidity 0.8.20 with OpenZeppelin ReentrancyGuard
- Hardhat for contract compilation and deployment
- viem for contract interaction
- Server-side rendered profile pages with Open Graph meta tags

### Features
- Profile creation with bio, avatar, and up to 10 links
- Direct INIT tipping with reentrancy protection (min 0.001 INIT)
- Follow/unfollow system with on-chain social graph
- Discover page with "New" and "Popular" tabs
- Dashboard with tip stats and follower counts
- Public profile pages viewable without wallet connection
- .init username resolution for profile URLs
