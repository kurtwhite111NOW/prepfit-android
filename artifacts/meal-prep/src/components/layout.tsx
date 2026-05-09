import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  CalendarDays,
  ShoppingBasket,
  BookOpen,
  ScanLine,
  Scale,
  Zap,
  Droplets,
  ClipboardList,
  Settings,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useTrial } from "@/hooks/use-trial";
import { useTheme } from "@/hooks/use-theme";
import { TrialBanner } from "@/components/trial-banner";
import { UpgradeWall } from "@/components/upgrade-wall";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/", label: "Dashboard", emoji: "🏠", icon: LayoutDashboard },
  { href: "/planner", label: "Meal Planner", emoji: "🥗", icon: CalendarDays },
  { href: "/shopping", label: "Grocery List", emoji: "🛒", icon: ShoppingBasket },
  { href: "/meals", label: "My Meals", emoji: "📓", icon: BookOpen },
  { href: "/scan", label: "Scan Photo", emoji: "📸", icon: ScanLine },
  { href: "/weight", label: "Weight", emoji: "📊", icon: Scale },
  { href: "/water", label: "Water", emoji: "💧", icon: Droplets },
  { href: "/plans", label: "Saved Plans", emoji: "📋", icon: ClipboardList },
];

const mobileNavItems = navItems.slice(0, 6);

