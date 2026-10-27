import { usePageTitle } from "@/hooks/use-page-title";
import {
  Clock,
  Flame,
  Zap,
  Shield,
  TrendingDown,
  Brain,
  Dumbbell,
  Sun,
  Moon,
  Coffee,
  Apple,
  AlertTriangle,
} from "lucide-react";

const EATING_WINDOW = [
  { time: "11:00 AM", label: "Break your fast", emoji: "🍳", tip: "Start with protein — eggs, Greek yogurt, or a protein shake. This spikes insulin gently and preserves muscle built overnight." },
  { time: "1:30 PM", label: "Main meal", emoji: "🥩", tip: "Your biggest meal. Prioritise lean protein (chicken, beef, fish), vegetables, and a moderate serving of complex carbs (rice, sweet potato)." },
  { time: "4:00 PM", label: "Snack (optional)", emoji: "🥜", tip: "If you train in the afternoon, a small protein-focused snack here — cottage cheese, hard-boiled eggs, or a protein bar — fuels your session." },
  { time: "5:00 PM", label: "Last meal / eating window closes", emoji: "🫐", tip: "Finish eating here. A high-protein final meal (salmon, ground beef, Greek yogurt) keeps you full through the fasting window." },
];

const FASTING_WINDOW = [
  { time: "5:00 PM", label: "Fasting begins", emoji: "🚫", tip: "Stop eating. Your body will spend the next 18 hours burning stored fat for energy." },
  { time: "8:00 PM", label: "Insulin normalises", emoji: "📉", tip: "Blood insulin drops to baseline — your body shifts from fat storage to fat burning mode." },
  { time: "12:00 AM", label: "Deep fat burn", emoji: "🔥", tip: "Growth hormone surges during sleep, protecting muscle mass while your body burns fat for fuel." },
  { time: "6:00 AM", label: "Autophagy peaks", emoji: "🔬", tip: "Your cells are cleaning house — removing damaged proteins and recycling cellular components. This is the anti-aging, recovery phase." },
  { time: "11:00 AM", label: "Fast ends", emoji: "✅", tip: "18 hours complete. Time to eat again and repeat the cycle." },
];

const BENEFITS = [
  {
    icon: TrendingDown,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    title: "Fat Loss Without Counting Every Calorie",
    body: "Restricting your eating to a 6-hour window naturally reduces total calorie intake. You eat fewer meals, so you eat less — without obsessing over every bite. Studies show 18:6 fasting reduces daily intake by 300–500 calories on average.",
  },
  {
    icon: Shield,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    title: "Improved Insulin Sensitivity",
    body: "Giving your body 18 hours without food lowers fasting insulin levels. Lower insulin = your cells become MORE responsive to it. Better insulin sensitivity means your body stores less fat and burns more of it as fuel.",
  },
  {
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    title: "Mental Clarity in the Morning",
    body: "Most people notice sharper focus and mental energy during the fasted state. Your brain runs on ketones (from fat burning) — a cleaner, steadier fuel than glucose. No blood sugar crashes, no mid-morning slump.",
  },
  {
    icon: Dumbbell,
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
    title: "Muscle Preservation (With High Protein)",
    body: "Contrary to the myth, short-term fasting does NOT burn muscle. Growth hormone surges during the fasted state, actively protecting lean mass. Hitting your protein target (0.7–1g per lb of bodyweight) inside your eating window is all you need.",
  },
  {
    icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    title: "Cellular Autophagy",
    body: "After 14–16 hours of fasting, your body triggers autophagy — a cellular cleanup process where damaged proteins and cellular waste are broken down and recycled. This is linked to reduced inflammation, slower aging, and better recovery.",
  },
  {
    icon: Flame,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    title: "Circadian Rhythm Alignment",
    body: "Eating from 11am–5pm aligns your meals with peak digestive enzyme activity and insulin sensitivity. Your gut is primed to process food in the afternoon. Eating late at night works against your biology — it stores fat more efficiently.",
  },
];

