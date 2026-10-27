const ORANGE = "#F26B1D";
const BG = "#0D1117";
const CARD = "#161B22";
const CARD2 = "#1C2128";
const BORDER = "rgba(255,255,255,0.08)";
const MUTED = "rgba(255,255,255,0.40)";
const WHITE = "#FFFFFF";

const base: React.CSSProperties = {
  width: 390,
  height: 844,
  background: BG,
  fontFamily: "'Inter', -apple-system, sans-serif",
  overflow: "hidden",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  margin: "0 auto",
};

function StatusBar() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px 4px", flexShrink: 0 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: WHITE }}>9:41</span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <span style={{ fontSize: 12, color: WHITE }}>●●●</span>
        <span style={{ fontSize: 12, color: WHITE }}>WiFi</span>
        <span style={{ fontSize: 12, color: WHITE }}>🔋</span>
      </div>
    </div>
  );
}

function NavBar({ active }: { active: string }) {
  const tabs = [
    { icon: "🏠", label: "Home" },
    { icon: "📅", label: "Planner" },
    { icon: "📷", label: "Scan" },
    { icon: "🛒", label: "Grocery" },
    { icon: "⚖️", label: "Weight" },
  ];
  return (
    <div style={{
      display: "flex", justifyContent: "space-around", alignItems: "center",
      background: CARD, borderTop: `1px solid ${BORDER}`,
      padding: "8px 0 16px", flexShrink: 0,
    }}>
      {tabs.map((t) => (
        <div key={t.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <span style={{ fontSize: 20 }}>{t.icon}</span>
          <span style={{ fontSize: 10, color: t.label === active ? ORANGE : MUTED, fontWeight: t.label === active ? 700 : 400 }}>{t.label}</span>
          {t.label === active && <div style={{ width: 4, height: 4, borderRadius: 2, background: ORANGE }} />}
        </div>
      ))}
    </div>
  );
}

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: WHITE, letterSpacing: -0.5 }}>{title}</div>
      {sub && <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Pill({ label, color = ORANGE }: { label: string; color?: string }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", padding: "3px 10px",
      borderRadius: 20, background: `${color}20`, border: `1px solid ${color}50`,
      fontSize: 11, fontWeight: 600, color,
    }}>{label}</div>
  );
}

function MealCard({ name, cal, type, color }: { name: string; cal: number; type: string; color: string }) {
  return (
    <div style={{
      background: CARD2, borderRadius: 12, padding: "12px 14px",
      border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 12,
      marginBottom: 8,
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
        {type === "breakfast" ? "🍳" : type === "lunch" ? "🥗" : type === "dinner" ? "🍗" : "🥜"}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: WHITE }}>{name}</div>
        <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{type.charAt(0).toUpperCase() + type.slice(1)}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: ORANGE }}>{cal}</div>
        <div style={{ fontSize: 10, color: MUTED }}>kcal</div>
      </div>
    </div>
  );
}

