import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { env } from "@/lib/env";

interface ExtendedUser {
  id: string;
  role: string;
  linkedWallet?: string;
  avatarColor?: string;
  rememberMe?: boolean;
  daoId: string;
  tokenBalance: number;
  votingPower: number;
}

export const authOptions: NextAuthOptions = {
  // ... providers ...
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "checkbox" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }
        await dbConnect();
        
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("Invalid email or password");
        }

        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new Error("Account is temporarily locked. Try again later.");
        }

        const isMatch = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isMatch) {
          user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
          if (user.failedLoginAttempts >= 5) {
            user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // lock for 15m
          }
          await user.save();
          throw new Error("Invalid email or password");
        }

        // Success
        user.failedLoginAttempts = 0;
        user.lockedUntil = undefined;
        user.lastLogin = new Date();
        user.rememberMe = credentials.rememberMe === "true";
        await user.save();

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          linkedWallet: user.linkedWallet,
          avatarColor: user.avatarColor,
          rememberMe: user.rememberMe,
          daoId: user.daoId,
          tokenBalance: user.tokenBalance,
          votingPower: user.votingPower,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days default, will be overridden in callback depending on rememberMe
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as ExtendedUser;
        token.id = u.id || "";
        token.role = u.role || "";
        token.linkedWallet = u.linkedWallet || "";
        token.avatarColor = u.avatarColor || "";
        token.rememberMe = u.rememberMe || false;
        token.daoId = u.daoId || "";
        token.tokenBalance = u.tokenBalance || 0;
        token.votingPower = u.votingPower || 0;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.linkedWallet = token.linkedWallet as string;
        session.user.avatarColor = token.avatarColor as string;
        session.user.rememberMe = token.rememberMe as boolean;
        session.user.daoId = token.daoId as string;
        session.user.tokenBalance = token.tokenBalance as number;
        session.user.votingPower = token.votingPower as number;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: env.NEXTAUTH_SECRET,
};
