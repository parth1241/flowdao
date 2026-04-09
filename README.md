# <p align="center">FlowDAO</p>

<p align="center">
  <img src="/Users/parthkaran/.gemini/antigravity/brain/208e056c-af74-4744-aba6-e914d517cfc8/flowdao_professional_banner_1775727819935.png" alt="FlowDAO Banner" width="100%">
</p>

<p align="center">
  <strong>The ultimate on-chain governance and treasury management platform for the Stellar Soroban ecosystem.</strong>
</p>

<p align="center">
  <a href="#-key-features">Features</a> •
  <a href="#-visual-tour">Visual Tour</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-architecture">Architecture</a>
</p>

---

## 🚀 Vision

FlowDAO empowers decentralized communities to manage shared treasuries with absolute transparency. By leveraging **Soroban smart contracts**, we ensure that every proposal, vote, and fund distribution is immutable and mathematically enforced on the Stellar network.

---

## ✨ Key Features

- **🛡️ Soroban Enforcement**: Governance rules are written in Rust/WASM, ensuring trustless execution.
- **⚡ Instant Settlement**: Consensus-driven treasury releases that happen in seconds.
- **📊 Weighted Voting**: Flexible voting models tailored to your community's token distribution.
- **🏢 Institutional Treasury**: Manage XLM and Stellar-native assets in a secure, multi-sig environment.
- **🛠️ Admin Toolkit**: Bulk distribute governance tokens via CSV and manage DAO parameters with ease.

---

## 📸 Visual Tour

#### 🏠 Landing Page
The entry point to the FlowDAO ecosystem, featuring real-time on-chain activity tickers and dynamic governance headlines.

![Landing Page](/Users/parthkaran/.gemini/antigravity/brain/208e056c-af74-4744-aba6-e914d517cfc8/homepage_hero_1775727901534.png)

#### 🛠️ Professional Feature Suite
Detailed exploration of our platform's capabilities, from programmable timelocks to audit trails.

![Features Page](/Users/parthkaran/.gemini/antigravity/brain/208e056c-af74-4744-aba6-e914d517cfc8/features_page_hero_1775727885733.png)

#### 🤝 Mission & Transparency
Our commitment to standardizing decentralized governance across the Stellar network.

![About Page](/Users/parthkaran/.gemini/antigravity/brain/208e056c-af74-4744-aba6-e914d517cfc8/about_page_hero_1775727931979.png)

---

## 🏁 Getting Started

### Prerequisites
- **Node.js**: 18.0.0 or higher
- **MongoDB**: Local instance or Atlas URI
- **Freighter**: [Stellar Browser Wallet](https://www.freighter.app/)

### 🛠️ Installation

```bash
# Clone the vision
git clone https://github.com/pkaranbe25/trustcert.git
cd flowdao

# Install dependencies
npm install

# Setup environment
cp .env.example .env
```

> [!TIP]
> Make sure to configure your `DAO_ENCRYPTION_KEY` in the `.env` file to enable secure storage of sensitive DAO metadata.

### 🏃 Running Locally

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to start your governance journey.

---

## 🏗 Architecture

FlowDAO utilizes a modern hybrid stack for maximum performance and security:

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14, Tailwind CSS | High-performance, responsive UX |
| **Blockchain** | Soroban, Stellar SDK | Immutable state & Treasury control |
| **Backend** | Mongoose, NextAuth | User session & off-chain metadata |
| **Security** | AES-256-CBC | Encryption of sensitive secrets at rest |

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<p align="center">
  Made with 💙 for the Stellar Community.
</p>