import { Clock, Zap, X } from "lucide-react";
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
    <div
      className={`w-full px-4 py-2.5 flex items-center justify-between gap-3 text-sm ${
        urgency
          ? "bg-amber-500/15 border-b border-amber-500/25"
          : "bg-primary/8 border-b border-primary/15"
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Clock
          size={14}
          className={urgency ? "text-amber-500 shrink-0" : "text-primary shrink-0"}
        />
        <span className={`font-medium truncate ${urgency ? "text-amber-700" : "text-foreground/75"}`}>
          {trial.daysLeft === 1
            ? `Last day of your free trial — ${trial.hoursLeft} hour${trial.hoursLeft !== 1 ? "s" : ""} remaining`
            : `${trial.daysLeft} day${trial.daysLeft !== 1 ? "s" : ""} left in your free trial`}
        </span>
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
          <Zap size={11} />
          Upgrade
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
