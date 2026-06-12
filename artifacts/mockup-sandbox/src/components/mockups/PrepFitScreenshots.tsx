const PRIMARY = "#F26B1D";
const BG = "#12151A";
const CARD = "#1C2029";
const CARD2 = "#22273A";
const TEXT = "#FFFFFF";
const MUTED = "#8A9BB0";
const GREEN = "#4CAF7D";
const RED = "#FF5A5A";

function AppBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{
      background: PRIMARY, padding: "48px 20px 16px", display: "flex",
      alignItems: "center", justifyContent: "space-between",
    }}>
      <div>
        <div style={{ color: TEXT, fontWeight: 800, fontSize: 20, letterSpacing: 0.5 }}>{title}</div>
        {subtitle && <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2 }}>{subtitle}</div>}
      </div>
      <div style={{ width: 36, height: 36, borderRadius: 18, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: TEXT, fontSize: 16 }}>☀</span>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, color }: { label: string; value: string; unit?: string; color?: string }) {
  return (
    <div style={{ background: CARD, borderRadius: 14, padding: "16px", flex: 1 }}>
      <div style={{ color: MUTED, fontSize: 11, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
      <div style={{ color: color || PRIMARY, fontWeight: 800, fontSize: 26 }}>{value}<span style={{ fontSize: 13, fontWeight: 500, color: MUTED }}> {unit}</span></div>
    </div>
  );
}

function Screen1() {
  return (
    <div style={{ flex: 1, overflowY: "hidden" }}>
      <AppBar title="PrepFit" subtitle="Simple Meal Prep" />
      <div style={{ padding: "20px 16px" }}>
        <div style={{ color: MUTED, fontSize: 13, marginBottom: 4 }}>Good morning 👋</div>
        <div style={{ color: TEXT, fontWeight: 800, fontSize: 22, marginBottom: 20 }}>Today's Overview</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <StatCard label="Calories" value="1,840" unit="kcal" />
          <StatCard label="Protein" value="142" unit="g" color={GREEN} />
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <StatCard label="Workouts" value="3" unit="done" color="#7B6EF6" />
          <StatCard label="Weight" value="172" unit="lbs" color={TEXT} />
        </div>
        <div style={{ color: TEXT, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Quick Actions</div>
        {[
          { icon: "🍽", label: "Log a Meal", sub: "Track calories & macros" },
          { icon: "💪", label: "Start Workout", sub: "Today: Upper Body" },
          { icon: "📸", label: "Scan Food", sub: "AI calorie analysis" },
        ].map((item) => (
          <div key={item.label} style={{ background: CARD, borderRadius: 14, padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 24 }}>{item.icon}</div>
            <div>
              <div style={{ color: TEXT, fontWeight: 600, fontSize: 15 }}>{item.label}</div>
              <div style={{ color: MUTED, fontSize: 12 }}>{item.sub}</div>
            </div>
            <div style={{ marginLeft: "auto", color: MUTED }}>›</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Screen2() {
  const exercises = [
    { name: "Bench Press", sets: "4 × 10", muscle: "Chest", done: true },
    { name: "Incline DB Press", sets: "3 × 12", muscle: "Chest", done: true },
    { name: "Cable Fly", sets: "3 × 15", muscle: "Chest", done: false },
    { name: "Tricep Dips", sets: "3 × 12", muscle: "Triceps", done: false },
    { name: "Overhead Press", sets: "4 × 8", muscle: "Shoulders", done: false },
  ];
  return (
    <div style={{ flex: 1, overflowY: "hidden" }}>
      <AppBar title="Workout Planner" subtitle="PrepFit" />
      <div style={{ padding: "20px 16px" }}>
        <div style={{ background: CARD, borderRadius: 14, padding: "14px 16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: MUTED, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8 }}>Today's Split</div>
            <div style={{ color: TEXT, fontWeight: 800, fontSize: 18 }}>Upper Body Push</div>
          </div>
          <div style={{ background: PRIMARY, borderRadius: 20, padding: "6px 14px", color: TEXT, fontWeight: 700, fontSize: 13 }}>Start</div>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <div style={{ background: CARD, borderRadius: 12, padding: "12px 16px", flex: 1, textAlign: "center" }}>
            <div style={{ color: PRIMARY, fontWeight: 800, fontSize: 22 }}>5</div>
            <div style={{ color: MUTED, fontSize: 11 }}>Exercises</div>
          </div>
          <div style={{ background: CARD, borderRadius: 12, padding: "12px 16px", flex: 1, textAlign: "center" }}>
            <div style={{ color: GREEN, fontWeight: 800, fontSize: 22 }}>45</div>
            <div style={{ color: MUTED, fontSize: 11 }}>Minutes</div>
          </div>
          <div style={{ background: CARD, borderRadius: 12, padding: "12px 16px", flex: 1, textAlign: "center" }}>
            <div style={{ color: "#7B6EF6", fontWeight: 800, fontSize: 22 }}>2/5</div>
            <div style={{ color: MUTED, fontSize: 11 }}>Done</div>
          </div>
        </div>
        <div style={{ color: TEXT, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Exercises</div>
        {exercises.map((ex) => (
          <div key={ex.name} style={{ background: CARD, borderRadius: 12, padding: "12px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 22, height: 22, borderRadius: 11, background: ex.done ? GREEN : "transparent", border: `2px solid ${ex.done ? GREEN : MUTED}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {ex.done && <span style={{ color: TEXT, fontSize: 12 }}>✓</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: ex.done ? MUTED : TEXT, fontWeight: 600, fontSize: 14, textDecoration: ex.done ? "line-through" : "none" }}>{ex.name}</div>
              <div style={{ color: MUTED, fontSize: 11 }}>{ex.muscle}</div>
            </div>
            <div style={{ color: PRIMARY, fontWeight: 700, fontSize: 13 }}>{ex.sets}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Screen3() {
  const meals = [
    { time: "7:30 AM", name: "Oatmeal & Berries", cal: 380, macro: "P:14g C:62g F:8g" },
    { time: "10:00 AM", name: "Greek Yogurt + Almonds", cal: 210, macro: "P:18g C:15g F:9g" },
    { time: "12:30 PM", name: "Grilled Chicken Bowl", cal: 520, macro: "P:48g C:42g F:12g" },
    { time: "3:30 PM", name: "Protein Shake", cal: 160, macro: "P:30g C:8g F:3g" },
    { time: "7:00 PM", name: "Salmon & Vegetables", cal: 480, macro: "P:38g C:28g F:18g" },
  ];
  return (
    <div style={{ flex: 1, overflowY: "hidden" }}>
      <AppBar title="Meal Prep" subtitle="PrepFit" />
      <div style={{ padding: "20px 16px" }}>
        <div style={{ background: CARD, borderRadius: 14, padding: "14px 16px", marginBottom: 20 }}>
          <div style={{ color: MUTED, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Daily Target</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ color: TEXT, fontWeight: 800, fontSize: 18 }}>1,750 / 2,000 kcal</div>
            <div style={{ color: GREEN, fontSize: 13, fontWeight: 600 }}>88%</div>
          </div>
          <div style={{ background: BG, borderRadius: 6, height: 8, overflow: "hidden" }}>
            <div style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${GREEN})`, width: "88%", height: "100%", borderRadius: 6 }} />
          </div>
        </div>
        <div style={{ color: TEXT, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Today's Meals</div>
        {meals.map((meal) => (
          <div key={meal.name} style={{ background: CARD, borderRadius: 12, padding: "12px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: BG, borderRadius: 8, padding: "6px 8px", minWidth: 52, textAlign: "center" }}>
              <div style={{ color: PRIMARY, fontSize: 10, fontWeight: 700 }}>{meal.time}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: TEXT, fontWeight: 600, fontSize: 13 }}>{meal.name}</div>
              <div style={{ color: MUTED, fontSize: 11 }}>{meal.macro}</div>
            </div>
            <div style={{ color: PRIMARY, fontWeight: 700, fontSize: 14 }}>{meal.cal}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Screen4() {
  const exercises = [
    { name: "Barbell Squat", muscle: "Quads", level: "Intermediate", icon: "🏋️" },
    { name: "Romanian Deadlift", muscle: "Hamstrings", level: "Intermediate", icon: "💪" },
    { name: "Pull-ups", muscle: "Back", level: "Beginner", icon: "🔝" },
    { name: "Dumbbell Lunges", muscle: "Legs", level: "Beginner", icon: "🦵" },
    { name: "Cable Row", muscle: "Back", level: "Beginner", icon: "🔄" },
    { name: "Lateral Raises", muscle: "Shoulders", level: "Beginner", icon: "🙌" },
  ];
  return (
    <div style={{ flex: 1, overflowY: "hidden" }}>
      <AppBar title="Exercise Library" subtitle="PrepFit" />
      <div style={{ padding: "16px 16px" }}>
        <div style={{ background: CARD, borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ color: MUTED }}>🔍</span>
          <span style={{ color: MUTED, fontSize: 14 }}>Search exercises...</span>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "hidden" }}>
          {["All", "Chest", "Back", "Legs", "Arms", "Core"].map((t, i) => (
            <div key={t} style={{ background: i === 0 ? PRIMARY : CARD, borderRadius: 20, padding: "6px 14px", color: TEXT, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>{t}</div>
          ))}
        </div>
        <div style={{ color: TEXT, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Popular Exercises</div>
        {exercises.map((ex) => (
          <div key={ex.name} style={{ background: CARD, borderRadius: 12, padding: "12px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{ex.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: TEXT, fontWeight: 600, fontSize: 14 }}>{ex.name}</div>
              <div style={{ color: MUTED, fontSize: 11 }}>{ex.muscle} · {ex.level}</div>
            </div>
            <div style={{ color: MUTED }}>›</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Screen5() {
  const weeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];
  const weights = [182, 180, 179, 177, 176, 174, 173, 172];
  const maxW = 185;
  const minW = 170;
  const chartH = 80;
  const points = weights.map((w, i) => ({
    x: (i / (weights.length - 1)) * 280,
    y: chartH - ((w - minW) / (maxW - minW)) * chartH,
  }));
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div style={{ flex: 1, overflowY: "hidden" }}>
      <AppBar title="Progress" subtitle="PrepFit" />
      <div style={{ padding: "20px 16px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <StatCard label="Start" value="182" unit="lbs" color={MUTED} />
          <StatCard label="Current" value="172" unit="lbs" color={PRIMARY} />
          <StatCard label="Lost" value="−10" unit="lbs" color={GREEN} />
        </div>
        <div style={{ background: CARD, borderRadius: 14, padding: "16px", marginBottom: 16 }}>
          <div style={{ color: TEXT, fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Weight Trend (8 weeks)</div>
          <svg width="100%" viewBox={`0 0 280 ${chartH + 20}`} style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={PRIMARY} stopOpacity="0.3" />
                <stop offset="100%" stopColor={PRIMARY} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${path} L ${points[points.length - 1].x} ${chartH} L 0 ${chartH} Z`} fill="url(#grad)" />
            <path d={path} fill="none" stroke={PRIMARY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="4" fill={i === points.length - 1 ? PRIMARY : CARD} stroke={PRIMARY} strokeWidth="2" />
            ))}
            {weeks.map((w, i) => (
              <text key={w} x={(i / (weeks.length - 1)) * 280} y={chartH + 16} textAnchor="middle" fill={MUTED} fontSize="9">{w}</text>
            ))}
          </svg>
        </div>
        <div style={{ color: TEXT, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Body Stats</div>
        {[
          { label: "Body Fat", value: "18.2%", change: "−2.1%", good: true },
          { label: "Muscle Mass", value: "142 lbs", change: "+3.4 lbs", good: true },
          { label: "BMI", value: "24.1", change: "−1.2", good: true },
        ].map((s) => (
          <div key={s.label} style={{ background: CARD, borderRadius: 12, padding: "12px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ color: TEXT, fontWeight: 600, fontSize: 14 }}>{s.label}</div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ color: s.good ? GREEN : RED, fontSize: 12, fontWeight: 600 }}>{s.change}</div>
              <div style={{ color: TEXT, fontWeight: 700, fontSize: 15 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Screen6() {
  const foods = [
    { name: "Scrambled Eggs (3)", cal: 210, p: 18, c: 2, f: 14 },
    { name: "Whole Wheat Toast", cal: 140, p: 6, c: 26, f: 2 },
    { name: "Orange Juice", cal: 110, p: 2, c: 26, f: 0 },
    { name: "Grilled Chicken 6oz", cal: 280, p: 52, c: 0, f: 6 },
    { name: "Brown Rice 1 cup", cal: 215, p: 5, c: 45, f: 2 },
  ];
  const total = foods.reduce((a, f) => a + f.cal, 0);
  return (
    <div style={{ flex: 1, overflowY: "hidden" }}>
      <AppBar title="Nutrition Log" subtitle="PrepFit" />
      <div style={{ padding: "20px 16px" }}>
        <div style={{ background: CARD, borderRadius: 14, padding: "16px", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <div style={{ color: MUTED, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8 }}>Consumed</div>
              <div style={{ color: PRIMARY, fontWeight: 800, fontSize: 28 }}>{total}<span style={{ fontSize: 13, color: MUTED, fontWeight: 400 }}> kcal</span></div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: MUTED, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8 }}>Remaining</div>
              <div style={{ color: GREEN, fontWeight: 800, fontSize: 28 }}>{2000 - total}<span style={{ fontSize: 13, color: MUTED, fontWeight: 400 }}> kcal</span></div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "space-around" }}>
            {[
              { label: "Protein", val: `${foods.reduce((a, f) => a + f.p, 0)}g`, color: "#7B6EF6" },
              { label: "Carbs", val: `${foods.reduce((a, f) => a + f.c, 0)}g`, color: PRIMARY },
              { label: "Fat", val: `${foods.reduce((a, f) => a + f.f, 0)}g`, color: GREEN },
            ].map((m) => (
              <div key={m.label} style={{ textAlign: "center" }}>
                <div style={{ color: m.color, fontWeight: 800, fontSize: 18 }}>{m.val}</div>
                <div style={{ color: MUTED, fontSize: 10 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ color: TEXT, fontWeight: 700, fontSize: 16 }}>Today's Foods</div>
          <div style={{ background: PRIMARY, borderRadius: 20, padding: "6px 14px", color: TEXT, fontWeight: 700, fontSize: 12 }}>+ Add</div>
        </div>
        {foods.map((food) => (
          <div key={food.name} style={{ background: CARD, borderRadius: 12, padding: "10px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: TEXT, fontWeight: 600, fontSize: 13 }}>{food.name}</div>
              <div style={{ color: MUTED, fontSize: 11 }}>P:{food.p}g C:{food.c}g F:{food.f}g</div>
            </div>
            <div style={{ color: PRIMARY, fontWeight: 700, fontSize: 15 }}>{food.cal}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Screen7() {
  return (
    <div style={{ flex: 1, overflowY: "hidden" }}>
      <AppBar title="Scan Food" subtitle="AI Calorie Analysis · PrepFit" />
      <div style={{ padding: "20px 16px" }}>
        <div style={{ background: CARD, borderRadius: 16, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ background: BG, height: 180, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div style={{ fontSize: 48 }}>🍗</div>
            <div style={{ color: MUTED, fontSize: 13 }}>Grilled Chicken Breast</div>
          </div>
          <div style={{ padding: "14px 16px" }}>
            <div style={{ color: MUTED, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>AI Analysis Result</div>
            <div style={{ color: TEXT, fontWeight: 800, fontSize: 22, marginBottom: 2 }}>285 calories</div>
            <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
              {[{ l: "Protein", v: "53g", c: "#7B6EF6" }, { l: "Carbs", v: "0g", c: PRIMARY }, { l: "Fat", v: "6g", c: GREEN }].map((m) => (
                <div key={m.l}>
                  <div style={{ color: m.c, fontWeight: 700, fontSize: 16 }}>{m.v}</div>
                  <div style={{ color: MUTED, fontSize: 10 }}>{m.l}</div>
                </div>
              ))}
            </div>
            <div style={{ color: MUTED, fontSize: 12, marginBottom: 12 }}>Identified: 6oz grilled chicken breast, no skin, herbs and lemon seasoning</div>
            <div style={{ background: PRIMARY, borderRadius: 10, padding: "12px", textAlign: "center", color: TEXT, fontWeight: 700, fontSize: 15 }}>Save to Journal</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ background: CARD, borderRadius: 12, padding: "14px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 28 }}>📷</span>
            <div style={{ color: TEXT, fontWeight: 600, fontSize: 13 }}>Take Photo</div>
          </div>
          <div style={{ background: CARD, borderRadius: 12, padding: "14px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 28 }}>🖼</span>
            <div style={{ color: TEXT, fontWeight: 600, fontSize: 13 }}>Upload Photo</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Screen8() {
  const features = [
    { icon: "🍽", title: "AI Meal Planning", desc: "Generate personalized weekly meal plans with calorie targets" },
    { icon: "💪", title: "Workout Planner", desc: "Build custom routines with 500+ exercises and track sets/reps" },
    { icon: "📸", title: "Food Scanner", desc: "Snap a photo and get instant AI calorie & macro analysis" },
    { icon: "📊", title: "Progress Tracker", desc: "Log weight and body stats, see your trend over time" },
    { icon: "🛒", title: "Smart Grocery List", desc: "Auto-generated shopping lists from your active meal plan" },
    { icon: "📓", title: "Meal Journal", desc: "Save and review all your scanned and logged meals" },
  ];
  return (
    <div style={{ flex: 1, overflowY: "hidden" }}>
      <AppBar title="User Guide" subtitle="PrepFit" />
      <div style={{ padding: "20px 16px" }}>
        <div style={{ background: CARD, borderRadius: 14, padding: "16px", marginBottom: 16, textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🏋️</div>
          <div style={{ color: TEXT, fontWeight: 800, fontSize: 18, marginBottom: 4 }}>Welcome to PrepFit</div>
          <div style={{ color: MUTED, fontSize: 13 }}>Your AI-powered fitness & nutrition companion. Simple meal prep for busy people.</div>
        </div>
        <div style={{ color: TEXT, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Features</div>
        {features.map((f) => (
          <div key={f.title} style={{ background: CARD, borderRadius: 12, padding: "12px 14px", marginBottom: 8, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ fontSize: 22, marginTop: 2 }}>{f.icon}</div>
            <div>
              <div style={{ color: TEXT, fontWeight: 700, fontSize: 14 }}>{f.title}</div>
              <div style={{ color: MUTED, fontSize: 12, marginTop: 2 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
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
      display: "flex", flexDirection: "column", overflow: "hidden",
      margin: "0 auto",
    }}>
      <Screen />
    </div>
  );
}
