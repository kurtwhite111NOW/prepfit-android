import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  CalendarDays,
  ShoppingBasket,
  BookOpen,
  ScanLine,
  Scale,
  Leaf,
} from "lucide-react";

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

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-5 py-3.5 bg-sidebar border-b border-sidebar-border sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg gradient-emerald flex items-center justify-center">
            <Leaf size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-serif font-bold text-lg text-sidebar-foreground tracking-tight">
            NutriPlan
          </span>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[232px] flex-col bg-sidebar border-r border-sidebar-border h-screen sticky top-0 overflow-hidden">
        {/* Subtle top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        {/* Logo */}
        <div className="px-6 pt-7 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-emerald flex items-center justify-center shadow-lg">
              <Leaf size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-serif font-bold text-[1.05rem] text-sidebar-foreground leading-none block">
                NutriPlan
              </span>
              <span className="text-[10px] text-sidebar-foreground/40 font-medium uppercase tracking-widest">
                Clean Eating
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
                  <Icon
                    size={17}
                    strokeWidth={active ? 2.5 : 1.75}
                    className={active ? "text-primary" : ""}
                  />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom card */}
        <div className="px-4 pb-6 pt-4">
          <div className="rounded-2xl bg-primary/10 border border-primary/15 p-4">
            <p className="text-sidebar-foreground/80 text-[11px] font-semibold uppercase tracking-wider mb-1.5">
              Pro Plan
            </p>
            <p className="text-sidebar-foreground/50 text-[11px] leading-relaxed">
              AI meal planning + calorie scanning, all in one place.
            </p>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-primary font-bold text-base">$20</span>
              <span className="text-sidebar-foreground/35 text-[11px]">/month</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen pb-24 md:pb-0 overflow-y-auto">
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
  );
}
