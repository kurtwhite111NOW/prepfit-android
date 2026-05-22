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
  BookMarked,
  Settings,
  Loader2,
  ExternalLink,
  LogOut,
  LogIn,
  User,
  Trash2,
} from "lucide-react";
import { useClerk, useUser } from "@clerk/react";
import { useTrial } from "@/hooks/use-trial";
import { useTheme } from "@/hooks/use-theme";
import { TrialBanner } from "@/components/trial-banner";
import { UpgradeWall } from "@/components/upgrade-wall";
import { ThemeToggle } from "@/components/theme-toggle";
import { DeleteAccountDialog } from "@/components/delete-account-dialog";

const navItems = [
  { href: "/", label: "Dashboard", emoji: "🏠", icon: LayoutDashboard },
  { href: "/planner", label: "Meal Planner", emoji: "🥗", icon: CalendarDays },
  { href: "/shopping", label: "Grocery List", emoji: "🛒", icon: ShoppingBasket },
  { href: "/meals", label: "My Meals", emoji: "📓", icon: BookOpen },
  { href: "/scan", label: "Scan Photo", emoji: "📸", icon: ScanLine },
  { href: "/weight", label: "Weight", emoji: "📊", icon: Scale },
  { href: "/water", label: "Water", emoji: "💧", icon: Droplets },
  { href: "/plans", label: "Saved Plans", emoji: "📋", icon: ClipboardList },
  { href: "/guide", label: "User Guide", sublabel: "(Read Me First)", emoji: "📖", icon: BookMarked },
];

const mobileNavItems = navItems;

