const PRIMARY = "#F26B1D";
const BG = "#12151A";
const CARD = "#1C2029";
const SIDEBAR = "#0D1117";
const TEXT = "#FFFFFF";
const MUTED = "#8A9BB0";
const GREEN = "#4CAF7D";
const BORDER = "rgba(255,255,255,0.08)";

const TABS = [
  { name: "Home", icon: "⌂" },
  { name: "Meal Plan", icon: "📋" },
  { name: "Grocery", icon: "🛒" },
  { name: "My Meals", icon: "🍽" },
  { name: "Scan Photo", icon: "📷" },
  { name: "Weight", icon: "📈" },
  { name: "Water", icon: "💧" },
  { name: "Saved Plans", icon: "🔖" },
  { name: "User Guide", icon: "📖" },
];

function AppBar() {
  return (
    <div style={{
      background: PRIMARY, padding: "44px 16px 12px",
      display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🔥</div>
        <div>
          <div style={{ color: TEXT, fontWeight: 800, fontSize: 19, letterSpacing: 0.4 }}>PrepFit</div>
          <div style={{ color: "rgba(255,255,255,0.82)", fontSize: 10, marginTop: 1 }}>Simple Meal Prep · Gym & Fitness</div>
        </div>
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
      background: CARD, borderTop: `1px solid ${BORDER}`,
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

// Screen 1: Dashboard
function Screen1() {
  const actions = [
    { emoji: "🍽", label: "Build a Meal Plan" },
    { emoji: "📷", label: "Scan a Meal" },
    { emoji: "🛒", label: "Grocery List" },
    { emoji: "💧", label: "Water Tracker" },
    { emoji: "📈", label: "Track Weight" },
    { emoji: "🔖", label: "Saved Plans" },
  ];
  return (
    <>
      <AppBar />
      <div style={{ flex: 1, overflowY: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Hero */}
        <div style={{ background: SIDEBAR, padding: "16px 16px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>Good morning,</div>
              <div style={{ color: TEXT, fontWeight: 800, fontSize: 22, marginTop: 2 }}>Alex 💪</div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, marginTop: 3 }}>Friday, Jun 12, 2026</div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: PRIMARY, display: "flex", alignItems: "center", justifyContent: "center", color: TEXT, fontWeight: 800, fontSize: 18 }}>A</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[{ v: "2", l: "Plans" }, { v: "2,000", l: "kcal goal" }, { v: "172", l: "lbs" }].map(s => (
              <div key={s.l} style={{ flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                <div style={{ color: TEXT, fontWeight: 800, fontSize: 18 }}>{s.v}</div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 10, marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* What do you want to do */}
        <div style={{ padding: "16px 16px 0" }}>
          <div style={{ color: TEXT, fontWeight: 700, fontSize: 15, marginBottom: 10 }}>What do you want to do?</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {actions.map(a => (
              <div key={a.label} style={{ width: "calc(33.33% - 6px)", background: CARD, borderRadius: 12, padding: "12px 8px", display: "flex", flexDirection: "column", alignItems: "center", border: `1px solid ${BORDER}` }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 7 }}>{a.emoji}</div>
                <div style={{ color: TEXT, fontSize: 10, fontWeight: 600, textAlign: "center", lineHeight: 1.3 }}>{a.label}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Your Current Plan */}
        <div style={{ padding: "14px 16px 0" }}>
          <div style={{ color: TEXT, fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Your Current Plan</div>
          <div style={{ background: CARD, borderRadius: 12, padding: "14px", border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: TEXT, fontWeight: 700, fontSize: 14 }}>Weekly Meal Plan</div>
              <div style={{ color: MUTED, fontSize: 11, marginTop: 2 }}>3 meals/day · 2,000 kcal/day</div>
            </div>
            <div style={{ color: MUTED, fontSize: 18 }}>›</div>
          </div>
        </div>
      </div>
      <TabBar active={0} />
    </>
  );
}

// Screen 2: Meal Planner
function Screen2() {
  return (
    <>
      <AppBar />
      <div style={{ flex: 1, overflowY: "hidden", padding: "16px" }}>
        <div style={{ color: TEXT, fontWeight: 800, fontSize: 20, marginBottom: 14 }}>Meal Planner</div>
        <div style={{ background: CARD, borderRadius: 14, padding: "14px", marginBottom: 12, border: `1px solid ${BORDER}` }}>
          <div style={{ color: PRIMARY, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Configure Your Plan</div>
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
          <div style={{ color: TEXT, fontWeight: 700, fontSize: 15 }}>⚡ Generate Meal Plan</div>
        </div>
        <div style={{ color: TEXT, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Generated Plan — Monday</div>
        {[
          { time: "Breakfast", name: "Avocado Toast & Eggs", cal: 420 },
          { time: "Lunch", name: "Grilled Chicken Bowl", cal: 580 },
          { time: "Dinner", name: "Salmon & Roasted Veg", cal: 520 },
        ].map((meal) => (
          <div key={meal.name} style={{ background: CARD, borderRadius: 12, padding: "11px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 10, border: `1px solid ${BORDER}` }}>
            <div style={{ background: BG, borderRadius: 8, padding: "4px 8px" }}>
              <div style={{ color: PRIMARY, fontSize: 10, fontWeight: 700 }}>{meal.time}</div>
            </div>
            <div style={{ flex: 1, color: TEXT, fontWeight: 600, fontSize: 13 }}>{meal.name}</div>
            <div style={{ color: MUTED, fontSize: 12 }}>{meal.cal} cal</div>
          </div>
        ))}
        <div style={{ background: CARD, borderRadius: 12, padding: "12px 14px", display: "flex", justifyContent: "center" }}>
          <div style={{ color: PRIMARY, fontWeight: 700, fontSize: 14 }}>💾 Save Plan</div>
        </div>
      </div>
      <TabBar active={1} />
    </>
  );
}

// Screen 3: Grocery List
function Screen3() {
  const categories = [
    { name: "Produce", items: ["Spinach", "Bananas", "Avocados", "Broccoli"], checked: [true, true, false, false] },
    { name: "Protein", items: ["Chicken Breast", "Salmon Fillet", "Greek Yogurt"], checked: [false, false, true] },
    { name: "Pantry", items: ["Brown Rice", "Olive Oil"], checked: [false, true] },
  ];
  return (
    <>
      <AppBar />
      <div style={{ flex: 1, overflowY: "hidden", padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ color: TEXT, fontWeight: 800, fontSize: 20 }}>Grocery List</div>
          <div style={{ color: GREEN, fontSize: 12, fontWeight: 600 }}>5 / 10 ✓</div>
        </div>
        <div style={{ background: CARD, borderRadius: 12, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8, border: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 13 }}>📋</span>
          <div style={{ color: TEXT, fontSize: 13 }}>Weekly Meal Plan</div>
          <span style={{ marginLeft: "auto", color: PRIMARY, fontSize: 12 }}>Change ›</span>
        </div>
        {categories.map((cat) => (
          <div key={cat.name} style={{ marginBottom: 12 }}>
            <div style={{ color: PRIMARY, fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>{cat.name}</div>
            {cat.items.map((item, i) => (
              <div key={item} style={{ background: CARD, borderRadius: 10, padding: "10px 14px", marginBottom: 6, display: "flex", alignItems: "center", gap: 10, border: `1px solid ${BORDER}` }}>
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

// Screen 4: My Meals
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
            <div key={s.l} style={{ background: CARD, borderRadius: 12, padding: "10px", flex: 1, textAlign: "center", border: `1px solid ${BORDER}` }}>
              <div style={{ color: s.c, fontWeight: 800, fontSize: 20 }}>{s.v}</div>
              <div style={{ color: MUTED, fontSize: 10 }}>{s.l}</div>
            </div>
          ))}
        </div>
        {meals.map((meal) => (
          <div key={meal.name} style={{ background: CARD, borderRadius: 12, padding: "11px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12, border: `1px solid ${BORDER}` }}>
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

// Screen 5: Scan Photo
function Screen5() {
  return (
    <>
      <AppBar />
      <div style={{ flex: 1, overflowY: "hidden", padding: "16px" }}>
        <div style={{ color: TEXT, fontWeight: 800, fontSize: 20, marginBottom: 14 }}>Scan Photo</div>
        <div style={{ background: CARD, borderRadius: 16, overflow: "hidden", marginBottom: 12, border: `1px solid ${BORDER}` }}>
          <div style={{ background: BG, height: 140, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <div style={{ fontSize: 42 }}>🍗</div>
            <div style={{ color: MUTED, fontSize: 12 }}>Grilled Chicken Breast</div>
          </div>
          <div style={{ padding: "12px 14px" }}>
            <div style={{ color: PRIMARY, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>Analysis Result</div>
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
            <div style={{ background: PRIMARY, borderRadius: 10, padding: "11px", textAlign: "center", color: TEXT, fontWeight: 700, fontSize: 14 }}>Save to Journal</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ background: CARD, borderRadius: 12, padding: "14px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, border: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: 26 }}>📷</span>
            <div style={{ color: TEXT, fontWeight: 600, fontSize: 12 }}>Take Photo</div>
          </div>
          <div style={{ background: CARD, borderRadius: 12, padding: "14px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, border: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: 26 }}>🖼</span>
            <div style={{ color: TEXT, fontWeight: 600, fontSize: 12 }}>Upload Photo</div>
          </div>
        </div>
      </div>
      <TabBar active={4} />
    </>
  );
}

// Screen 6: Weight Tracker
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
          {[{ l: "Start", v: "182", u: "lbs", c: MUTED }, { l: "Current", v: "172", u: "lbs", c: PRIMARY }, { l: "Lost", v: "−10", u: "lbs", c: GREEN }].map(s => (
            <div key={s.l} style={{ background: CARD, borderRadius: 12, padding: "12px", flex: 1, border: `1px solid ${BORDER}` }}>
              <div style={{ color: MUTED, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>{s.l}</div>
              <div style={{ color: s.c, fontWeight: 800, fontSize: 20 }}>{s.v}<span style={{ fontSize: 11, fontWeight: 500, color: MUTED }}> {s.u}</span></div>
            </div>
          ))}
        </div>
        <div style={{ background: CARD, borderRadius: 14, padding: "14px", marginBottom: 12, border: `1px solid ${BORDER}` }}>
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
          <div key={e.d} style={{ background: CARD, borderRadius: 10, padding: "10px 14px", marginBottom: 6, display: "flex", justifyContent: "space-between", border: `1px solid ${BORDER}` }}>
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

// Screen 7: Water Tracker
function Screen7() {
  const cups = 6, goal = 8;
  const SIZE = 160, STROKE = 12, R = (SIZE-STROKE)/2;
  const CIRC = 2*Math.PI*R;
  const progress = cups/goal;
  return (
    <>
      <AppBar />
      <div style={{ flex: 1, overflowY: "hidden", padding: "16px" }}>
        <div style={{ color: TEXT, fontWeight: 800, fontSize: 20, marginBottom: 14 }}>Water Tracker</div>
        <div style={{ background: CARD, borderRadius: 16, padding: "20px 16px", marginBottom: 14, textAlign: "center", border: `1px solid ${BORDER}` }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <svg width={SIZE} height={SIZE}>
              <circle cx={SIZE/2} cy={SIZE/2} r={R} fill="none" stroke={BG} strokeWidth={STROKE} />
              <circle cx={SIZE/2} cy={SIZE/2} r={R} fill="none" stroke={PRIMARY} strokeWidth={STROKE}
                strokeDasharray={CIRC} strokeDashoffset={CIRC*(1-progress)} strokeLinecap="round"
                transform={`rotate(-90 ${SIZE/2} ${SIZE/2})`} />
              <text x={SIZE/2} y={SIZE/2-6} textAnchor="middle" fill={PRIMARY} fontSize="32" fontWeight="800">{cups}</text>
              <text x={SIZE/2} y={SIZE/2+16} textAnchor="middle" fill={MUTED} fontSize="11">of {goal} cups</text>
            </svg>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {Array.from({ length: goal }).map((_, i) => (
              <div key={i} style={{ width: 34, height: 34, borderRadius: 10, background: i < cups ? "#4CA8F722" : BG, border: `2px solid ${i < cups ? "#4CA8F7" : MUTED}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>
                {i < cups ? "💧" : "○"}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{ background: PRIMARY, borderRadius: 12, padding: "12px", flex: 1, textAlign: "center", color: TEXT, fontWeight: 700, fontSize: 14 }}>+ Add Glass</div>
          <div style={{ background: CARD, borderRadius: 12, padding: "12px", flex: 1, textAlign: "center", color: TEXT, fontWeight: 600, fontSize: 14, border: `1px solid ${BORDER}` }}>Set Goal</div>
        </div>
        <div style={{ color: TEXT, fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Daily Stats</div>
        {[{d:"Today",v:"6/8",p:"75%"},{d:"Yesterday",v:"8/8",p:"100%"},{d:"Monday",v:"5/8",p:"63%"}].map(s=>(
          <div key={s.d} style={{ background: CARD, borderRadius: 10, padding: "10px 14px", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${BORDER}` }}>
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

// Screen 8: Saved Plans
function Screen8() {
  const plans = [
    { name: "Weekly Meal Plan", meals: 3, cal: 2000, items: 21, active: true },
    { name: "Low Carb Cut", meals: 4, cal: 1600, items: 28, active: false },
    { name: "Bulk Season Plan", meals: 5, cal: 3200, items: 35, active: false },
  ];
  return (
    <>
      <AppBar />
      <div style={{ flex: 1, overflowY: "hidden", padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ color: TEXT, fontWeight: 800, fontSize: 20 }}>Saved Plans</div>
          <div style={{ color: MUTED, fontSize: 12 }}>{plans.length} plans</div>
        </div>
        {plans.map((plan) => (
          <div key={plan.name} style={{ background: CARD, borderRadius: 14, padding: "14px", marginBottom: 10, border: `1px solid ${plan.active ? PRIMARY : BORDER}` }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: plan.active ? `${PRIMARY}22` : BG, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>⚡</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ color: TEXT, fontWeight: 700, fontSize: 14 }}>{plan.name}</div>
                  {plan.active && <div style={{ background: `${PRIMARY}22`, borderRadius: 6, padding: "2px 6px" }}><span style={{ color: PRIMARY, fontSize: 9, fontWeight: 700 }}>ACTIVE</span></div>}
                </div>
                <div style={{ color: MUTED, fontSize: 11, marginTop: 3 }}>{plan.meals} meals/day · {plan.cal} kcal · {plan.items} meals saved</div>
              </div>
              <div style={{ color: MUTED, fontSize: 18 }}>›</div>
            </div>
          </div>
        ))}
        <div style={{ background: CARD, borderRadius: 14, padding: "20px", textAlign: "center", border: `1.5px dashed ${PRIMARY}` }}>
          <div style={{ fontSize: 26, marginBottom: 6 }}>➕</div>
          <div style={{ color: TEXT, fontWeight: 600, fontSize: 14 }}>Create New Plan</div>
          <div style={{ color: MUTED, fontSize: 12, marginTop: 3 }}>Smart plans in seconds</div>
        </div>
      </div>
      <TabBar active={7} />
    </>
  );
}

// Screen 9: User Guide — NEW accordion design
function Screen9() {
  const sections = [
    { icon: "▶", title: "Getting Started", open: true, content: "Sign in or create a free account to get started. Head to Meal Planner to generate your first meal plan." },
    { icon: "⌂", title: "Dashboard", open: false },
    { icon: "📋", title: "Meal Planner", open: false },
    { icon: "🛒", title: "Grocery List", open: false },
    { icon: "📷", title: "Scan Photo", open: false },
    { icon: "📈", title: "Weight", open: false },
    { icon: "💧", title: "Water", open: false },
    { icon: "🔖", title: "Saved Plans", open: false },
  ];
  return (
    <>
      <AppBar />
      <div style={{ flex: 1, overflowY: "hidden", padding: "16px" }}>
        {/* Hero card */}
        <div style={{ background: SIDEBAR, borderRadius: 14, padding: "16px", marginBottom: 16, display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>🥗</div>
          <div>
            <div style={{ color: PRIMARY, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>Complete Guide</div>
            <div style={{ color: TEXT, fontWeight: 800, fontSize: 20, lineHeight: 1.2 }}>PrepFit</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>User Guide</div>
          </div>
        </div>

        {/* Platform Support */}
        <div style={{ color: PRIMARY, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Platform Support</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[{ icon: "📱", title: "iPhone (iOS)", color: "#007AFF", sub: "Safari → Share → Add to Home Screen" },
            { icon: "📱", title: "Android", color: "#34A853", sub: "Chrome → ⋮ menu → Add to Home Screen" }].map(p => (
            <div key={p.title} style={{ flex: 1, background: CARD, borderRadius: 12, padding: "12px", border: `1px solid ${BORDER}` }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${p.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginBottom: 6 }}>{p.icon}</div>
              <div style={{ color: TEXT, fontWeight: 700, fontSize: 12 }}>{p.title}</div>
              <div style={{ color: MUTED, fontSize: 10, marginTop: 3 }}>{p.sub}</div>
            </div>
          ))}
        </div>

        {/* Feature Guide accordion */}
        <div style={{ color: PRIMARY, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Feature Guide</div>
        <div style={{ background: CARD, borderRadius: 12, overflow: "hidden", border: `1px solid ${BORDER}` }}>
          {sections.map((s, i) => (
            <div key={s.title}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderBottom: i < sections.length - 1 && !s.open ? `1px solid ${BORDER}` : "none" }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{s.icon}</div>
                <div style={{ flex: 1, color: TEXT, fontWeight: 600, fontSize: 13 }}>{s.title}</div>
                <div style={{ color: MUTED, fontSize: 14 }}>{s.open ? "∧" : "∨"}</div>
              </div>
              {s.open && s.content && (
                <div style={{ padding: "0 14px 12px 54px", color: MUTED, fontSize: 12, lineHeight: 1.6, borderBottom: `1px solid ${BORDER}` }}>{s.content}</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <TabBar active={8} />
    </>
  );
}

const screens: Record<string, React.ComponentType> = {
  "1": Screen1, "2": Screen2, "3": Screen3, "4": Screen4, "5": Screen5,
  "6": Screen6, "7": Screen7, "8": Screen8, "9": Screen9,
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
