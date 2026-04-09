import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12 px-4 container mx-auto max-w-4xl">
         <h1 className="text-4xl md:text-5xl font-black mb-6">About FlowDAO</h1>
         <p className="text-xl text-muted-foreground mb-12">
            Our mission is to standardize and empower decentralized communities with robust, on-chain governance using Soroban smart contracts on the Stellar network.
         </p>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-surface p-6 border-sky-500/20">
               <h3 className="text-lg font-bold text-sky-400 mb-2">Decentralized</h3>
               <p className="text-muted-foreground">No single point of control. Communities govern themselves.</p>
            </div>
            <div className="card-surface p-6 border-indigo-500/20">
               <h3 className="text-lg font-bold text-indigo-400 mb-2">Transparent</h3>
               <p className="text-muted-foreground">Every vote publicly verifiable on Stellar.</p>
            </div>
            <div className="card-surface p-6 border-violet-500/20">
               <h3 className="text-lg font-bold text-violet-400 mb-2">Enforceable</h3>
               <p className="text-muted-foreground">Soroban contracts execute automatically without human intervention.</p>
            </div>
            <div className="card-surface p-6 border-amber-500/20">
               <h3 className="text-lg font-bold text-amber-400 mb-2">Inclusive</h3>
               <p className="text-muted-foreground">Token distribution determines voice. Anyone can acquire tokens and shape the future.</p>
            </div>
         </div>
      </main>
      <Footer />
    </div>
  );
}
