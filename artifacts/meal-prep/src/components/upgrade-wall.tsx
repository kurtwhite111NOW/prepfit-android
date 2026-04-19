import { Leaf, Check, Star, Shield, Zap, Brain, ShoppingCart, ScanLine, Scale, X, Loader2 } from "lucide-react";
import { useStripeCheckout } from "../hooks/use-stripe-checkout";

const features = [
  { icon: Brain, label: "AI Meal Plan Generation", desc: "Personalized weekly plans in seconds" },
  { icon: ShoppingCart, label: "Smart Grocery Lists", desc: "Clean-brand picks, organized by aisle" },
  { icon: ScanLine, label: "Photo Calorie Scanner", desc: "AI identifies food and estimates calories" },
  { icon: Scale, label: "Weight Tracker", desc: "Trend chart and progress insights" },
  { icon: Star, label: "My Meals Journal", desc: "Save and review all analyzed meals" },
  { icon: Shield, label: "Android PWA Install", desc: "Add to home screen — no Play Store needed" },
];

interface UpgradeWallProps {
  onClose?: () => void;
}

export function UpgradeWall({ onClose }: UpgradeWallProps) {
  const { startCheckout, loading, error } = useStripeCheckout();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(220_22%_7%)] overflow-y-auto">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/4 blur-3xl" />
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-white/30 hover:text-white/70 hover:bg-white/8 transition-all z-10"
        >
          <X size={18} />
        </button>
      )}

      <div className="relative w-full max-w-lg mx-auto px-6 py-12 flex flex-col items-center text-center gap-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl gradient-emerald flex items-center justify-center shadow-2xl shadow-primary/30">
            <Leaf size={26} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-serif font-bold text-xl text-white leading-tight">Simple Meal Prep</p>
            <p className="text-[10px] text-white font-medium uppercase tracking-widest mt-0.5">Gym & Fitness</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 text-[11px] font-semibold uppercase tracking-wide">
            <Zap size={11} />
            {onClose ? "Upgrade Early & Save" : "Free Trial Ended"}
          </div>
          <h1 className="font-serif font-bold text-3xl text-white leading-tight mt-1">
            {onClose ? "Go Pro Today" : "Continue with Pro"}
          </h1>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            {onClose
              ? "Unlock all features and lock in the best rate before your trial ends."
              : "Your 3-day free trial has ended. Upgrade to keep using AI meal planning, calorie scanning, and all premium features."}
          </p>
        </div>

        <div className="w-full rounded-2xl border border-primary/20 bg-primary/8 p-5 flex flex-col gap-3">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3 text-left">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check size={12} className="text-primary" strokeWidth={3} />
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium leading-none mb-0.5">{label}</p>
                <p className="text-white/60 text-xs leading-snug">{desc}</p>
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
          <p className="text-white/65 text-xs mt-1">Billed annually — $144.00 USD / year</p>
          <p className="text-primary text-xs font-medium mt-0.5">Cancel anytime · No hidden fees</p>
        </div>

        {error && (
          <div className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <button
          onClick={startCheckout}
          disabled={loading}
          className="w-full py-4 rounded-2xl gradient-emerald text-white font-bold text-base tracking-wide shadow-2xl shadow-primary/30 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Redirecting to checkout...
            </>
          ) : (
            "Start Pro Plan — $12 / month"
          )}
        </button>

        <p className="text-white/45 text-[11px] leading-relaxed max-w-xs">
          Billed as $144.00 USD annually. Cancel anytime from your account settings. Secure payment powered by Stripe.
        </p>
      </div>
    </div>
  );
}
