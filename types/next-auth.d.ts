import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      linkedWallet?: string;
      avatarColor: string;
      rememberMe: boolean;
      daoId?: string;
      tokenBalance: number;
      votingPower: number;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: string;
    linkedWallet?: string;
    avatarColor: string;
    rememberMe: boolean;
    daoId?: string;
    tokenBalance: number;
    votingPower: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    linkedWallet?: string;
    avatarColor: string;
    rememberMe: boolean;
    daoId?: string;
    tokenBalance: number;
    votingPower: number;
  }
}
