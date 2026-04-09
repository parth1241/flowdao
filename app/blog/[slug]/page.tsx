import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import Link from "next/link";

export default function BlogPost({ params }: { params: { slug: string } }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-16 px-4 container mx-auto max-w-3xl">
         <Link href="/blog" className="text-sm text-sky-400 mb-8 inline-block hover:underline">← Back to Blog</Link>
         <h1 className="text-4xl md:text-5xl font-black mb-8 capitalize">{params.slug.replace(/-/g, " ")}</h1>
         <div className="prose prose-invert max-w-none text-muted-foreground leading-loose">
            <p>This is a placeholder for the blog post content. In a real application, this would be fetched from a CMS like Sanity or Contentful, or rendered from local MDX files.</p>
            <p>Stellar and Soroban provide an amazing foundation for this technology...</p>
         </div>
      </main>
      <Footer />
    </div>
  );
}