const HIGH_PROTEIN_TIPS = [
  { emoji: "🍳", title: "Break fast with 40–50g protein", body: "Eggs, Greek yogurt, cottage cheese, or a protein shake. High protein at meal 1 sets your appetite for the day — you'll feel fuller longer and crave less junk." },
  { emoji: "🥩", title: "0.7–1g protein per lb of bodyweight", body: "For a 170 lb person that's 120–170g of protein daily. This sounds like a lot — it isn't. Split across 2–3 meals in your 6-hour window and it's very achievable." },
  { emoji: "🐟", title: "Rotate your protein sources", body: "Chicken breast, ground beef, salmon, tuna, shrimp, turkey, eggs, Greek yogurt, cottage cheese, protein powder. Variety = better amino acid profile and you won't get bored." },
  { emoji: "🥛", title: "Protein slows carb absorption", body: "Always eat protein WITH your carbs. It blunts the blood sugar spike, keeps insulin stable, and means more of those carbs fuel muscle glycogen instead of being stored as fat." },
  { emoji: "💊", title: "Creatine during your eating window", body: "5g of creatine monohydrate daily is the most evidence-backed supplement for strength and muscle. Take it with any meal inside your eating window — timing doesn't matter much." },
  { emoji: "🫙", title: "Meal prep your proteins on Sunday", body: "Cook 5–7 days of chicken, ground beef, or hard-boiled eggs in one session. Having protein ready-to-go means you'll hit your goals even on your busiest days." },
];

const FASTING_MISTAKES = [
  { title: "Breaking the fast with sugar or simple carbs", fix: "Start with protein + fat. Save carbs for after you've eaten protein first." },
  { title: "Not drinking enough water", fix: "Aim for 2–3 litres of water during your fasting window. Black coffee and plain tea are fine too." },
  { title: "Eating too little protein", fix: "Under-eating protein causes muscle loss. Hit your target every single day inside your eating window." },
  { title: "Eating too late at night", fix: "Closing your window at 5–6pm is where the real magic happens. Eating at 9pm defeats the circadian benefit." },
  { title: "Giving up after one week", fix: "It takes 2–3 weeks for hunger hormones (ghrelin) to adapt. The morning hunger fades. Stick with it." },
  { title: "Over-complicating the meals", fix: "Simple high-protein meals beat elaborate recipes every time. Prep in bulk, eat simple, stay consistent." },
];

