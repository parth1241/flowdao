import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-16 px-4 container mx-auto max-w-3xl">
         <h1 className="text-3xl font-black mb-8">Terms of Service</h1>
         <div className="prose prose-invert text-muted-foreground">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <h3>1. Agreement to Terms</h3>
            <p>By accessing or using FlowDAO, you agree to be bound by these Terms.</p>
            <h3>2. Platform and Blockchain Iteractions</h3>
            <p>FlowDAO is a user interface that facilitates interaction with smart contracts on the Stellar network. We do not control the Soroban network and are not responsible for any lost funds or technical failures on the network level.</p>
            <h3>3. Governance</h3>
            <p>You acknowledge that participating in governance via token-weighted voting creates legal and financial risk. FlowDAO is not liable for DAOs whose parameter changes or protocol actions result in loss of value.</p>
         </div>
      </main>
      <Footer />
    </div>
  );
}