const BASE_URL = (import.meta.env.BASE_URL as string)?.replace(/\/$/, '') || '';

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const trial = useTrial();
  const { isDark, toggle } = useTheme();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [manageEmail, setManageEmail] = useState('');
  const [manageLoading, setManageLoading] = useState(false);
  const [manageError, setManageError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const openBillingPortal = async () => {
    const email = manageEmail.trim();
    if (!email) return;
    setManageLoading(true);
    setManageError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/stripe/portal-by-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to open billing portal.');
      window.location.href = data.url;
    } catch (err: any) {
      setManageError(err.message || 'Something went wrong.');
      setManageLoading(false);
    }
  };

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <>
      {(trial.expired || showUpgrade) && !trial.loading && (
        <UpgradeWall onClose={trial.expired ? undefined : () => setShowUpgrade(false)} />
      )}

      <div className="min-h-screen bg-background flex flex-col md:flex-row">

        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-sidebar border-b border-sidebar-border sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl gradient-emerald flex items-center justify-center shrink-0 shadow-md">
              <span className="text-base">💪</span>
            </div>
            <div>
              <span className="font-bold text-sm text-sidebar-foreground leading-none block">PrepFit</span>
              <span className="text-[10px] text-primary font-semibold leading-none">Simple Meal Prep · Gym & Fitness</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle isDark={isDark} toggle={toggle} variant="header" />
            {!trial.expired && !trial.loading && (
              <button
                onClick={() => setShowUpgrade(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/15 text-primary text-[11px] font-bold border border-primary/20"
              >
                <Zap size={11} />
                {trial.daysLeft}d left
              </button>
            )}
          </div>
        </header>

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-[220px] flex-col bg-sidebar border-r border-sidebar-border h-screen sticky top-0 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          {/* Logo */}
          <div className="px-5 pt-6 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl gradient-emerald flex items-center justify-center shadow-lg text-xl shrink-0">
                💪
              </div>
              <div>
                <span className="font-extrabold text-sm text-sidebar-foreground leading-tight block">PrepFit</span>
                <span className="text-[11px] text-primary font-bold tracking-wide leading-none block">Simple Meal Prep · Gym & Fitness</span>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                      active
                        ? "bg-primary/15 text-primary border border-primary/20"
                        : "text-sidebar-foreground/55 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary shadow-[0_0_8px_2px_rgba(249,115,22,0.4)]" />
                    )}
                    <span className="text-base w-5 text-center">{item.emoji}</span>
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Theme toggle */}
          <div className="px-3 pb-2">
            <ThemeToggle isDark={isDark} toggle={toggle} variant="sidebar" />
          </div>

          {/* Trial / Pro card */}
          <div className="px-4 pb-3 pt-2">
            <div className="rounded-2xl bg-primary/10 border border-primary/15 p-4">
              {!trial.loading && !trial.expired ? (
                <>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sidebar-foreground/80 text-[11px] font-bold uppercase tracking-wider">🎁 Free Trial</p>
                    <span className="text-[10px] font-bold text-amber-400">{trial.daysLeft}d left</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-sidebar-foreground/10 mb-3">
                    <div
                      className="h-1.5 rounded-full bg-amber-400 transition-all"
                      style={{ width: `${Math.round((trial.daysLeft / 3) * 100)}%` }}
                    />
                  </div>
                  <button
                    onClick={() => setShowUpgrade(true)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl gradient-emerald text-white text-[11px] font-bold uppercase tracking-wide"
                  >
                    <Zap size={11} />
                    Upgrade to Pro
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sidebar-foreground/80 text-[11px] font-bold uppercase tracking-wider">⚡ Pro Plan</p>
                    <span className="text-[10px] font-bold text-primary bg-primary/15 px-1.5 py-0.5 rounded-full">Active</span>
                  </div>
                  <p className="text-sidebar-foreground/50 text-[11px] leading-relaxed">
                    Unlimited meal plans, calorie scanning & more.
                  </p>

                  {!showManage ? (
                    <button
                      onClick={() => {
                        setShowManage(true);
                        setManageError(null);
                        setTimeout(() => emailRef.current?.focus(), 50);
                      }}
                      className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-sidebar-border/60 text-sidebar-foreground/60 hover:text-white hover:border-white/20 text-[11px] font-semibold transition-colors"
                    >
                      <Settings size={11} />
                      Manage Subscription
                    </button>
                  ) : (
                    <div className="mt-3 flex flex-col gap-2">
                      <p className="text-sidebar-foreground/60 text-[10px] leading-snug">
                        Enter your billing email to open the Stripe portal.
                      </p>
                      <input
                        ref={emailRef}
                        type="email"
                        value={manageEmail}
                        onChange={(e) => setManageEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && openBillingPortal()}
                        placeholder="you@example.com"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-sidebar-accent/40 border border-sidebar-border/60 text-sidebar-foreground text-[11px] placeholder:text-sidebar-foreground/30 outline-none focus:border-primary/50 transition-colors"
                      />
                      {manageError && (
                        <p className="text-red-400 text-[10px] leading-snug">{manageError}</p>
                      )}
                      <div className="flex gap-1.5">
                        <button
                          onClick={openBillingPortal}
                          disabled={manageLoading || !manageEmail.trim()}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg gradient-emerald text-white text-[11px] font-bold disabled:opacity-50 transition-opacity"
                        >
                          {manageLoading ? (
                            <Loader2 size={10} className="animate-spin" />
                          ) : (
                            <ExternalLink size={10} />
                          )}
                          {manageLoading ? 'Opening…' : 'Open Portal'}
                        </button>
                        <button
                          onClick={() => { setShowManage(false); setManageError(null); setManageEmail(''); }}
                          className="px-2.5 py-1.5 rounded-lg text-sidebar-foreground/40 hover:text-sidebar-foreground/70 text-[11px] font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Android install */}
          <div className="px-4 pb-3">
            <Link href="/android">
              <div className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-white hover:bg-sidebar-accent/60 transition-colors cursor-pointer text-[13px] font-bold border border-sidebar-border/60">
                🤖 Install on Android
              </div>
            </Link>
          </div>

          {/* Footer */}
          <div className="px-5 pb-4 text-center">
            <p className="text-[10px] text-primary font-bold">PrepFit © 2025 · version 2.0.0</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen pb-24 md:pb-0 overflow-y-auto">
          <TrialBanner trial={trial} onUpgrade={() => setShowUpgrade(true)} />
          <div key={location} className="max-w-3xl mx-auto px-3 md:px-8 py-4 md:py-8 animate-in fade-in duration-300">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Nav — top 6 items */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border flex items-center justify-around px-1 py-1.5 z-20">
          {mobileNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <div className="flex flex-col items-center gap-0.5 px-2 py-1.5 cursor-pointer min-w-[48px]">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors text-lg ${active ? "bg-primary/20" : ""}`}>
                    {item.emoji}
                  </div>
                  <span className={`text-[9px] font-bold tracking-wide ${active ? "text-primary" : "text-sidebar-foreground/35"}`}>
                    {item.label.split(" ")[0]}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
