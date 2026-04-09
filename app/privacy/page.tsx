import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-16 px-4 container mx-auto max-w-3xl">
         <h1 className="text-3xl font-black mb-8">Privacy Policy</h1>
         <div className="prose prose-invert text-muted-foreground">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <h3>1. Introduction</h3>
            <p>FlowDAO respects your privacy and is committed to protecting your personal data...</p>
            <h3>2. Data we collect</h3>
            <ul>
               <li>Email address (for authentication)</li>
               <li>Stellar Wallet Address (for governance verification)</li>
               <li>Usage data and interactions on our platform</li>
            </ul>
            <h3>3. On-chain data</h3>
            <p>Please note that any actions taken on the Stellar blockchain, such as voting or treasury execution, are public and cannot be modified or deleted by FlowDAO.</p>
         </div>
      </main>
      <Footer />
    </div>
  );
}
