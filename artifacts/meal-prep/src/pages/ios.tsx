import { Link } from "wouter";
import {
  Share,
  Plus,
  Smartphone,
  CheckCircle2,
  ArrowLeft,
  Wifi,
  Bell,
  Zap,
  Scale,
  Camera,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    number: "01",
    icon: "safari",
    title: "Open Safari",
    description:
      "Launch Safari on your iPhone or iPad. NutriPlan works best in Safari for full home screen installation support.",
    note: "⚠️ Must use Safari — Chrome on iOS does not support Add to Home Screen with full PWA support.",
  },
  {
    number: "02",
    icon: "qr",
    title: "Visit the App",
    description:
      "Scan the QR code on this page with your iPhone camera, or type the URL into Safari's address bar.",
    note: null,
  },
  {
    number: "03",
    icon: "share",
    title: 'Tap the Share Button',
    description:
      'Tap the Share icon (the box with an arrow pointing up) in the Safari toolbar at the bottom of your screen.',
    note: null,
  },
  {
    number: "04",
    icon: "add",
    title: '"Add to Home Screen"',
    description:
      'Scroll down in the share sheet and tap "Add to Home Screen". Give it the name NutriPlan and tap Add in the top right corner.',
    note: null,
  },
  {
    number: "05",
    icon: "done",
    title: "Launch from Home Screen",
    description:
      "NutriPlan now appears on your home screen like a native app. Tap it to open — no browser chrome, full screen experience.",
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

export default function IOSPage() {
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
        </div>
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                🍎
              </div>
              <span className="text-primary text-xs font-bold uppercase tracking-widest">
                iPhone & iPad
              </span>
            </div>
            <h1 className="font-serif text-4xl font-bold text-sidebar-foreground leading-tight mb-2">
              Install on iOS
            </h1>
            <p className="text-sidebar-foreground/50 max-w-sm text-sm leading-relaxed">
              Add NutriPlan to your iPhone or iPad home screen for a full app experience — no App Store needed.
            </p>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="bg-white p-3 rounded-2xl shadow-lg">
              <QRCode url={appUrl} size={150} />
            </div>
            <p className="text-sidebar-foreground/40 text-[11px] font-medium uppercase tracking-wider text-center">
              Scan with iPhone Camera
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
                  <p className="mt-2 text-[11px] text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 font-medium">
                    {step.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visual share sheet guide */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold text-foreground mb-4">Where to find Share on iOS</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "⬆️", label: "Tap Share", sub: "Bottom center of Safari" },
            { icon: "📋", label: "Scroll down", sub: "In the share sheet" },
            { icon: "➕", label: "Add to Home Screen", sub: "Tap & confirm name" },
          ].map((item, i) => (
            <div key={i} className="text-center rounded-xl bg-muted/40 border border-border p-4">
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="font-semibold text-foreground text-sm">{item.label}</p>
              <p className="text-muted-foreground text-[11px] mt-0.5">{item.sub}</p>
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
            { icon: Bell, label: "No App Store required", desc: "Direct install, always the latest version" },
            { icon: Smartphone, label: "Full screen", desc: "No Safari address bar — pure app experience" },
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
          <p className="font-semibold text-foreground">Using Android instead?</p>
          <p className="text-muted-foreground text-sm">See the Android installation guide.</p>
        </div>
        <Link href="/android">
          <Button variant="outline" className="gap-2 font-semibold whitespace-nowrap">
            Android Guide →
          </Button>
        </Link>
      </div>
    </div>
  );
}
