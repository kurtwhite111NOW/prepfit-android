const PRIMARY = "#F26B1D";
const BG = "#12151A";
const CARD = "#1C2029";
const TEXT = "#FFFFFF";
const MUTED = "#8A9BB0";
const GREEN = "#4CAF7D";

const TABS = [
  { name: "Home", icon: "⌂" },
  { name: "Meal Plan", icon: "📋" },
  { name: "Grocery", icon: "🛒" },
  { name: "My Meals", icon: "🍽" },
  { name: "Scan Photo", icon: "📷" },
  { name: "Weight", icon: "📈" },
  { name: "Water", icon: "💧" },
  { name: "Saved Plans", icon: "🔖" },
  { name: "User Guide", icon: "❓" },
];

function AppBar({ title, subtitle }: { title?: string; subtitle?: string }) {
  return (
    <div style={{
      background: PRIMARY, padding: "44px 16px 12px",
      display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
    }}>
      <div>
        <div style={{ color: TEXT, fontWeight: 800, fontSize: 19, letterSpacing: 0.4 }}>{title || "PrepFit"}</div>
        <div style={{ color: "rgba(255,255,255,0.82)", fontSize: 11, marginTop: 1 }}>{subtitle || "Simple Meal Prep"}</div>
      </div>
      <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: TEXT, fontSize: 17 }}>☀</span>
      </div>
    </div>
  );
}

