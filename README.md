# FlowDAO — Soroban-powered Governance

![CI](https://github.com/parth1241/flowdao/actions/workflows/ci.yml/badge.svg)
![Vercel](https://img.shields.io/badge/deployed-vercel-black)
![Stellar](https://img.shields.io/badge/blockchain-Stellar%20Testnet-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌐 Live Demo
**[YOUR_VERCEL_URL]**

> Built on **Stellar Testnet** — no real funds used.

## 📱 Screenshots

### Wallet Connected + Balance Display
> Screenshot of WalletStatusBar showing connected address + XLM balance.

### Successful Testnet Transaction
> Screenshot of TransactionSuccessCard after submitting a proposal.
> Shows: txHash, amount, wallet address, updated balance, Stellar Expert link.

### Mobile Responsive View
> Screenshot of the app on 375px mobile width.

### CI/CD Pipeline
> GitHub Actions tab showing green CI run.

---

## 📋 What It Does
FlowDAO is a decentralized autonomous organization (DAO) framework built on Stellar using Soroban smart contracts. It enables communities to create proposals, manage treasuries, and execute on-chain governance decisions through a transparent and secure voting process. Tokens equal power in FlowDAO, where governance is distributed and every decision is verifiable on the blockchain. From fund allocation to protocol upgrades, FlowDAO provides the infrastructure for collective intelligence to flourish.

## ⚙️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 App Router + TypeScript |
| Styling | TailwindCSS + shadcn/ui |
| Blockchain | Stellar SDK + Soroban + Freighter Wallet |
| Database | MongoDB Atlas |
| Auth | NextAuth.js (JWT) |
| Deployment | Vercel |
| Network | Stellar Testnet |

## 🔗 Blockchain Details

### Network
- **Network:** Stellar Testnet
- **Horizon:** https://horizon-testnet.stellar.org
- **Soroban RPC:** https://soroban-testnet.stellar.org
- **Explorer:** https://stellar.expert/explorer/testnet

### Contract Details
- **Governance Contract ID:** [CONTRACT_ID]
- **Blockchain Network:** Stellar Testnet

### Asset / Token Details
- **Asset Code:** XLM (Native)
- **Explorer Link:** https://stellar.expert/explorer/testnet/asset/XLM

## 🚀 Setup Instructions (Run Locally)

### Prerequisites
- [ ] Node.js 18+
- [ ] MongoDB Atlas account
- [ ] Freighter wallet extension

### Step 1 — Clone Repository
```bash
git clone https://github.com/parth1241/flowdao.git
cd flowdao
```

### Step 2 — Install Dependencies
```bash
npm install
```

### Step 3 — Configure Environment Variables
```bash
cp .env.example .env.local
```

### Step 4 — Set Up MongoDB Atlas
1. Visit https://cloud.mongodb.com and create a free M0 cluster.
2. Add a database user and allow network access (0.0.0.0/0).
3. Copy the driver connection string into `MONGODB_URI` in `.env.local`.

### Step 5 — Set Up Freighter Wallet
1. Install Freighter and switch to **Testnet**.
2. Fund your wallet at https://friendbot.stellar.org/?addr=YOUR_PUBLIC_KEY.

### Step 6 — Run Development Server
```bash
npm run dev
```

### Step 7 — Create Account + Connect Wallet
1. Visit http://localhost:3000/signup
2. After login, click "Connect Wallet" and approve in Freighter.

### Step 8 — Test a Transaction
1. Governance → Create Proposal.
2. Enter proposal details and target action.
3. Click "Submit to FlowDAO".
4. Approve in Freighter → transaction confirmed and proposal is live for voting.

## 📁 Project Structure
```
/app                 → Next.js App Router root
  /proposals         → Proposal management
  /treasury          → Asset management logic
  /api               → API routes for backend logic
/components
  /shared            → Blockchain-aware components
  /governance        → DAO-specific UI
/lib
  stellar.ts         ← Core Stellar/Soroban SDK logic
  contracts.ts       ← Smart contract interaction layer
```

## 🔒 Security
- Funds managed by Soroban multisig/governance logic.
- Client-side signing via Freighter.
- Transparent vote counting on-chain.

## 🌱 Deployment (Vercel)
1. Push to GitHub.
2. Import to Vercel and add environment variables.
3. Update `NEXTAUTH_URL` to your Vercel URL.

## 📝 Commit History
10+ meaningful commits following conventional format.

## 🏆 Hackathon
Built for the **Antigravity x Stellar Builder Track Belt Progression**.
- Level 1-4 Complete ✅

## 📄 License
MIT — see LICENSE file