const BASE_URL = (import.meta.env.BASE_URL as string)?.replace(/\/$/, '') || '';

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const trial = useTrial();
  const { isDark, toggle } = useTheme();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [manageEmail, setManageEmail] = useState('');
  const [manageLoading, setManageLoading] = useState(false);
  const [manageError, setManageError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const { signOut } = useClerk();
  const { user, isSignedIn, isLoaded } = useUser();

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

  const displayName = user?.firstName || user?.username || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User';
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || '';

  return (
    <>
      {(trial.expired || showUpgrade) && !trial.loading && isSignedIn && (
        <UpgradeWall onClose={trial.expired ? undefined : () => setShowUpgrade(false)} />
      )}
      {showDeleteAccount && (
        <DeleteAccountDialog onClose={() => setShowDeleteAccount(false)} />
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
            {isLoaded && !isSignedIn && (
              <a
                href={`${BASE_URL}/sign-in`}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/15 text-primary text-[11px] font-bold border border-primary/20"
              >
                <LogIn size={11} />
                Sign In
              </a>
            )}
            {isSignedIn && !trial.expired && !trial.loading && (
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
          <div className="px-5 pt-5 pb-3">
            <a href="https://prepfit.fit/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-2xl gradient-emerald flex items-center justify-center shadow-lg text-xl shrink-0">
                💪
              </div>
              <div>
                <span className="font-extrabold text-sm text-sidebar-foreground leading-tight block">PrepFit</span>
                <span className="text-[11px] text-primary font-bold tracking-wide leading-none block">Simple Meal Prep · Gym & Fitness</span>
              </div>
            </a>
          </div>

          {/* User Account Section */}
          {isLoaded && (
            <div className="px-4 pb-3">
              {isSignedIn ? (
                <>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-sidebar-accent/40 border border-sidebar-border/60">
                    <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                      {user?.imageUrl ? (
                        <img src={user.imageUrl} alt={displayName} className="w-7 h-7 rounded-full object-cover" />
                      ) : (
                        <User size={14} className="text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sidebar-foreground text-[11px] font-bold truncate leading-tight">{displayName}</p>
                      {userEmail && (
                        <p className="text-sidebar-foreground/40 text-[10px] truncate leading-tight">{userEmail}</p>
                      )}
                    </div>
                    <button
                      onClick={() => signOut({ redirectUrl: BASE_URL || "/" })}
                      title="Sign out"
                      className="p-1 rounded-lg text-sidebar-foreground/40 hover:text-red-400 hover:bg-red-400/10 transition-colors shrink-0"
                    >
                      <LogOut size={13} />
                    </button>
                  </div>
                  <button
                    onClick={() => setShowDeleteAccount(true)}
                    className="w-full flex items-center gap-1.5 px-3 py-1 rounded-lg text-sidebar-foreground/25 hover:text-red-400/70 hover:bg-red-500/5 transition-colors text-[10px] font-medium mt-0.5"
                  >
                    <Trash2 size={10} />
                    Delete account & all data
                  </button>
                </>
              ) : (
                <div className="flex gap-1.5">
                  <a
                    href={`${BASE_URL}/sign-in`}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-primary/15 text-primary border border-primary/20 text-[11px] font-bold hover:bg-primary/20 transition-colors"
                  >
                    <LogIn size={11} />
                    Sign In
                  </a>
                  <a
                    href={`${BASE_URL}/sign-up`}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl gradient-emerald text-white text-[11px] font-bold"
                  >
                    Sign Up
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Nav */}
          <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${item.href === "/guide" ? "mt-8" : ""} ${
                      active
                        ? "bg-primary/15 text-primary border border-primary/20"
                        : "text-sidebar-foreground/55 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary shadow-[0_0_8px_2px_rgba(249,115,22,0.4)]" />
                    )}
                    <span className="text-base w-5 text-center">{item.emoji}</span>
                    <span className="flex flex-col leading-tight">
                      <span>{item.label}</span>
                      {item.sublabel && (
                        <span className="text-[10px] font-normal text-sidebar-foreground/50">{item.sublabel}</span>
                      )}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Theme toggle */}
          <div className="px-3 pb-2">
            <ThemeToggle isDark={isDark} toggle={toggle} variant="sidebar" />
          </div>

          {/* Trial / Pro card — only for signed-in users */}
          {isSignedIn && (
            <div className="px-4 pb-2 pt-1">
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
          )}

          {/* Install buttons */}
          <div className="px-4 pb-2 flex flex-col gap-1.5">
            <Link href="/android">
              <div className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-white bg-sidebar-accent/40 hover:bg-sidebar-accent/70 transition-colors cursor-pointer text-[14px] font-extrabold border border-sidebar-border tracking-wide">
                <span className="text-base">🤖</span> Install on Android
              </div>
            </Link>
            <Link href="/ios">
              <div className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-white bg-sidebar-accent/40 hover:bg-sidebar-accent/70 transition-colors cursor-pointer text-[14px] font-extrabold border border-sidebar-border tracking-wide">
                <span className="text-base">🍎</span> Install on iPhone
              </div>
            </Link>
          </div>

          {/* Footer */}
          <div className="px-5 pb-3 pt-1 text-center">
            <p className="text-[10px] text-primary font-bold">PrepFit © 2026 · version 2.0.0</p>
            <p className="text-[10px] text-white font-semibold mt-0.5">bestappsmade LLC</p>
            <Link href="/privacy">
              <span className="text-[10px] text-sidebar-foreground/40 hover:text-sidebar-foreground/70 transition-colors cursor-pointer underline">Privacy Policy</span>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen pb-24 md:pb-0 overflow-y-auto">
          {isSignedIn && <TrialBanner trial={trial} onUpgrade={() => setShowUpgrade(true)} />}
          <div key={location} className="max-w-3xl mx-auto px-3 md:px-8 py-4 md:py-8 animate-in fade-in duration-300">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border z-20">
          <div className="flex items-center overflow-x-auto scrollbar-hide px-1 py-1.5 scroll-smooth">
            {mobileNavItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <div className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 cursor-pointer shrink-0 min-w-[58px]">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors text-lg ${active ? "bg-primary/20" : ""}`}>
                      {item.emoji}
                    </div>
                    <span className={`text-[9px] font-bold tracking-wide whitespace-nowrap ${active ? "text-primary" : "text-sidebar-foreground/35"}`}>
                      {item.label.split(" ")[0]}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}