function TabBar({ active }: { active: number }) {
  return (
    <div style={{
      background: CARD, borderTop: `1px solid rgba(255,255,255,0.07)`,
      display: "flex", overflowX: "auto", flexShrink: 0, padding: "6px 4px 16px",
    }}>
      {TABS.map((tab, i) => (
        <div key={tab.name} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          padding: "4px 10px", flexShrink: 0, position: "relative",
        }}>
          {i === active && (
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 28, height: 3, background: PRIMARY, borderRadius: 2 }} />
          )}
          <span style={{ fontSize: 18 }}>{tab.icon}</span>
          <span style={{ fontSize: 9, color: i === active ? PRIMARY : MUTED, fontWeight: i === active ? 700 : 400, whiteSpace: "nowrap" }}>{tab.name}</span>
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value, unit, color }: { label: string; value: string; unit?: string; color?: string }) {
  return (
    <div style={{ background: CARD, borderRadius: 14, padding: "14px", flex: 1 }}>
      <div style={{ color: MUTED, fontSize: 10, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
      <div style={{ color: color || PRIMARY, fontWeight: 800, fontSize: 24 }}>{value}<span style={{ fontSize: 12, fontWeight: 500, color: MUTED }}> {unit}</span></div>
    </div>
  );
}

function Screen1() {
  return (
    <>
      <AppBar />
      <div style={{ flex: 1, overflowY: "hidden", padding: "16px" }}>
        <div style={{ color: MUTED, fontSize: 12, marginBottom: 3 }}>Good morning 👋</div>
        <div style={{ color: TEXT, fontWeight: 800, fontSize: 20, marginBottom: 16 }}>Today's Overview</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <StatCard label="Calories" value="1,840" unit="kcal" />
          <StatCard label="Protein" value="142" unit="g" color={GREEN} />
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <StatCard label="Water" value="6" unit="cups" color="#4CA8F7" />
          <StatCard label="Weight" value="172" unit="lbs" color={TEXT} />
        </div>
        <div style={{ color: TEXT, fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Quick Actions</div>
        {[
          { icon: "🍽", label: "Log a Meal", sub: "Track calories & macros" },
          { icon: "📷", label: "Scan Food", sub: "AI calorie analysis" },
          { icon: "💧", label: "Log Water", sub: "Stay hydrated" },
        ].map((item) => (
          <div key={item.label} style={{ background: CARD, borderRadius: 12, padding: "12px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 22 }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: TEXT, fontWeight: 600, fontSize: 14 }}>{item.label}</div>
              <div style={{ color: MUTED, fontSize: 11 }}>{item.sub}</div>
            </div>
            <div style={{ color: MUTED }}>›</div>
          </div>
        ))}
      </div>
      <TabBar active={0} />
    </>
  );
}

function Screen2() {
  return (
    <>
      <AppBar />
      <div style={{ flex: 1, overflowY: "hidden", padding: "16px" }}>
        <div style={{ color: TEXT, fontWeight: 800, fontSize: 20, marginBottom: 14 }}>AI Meal Planner</div>
        <div style={{ background: CARD, borderRadius: 14, padding: "14px", marginBottom: 12 }}>
          <div style={{ color: MUTED, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Configure Your Plan</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ color: TEXT, fontSize: 14 }}>Meals per day</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ background: BG, borderRadius: 8, padding: "4px 12px", color: TEXT, fontSize: 14 }}>−</div>
              <div style={{ color: PRIMARY, fontWeight: 800, fontSize: 18, minWidth: 20, textAlign: "center" }}>3</div>
              <div style={{ background: BG, borderRadius: 8, padding: "4px 12px", color: TEXT, fontSize: 14 }}>+</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ color: TEXT, fontSize: 14 }}>Daily calories</div>
            <div style={{ color: PRIMARY, fontWeight: 700, fontSize: 16 }}>2,000 kcal</div>
          </div>
        </div>
        <div style={{ background: PRIMARY, borderRadius: 12, padding: "13px", textAlign: "center", marginBottom: 14 }}>
          <div style={{ color: TEXT, fontWeight: 700, fontSize: 15 }}>✨ Generate AI Meal Plan</div>
        </div>
        <div style={{ color: TEXT, fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Generated Plan — Monday</div>
        {[
          { time: "Breakfast", name: "Avocado Toast & Eggs", cal: 420 },
          { time: "Lunch", name: "Grilled Chicken Bowl", cal: 580 },
          { time: "Dinner", name: "Salmon & Roasted Veg", cal: 520 },
        ].map((meal) => (
          <div key={meal.name} style={{ background: CARD, borderRadius: 12, padding: "11px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: BG, borderRadius: 8, padding: "4px 8px" }}>
              <div style={{ color: PRIMARY, fontSize: 10, fontWeight: 700 }}>{meal.time}</div>
            </div>
            <div style={{ flex: 1, color: TEXT, fontWeight: 600, fontSize: 13 }}>{meal.name}</div>
            <div style={{ color: MUTED, fontSize: 12 }}>{meal.cal} cal</div>
          </div>
        ))}
      </div>
      <TabBar active={1} />
    </>
  );
}

function Screen3() {
  const categories = [
    { name: "Produce", items: ["Spinach", "Bananas", "Avocados", "Broccoli"], checked: [true, true, false, false] },
    { name: "Protein", items: ["Chicken Breast", "Salmon Fillet", "Greek Yogurt"], checked: [false, false, true] },
    { name: "Pantry", items: ["Brown Rice", "Olive Oil", "Oats"], checked: [false, true, false] },
  ];
  return (
    <>
      <AppBar />
      <div style={{ flex: 1, overflowY: "hidden", padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ color: TEXT, fontWeight: 800, fontSize: 20 }}>Grocery List</div>
          <div style={{ color: GREEN, fontSize: 12, fontWeight: 600 }}>5 / 10 ✓</div>
        </div>
        <div style={{ background: CARD, borderRadius: 12, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13 }}>📋</span>
          <div style={{ color: TEXT, fontSize: 13 }}>Weekly Meal Plan</div>
          <span style={{ marginLeft: "auto", color: PRIMARY, fontSize: 12 }}>Change ›</span>
        </div>
        {categories.map((cat) => (
          <div key={cat.name} style={{ marginBottom: 12 }}>
            <div style={{ color: PRIMARY, fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>{cat.name}</div>
            {cat.items.map((item, i) => (
              <div key={item} style={{ background: CARD, borderRadius: 10, padding: "10px 14px", marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: 10, background: cat.checked[i] ? GREEN : "transparent", border: `2px solid ${cat.checked[i] ? GREEN : MUTED}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {cat.checked[i] && <span style={{ color: TEXT, fontSize: 11 }}>✓</span>}
                </div>
                <span style={{ color: cat.checked[i] ? MUTED : TEXT, fontSize: 13, textDecoration: cat.checked[i] ? "line-through" : "none" }}>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <TabBar active={2} />
    </>
  );
}

function Screen4() {
  const meals = [
    { name: "Grilled Chicken Breast", cal: 285, date: "Today", emoji: "🍗" },
    { name: "Avocado Toast", cal: 340, date: "Today", emoji: "🥑" },
    { name: "Protein Smoothie", cal: 310, date: "Yesterday", emoji: "🥤" },
    { name: "Salmon & Rice Bowl", cal: 520, date: "Yesterday", emoji: "🍣" },
    { name: "Greek Yogurt Parfait", cal: 220, date: "Mon", emoji: "🫙" },
  ];
  return (
    <>
      <AppBar />
      <div style={{ flex: 1, overflowY: "hidden", padding: "16px" }}>
        <div style={{ color: TEXT, fontWeight: 800, fontSize: 20, marginBottom: 14 }}>My Meals</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          {[{ l: "Total Logged", v: "24", c: PRIMARY }, { l: "This Week", v: "8", c: GREEN }, { l: "Avg Calories", v: "385", c: MUTED }].map((s) => (
            <div key={s.l} style={{ background: CARD, borderRadius: 12, padding: "10px", flex: 1, textAlign: "center" }}>
              <div style={{ color: s.c, fontWeight: 800, fontSize: 20 }}>{s.v}</div>
              <div style={{ color: MUTED, fontSize: 10 }}>{s.l}</div>
            </div>
          ))}
        </div>
        {meals.map((meal) => (
          <div key={meal.name} style={{ background: CARD, borderRadius: 12, padding: "11px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{meal.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: TEXT, fontWeight: 600, fontSize: 13 }}>{meal.name}</div>
              <div style={{ color: MUTED, fontSize: 11 }}>{meal.date}</div>
            </div>
            <div style={{ color: PRIMARY, fontWeight: 700, fontSize: 14 }}>{meal.cal}<span style={{ color: MUTED, fontSize: 10 }}> cal</span></div>
          </div>
        ))}
      </div>
      <TabBar active={3} />
    </>
  );
}

function Screen5() {
  return (
    <>
      <AppBar />
      <div style={{ flex: 1, overflowY: "hidden", padding: "16px" }}>
        <div style={{ color: TEXT, fontWeight: 800, fontSize: 20, marginBottom: 14 }}>Scan Photo</div>
        <div style={{ background: CARD, borderRadius: 16, overflow: "hidden", marginBottom: 12 }}>
          <div style={{ background: BG, height: 150, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <div style={{ fontSize: 42 }}>🍗</div>
            <div style={{ color: MUTED, fontSize: 12 }}>Grilled Chicken Breast</div>
          </div>
          <div style={{ padding: "12px 14px" }}>
            <div style={{ color: MUTED, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>AI Analysis Result</div>
            <div style={{ color: TEXT, fontWeight: 800, fontSize: 22, marginBottom: 6 }}>285 calories</div>
            <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
              {[{ l: "Protein", v: "53g", c: "#7B6EF6" }, { l: "Carbs", v: "0g", c: PRIMARY }, { l: "Fat", v: "6g", c: GREEN }].map((m) => (
                <div key={m.l}>
                  <div style={{ color: m.c, fontWeight: 700, fontSize: 15 }}>{m.v}</div>
                  <div style={{ color: MUTED, fontSize: 10 }}>{m.l}</div>
                </div>
              ))}
            </div>
            <div style={{ color: MUTED, fontSize: 11, marginBottom: 10 }}>Identified: 6oz grilled chicken breast, no skin, herbs & lemon</div>
            <div style={{ background: PRIMARY, borderRadius: 10, padding: "11px", textAlign: "center", color: TEXT, fontWeight: 700, fontSize: 14 }}>Save to My Meals</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ background: CARD, borderRadius: 12, padding: "14px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 26 }}>📷</span>
            <div style={{ color: TEXT, fontWeight: 600, fontSize: 12 }}>Take Photo</div>
          </div>
          <div style={{ background: CARD, borderRadius: 12, padding: "14px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 26 }}>🖼</span>
            <div style={{ color: TEXT, fontWeight: 600, fontSize: 12 }}>Upload Photo</div>
          </div>
        </div>
      </div>
      <TabBar active={4} />
    </>
  );
}

function Screen6() {
  const weeks = ["W1","W2","W3","W4","W5","W6","W7","W8"];
  const weights = [182,180,179,177,176,174,173,172];
  const maxW = 185, minW = 170, chartH = 70;
  const points = weights.map((w,i) => ({ x:(i/(weights.length-1))*280, y:chartH-((w-minW)/(maxW-minW))*chartH }));
  const path = points.map((p,i) => `${i===0?"M":"L"} ${p.x} ${p.y}`).join(" ");
  return (
    <>
      <AppBar />
      <div style={{ flex: 1, overflowY: "hidden", padding: "16px" }}>
        <div style={{ color: TEXT, fontWeight: 800, fontSize: 20, marginBottom: 14 }}>Weight Tracker</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <StatCard label="Start" value="182" unit="lbs" color={MUTED} />
          <StatCard label="Current" value="172" unit="lbs" color={PRIMARY} />
          <StatCard label="Lost" value="−10" unit="lbs" color={GREEN} />
        </div>
        <div style={{ background: CARD, borderRadius: 14, padding: "14px", marginBottom: 12 }}>
          <div style={{ color: TEXT, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>8-Week Trend</div>
          <svg width="100%" viewBox={`0 0 280 ${chartH+18}`} style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={PRIMARY} stopOpacity="0.3" />
                <stop offset="100%" stopColor={PRIMARY} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${path} L ${points[points.length-1].x} ${chartH} L 0 ${chartH} Z`} fill="url(#g2)" />
            <path d={path} fill="none" stroke={PRIMARY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((p,i) => <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={i===points.length-1?PRIMARY:CARD} stroke={PRIMARY} strokeWidth="2" />)}
            {weeks.map((w,i) => <text key={w} x={(i/(weeks.length-1))*280} y={chartH+14} textAnchor="middle" fill={MUTED} fontSize="9">{w}</text>)}
          </svg>
        </div>
        <div style={{ background: PRIMARY, borderRadius: 12, padding: "12px", textAlign: "center", marginBottom: 10 }}>
          <div style={{ color: TEXT, fontWeight: 700, fontSize: 14 }}>+ Log Today's Weight</div>
        </div>
        <div style={{ color: TEXT, fontWeight: 700, fontSize: 14, marginBottom: 8 }}>History</div>
        {[{d:"Today",w:"172 lbs",c:"+0"},{d:"Jun 10",w:"173 lbs",c:"−1"},{d:"Jun 8",w:"174 lbs",c:"−1"}].map(e=>(
          <div key={e.d} style={{ background: CARD, borderRadius: 10, padding: "10px 14px", marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
            <div style={{ color: MUTED, fontSize: 13 }}>{e.d}</div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ color: GREEN, fontSize: 12, fontWeight: 600 }}>{e.c}</div>
              <div style={{ color: TEXT, fontWeight: 700, fontSize: 13 }}>{e.w}</div>
            </div>
          </div>
        ))}
      </div>
      <TabBar active={5} />
    </>
  );
}

function Screen7() {
  const cups = 6;
  const goal = 8;
  return (
    <>
      <AppBar />
      <div style={{ flex: 1, overflowY: "hidden", padding: "16px" }}>
        <div style={{ color: TEXT, fontWeight: 800, fontSize: 20, marginBottom: 14 }}>Water Tracker</div>
        <div style={{ background: CARD, borderRadius: 16, padding: "20px 16px", marginBottom: 14, textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>💧</div>
          <div style={{ color: PRIMARY, fontWeight: 800, fontSize: 48, lineHeight: 1 }}>{cups}</div>
          <div style={{ color: MUTED, fontSize: 14, marginBottom: 12 }}>of {goal} cups today</div>
          <div style={{ background: BG, borderRadius: 8, height: 10, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ background: `linear-gradient(90deg, #4CA8F7, ${PRIMARY})`, width: `${(cups/goal)*100}%`, height: "100%", borderRadius: 8 }} />
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {Array.from({ length: goal }).map((_, i) => (
              <div key={i} style={{ width: 36, height: 36, borderRadius: 10, background: i < cups ? "#4CA8F7" : BG, border: `2px solid ${i < cups ? "#4CA8F7" : MUTED}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                {i < cups ? "💧" : "○"}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{ background: PRIMARY, borderRadius: 12, padding: "12px", flex: 1, textAlign: "center", color: TEXT, fontWeight: 700, fontSize: 14 }}>+ Add Cup</div>
          <div style={{ background: CARD, borderRadius: 12, padding: "12px", flex: 1, textAlign: "center", color: TEXT, fontWeight: 600, fontSize: 14 }}>Set Goal</div>
        </div>
        <div style={{ color: TEXT, fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Daily Stats</div>
        {[{d:"Today",v:"6/8",p:"75%"},{d:"Yesterday",v:"8/8",p:"100%"},{d:"Monday",v:"5/8",p:"63%"}].map(s=>(
          <div key={s.d} style={{ background: CARD, borderRadius: 10, padding: "10px 14px", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ color: MUTED, fontSize: 13 }}>{s.d}</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ color: s.p==="100%"?GREEN:PRIMARY, fontSize: 12, fontWeight: 600 }}>{s.p}</div>
              <div style={{ color: TEXT, fontWeight: 700, fontSize: 13 }}>{s.v} cups</div>
            </div>
          </div>
        ))}
      </div>
      <TabBar active={6} />
    </>
  );
}

function Screen8() {
  const features = [
    { icon: "📋", title: "AI Meal Planning", desc: "Generate personalized weekly meal plans with balanced macros" },
    { icon: "🛒", title: "Smart Grocery List", desc: "Auto-generated shopping list from your active meal plan" },
    { icon: "📷", title: "Food Scanner", desc: "Snap a photo and get instant AI calorie & macro analysis" },
    { icon: "📈", title: "Weight Tracker", desc: "Log weight and see your trend over time with charts" },
    { icon: "💧", title: "Water Tracker", desc: "Track daily hydration and hit your water goals" },
    { icon: "🔖", title: "Saved Plans", desc: "Store and switch between multiple meal plans anytime" },
  ];
  return (
    <>
      <AppBar />
      <div style={{ flex: 1, overflowY: "hidden", padding: "16px" }}>
        <div style={{ background: CARD, borderRadius: 14, padding: "14px", marginBottom: 14, textAlign: "center" }}>
          <div style={{ fontSize: 34, marginBottom: 6 }}>🥗</div>
          <div style={{ color: TEXT, fontWeight: 800, fontSize: 17, marginBottom: 3 }}>Welcome to PrepFit</div>
          <div style={{ color: MUTED, fontSize: 12 }}>Your AI-powered meal prep & nutrition companion.</div>
        </div>
        <div style={{ color: TEXT, fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Features</div>
        {features.map((f) => (
          <div key={f.title} style={{ background: CARD, borderRadius: 12, padding: "10px 12px", marginBottom: 7, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ fontSize: 20, marginTop: 1 }}>{f.icon}</div>
            <div>
              <div style={{ color: TEXT, fontWeight: 700, fontSize: 13 }}>{f.title}</div>
              <div style={{ color: MUTED, fontSize: 11, marginTop: 1 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <TabBar active={8} />
    </>
  );
}

const screens: Record<string, React.ComponentType> = {
  "1": Screen1, "2": Screen2, "3": Screen3, "4": Screen4,
  "5": Screen5, "6": Screen6, "7": Screen7, "8": Screen8,
};

export default function PrepFitScreenshots() {
  const params = new URLSearchParams(window.location.search);
  const n = params.get("n") || "1";
  const Screen = screens[n] || Screen1;
  return (
    <div style={{
      width: 390, height: 844, background: BG,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      display: "flex", flexDirection: "column", overflow: "hidden", margin: "0 auto",
    }}>
      <Screen />
    </div>
  );
}
