import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  CalendarDays,
  ShoppingBasket,
  BookOpen,
  ScanLine,
  Scale,
  Leaf,
  Zap,
} from "lucide-react";
import { useTrial } from "@/hooks/use-trial";
import { useTheme } from "@/hooks/use-theme";
import { TrialBanner } from "@/components/trial-banner";
import { UpgradeWall } from "@/components/upgrade-wall";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/planner", label: "Meal Planner", icon: CalendarDays },
  { href: "/shopping", label: "Grocery List", icon: ShoppingBasket },
  { href: "/meals", label: "My Meals", icon: BookOpen },
  { href: "/scan", label: "Scan Photo", icon: ScanLine },
  { href: "/weight", label: "Weight", icon: Scale },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const trial = useTrial();
  const { isDark, toggle } = useTheme();
  const [showUpgrade, setShowUpgrade] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <>
      {(trial.expired || showUpgrade) && !trial.loading && (
        <UpgradeWall onClose={trial.expired ? undefined : () => setShowUpgrade(false)} />
      )}

      <div className="min-h-screen bg-background flex flex-col md:flex-row">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-5 py-3.5 bg-sidebar border-b border-sidebar-border sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg gradient-emerald flex items-center justify-center shrink-0">
              <Leaf size={14} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-serif font-bold text-base text-sidebar-foreground tracking-tight leading-none block">
                NutriPlan's
              </span>
              <span className="text-[9px] text-sidebar-foreground/50 font-medium leading-none">
                Clean Eating & Weightloss
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle isDark={isDark} toggle={toggle} variant="header" />
            {!trial.expired && !trial.loading && (
              <button
                onClick={() => setShowUpgrade(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/15 text-primary text-[11px] font-semibold border border-primary/20"
              >
                <Zap size={11} />
                {trial.daysLeft}d left
              </button>
            )}
          </div>
        </header>

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-[232px] flex-col bg-sidebar border-r border-sidebar-border h-screen sticky top-0 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          {/* Logo */}
          <div className="px-6 pt-7 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl gradient-emerald flex items-center justify-center shadow-lg">
                <Leaf size={18} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <span className="font-serif font-bold text-[1.05rem] text-sidebar-foreground leading-none block">
                  NutriPlan's
                </span>
                <span className="text-[10px] text-sidebar-foreground/70 font-semibold tracking-wide leading-none block mt-0.5">
                  Clean Eating & Weightloss
                </span>
                <span className="text-[9px] text-sidebar-foreground/35 font-medium uppercase tracking-widest leading-none block mt-0.5">
                  A Meal Prep for Busy Moms
                </span>
              </div>
            </div>
          </div>

          {/* Section label */}
          <div className="px-6 mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/30">
              Menu
            </span>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`
                      relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer
                      ${active
                        ? "bg-primary/15 text-primary border border-primary/20"
                        : "text-sidebar-foreground/55 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
                      }
                    `}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-primary" />
                    )}
                    <Icon size={17} strokeWidth={active ? 2.5 : 1.75} className={active ? "text-primary" : ""} />
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

          {/* Trial / Pro Plan card */}
          <div className="px-4 pb-3 pt-2">
            <div className="rounded-2xl bg-primary/10 border border-primary/15 p-4">
              {!trial.loading && !trial.expired ? (
                <>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sidebar-foreground/80 text-[11px] font-semibold uppercase tracking-wider">
                      Free Trial
                    </p>
                    <span className="text-[10px] font-bold text-amber-400">
                      {trial.daysLeft}d left
                    </span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-sidebar-foreground/10 mb-3">
                    <div
                      className="h-1 rounded-full bg-amber-400 transition-all"
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
                  <p className="text-sidebar-foreground/80 text-[11px] font-semibold uppercase tracking-wider mb-1.5">
                    Pro Plan
                  </p>
                  <p className="text-sidebar-foreground/50 text-[11px] leading-relaxed">
                    AI meal planning + calorie scanning, all in one place.
                  </p>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-primary font-bold text-base">$12</span>
                    <span className="text-sidebar-foreground/35 text-[11px]">/month</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Android install link */}
          <div className="px-4 pb-5">
            <Link href="/android">
              <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sidebar-foreground/45 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors cursor-pointer text-[11px] font-medium border border-sidebar-border/50">
                🤖 Install on Android
              </div>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen pb-24 md:pb-0 overflow-y-auto">
          <TrialBanner trial={trial} onUpgrade={() => setShowUpgrade(true)} />
          <div className="max-w-4xl mx-auto px-4 md:px-10 py-6 md:py-10">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border flex items-center justify-around px-2 py-2 z-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <div className="flex flex-col items-center gap-1 px-3 py-1 cursor-pointer">
                  <div className={`p-1.5 rounded-lg transition-colors ${active ? "bg-primary/20" : ""}`}>
                    <Icon
                      size={19}
                      strokeWidth={active ? 2.5 : 1.75}
                      className={active ? "text-primary" : "text-sidebar-foreground/45"}
                    />
                  </div>
                  <span className={`text-[9px] font-semibold tracking-wide ${active ? "text-primary" : "text-sidebar-foreground/35"}`}>
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