export function Screen1Dashboard() {
  return (
    <div style={base}>
      <StatusBar />
      <div style={{ flex: 1, overflowY: "hidden", padding: "8px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: MUTED }}>Good morning 👋</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: WHITE }}>Sarah Johnson</div>
          </div>
          <div style={{
            width: 42, height: 42, borderRadius: 21, background: ORANGE,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
          }}>💪</div>
        </div>

        <div style={{
          background: `linear-gradient(135deg, ${ORANGE}22, ${ORANGE}08)`,
          border: `1px solid ${ORANGE}40`, borderRadius: 16, padding: "16px",
          marginBottom: 16, display: "flex", gap: 0,
        }}>
          {[["1,840", "Daily Calories", ORANGE], ["5/7", "Meals Logged", "#22C55E"], ["6/8", "Water Glasses", "#38BDF8"]].map(([val, label, color]) => (
            <div key={label as string} style={{ flex: 1, textAlign: "center", borderRight: label !== "Water Glasses" ? `1px solid ${BORDER}` : "none" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: color as string }}>{val}</div>
              <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: MUTED, marginBottom: 10, letterSpacing: 0.5 }}>QUICK ACTIONS</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[
            ["📅", "Planner", ORANGE],
            ["📷", "Scan Meal", "#F59E0B"],
            ["🛒", "Grocery", "#3B82F6"],
            ["💧", "Water", "#38BDF8"],
            ["📈", "Weight", "#22C55E"],
            ["🔖", "My Plans", "#A855F7"],
          ].map(([icon, label, color]) => (
            <div key={label as string} style={{
              background: CARD2, borderRadius: 12, padding: "14px 10px",
              border: `1px solid ${BORDER}`, display: "flex", flexDirection: "column",
              alignItems: "center", gap: 6,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color as string}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</div>
              <span style={{ fontSize: 11, fontWeight: 600, color: WHITE }}>{label}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: MUTED, marginBottom: 10, letterSpacing: 0.5 }}>TODAY'S PLAN</div>
        <MealCard name="Greek Yogurt Parfait" cal={320} type="breakfast" color={ORANGE} />
        <MealCard name="Grilled Chicken Salad" cal={480} type="lunch" color="#22C55E" />
      </div>
      <NavBar active="Home" />
    </div>
  );
}

export function Screen2Planner() {
  return (
    <div style={base}>
      <StatusBar />
      <div style={{ flex: 1, overflowY: "hidden", padding: "8px 20px 0" }}>
        <SectionHeader title="Meal Planner" sub="AI-powered weekly meal plan" />

        <div style={{
          background: `${ORANGE}12`, border: `1px solid ${ORANGE}40`,
          borderRadius: 14, padding: "14px 16px", marginBottom: 14,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: ORANGE, marginBottom: 12 }}>⚙️ Plan Settings</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <div style={{ flex: 1, background: CARD2, borderRadius: 10, padding: "10px 12px", border: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 10, color: MUTED }}>Daily Calories</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: WHITE, marginTop: 2 }}>1,800</div>
            </div>
            <div style={{ flex: 1, background: CARD2, borderRadius: 10, padding: "10px 12px", border: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 10, color: MUTED }}>Meals / Day</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: WHITE, marginTop: 2 }}>4</div>
            </div>
          </div>
          <div style={{
            background: ORANGE, borderRadius: 10, padding: "12px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>✨</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: WHITE }}>Generate My Meal Plan</span>
          </div>
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: MUTED, marginBottom: 10, letterSpacing: 0.5 }}>THIS WEEK'S PLAN · JUN 16–22</div>

        {[
          { day: "Mon", meals: [{ name: "Oat Banana Smoothie", cal: 310, type: "breakfast" }, { name: "Turkey Avocado Wrap", cal: 490, type: "lunch" }] },
          { day: "Tue", meals: [{ name: "Egg White Omelette", cal: 280, type: "breakfast" }, { name: "Salmon Rice Bowl", cal: 520, type: "lunch" }] },
        ].map(({ day, meals }) => (
          <div key={day} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: ORANGE, marginBottom: 6, letterSpacing: 0.5 }}>{day}</div>
            {meals.map((m) => <MealCard key={m.name} {...m} color={ORANGE} />)}
          </div>
        ))}
      </div>
      <NavBar active="Planner" />
    </div>
  );
}

