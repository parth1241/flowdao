import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface border-t border-sky-500/10 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link href="/" className="font-bold text-xl tracking-tight mb-4 inline-block">
            <span className="gradient-text">FlowDAO</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            On-chain governance and treasury management platform powered by Soroban smart contracts on Stellar.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold text-foreground mb-4">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/pricing" className="hover:text-sky-400 transition-colors">Pricing</Link></li>
            <li><Link href="/dao/features" className="hover:text-sky-400 transition-colors">Features</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-sky-400 transition-colors">About Us</Link></li>
            <li><Link href="/about/team" className="hover:text-sky-400 transition-colors">Team</Link></li>
            <li><Link href="/blog" className="hover:text-sky-400 transition-colors">Blog</Link></li>
            <li><Link href="/contact" className="hover:text-sky-400 transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/privacy" className="hover:text-sky-400 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-sky-400 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-sky-500/10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} FlowDAO. All rights reserved.
      </div>
    </footer>
  );
}
