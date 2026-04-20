import { Link } from "wouter";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 animate-in fade-in duration-500">
      <div className="w-20 h-20 rounded-3xl gradient-emerald flex items-center justify-center text-4xl shadow-lg mb-6">
        💪
      </div>
      <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">PrepFit</p>
      <h1 className="font-serif text-5xl font-bold text-foreground leading-tight mb-3">404</h1>
      <p className="text-xl font-semibold text-foreground mb-2">Page not found</p>
      <p className="text-muted-foreground text-sm max-w-xs mb-8">
        Looks like this page skipped leg day — it doesn't exist. Let's get you back on track.
      </p>
      <Link href="/">
        <Button className="gap-2 font-semibold gradient-emerald border-0 shadow-md px-6">
          <Home size={16} />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
