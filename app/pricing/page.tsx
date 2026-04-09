import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-20 px-4 container mx-auto max-w-5xl">
         <h1 className="text-4xl md:text-6xl font-black mb-6 text-center gradient-text">Simple, Transparent Pricing</h1>
         <p className="text-center text-muted-foreground text-xl mb-16">Aligned with the growth of your DAO.</p>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-surface p-8 text-center flex flex-col">
               <h3 className="text-xl font-bold mb-4 text-slate-400">Community</h3>
               <p className="text-4xl font-black mb-6">Free</p>
               <ul className="text-sm text-muted-foreground space-y-4 mb-8 flex-1 text-left">
                  <li>• Up to 100 members</li>
                  <li>• Publicly visible proposals</li>
                  <li>• Standard Soroban timelocks</li>
               </ul>
               <button className="btn-secondary w-full">Get Started</button>
            </div>
            
            <div className="card-elevated p-8 text-center border-sky-500/50 shadow-[0_0_30px_rgba(14,165,233,0.2)] md:-translate-y-4 flex flex-col">
               <h3 className="text-xl font-bold mb-4 text-sky-400">Pro</h3>
               <p className="text-4xl font-black mb-6">$49<span className="text-lg text-muted-foreground font-normal">/mo</span></p>
               <ul className="text-sm text-muted-foreground space-y-4 mb-8 flex-1 text-left">
                  <li>• Unlimited members</li>
                  <li>• Custom domain linking</li>
                  <li>• Advanced Treasury charts</li>
                  <li>• Priority RPC access</li>
               </ul>
               <button className="btn-primary w-full">Upgrade to Pro</button>
            </div>
            
            <div className="card-surface p-8 text-center border-violet-500/20 flex flex-col">
               <h3 className="text-xl font-bold mb-4 text-violet-400">Enterprise</h3>
               <p className="text-4xl font-black mb-6">Custom</p>
               <ul className="text-sm text-muted-foreground space-y-4 mb-8 flex-1 text-left">
                  <li>• Legal wrapper templates</li>
                  <li>• Custom Soroban contract deployment</li>
                  <li>• Dedicated engineering support</li>
               </ul>
               <button className="btn-secondary w-full">Contact Sales</button>
            </div>
         </div>

         <div className="mt-24 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">FAQ</h2>
            <div className="space-y-6">
                <div>
                   <h4 className="font-bold mb-2">What happens to the treasury if the DAO is archived?</h4>
                   <p className="text-muted-foreground text-sm">For safety, the treasury cannot be withdrawn automatically on archive. Funds must be voted out before archiving.</p>
                </div>
                <div>
                   <h4 className="font-bold mb-2">Can members be removed from a DAO?</h4>
                   <p className="text-muted-foreground text-sm">Yes, if the DAO admin executes a Member Remove action, or via a vote depending on settings.</p>
                </div>
                <div>
                   <h4 className="font-bold mb-2">How is voting power calculated?</h4>
                   <p className="text-muted-foreground text-sm">Voting power is 1:1 with the amount of DAO governance tokens held by the user at the snapshot moment.</p>
                </div>
            </div>
         </div>
      </main>
      <Footer />
    </div>
  );
}
