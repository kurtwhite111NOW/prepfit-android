import { Link } from "wouter";
import { usePageTitle } from "@/hooks/use-page-title";
import {
  ArrowLeft, CheckCircle2, Zap,
  Scale, Camera, CalendarDays, ShoppingCart, Download,
  ExternalLink, Monitor, MoreHorizontal,
} from "lucide-react";

const BROWSERS = [
  {
    name: "Microsoft Edge",
    emoji: "🟦",
    status: "Recommended",
    description: "Built into Windows 10/11. Best PWA support — shows install button directly in the address bar.",
    link: "https://www.microsoft.com/en-us/edge",
    linkLabel: "Get Edge",
  },
  {
    name: "Google Chrome",
    emoji: "🌐",
    status: "Supported",
    description: "Shows an install icon in the address bar. Works on all Windows versions.",
    link: "https://www.google.com/chrome/",
    linkLabel: "Get Chrome",
  },
];

const STEPS = [
  {
    number: "01",
    icon: Monitor,
    title: "Open Edge or Chrome on your PC",
    description: "Launch Microsoft Edge (recommended) or Google Chrome. Navigate to PrepFit by typing the URL in the address bar.",
    visual: (
      <div className="flex items-center gap-2 mt-3 p-2.5 rounded-xl bg-muted/50 border border-border text-xs font-mono text-muted-foreground">
        <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
        prepfit.fit
      </div>
    ),
    tip: null,
  },
  {
    number: "02",
    icon: Download,
    title: "Look for the install icon in the address bar",
    description: "Once the page loads, you'll see a small computer/install icon (⊕) appear at the right end of the address bar. Click it.",
    visual: (
      <div className="flex items-center justify-center mt-3">
        <div className="flex items-center gap-2 bg-muted border border-border rounded-xl px-4 py-3 shadow text-xs text-foreground/70 w-full max-w-xs">
          <div className="flex-1 bg-background rounded-lg px-3 py-1.5 text-xs font-mono border border-border text-muted-foreground truncate">prepfit.fit</div>
          <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Download size={13} className="text-primary" />
          </div>
        </div>
      </div>
    ),
    tip: "💡 Don't see the icon? Try the menu method in the next step instead.",
  },
  {
    number: "03",
    icon: MoreHorizontal,
    title: "Or use the browser menu",
    description: 'If no icon appears in the address bar, click the 3-dot menu (⋯) in the top-right corner. In Edge: select "Apps" → "Install this site as an app". In Chrome: select "Save and share" → "Install page as app".',
    visual: (
      <div className="flex items-center justify-end mt-3">
        <div className="flex flex-col gap-0.5 bg-muted border border-border rounded-xl px-3 py-2.5 w-52 text-xs text-foreground/70 shadow">
          {["New tab", "New window", "History", "Downloads", "Apps ▶  Install this site as an app ✦", "Settings"].map((item, i) => (
            <div key={i} className={`py-1 px-1 rounded ${item.includes("Install") ? "bg-primary/10 text-primary font-semibold" : ""}`}>
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    tip: null,
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: 'Click "Install" in the popup',
    description: 'A small dialog will appear asking "Install PrepFit?". Click the blue "Install" button. The app will open in its own window immediately.',
    visual: (
      <div className="flex items-center justify-center mt-3">
        <div className="bg-muted border border-border rounded-2xl px-5 py-4 shadow text-center w-56">
          <div className="text-2xl mb-1">💪</div>
          <p className="text-xs font-semibold text-foreground mb-0.5">Install PrepFit?</p>
          <p className="text-[10px] text-muted-foreground mb-3">prepfit.fit</p>
          <button className="w-full py-1.5 rounded-lg bg-primary text-white text-xs font-bold">Install</button>
        </div>
      </div>
    ),
    tip: null,
  },
  {
    number: "05",
    icon: Monitor,
    title: "PrepFit is now on your Desktop",
    description: "The app opens in its own standalone window — no browser tabs, no address bar. You'll also find a PrepFit shortcut on your Desktop and in the Start Menu.",
    visual: (
      <div className="flex items-center justify-center mt-3 gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-2xl gradient-emerald flex items-center justify-center text-2xl shadow-lg">💪</div>
          <span className="text-[10px] text-muted-foreground">Desktop</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">🪟</div>
          <span className="text-[10px] text-muted-foreground">Start Menu</span>
        </div>
      </div>
    ),
    tip: "✅ To uninstall: right-click the app icon → Uninstall, or go to Settings → Apps.",
  },
];

const FEATURES = [
  { icon: CalendarDays, label: "Weekly meal plans, offline" },
  { icon: ShoppingCart, label: "Grocery list on a big screen" },
  { icon: Camera, label: "Photo calorie scanner" },
  { icon: Scale, label: "Weight tracker with chart" },
  { icon: Download, label: "No Play Store or App Store needed" },
  { icon: Zap, label: "Instant launch from Desktop" },
];

export default function WindowsPage() {
  usePageTitle("Install on Windows — PrepFit");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Back */}
        <Link href="/">
          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
            <ArrowLeft size={15} />
            Back to Dashboard
          </button>
        </Link>

        {/* Hero */}
        <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/15 p-6 mb-6 text-center">
          <div className="w-16 h-16 rounded-2xl gradient-emerald flex items-center justify-center text-3xl shadow-xl mx-auto mb-4">💪</div>
          <h1 className="font-serif font-bold text-2xl text-foreground mb-1">Install on Windows</h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
            Add PrepFit to your Windows Desktop — works like a real app, no app store required.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <Download size={11} />
            Free — Works on Windows 10 & 11
          </div>
        </div>

        {/* Recommended Browsers */}
        <div className="mb-6">
          <h2 className="font-serif font-bold text-lg text-foreground mb-3">Choose your browser</h2>
          <div className="flex flex-col gap-2">
            {BROWSERS.map((b) => (
              <div key={b.name} className="flex items-center gap-3 p-3.5 rounded-2xl border border-border bg-card">
                <span className="text-2xl">{b.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-foreground">{b.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.status === "Recommended" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {b.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{b.description}</p>
                </div>
                <a href={b.link} target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center gap-1 text-[11px] text-primary font-semibold hover:underline">
                  {b.linkLabel} <ExternalLink size={10} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="mb-6">
          <h2 className="font-serif font-bold text-lg text-foreground mb-4">Step-by-step guide</h2>
          <div className="flex flex-col gap-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative">
                  {i < STEPS.length - 1 && (
                    <div className="absolute left-[22px] top-[48px] bottom-[-16px] w-px bg-border" />
                  )}
                  <div className="flex gap-4">
                    <div className="shrink-0 w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0 pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">{step.number}</span>
                      </div>
                      <h3 className="font-semibold text-foreground text-sm leading-snug mb-1">{step.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                      {step.visual}
                      {step.tip && (
                        <p className="mt-2 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/20 rounded-xl px-3 py-2 leading-snug">
                          {step.tip}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <div className="rounded-3xl bg-card border border-border p-5 mb-6">
          <h2 className="font-serif font-bold text-base text-foreground mb-3">What you get on Desktop</h2>
          <div className="grid grid-cols-2 gap-2">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon size={12} className="text-primary" />
                </div>
                <span className="text-xs text-muted-foreground leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Other platforms */}
        <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Also available on</p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Link href="/android">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors">
                🤖 Android
              </button>
            </Link>
            <Link href="/ios">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors">
                🍎 iPhone
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
