import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import Link from "next/link";

export default function BlogPage() {
  const posts = [
    { title: "What is Token-Weighted Voting and Why It Matters", slug: "token-weighted-voting" },
    { title: "How Soroban Timelocks Protect DAOs from Rushed Decisions", slug: "soroban-timelocks" },
    { title: "Building FlowDAO: Governance on Stellar", slug: "building-flowdao" }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-16 px-4 container mx-auto max-w-4xl">
         <h1 className="text-4xl md:text-5xl font-black mb-12 gradient-text">Blog</h1>
         <div className="space-y-6">
            {posts.map(p => (
               <Link key={p.slug} href={`/blog/${p.slug}`} className="block card-surface p-6 hover:-translate-y-1 transition-all">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{p.title}</h3>
                  <p className="text-sm text-sky-400">Read article →</p>
               </Link>
            ))}
         </div>
      </main>
      <Footer />
    </div>
  );
}
