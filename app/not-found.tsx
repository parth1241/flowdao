import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center p-4 text-center space-y-8">
      <h1 className="text-8xl md:text-9xl font-black gradient-text animate-pulse">404</h1>
      <div className="space-y-4 max-w-md">
        <h2 className="text-2xl font-bold">This proposal doesn&apos;t exist on-chain</h2>
        <p className="text-muted-foreground">The asset or page you are looking for does not exist or has not been broadcasted to the network.</p>
      </div>
      <Link href="/" className="btn-primary px-8 py-3">Back home</Link>
    </div>
  );
}
