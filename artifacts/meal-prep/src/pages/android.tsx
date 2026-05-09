import { Link } from "wouter";
import {
  ArrowLeft, Chrome, Smartphone, CheckCircle2, Zap,
  Scale, Camera, CalendarDays, ShoppingCart, Download,
  ExternalLink, LayoutGrid, MoreVertical, Home,
} from "lucide-react";

const BROWSERS = [
  {
    name: "Google Chrome",
    emoji: "🌐",
    status: "Recommended",
    description: "Best PWA support. Shows install banner automatically.",
    link: "https://play.google.com/store/apps/details?id=com.android.chrome",
    linkLabel: "Get Chrome",
  },
  {
    name: "Samsung Internet",
    emoji: "🔵",
    status: "Supported",
    description: "Built into Samsung phones. Fully supports Add to Home Screen.",
    link: "https://play.google.com/store/apps/details?id=com.sec.android.app.sbrowser",
    linkLabel: "Get Samsung Internet",
  },
  {
    name: "Microsoft Edge",
    emoji: "🟦",
    status: "Supported",
    description: "Shows an Add to Phone option in the menu.",
    link: "https://play.google.com/store/apps/details?id=com.microsoft.emmx",
    linkLabel: "Get Edge",
  },
];

const STEPS = [
  {
    number: "01",
    icon: Chrome,
    title: "Open Chrome on your Android",
    description: "Launch Google Chrome (or Samsung Internet / Edge). Navigate to Simple Meal Prep Planner by scanning the QR code or typing the URL.",
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
    icon: MoreVertical,
    title: 'Tap the three-dot menu (⋮)',
    description: "Tap the ⋮ icon in the top-right corner of Chrome to open the browser options menu.",
    visual: (
      <div className="flex items-center justify-end mt-3">
        <div className="flex flex-col gap-0.5 bg-muted border border-border rounded-xl px-3 py-2.5 w-44 text-xs text-foreground/70 shadow">
          {["New tab", "New incognito tab", "History", "Downloads", "Add to Home screen ✦", "Settings"].map((item, i) => (
            <div key={i} className={`py-1 px-1 rounded ${item.includes("Home") ? "bg-primary/10 text-primary font-semibold" : ""}`}>
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    tip: null,
  },
  {
    number: "03",
    icon: Home,
    title: '"Add to Home Screen"',
    description: 'Find and tap "Add to Home Screen" in the menu. A dialog will appear showing the app name and icon.',
    visual: (
      <div className="mt-3 p-3 rounded-xl bg-muted/40 border border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-emerald flex items-center justify-center text-white text-lg shrink-0">🌿</div>
        <div>
          <p className="text-sm font-semibold text-foreground">Simple Meal Prep Planner</p>
          <p className="text-xs text-muted-foreground">prepfit.fit</p>
        </div>
        <div className="ml-auto flex gap-2 text-xs">
          <button className="px-3 py-1 rounded-lg border border-border text-muted-foreground">Cancel</button>
          <button className="px-3 py-1 rounded-lg gradient-emerald text-white font-semibold">Add</button>
        </div>
      </div>
    ),
    tip: null,
  },
  {
    number: "04",
    icon: LayoutGrid,
    title: "Tap Add — it's on your home screen",
    description: "Tap Add to confirm. The app icon will appear on your Android home screen instantly.",
    visual: (
      <div className="mt-3 grid grid-cols-4 gap-2">
        {["📱", "🎵", "📷", "🌿"].map((emoji, i) => (
          <div key={i} className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-2xl ${i === 3 ? "gradient-emerald shadow-lg ring-2 ring-primary/30" : "bg-muted/50 border border-border"}`}>
            {emoji}
            {i === 3 && <span className="text-[8px] text-white font-bold mt-0.5">Simple Meal Prep</span>}
          </div>
        ))}
      </div>
    ),
    tip: "💡 Some Android phones also show an automatic 'Install' banner at the bottom of Chrome — just tap that instead!",
  },
  {
    number: "05",
    icon: Zap,
    title: "Launch — it's a full native app experience",
    description: "Tap the Simple Meal Prep Planner icon on your home screen. It opens full screen with no browser bar — just like an app from the Play Store.",
    visual: null,
    tip: null,
  },
];

const FEATURES = [
  { icon: CalendarDays, label: "AI Meal Plans", desc: "Personalized weekly plans in seconds" },
  { icon: Camera, label: "Photo Calorie Scanner", desc: "Snap a meal, get instant calorie breakdown" },
  { icon: Scale, label: "Weight Tracker", desc: "Chart your progress with trend graphs" },
  { icon: ShoppingCart, label: "Smart Grocery Lists", desc: "Clean-brand picks, organized by aisle" },
];

function QRCode({ url, size = 160 }: { url: string; size?: number }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&color=0a1a0a&bgcolor=faf8f5&margin=12&qzone=1`;
  return (
    <img src={qrUrl} alt="QR code to open PrepFit" width={size} height={size} className="rounded-xl" />
  );
}

export default function AndroidPage() {
  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://prepfit.fit";

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-3xl mx-auto">

      {/* Back */}
      <Link href="/">
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={15} />
          Back to Dashboard
        </button>
      </Link>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-sidebar">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-amber-400/8 blur-3xl" />
        </div>
        <div className="relative px-8 pt-8 pb-8 flex flex-col sm:flex-row items-start sm:items-center gap-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-lg">🤖</div>
              <span className="text-primary text-xs font-bold uppercase tracking-widest">Android</span>
            </div>
            <p className="font-extrabold text-2xl text-primary mb-1">PrepFit</p>
            <h1 className="font-serif text-4xl font-bold text-sidebar-foreground leading-tight mb-3">
              Install Simple Meal Prep Planner<br />on Android
            </h1>
            <p className="text-sidebar-foreground/50 text-sm leading-relaxed max-w-xs mb-5">
              Add it to your home screen in under a minute — no Play Store, no downloads, always up to date.
            </p>
            <a
              href={appUrl}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-emerald text-white text-sm font-semibold shadow-lg"
            >
              <Download size={15} />
              Open in Chrome to Install
            </a>
          </div>

          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="bg-[#faf8f5] p-3 rounded-2xl shadow-xl">
              <QRCode url={appUrl} size={140} />
            </div>
            <p className="text-sidebar-foreground/35 text-[10px] font-semibold uppercase tracking-widest text-center">
              Scan with camera
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Step-by-Step Guide</h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="p-5">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl gradient-emerald flex items-center justify-center text-white font-bold text-sm shrink-0 shadow">
                    {step.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={14} className="text-muted-foreground shrink-0" />
                      <h3 className="font-semibold text-foreground text-[15px]">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                    {step.visual}
                    {step.tip && (
                      <p className="mt-3 text-[11px] text-primary bg-primary/8 border border-primary/15 rounded-xl px-3 py-2 font-medium leading-relaxed">
                        {step.tip}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Supported browsers with links */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Compatible Browsers</h2>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="grid gap-3">
          {BROWSERS.map((b) => (
            <div key={b.name} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-4">
              <div className="text-3xl shrink-0">{b.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-foreground text-sm">{b.name}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.status === "Recommended" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {b.status}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs leading-snug">{b.description}</p>
              </div>
              <a
                href={b.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-foreground/70 hover:text-foreground hover:border-primary/30 transition-all shrink-0"
              >
                {b.linkLabel}
                <ExternalLink size={11} />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* After install */}
      <section className="rounded-2xl border border-primary/15 bg-primary/5 p-6">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-primary" />
          What you get after installing
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { emoji: "📴", label: "Works offline", desc: "Core features cached on device" },
            { emoji: "🚀", label: "Instant launch", desc: "Opens in under a second" },
            { emoji: "🖥️", label: "Full screen", desc: "No browser bar, pure app" },
            { emoji: "🔄", label: "Auto-updates", desc: "Always latest when online" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <span className="text-xl shrink-0">{item.emoji}</span>
              <div>
                <p className="font-semibold text-foreground text-sm leading-none mb-0.5">{item.label}</p>
                <p className="text-muted-foreground text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">All Features Included</h2>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="rounded-2xl border border-border bg-card p-4 flex gap-3 items-start">
                <div className="w-9 h-9 rounded-xl gradient-emerald flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm leading-snug">{f.label}</p>
                  <p className="text-muted-foreground text-xs leading-snug mt-0.5">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Learn more links */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-semibold text-foreground mb-4 text-sm">Learn more about PWA apps</h2>
        <div className="space-y-2">
          {[
            { label: "What is a Progressive Web App?", href: "https://developer.chrome.com/docs/capabilities/", src: "developer.chrome.com" },
            { label: "Add to Home Screen on Android — Google Support", href: "https://support.google.com/chrome/answer/9658361", src: "support.google.com" },
            { label: "Samsung Internet: Add page to Home screen", href: "https://www.samsung.com/global/galaxy/apps/samsung-internet/", src: "samsung.com" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border transition-all group"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{link.label}</p>
                <p className="text-xs text-muted-foreground">{link.src}</p>
              </div>
              <ExternalLink size={13} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </a>
          ))}
        </div>
      </section>

    </div>
  );
}
