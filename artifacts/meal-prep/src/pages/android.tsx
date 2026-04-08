import { Link } from "wouter";
import {
  ArrowLeft,
  Wifi,
  Bell,
  Smartphone,
  CheckCircle2,
  Zap,
  Scale,
  Camera,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    number: "01",
    title: "Open Chrome",
    description:
      "Launch Google Chrome on your Android phone or tablet. NutriPlan's install prompt works best in Chrome.",
    note: "💡 Samsung Internet and Edge also support Add to Home Screen on Android.",
  },
  {
    number: "02",
    title: "Scan or Type the URL",
    description:
      "Use your camera to scan the QR code on this page, or type the URL into Chrome's address bar and hit Go.",
    note: null,
  },
  {
    number: "03",
    title: "Tap the Menu (⋮)",
    description:
      'Tap the three-dot menu in the top-right corner of Chrome. This opens Chrome\'s options menu.',
    note: null,
  },
  {
    number: "04",
    title: '"Add to Home Screen"',
    description:
      'Find and tap "Add to Home Screen" in the menu. A prompt will appear — tap "Add" to confirm. The app icon will appear on your home screen.',
    note: null,
  },
  {
    number: "05",
    title: "Or: Use the Install Banner",
    description:
      'On some Android devices, Chrome shows an automatic "Add NutriPlan to Home Screen" banner at the bottom of the screen. Just tap that banner and confirm.',
    note: null,
  },
  {
    number: "06",
    title: "Launch from Home Screen",
    description:
      "Tap the NutriPlan icon on your home screen. It opens in full screen — no browser address bar — just like a native Android app.",
    note: null,
  },
];

const FEATURES = [
  { icon: CalendarDays, label: "AI Meal Plans", desc: "Generate a week of balanced meals in seconds" },
  { icon: Camera, label: "Photo Scanner", desc: "Snap a meal photo to estimate calories" },
  { icon: Scale, label: "Weight Tracker", desc: "Chart your weight loss or gain journey" },
  { icon: Zap, label: "Grocery Lists", desc: "Auto-generated shopping lists with clean brands" },
];

function QRCode({ url, size = 180 }: { url: string; size?: number }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&color=0a1a0a&bgcolor=faf8f5&margin=12&qzone=1`;
  return (
    <img
      src={qrUrl}
      alt="QR Code to open NutriPlan"
      width={size}
      height={size}
      className="rounded-2xl"
    />
  );
}

export default function AndroidPage() {
  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://nutriplan.app";

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
      <section className="relative overflow-hidden rounded-3xl bg-sidebar px-8 pt-8 pb-7">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-amber-500/60 blur-3xl" />
        </div>
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                🤖
              </div>
              <span className="text-primary text-xs font-bold uppercase tracking-widest">
                Android
              </span>
            </div>
            <h1 className="font-serif text-4xl font-bold text-sidebar-foreground leading-tight mb-2">
              Install on Android
            </h1>
            <p className="text-sidebar-foreground/50 max-w-sm text-sm leading-relaxed">
              Add NutriPlan to your Android home screen in seconds — no Play Store required, always up to date.
            </p>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="bg-white p-3 rounded-2xl shadow-lg">
              <QRCode url={appUrl} size={150} />
            </div>
            <p className="text-sidebar-foreground/40 text-[11px] font-medium uppercase tracking-wider text-center">
              Scan with Android Camera
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
          Step-by-step Installation
        </h2>
        <div className="space-y-3">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-5 flex gap-4 items-start"
            >
              <div className="w-10 h-10 rounded-xl gradient-emerald flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                {step.number}
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
                {step.note && (
                  <p className="mt-2 text-[11px] text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 font-medium">
                    {step.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visual menu guide */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold text-foreground mb-4">Where to find it in Chrome</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "⋮", label: "Tap Menu", sub: "Top-right of Chrome" },
            { icon: "📲", label: "Add to Home Screen", sub: "In the menu list" },
            { icon: "✅", label: "Confirm", sub: "Tap Add to finish" },
          ].map((item, i) => (
            <div key={i} className="text-center rounded-xl bg-muted/40 border border-border p-4">
              <div className="text-3xl mb-2 font-bold">{item.icon}</div>
              <p className="font-semibold text-foreground text-sm">{item.label}</p>
              <p className="text-muted-foreground text-[11px] mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Supported browsers */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-semibold text-foreground mb-4">Supported Android Browsers</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: "Chrome", emoji: "🌐", status: "Recommended" },
            { name: "Samsung Internet", emoji: "🔵", status: "Supported" },
            { name: "Microsoft Edge", emoji: "🟦", status: "Supported" },
          ].map((b) => (
            <div
              key={b.name}
              className="rounded-xl border border-border bg-muted/30 p-3 text-center"
            >
              <div className="text-2xl mb-1.5">{b.emoji}</div>
              <p className="font-semibold text-foreground text-xs">{b.name}</p>
              <p
                className={`text-[10px] font-semibold mt-0.5 ${
                  b.status === "Recommended" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {b.status}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          What You Get
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="rounded-2xl border border-border bg-card p-4 flex gap-3 items-start">
                <div className="w-9 h-9 rounded-xl gradient-emerald flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{f.label}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed mt-0.5">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Capabilities */}
      <section className="rounded-2xl border border-primary/15 bg-primary/5 p-6">
        <h2 className="font-semibold text-foreground mb-4">After Installing</h2>
        <div className="space-y-2.5">
          {[
            { icon: Wifi, label: "Works offline", desc: "Core features cached for offline use" },
            { icon: Bell, label: "No Play Store required", desc: "Direct install, always the latest version" },
            { icon: Smartphone, label: "Full screen", desc: "No Chrome address bar — pure app experience" },
            { icon: CheckCircle2, label: "Updates automatically", desc: "Always current when you're online" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                  <Icon size={13} className="text-primary" />
                </div>
                <div>
                  <span className="font-medium text-foreground text-sm">{item.label}</span>
                  <span className="text-muted-foreground text-xs ml-2">{item.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <div className="rounded-2xl border border-border bg-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-foreground">Using an iPhone instead?</p>
          <p className="text-muted-foreground text-sm">See the iOS installation guide.</p>
        </div>
        <Link href="/ios">
          <Button variant="outline" className="gap-2 font-semibold whitespace-nowrap">
            iOS Guide →
          </Button>
        </Link>
      </div>
    </div>
  );
}
