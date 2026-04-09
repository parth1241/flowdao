export const env = {
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/flowdao",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "fallback-secret-development-only",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  NEXT_PUBLIC_STELLAR_NETWORK: process.env.NEXT_PUBLIC_STELLAR_NETWORK || "testnet",
  NEXT_PUBLIC_STELLAR_HORIZON: process.env.NEXT_PUBLIC_STELLAR_HORIZON || "https://horizon-testnet.stellar.org",
  NEXT_PUBLIC_SOROBAN_RPC: process.env.NEXT_PUBLIC_SOROBAN_RPC || "https://soroban-testnet.stellar.org",
  DAO_ENCRYPTION_KEY: process.env.DAO_ENCRYPTION_KEY || "0123456789abcdef0123456789abcdef", // 32 chars for AES-256
  NEXT_PUBLIC_DAO_ID: process.env.NEXT_PUBLIC_DAO_ID || "",
};
