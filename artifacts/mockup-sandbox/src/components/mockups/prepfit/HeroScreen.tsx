import { useEffect, useState } from "react";

const ORANGE = "#F26B1D";
const BG = "#0D1117";
const CARD = "#161B22";
const BORDER = "rgba(255,255,255,0.08)";
const MUTED = "rgba(255,255,255,0.45)";

const FEATURES = [
  { icon: "📅", label: "Smart Meal Planning", desc: "Weekly plans tailored to your calorie goals" },
  { icon: "🛒", label: "Smart Grocery Lists", desc: "Auto-generated with clean-brand suggestions" },
  { icon: "📷", label: "Photo Calorie Scanner", desc: "Snap a meal — get instant calorie breakdown" },
  { icon: "📈", label: "Weight & Progress Tracking", desc: "Charts, BMI calculator, progress photos" },
  { icon: "💧", label: "Water & Streak Tracking", desc: "Hit daily goals and build lasting habits" },
];

function useCountdown() {
  const TRIAL_MS = 3 * 24 * 60 * 60 * 1000;
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 23, mins: 47, secs: 12 });

  useEffect(() => {
    const end = Date.now() + TRIAL_MS;
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

function CountBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        style={{
          width: 52, height: 52, borderRadius: 10,
          background: "rgba(242,107,29,0.18)",
          border: "1px solid rgba(242,107,29,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span style={{ fontSize: 9, fontWeight: 600, color: ORANGE, letterSpacing: 1 }}>{label}</span>
    </div>
  );
}

export function HeroScreen() {
  const trial = useCountdown();

  return (
    <div
      style={{
        background: BG,
        minHeight: "100vh",
        fontFamily: "'Inter', -apple-system, sans-serif",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <div style={{ maxWidth: 390, margin: "0 auto", padding: "48px 20px 32px" }}>

        {/* ── Hero Header ── */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 20, marginBottom: 14,
            background: ORANGE, border: "2.5px solid rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 38,
          }}>
            💪
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#fff", letterSpacing: -1, lineHeight: 1 }}>
            PrepFit
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: ORANGE, marginTop: 5, letterSpacing: 1.5, textTransform: "uppercase" }}>
            Meal Prep · Gym & Fitness
          </div>
          <div style={{
            fontSize: 14, color: MUTED, textAlign: "center",
            lineHeight: 1.6, marginTop: 14, maxWidth: 290,
          }}>
            The all-in-one fitness companion for busy people who want to eat clean, track progress, and feel great.
          </div>
        </div>

        {/* ── Trial Countdown ── */}
        <div style={{
          background: "rgba(242,107,29,0.08)",
          border: "1px solid rgba(242,107,29,0.35)",
          borderRadius: 16, padding: "16px 18px",
          marginBottom: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 14 }}>⏱</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: ORANGE, letterSpacing: 0.5 }}>
              Your 3-Day Free Trial
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CountBox value={trial.days} label="DAYS" />
            <span style={{ fontSize: 22, fontWeight: 700, color: ORANGE, marginBottom: 16 }}>:</span>
            <CountBox value={trial.hours} label="HRS" />
            <span style={{ fontSize: 22, fontWeight: 700, color: ORANGE, marginBottom: 16 }}>:</span>
            <CountBox value={trial.mins} label="MIN" />
            <span style={{ fontSize: 22, fontWeight: 700, color: ORANGE, marginBottom: 16 }}>:</span>
            <CountBox value={trial.secs} label="SEC" />
          </div>

          <div style={{ fontSize: 12, color: MUTED, textAlign: "center" }}>
            Full access to all features — no charge until your trial ends
          </div>
        </div>

        {/* ── Features ── */}
        <div style={{
          background: CARD, borderRadius: 16,
          border: `1px solid ${BORDER}`, marginBottom: 20, overflow: "hidden",
        }}>
          {FEATURES.map((f, i) => (
            <div
              key={f.label}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "13px 16px",
                borderBottom: i < FEATURES.length - 1 ? `1px solid ${BORDER}` : "none",
              }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: "rgba(242,107,29,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, flexShrink: 0,
              }}>
                {f.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{f.label}</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>{f.desc}</div>
              </div>
              <span style={{ fontSize: 15, color: ORANGE }}>✓</span>
            </div>
          ))}
        </div>

        {/* ── CTAs ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          {/* Primary */}
          <button style={{
            height: 54, borderRadius: 14, background: ORANGE, border: "none",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            cursor: "pointer", width: "100%",
          }}>
            <span style={{ fontSize: 17 }}>⚡</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
              Start Free Trial — 3 Days Free
            </span>
          </button>

          {/* Secondary */}
          <button style={{
            height: 48, borderRadius: 14, background: "rgba(242,107,29,0.06)",
            border: `1.5px solid ${ORANGE}`,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            cursor: "pointer", width: "100%",
          }}>
            <span style={{ fontSize: 15 }}>→</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: ORANGE }}>
              I already have an account
            </span>
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "2px 0" }}>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
            <span style={{ fontSize: 12, color: MUTED }}>or</span>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
          </div>

          {/* Demo */}
          <button style={{
            height: 44, borderRadius: 12, background: "transparent",
            border: `1px solid ${BORDER}`,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            cursor: "pointer", width: "100%",
          }}>
            <span style={{ fontSize: 15 }}>👁</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: MUTED }}>
              Explore without an account
            </span>
          </button>
        </div>

        {/* Fine print */}
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", textAlign: "center", lineHeight: 1.5 }}>
          After 3 days, $9.99/month. Cancel anytime. No commitment.
        </div>
      </div>
    </div>
  );
}
