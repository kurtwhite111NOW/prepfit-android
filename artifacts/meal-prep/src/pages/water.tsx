import { useState, useEffect } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { Droplets, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

const GOAL = 8;

export default function Water() {
  usePageTitle("Water Tracker", "Track your daily water intake and stay hydrated for peak gym performance. Log glasses and hit your daily goal.");
  const today = new Date().toISOString().split("T")[0];
  const storageKey = `water_${today}`;
  const lastLoggedKey = `water_lastlogged_${today}`;

  const [glasses, setGlasses] = useState<number>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? parseInt(saved, 10) : 0;
  });

  const [lastLogged, setLastLogged] = useState<string | null>(
    () => localStorage.getItem(lastLoggedKey)
  );

  useEffect(() => {
    localStorage.setItem(storageKey, String(glasses));
  }, [glasses, storageKey]);

  const addGlass = () => {
    const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    setGlasses((g) => g + 1);
    setLastLogged(time);
    localStorage.setItem(lastLoggedKey, time);
  };

  const removeGlass = () => {
    setGlasses((g) => Math.max(0, g - 1));
  };

  const resetGlasses = () => {
    setGlasses(0);
    setLastLogged(null);
    localStorage.removeItem(lastLoggedKey);
  };

  const pct = Math.min(100, Math.round((glasses / GOAL) * 100));
  const circumference = 2 * Math.PI * 44;

  const statusMsg =
    glasses === 0 ? "Time to hydrate! 💧"
    : glasses < 4 ? "Keep drinking! 💪"
    : glasses < GOAL ? "Almost there! 🔥"
    : "Goal reached! ⚡";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Hydration</p>
        <h1 className="font-serif text-4xl font-bold text-foreground leading-tight mb-2">Water Tracker</h1>
        <p className="text-muted-foreground">8 glasses a day keeps the gains on track.</p>
      </section>

      <div className="rounded-2xl border border-border bg-card p-8 flex flex-col items-center text-center shadow-sm">
        <div className="relative w-44 h-44 mb-6">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
            <circle
              cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="8"
              strokeLinecap="round"
              className="text-primary transition-all duration-500"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - pct / 100)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-extrabold text-foreground">{glasses}</span>
            <span className="text-xs text-muted-foreground font-semibold">of {GOAL} glasses</span>
          </div>
        </div>

        <p className="text-lg font-semibold text-foreground mb-1">{statusMsg}</p>
        <p className="text-muted-foreground text-sm mb-8">
          {pct}% of daily goal · {Math.max(0, GOAL - glasses)} glasses remaining
        </p>

        <div className="flex items-center gap-6">
          <Button
            variant="outline" size="icon"
            className="w-14 h-14 rounded-2xl text-lg border-2"
            onClick={removeGlass}
            disabled={glasses === 0}
          >
            <Minus size={20} />
          </Button>
          <div className="w-14 h-14 rounded-2xl gradient-emerald flex items-center justify-center shadow-lg">
            <Droplets size={24} className="text-white" />
          </div>
          <Button
            size="icon"
            className="w-14 h-14 rounded-2xl gradient-emerald border-0 shadow-md"
            onClick={addGlass}
          >
            <Plus size={20} />
          </Button>
        </div>

        {lastLogged && (
          <p className="mt-3 text-xs text-muted-foreground">Last logged: <span className="font-semibold text-foreground">{lastLogged}</span></p>
        )}

        {glasses > 0 && (
          <button
            className="mt-2 text-xs text-muted-foreground hover:text-foreground underline transition-colors"
            onClick={resetGlasses}
          >
            Reset today's count
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Today's Progress</p>
          <span className="text-xs font-bold text-primary">{pct}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden mb-4">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="grid grid-cols-8 gap-2">
          {Array.from({ length: GOAL }, (_, i) => (
            <button
              key={i}
              onClick={() => setGlasses(i < glasses ? i : i + 1)}
              className={`aspect-square rounded-xl flex items-center justify-center text-xl transition-all duration-200 ${
                i < glasses
                  ? "bg-primary/15 border-2 border-primary scale-105"
                  : "bg-muted border-2 border-border opacity-40"
              }`}
            >
              💧
            </button>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground mt-3">Each glass = ~8 oz (250 ml)</p>
      </div>

      <div className="rounded-2xl bg-primary/8 border border-primary/15 p-4 flex gap-4 items-start">
        <span className="text-2xl shrink-0 mt-0.5">💡</span>
        <div>
          <p className="font-bold text-foreground text-sm mb-0.5">Hydration tip</p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Drink 1–2 glasses before each meal — it helps with portion control and keeps your metabolism firing during training sessions. Aim to finish your last glass 1 hour before bed.
          </p>
        </div>
      </div>
    </div>
  );
}
