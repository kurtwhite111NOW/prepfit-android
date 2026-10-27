import { LogIn, ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { useUser } from "@clerk/react";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-[100dvh] bg-background font-sans text-foreground flex flex-col selection:bg-primary/20">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl gradient-emerald flex items-center justify-center shadow-md text-lg shrink-0 group-hover:scale-105 transition-transform duration-300">
              💪
            </div>
            <span className="font-extrabold text-lg tracking-tight">PrepFit</span>
          </a>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <a href="/meal-prep-app-guide" className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Guide
            </a>
            {isSignedIn ? (
              <a href="/" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all font-bold shadow-sm shadow-primary/20 cursor-pointer">
                Go to Dashboard
              </a>
            ) : (
              <div className="flex items-center gap-4">
                <a href="/sign-in" className="text-foreground hover:text-primary transition-colors flex items-center gap-2 cursor-pointer">
                  <LogIn size={16} />
                  <span>Log in</span>
                </a>
                <a href="/sign-up" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all font-bold shadow-sm shadow-primary/20 flex items-center gap-2 cursor-pointer">
                  <span>Start Free</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            )}
          </nav>
          
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-background z-40 p-6 flex flex-col gap-6 animate-in slide-in-from-top-4">
          <a href="/meal-prep-app-guide" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold border-b border-border pb-4 cursor-pointer">
            Guide
          </a>
          {isSignedIn ? (
            <a href="/" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-primary border-b border-border pb-4 cursor-pointer">
              Dashboard
            </a>
          ) : (
            <>
              <a href="/sign-in" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold border-b border-border pb-4 cursor-pointer">
                Log in
              </a>
              <a href="/sign-up" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-primary border-b border-border pb-4 cursor-pointer">
                Start Free Trial
              </a>
            </>
          )}
        </div>
      )}

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t border-border bg-card py-12 mt-auto">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <a href="/" className="flex items-center gap-2.5 mb-4 cursor-pointer">
              <div className="w-8 h-8 rounded-xl gradient-emerald flex items-center justify-center text-base shrink-0">
                💪
              </div>
              <span className="font-extrabold text-base tracking-tight">PrepFit</span>
            </a>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-6">
              Meal planning and tracking for every fitness goal. Build personalized plans, track macros, and make steady progress.
            </p>
            <p className="text-xs text-muted-foreground/60 font-medium">
              © {new Date().getFullYear()} bestappsmade LLC. All rights reserved.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-foreground">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground font-medium">
              <li><a href="/sign-up" className="hover:text-primary transition-colors cursor-pointer">Start Free Trial</a></li>
              <li><a href="/sign-in" className="hover:text-primary transition-colors cursor-pointer">Sign In</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-foreground">Resources</h4>
            <ul className="space-y-3 text-sm text-muted-foreground font-medium">
              <li><a href="/meal-prep-app-guide" className="hover:text-primary transition-colors cursor-pointer">Meal Prep Guide</a></li>
              <li><a href="/privacy" className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