export function Screen3Grocery() {
  const cats = [
    { name: "🥩 Proteins", items: ["Grilled Chicken Breast", "Salmon Fillet", "Eggs (12-pack)", "Greek Yogurt, Siggi's"], color: "#EF4444" },
    { name: "🥦 Vegetables", items: ["Baby Spinach", "Broccoli Florets", "Cherry Tomatoes", "Zucchini"], color: "#22C55E" },
    { name: "🍚 Grains", items: ["Brown Rice, Bob's Red Mill", "Rolled Oats", "Whole Wheat Bread"], color: "#F59E0B" },
  ];
  return (
    <div style={base}>
      <StatusBar />
      <div style={{ flex: 1, overflowY: "hidden", padding: "8px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <SectionHeader title="Grocery List" sub="Week of June 16–22" />
          <div style={{ background: `${ORANGE}20`, border: `1px solid ${ORANGE}50`, borderRadius: 8, padding: "6px 12px", fontSize: 12, color: ORANGE, fontWeight: 600 }}>Share 📤</div>
        </div>

        {cats.map((cat) => (
          <div key={cat.name} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: WHITE, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              {cat.name}
              <Pill label={`${cat.items.length} items`} color={cat.color} />
            </div>
            <div style={{ background: CARD2, borderRadius: 12, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
              {cat.items.map((item, i) => (
                <div key={item} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 14px",
                  borderBottom: i < cat.items.length - 1 ? `1px solid ${BORDER}` : "none",
                }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${BORDER}`, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: WHITE, flex: 1 }}>{item}</span>
                  <span style={{ fontSize: 10, color: MUTED }}>✓</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <NavBar active="Grocery" />
    </div>
  );
}

export function Screen4Scanner() {
  return (
    <div style={base}>
      <StatusBar />
      <div style={{ flex: 1, overflowY: "hidden", padding: "8px 20px 0" }}>
        <SectionHeader title="Scan Meal" sub="AI calorie & nutrition analysis" />

        <div style={{
          background: CARD2, borderRadius: 16, border: `1px solid ${BORDER}`,
          overflow: "hidden", marginBottom: 14, position: "relative", height: 190,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, #1a2a1a 0%, #0d1a0d 100%)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ fontSize: 48 }}>🥗</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>Grilled Chicken Salad</div>
          </div>
          <div style={{
            position: "absolute", top: 10, right: 10,
            background: "#22C55E", borderRadius: 20, padding: "4px 10px",
            fontSize: 11, fontWeight: 700, color: WHITE,
          }}>✓ Analyzed</div>
        </div>

        <div style={{
          background: `${ORANGE}10`, border: `1px solid ${ORANGE}40`,
          borderRadius: 14, padding: "14px", marginBottom: 14,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: WHITE }}>Grilled Chicken Salad</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: ORANGE }}>487 <span style={{ fontSize: 12, fontWeight: 400, color: MUTED }}>kcal</span></div>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {[["Protein", "42g", "#22C55E"], ["Carbs", "28g", "#F59E0B"], ["Fat", "18g", "#EF4444"]].map(([label, val, color]) => (
              <div key={label as string} style={{ flex: 1, background: CARD2, borderRadius: 8, padding: "8px 10px", textAlign: "center", border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: color as string }}>{val}</div>
                <div style={{ fontSize: 10, color: MUTED }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: MUTED, marginBottom: 8 }}>INGREDIENTS DETECTED</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {["Grilled Chicken", "Romaine Lettuce", "Cherry Tomatoes", "Cucumber", "Olive Oil", "Lemon"].map((ing) => (
              <Pill key={ing} label={ing} color="#22C55E" />
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{
            flex: 1, background: ORANGE, borderRadius: 12, padding: "13px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <span style={{ fontSize: 16 }}>💾</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: WHITE }}>Save to Journal</span>
          </div>
          <div style={{
            background: CARD2, borderRadius: 12, padding: "13px 16px",
            border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 20 }}>📷</span>
          </div>
        </div>
      </div>
      <NavBar active="Scan" />
    </div>
  );
}

export function Screen5MyMeals() {
  const meals = [
    { emoji: "🥗", name: "Chicken Salad", cal: 487, date: "Today" },
    { emoji: "🍳", name: "Egg Omelette", cal: 310, date: "Today" },
    { emoji: "🍗", name: "Grilled Chicken", cal: 520, date: "Yesterday" },
    { emoji: "🥑", name: "Avocado Toast", cal: 340, date: "Yesterday" },
    { emoji: "🍱", name: "Turkey Wrap", cal: 430, date: "Jun 17" },
    { emoji: "🥤", name: "Protein Shake", cal: 240, date: "Jun 17" },
  ];

  return (
    <div style={base}>
      <StatusBar />
      <div style={{ flex: 1, overflowY: "hidden", padding: "8px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <SectionHeader title="My Meals" sub="24 meals saved" />
          <Pill label="This Week" />
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10,
        }}>
          {meals.map((m) => (
            <div key={m.name} style={{
              background: CARD2, borderRadius: 14, border: `1px solid ${BORDER}`,
              overflow: "hidden",
            }}>
              <div style={{
                height: 90, background: `linear-gradient(135deg, ${ORANGE}15, ${ORANGE}05)`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40,
              }}>{m.emoji}</div>
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: WHITE, marginBottom: 3 }}>{m.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: ORANGE }}>{m.cal} kcal</span>
                  <span style={{ fontSize: 10, color: MUTED }}>{m.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <NavBar active="Home" />
    </div>
  );
}

export function Screen6Weight() {
  const data = [145, 143.5, 144, 142, 141, 140.5, 139.8];
  const min = 138;
  const max = 147;
  const pts = data.map((v, i) => ({ x: 14 + i * 50, y: 140 - ((v - min) / (max - min)) * 120 }));

  return (
    <div style={base}>
      <StatusBar />
      <div style={{ flex: 1, overflowY: "hidden", padding: "8px 20px 0" }}>
        <SectionHeader title="Weight Tracker" sub="Last 7 days" />

        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[["139.8", "Current", ORANGE], ["-5.2", "Total Lost", "#22C55E"], ["-0.7", "This Week", "#38BDF8"]].map(([val, label, color]) => (
            <div key={label as string} style={{ flex: 1, background: CARD2, borderRadius: 12, padding: "12px 10px", border: `1px solid ${BORDER}`, textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: color as string }}>{val}</div>
              <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: CARD2, borderRadius: 16, border: `1px solid ${BORDER}`, padding: "14px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: MUTED, marginBottom: 10 }}>lbs</div>
          <svg width="100%" height="140" viewBox="0 0 360 140">
            <defs>
              <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ORANGE} stopOpacity="0.3" />
                <stop offset="100%" stopColor={ORANGE} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <polyline
              points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none" stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            />
            {pts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 5 : 3} fill={ORANGE} />
            ))}
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <text key={i} x={14 + i * 50} y={138} textAnchor="middle" fontSize="10" fill={MUTED}>{d}</text>
            ))}
          </svg>
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: MUTED, marginBottom: 10, letterSpacing: 0.5 }}>LOG WEIGHT</div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1, background: CARD2, borderRadius: 12, border: `1px solid ${BORDER}`, padding: "12px 14px" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: WHITE, textAlign: "center" }}>139.5</div>
            <div style={{ fontSize: 11, color: MUTED, textAlign: "center" }}>lbs</div>
          </div>
          <div style={{ background: ORANGE, borderRadius: 12, padding: "12px 20px", display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: WHITE }}>Save</span>
          </div>
        </div>
      </div>
      <NavBar active="Weight" />
    </div>
  );
}

export function Screen7Water() {
  const count = 5;
  const goal = 8;
  const pct = count / goal;
  const SIZE = 160;
  const STROKE = 14;
  const R = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * R;
  const offset = CIRC * (1 - pct);

  return (
    <div style={base}>
      <StatusBar />
      <div style={{ flex: 1, overflowY: "hidden", padding: "8px 20px 0" }}>
        <SectionHeader title="Water Tracker" sub="Stay hydrated, build habits" />

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ position: "relative", width: SIZE, height: SIZE }}>
            <svg width={SIZE} height={SIZE} style={{ transform: "rotate(-90deg)" }}>
              <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke={BORDER} strokeWidth={STROKE} />
              <circle
                cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none"
                stroke="#38BDF8" strokeWidth={STROKE}
                strokeDasharray={CIRC} strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>
            <div style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#38BDF8" }}>{count}</div>
              <div style={{ fontSize: 12, color: MUTED }}>of {goal} glasses</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[["💧", "Today", `${count}/${goal}`], ["🔥", "Streak", "12 days"], ["✅", "Best", "8/8"]].map(([icon, label, val]) => (
            <div key={label as string} style={{ flex: 1, background: CARD2, borderRadius: 12, padding: "12px 8px", border: `1px solid ${BORDER}`, textAlign: "center" }}>
              <div style={{ fontSize: 18 }}>{icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: WHITE, marginTop: 4 }}>{val}</div>
              <div style={{ fontSize: 10, color: MUTED }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: MUTED, marginBottom: 12, letterSpacing: 0.5 }}>GLASSES</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 6, marginBottom: 16 }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} style={{
              height: 48, borderRadius: 8,
              background: i < count ? "#38BDF820" : CARD2,
              border: `2px solid ${i < count ? "#38BDF8" : BORDER}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>
              {i < count ? "💧" : "○"}
            </div>
          ))}
        </div>

        <div style={{
          background: "#38BDF820", border: "1px solid #38BDF850", borderRadius: 14, padding: "14px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <span style={{ fontSize: 22 }}>+</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#38BDF8" }}>Log a Glass</span>
        </div>
      </div>
      <NavBar active="Home" />
    </div>
  );
}

export function Screen8Paywall() {
  return (
    <div style={base}>
      <StatusBar />
      <div style={{ flex: 1, overflowY: "hidden", padding: "8px 20px 0", display: "flex", flexDirection: "column" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{
            width: 68, height: 68, borderRadius: 18, background: ORANGE,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 34, margin: "0 auto 12px",
          }}>💪</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: WHITE, letterSpacing: -0.5 }}>Go PrepFit Pro</div>
          <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>Unlock everything. Cancel anytime.</div>
        </div>

        <div style={{ background: CARD2, borderRadius: 16, border: `1px solid ${BORDER}`, marginBottom: 14, overflow: "hidden" }}>
          {[
            ["✨", "AI Meal Planning", "Personalized weekly plans"],
            ["📷", "Photo Scanner", "Instant calorie analysis"],
            ["🛒", "Smart Grocery Lists", "Clean-brand suggestions"],
            ["📈", "Progress Tracking", "Weight, BMI & photos"],
            ["💧", "Habit Streaks", "Water & workout streaks"],
            ["🌍", "Multi-language", "EN, ES, FR & more"],
          ].map(([icon, title, sub], i, arr) => (
            <div key={title as string} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
              borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : "none",
            }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: `${ORANGE}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                {icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: WHITE }}>{title}</div>
                <div style={{ fontSize: 11, color: MUTED }}>{sub}</div>
              </div>
              <span style={{ color: "#22C55E", fontSize: 14 }}>✓</span>
            </div>
          ))}
        </div>

        <div style={{
          background: `${ORANGE}12`, border: `1px solid ${ORANGE}50`,
          borderRadius: 14, padding: "14px 16px", marginBottom: 12, textAlign: "center",
        }}>
          <div style={{ fontSize: 13, color: MUTED, marginBottom: 4 }}>Annual Plan</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: WHITE }}>$168 <span style={{ fontSize: 14, fontWeight: 400, color: MUTED }}>/year</span></div>
          <div style={{ fontSize: 12, color: ORANGE, fontWeight: 600, marginTop: 4 }}>= $14/month · Save 40%</div>
        </div>

        <div style={{
          background: ORANGE, borderRadius: 14, padding: "15px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8,
        }}>
          <span style={{ fontSize: 16 }}>⚡</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: WHITE }}>Start Free 3-Day Trial</span>
        </div>

        <div style={{ fontSize: 11, color: MUTED, textAlign: "center" }}>
          No charge for 3 days · Cancel anytime
        </div>
      </div>
    </div>
  );
}
