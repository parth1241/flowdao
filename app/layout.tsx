import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";
import { SessionWatcher } from "@/components/shared/SessionWatcher";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FlowDAO | On-Chain Governance",
  description: "Create DAOs, issue governance tokens, and manage treasuries on Stellar Soroban.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-safari min-h-screen bg-base text-foreground font-sans antialiased overflow-x-hidden`}>
        <div className="ambient-blobs" />
        <div className="ambient-blobs-3" />
        <Providers>
          <SessionWatcher />
          {children}
        </Providers>
      </body>
    </html>
  );
}
