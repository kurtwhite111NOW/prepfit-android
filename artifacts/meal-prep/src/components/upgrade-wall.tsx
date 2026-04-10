import { Leaf, Check, Star, Shield, Zap, Brain, ShoppingCart, ScanLine, Scale } from "lucide-react";

const features = [
  { icon: Brain, label: "AI Meal Plan Generation", desc: "Personalized weekly plans in seconds" },
  { icon: ShoppingCart, label: "Smart Grocery Lists", desc: "Clean-brand picks, organized by aisle" },
  { icon: ScanLine, label: "Photo Calorie Scanner", desc: "AI identifies food and estimates calories" },
  { icon: Scale, label: "Weight Tracker", desc: "Trend chart and progress insights" },
  { icon: Star, label: "My Meals Journal", desc: "Save and review all analyzed meals" },
  { icon: Shield, label: "iOS & Android PWA", desc: "Install on your home screen, use anywhere" },
];

export function UpgradeWall() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(160_35%_6%)] overflow-y-auto">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/4 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg mx-auto px-6 py-12 flex flex-col items-center text-center gap-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl gradient-emerald flex items-center justify-center shadow-2xl shadow-primary/30">
            <Leaf size={26} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-serif font-bold text-2xl text-white leading-tight">NutriPlan</p>
            <p className="text-[11px] text-white/35 font-medium uppercase tracking-widest mt-0.5">Clean Eating</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 text-[11px] font-semibold uppercase tracking-wide">
            <Zap size={11} />
            Free Trial Ended
          </div>
          <h1 className="font-serif font-bold text-3xl text-white leading-tight mt-1">
            Continue with Pro
          </h1>
          <p className="text-white/45 text-sm leading-relaxed max-w-sm">
            Your 3-day free trial has ended. Upgrade to keep using AI meal planning, calorie scanning, and all premium features.
          </p>
        </div>

        <div className="w-full rounded-2xl border border-primary/20 bg-primary/8 p-5 flex flex-col gap-3">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3 text-left">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check size={12} className="text-primary" strokeWidth={3} />
              </div>
              <div className="min-w-0">
                <p className="text-white/85 text-sm font-medium leading-none mb-0.5">{label}</p>
                <p className="text-white/35 text-xs leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col items-center gap-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider mb-2">
            Best Value
          </div>
          <div className="flex items-end gap-1.5">
            <span className="font-serif font-bold text-5xl text-white leading-none">$12</span>
            <div className="flex flex-col items-start pb-1">
              <span className="text-white/50 text-sm leading-none">/month</span>
            </div>
          </div>
          <p className="text-white/40 text-xs mt-1">Billed annually — $144.00 USD / year</p>
          <p className="text-primary/80 text-xs font-medium mt-0.5">Save vs. monthly billing · Cancel anytime</p>
        </div>

        <button className="w-full py-4 rounded-2xl gradient-emerald text-white font-bold text-base tracking-wide shadow-2xl shadow-primary/30 hover:opacity-90 active:scale-[0.98] transition-all">
          Start Pro Plan — $12 / month
        </button>

        <p className="text-white/20 text-[11px] leading-relaxed max-w-xs">
          Billed as $144.00 USD annually. Cancel anytime from your account settings. Secure payment powered by Stripe.
        </p>
      </div>
    </div>
  );
}
