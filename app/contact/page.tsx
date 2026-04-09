import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-16 px-4 container mx-auto max-w-2xl text-center">
         <h1 className="text-4xl md:text-5xl font-black mb-8 gradient-text">Contact Us</h1>
         <p className="text-muted-foreground mb-8">Have a question or need support with your DAO? We&apos;re here to help.</p>
         
         <form className="card-surface p-8 text-left space-y-6">
            <div>
               <label className="block text-sm font-medium text-muted-foreground mb-1">Name</label>
               <input type="text" className="input-field" placeholder="Alice DAO" />
            </div>
            <div>
               <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
               <input type="email" className="input-field" placeholder="alice@example.com" />
            </div>
            <div>
               <label className="block text-sm font-medium text-muted-foreground mb-1">Message</label>
               <textarea className="input-field h-32" placeholder="How can we help?"></textarea>
            </div>
            <button type="button" className="btn-primary w-full">Send Message</button>
         </form>
         
         <div className="mt-12 text-sm text-muted-foreground">
            Or email us directly at <a href="mailto:support@flowdao.example.com" className="text-sky-400 font-bold hover:underline">support@flowdao.example.com</a>
         </div>
      </main>
      <Footer />
    </div>
  );
}
