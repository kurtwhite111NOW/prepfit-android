import { Clock, ArrowRight, X } from "lucide-react";
import { useState } from "react";
import type { TrialState } from "@/hooks/use-trial";

interface TrialBannerProps {
  trial: TrialState;
  onUpgrade: () => void;
}

export function TrialBanner({ trial, onUpgrade }: TrialBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (trial.loading || trial.expired || dismissed) return null;

  const urgency = trial.daysLeft <= 1;

  return (
    <div className="w-full px-4 py-2 flex items-center justify-between gap-3 bg-background border-b border-border/50">
      <div className="flex items-center gap-2.5 min-w-0">
        <span
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold border ${
            urgency
              ? "bg-amber-400 border-amber-500 text-amber-900"
              : "bg-yellow-300 border-yellow-400 text-yellow-900"
          }`}
        >
          <Clock size={12} className="shrink-0" />
          {trial.daysLeft === 1
            ? `Last day — ${trial.hoursLeft}h remaining`
            : `${trial.daysLeft} days left in your free trial`}
        </span>
        <ArrowRight size={16} className="text-primary shrink-0" strokeWidth={2.5} />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onUpgrade}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wide transition-all ${
            urgency
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : "bg-primary text-white hover:bg-primary/90"
          }`}
        >
          ⚡ Upgrade
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-foreground/30 hover:text-foreground/60 transition-colors p-1 rounded"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