export default function FastingGuide() {
  usePageTitle("Fasting Guide", "The complete 18:6 intermittent fasting guide — eating window, benefits, high-protein tips, and common mistakes.");

  return (
    <div className="space-y-10 animate-in fade-in duration-500">

      {/* Hero */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Fasting Guide</p>
        <h1 className="font-serif text-4xl font-bold text-foreground leading-tight mb-3">
          The 18:6 Fasting Window
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
          Eat from <strong className="text-foreground">11 AM to 5 PM</strong>. Fast for 18 hours. Build muscle, burn fat, and feel sharper — without obsessing over every calorie.
        </p>
      </section>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Eating window", value: "6 hrs", icon: "🕐" },
          { label: "Fasting window", value: "18 hrs", icon: "🌙" },
          { label: "Meals per day", value: "2–3", icon: "🍽️" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="font-bold text-xl text-foreground">{s.value}</p>
            <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wide mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Eating Window Timeline */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <Sun size={14} className="text-emerald-400" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground">Eating Window: 11 AM – 5 PM</h2>
        </div>
        <p className="text-muted-foreground text-sm">What to eat and when during your 6-hour window.</p>
        <div className="space-y-3">
          {EATING_WINDOW.map((item, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-5 flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl gradient-emerald flex items-center justify-center shrink-0 shadow-sm text-lg">
                  {item.emoji}
                </div>
                {i < EATING_WINDOW.length - 1 && (
                  <div className="w-px flex-1 bg-border mt-2 min-h-[20px]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">{item.time}</span>
                  <span className="font-semibold text-sm text-foreground">{item.label}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fasting Window Timeline */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center">
            <Moon size={14} className="text-indigo-400" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground">Fasting Window: 5 PM – 11 AM</h2>
        </div>
        <p className="text-muted-foreground text-sm">What's happening inside your body during the 18-hour fast.</p>
        <div className="space-y-3">
          {FASTING_WINDOW.map((item, i) => (
            <div key={i} className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5 flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/25 flex items-center justify-center shrink-0 text-lg">
                  {item.emoji}
                </div>
                {i < FASTING_WINDOW.length - 1 && (
                  <div className="w-px flex-1 bg-indigo-500/20 mt-2 min-h-[20px]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-500/15 px-2 py-0.5 rounded-lg">{item.time}</span>
                  <span className="font-semibold text-sm text-foreground">{item.label}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
            <Zap size={14} className="text-primary" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground">Why 18:6 Works</h2>
        </div>
        <p className="text-muted-foreground text-sm">The science behind the eating window — no fluff, just what actually happens.</p>
        <div className="grid md:grid-cols-2 gap-3">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className={`rounded-2xl border p-5 ${b.bg}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={16} className={b.color} />
                  <h3 className="font-semibold text-sm text-foreground">{b.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* High Protein Tips */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-500/15 flex items-center justify-center">
            <Dumbbell size={14} className="text-orange-400" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground">High-Protein Eating Inside Your Window</h2>
        </div>
        <p className="text-muted-foreground text-sm">Protein is the most important macro during intermittent fasting. Here's how to nail it.</p>
        <div className="space-y-3">
          {HIGH_PROTEIN_TIPS.map((tip, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-5 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 text-xl">
                {tip.emoji}
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-1">{tip.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{tip.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What you can have while fasting */}
      <section className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Coffee size={15} className="text-primary" />
          <h2 className="font-semibold text-foreground">What You Can Have During the Fast</h2>
        </div>
        <div className="divide-y divide-border">
          {[
            { item: "Water (still or sparkling)", ok: true },
            { item: "Black coffee (no milk, no sugar)", ok: true },
            { item: "Plain tea (green, black, herbal)", ok: true },
            { item: "Electrolytes (salt, magnesium — zero calorie)", ok: true },
            { item: "Apple cider vinegar in water", ok: true },
            { item: "Milk, cream, or sweetened coffee", ok: false },
            { item: "Chewing gum (contains calories)", ok: false },
            { item: "Protein shakes or BCAAs", ok: false },
            { item: 'Any food, even "healthy" food', ok: false },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-foreground">{row.item}</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${row.ok ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                {row.ok ? "✓ Fine" : "✗ Breaks fast"}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Common mistakes */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-500/15 flex items-center justify-center">
            <AlertTriangle size={14} className="text-red-400" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground">Common Mistakes (and How to Fix Them)</h2>
        </div>
        <div className="space-y-3">
          {FASTING_MISTAKES.map((m, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                <p className="text-sm font-semibold text-foreground">{m.title}</p>
              </div>
              <div className="flex items-start gap-2 ml-4">
                <span className="text-emerald-400 mt-0.5 shrink-0">→</span>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.fix}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sample day */}
      <section className="rounded-2xl border border-primary/15 bg-primary/5 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Apple size={16} className="text-primary" />
          <h2 className="font-serif text-xl font-bold text-foreground">A Perfect 18:6 Day</h2>
        </div>
        <div className="space-y-2 text-sm">
          {[
            { time: "7:00 AM", action: "Wake up — black coffee or tea ☕" },
            { time: "9:00 AM", action: "Water + electrolytes if training fasted 💧" },
            { time: "10:00 AM", action: "Optional fasted workout (great for fat burning) 🏋️" },
            { time: "11:00 AM", action: "Break fast — 4 eggs + Greek yogurt or protein shake 🍳" },
            { time: "1:30 PM", action: "Main meal — 8 oz chicken, 1 cup rice, roasted veg 🥩" },
            { time: "4:30 PM", action: "Final meal — salmon, sweet potato, side salad 🐟" },
            { time: "5:00 PM", action: "Eating window CLOSED 🚫" },
            { time: "5 PM → 11 AM", action: "18-hour fast — water, coffee, tea only 🌙" },
          ].map((row, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-primary font-bold text-xs w-24 shrink-0 pt-0.5">{row.time}</span>
              <span className="text-foreground/80">{row.action}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA to planner */}
      <section className="rounded-2xl border border-border bg-card p-6 text-center">
        <div className="text-3xl mb-3">💪</div>
        <h3 className="font-serif text-xl font-bold text-foreground mb-2">Ready to build your fasting meal plan?</h3>
        <p className="text-muted-foreground text-sm mb-4">Use the Meal Planner to generate high-protein meals perfectly sized for your 11 AM – 5 PM eating window.</p>
        <a
          href="/planner"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-emerald text-white font-bold text-sm shadow-md hover:opacity-90 transition-opacity"
        >
          <Flame size={15} />
          Go to Meal Planner
        </a>
      </section>

    </div>
  );
}
