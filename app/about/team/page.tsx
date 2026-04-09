import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function TeamPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-16 px-4 container mx-auto max-w-5xl text-center">
         <h1 className="text-4xl md:text-5xl font-black mb-12 gradient-text">Our Team</h1>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="card-surface p-6 border-sky-500/30 text-center">
               <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-sky-500"></div>
               <h3 className="font-bold">Alice</h3>
               <p className="text-sm text-sky-400">Founder</p>
            </div>
            <div className="card-surface p-6 border-indigo-500/30 text-center">
               <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-indigo-500"></div>
               <h3 className="font-bold">Bob</h3>
               <p className="text-sm text-indigo-400">Head of smart contracts</p>
            </div>
            <div className="card-surface p-6 border-violet-500/30 text-center">
               <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-violet-500"></div>
               <h3 className="font-bold">Charlie</h3>
               <p className="text-sm text-violet-400">Design Lead</p>
            </div>
            <div className="card-surface p-6 border-amber-500/30 text-center">
               <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-amber-500"></div>
               <h3 className="font-bold">Dave</h3>
               <p className="text-sm text-amber-400">Community Mgr</p>
            </div>
         </div>
      </main>
      <Footer />
    </div>
  );
}
