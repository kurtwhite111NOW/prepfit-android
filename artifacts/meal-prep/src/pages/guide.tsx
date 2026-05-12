import { useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { Link } from "wouter";
import {
  ArrowLeft, LayoutDashboard, CalendarDays, ShoppingBasket,
  BookOpen, ScanLine, Scale, Droplets, ClipboardList,
  ChevronDown, ChevronUp, Zap, CheckCircle2, Smartphone, Apple,
} from "lucide-react";

const SECTIONS = [
  {
    id: "getting-started",
    emoji: "🚀",
    title: "Getting Started",
    icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    content: [
      {
        heading: "What is PrepFit?",
        text: "PrepFit is an AI-powered meal prep and fitness tracking app. It helps you plan healthy meals, track calories, monitor your weight and water intake, and build smart grocery lists — all in one place. No App Store needed: just visit prepfit.fit from your phone and install it to your home screen.",
      },
      {
        heading: "Free Trial",
        text: "You get a 3-day free trial with full access to every feature. The countdown shows in the sidebar. Before it expires, tap 'Upgrade to Pro' to continue at $14/month (billed annually at $168/year). There are no ads, no data selling — just the app.",
      },
      {
        heading: "Installing on your phone",
        text: "PrepFit works like a native app on both iPhone and Android. On iPhone, open prepfit.fit in Safari → tap the Share button → 'Add to Home Screen'. On Android, open it in Chrome → tap the three-dot menu → 'Add to Home Screen'. Use the Install buttons in the sidebar for step-by-step guides.",
      },
    ],
  },
  {
    id: "dashboard",
    emoji: "🏠",
    title: "Dashboard",
    icon: LayoutDashboard,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    content: [
      {
        heading: "Your home base",
        text: "The Dashboard shows a summary of your active meal plan — today's meals, total calories, and macros (protein, carbs, fat). It also shows your current weight and today's water intake at a glance.",
      },
      {
        heading: "Quick actions",
        text: "Tap any card on the Dashboard to jump straight to that feature — Meal Planner, Grocery List, Scan Photo, or Weight Tracker. It's designed so you can get in and out fast.",
      },
    ],
  },
  {
    id: "meal-planner",
    emoji: "🥗",
    title: "Meal Planner",
    icon: CalendarDays,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    content: [
      {
        heading: "Generating a meal plan",
        text: "Go to Meal Planner and choose how many meals per day (2–5) and your daily calorie goal. Tap 'Generate Meal Plan' and the AI builds a full week of balanced, gym-friendly meals with per-meal calorie and macro targets in seconds.",
      },
      {
        heading: "Saving your plan",
        text: "After generating, review the meals and tap 'Save Plan'. Give it a name and it's stored under Saved Plans. You can generate as many plans as you like and switch between them anytime.",
      },
      {
        heading: "Understanding macros",
        text: "Each meal shows Protein (g), Carbs (g), and Fat (g) alongside calories. These are calculated by the AI to hit your daily goal. High-protein plans are great for muscle building; lower-carb plans suit fat loss.",
      },
      {
        heading: "Tips for best results",
        text: "Set a realistic calorie goal — 1,800–2,200 cal for maintenance, 1,400–1,700 for fat loss, 2,500+ for muscle gain. The AI adjusts meal size and composition to match your target.",
      },
    ],
  },
  {
    id: "grocery-list",
    emoji: "🛒",
    title: "Grocery List",
    icon: ShoppingBasket,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    content: [
      {
        heading: "How it works",
        text: "The Grocery List is automatically generated from your active meal plan. It pulls all ingredients needed for the week, organizes them by category (Produce, Proteins, Dairy, etc.), and suggests clean brands like Bob's Red Mill, Siggi's, and Simple Truth.",
      },
      {
        heading: "Checking items off",
        text: "Each item has a checkbox. Tap to check it off as you shop — checked items stay checked until you regenerate the list. Perfect for in-store use on your phone.",
      },
      {
        heading: "Clean brand suggestions",
        text: "Next to many ingredients, you'll see a recommended brand. These are chosen for being minimally processed, free from artificial additives, and widely available at most grocery stores.",
      },
    ],
  },
  {
    id: "my-meals",
    emoji: "📓",
    title: "My Meals (Journal)",
    icon: BookOpen,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    content: [
      {
        heading: "Your photo meal journal",
        text: "Every meal you analyze with the Photo Scanner is saved here automatically. You'll see a photo, the meal name, estimated calories, ingredient list, and the date it was logged.",
      },
      {
        heading: "Editing and deleting",
        text: "Tap any meal in the journal to view its full details. You can add notes or delete it if it was logged by mistake. Your journal builds up over time as a visual record of what you've been eating.",
      },
    ],
  },
  {
    id: "scan-photo",
    emoji: "📸",
    title: "Scan Photo",
    icon: ScanLine,
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/20",
    content: [
      {
        heading: "Scanning a meal",
        text: "Go to Scan Photo and either take a photo or upload one from your camera roll. The AI analyzes the image, identifies the food, estimates the calorie count, and lists the ingredients. Results appear in about 10–15 seconds.",
      },
      {
        heading: "Best photo tips",
        text: "For the most accurate results: use good lighting, photograph from directly above, make sure the plate fills most of the frame, and avoid blurry or dark images. The AI works better with clear, well-lit photos.",
      },
      {
        heading: "Saving to your journal",
        text: "After the analysis, tap 'Save to Journal' to add it to My Meals. You can also add a note before saving — useful for logging how you felt, or what time of day you ate.",
      },
      {
        heading: "Accuracy note",
        text: "Calorie estimates are approximate and based on visual portion analysis. For precise tracking, use a kitchen scale alongside the app. Estimates are generally accurate within ±15%.",
      },
    ],
  },
  {
    id: "weight",
    emoji: "📊",
    title: "Weight Tracker",
    icon: Scale,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
    content: [
      {
        heading: "Logging your weight",
        text: "Tap 'Add Entry' on the Weight page, enter your current weight, choose lbs or kg, and optionally add a note (e.g. 'after gym', 'morning fast'). Tap Save — it's logged with today's date.",
      },
      {
        heading: "Reading the chart",
        text: "The line chart shows your weight trend over time. The dots are individual entries; the line shows the overall direction. Look at the trend over weeks, not day-to-day fluctuations — weight naturally varies 1–3 lbs daily.",
      },
      {
        heading: "Stats panel",
        text: "Below the chart you'll see: Current weight, Total change from your first entry, and Last change vs the entry before it. These update automatically as you log.",
      },
      {
        heading: "Best practice",
        text: "Weigh yourself at the same time each day for the most consistent data — ideally first thing in the morning, after using the bathroom, before eating or drinking.",
      },
    ],
  },
  {
    id: "water",
    emoji: "💧",
    title: "Water Tracker",
    icon: Droplets,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/20",
    content: [
      {
        heading: "Logging water intake",
        text: "On the Water page, tap the quick-add buttons (e.g. +250ml, +500ml) or enter a custom amount. Your daily total is shown with a progress ring toward your goal.",
      },
      {
        heading: "Daily goal",
        text: "The default goal is 2,500ml (about 85oz or 10 cups). For active gym-goers, aim for 3,000–4,000ml on training days. Staying hydrated improves performance, recovery, and hunger management.",
      },
      {
        heading: "Resets daily",
        text: "Your water log resets at midnight each day so you always start fresh. Past days' logs are saved for reference.",
      },
    ],
  },
  {
    id: "saved-plans",
    emoji: "📋",
    title: "Saved Plans",
    icon: ClipboardList,
    color: "text-teal-400",
    bg: "bg-teal-400/10",
    border: "border-teal-400/20",
    content: [
      {
        heading: "Viewing your plans",
        text: "All meal plans you've saved appear here, listed by name and creation date. Tap any plan to see its full meal breakdown — all meals, calories, and macros for the week.",
      },
      {
        heading: "Setting an active plan",
        text: "The most recently viewed plan becomes your active plan, which powers the Dashboard stats and Grocery List. To switch plans, just tap a different one in Saved Plans.",
      },
      {
        heading: "Deleting plans",
        text: "Tap the trash icon on any plan to delete it. This also removes all meals associated with that plan. This action cannot be undone, so only delete plans you no longer need.",
      },
    ],
  },
];

const PLATFORMS = [
  {
    icon: Apple,
    label: "iPhone (iOS)",
    emoji: "🍎",
    tips: [
      "Install via Safari only — Chrome on iOS doesn't support home screen install",
      "After installing, app opens full screen with no address bar",
      "Works great on all iPhones running iOS 16.4 or later",
      "Push to home screen: Share → Add to Home Screen → Add",
    ],
    link: "/ios",
    linkLabel: "iOS Install Guide →",
  },
  {
    icon: Smartphone,
    label: "Android",
    emoji: "🤖",
    tips: [
      "Install via Chrome, Samsung Internet, or Edge",
      "Look for the 'Add to Home Screen' banner or use the three-dot menu",
      "Works on Android 8.0 and later",
      "App loads instantly from home screen, just like a Play Store app",
    ],
    link: "/android",
    linkLabel: "Android Install Guide →",
  },
];

function Section({ section }: { section: typeof SECTIONS[0] }) {
  const [open, setOpen] = useState(false);
  const Icon = section.icon;

  return (
    <div className={`rounded-2xl border ${section.border} bg-card overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-muted/30 transition-colors"
      >
        <div className={`w-11 h-11 rounded-2xl ${section.bg} border ${section.border} flex items-center justify-center text-xl shrink-0`}>
          {section.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className={`font-bold text-[15px] ${section.color}`}>{section.title}</h2>
          <p className="text-muted-foreground text-xs mt-0.5">{section.content.length} topic{section.content.length > 1 ? "s" : ""}</p>
        </div>
        {open ? <ChevronUp size={16} className="text-muted-foreground shrink-0" /> : <ChevronDown size={16} className="text-muted-foreground shrink-0" />}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-border/50">
          {section.content.map((item, i) => (
            <div key={i} className="pt-4">
              <div className="flex items-center gap-2 mb-1.5">
                <CheckCircle2 size={13} className={section.color} />
                <h3 className="font-semibold text-foreground text-sm">{item.heading}</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed pl-5">{item.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function GuidePage() {
  usePageTitle("User Guide", "Learn how to use PrepFit — AI meal planning, calorie scanning, grocery lists, weight tracking, and more.");
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto">

      {/* Back */}
      <Link href="/">
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={15} />
          Back to Dashboard
        </button>
      </Link>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-sidebar">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-amber-400/8 blur-3xl" />
        </div>
        <div className="relative px-8 pt-8 pb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-lg">📖</div>
            <span className="text-primary text-xs font-bold uppercase tracking-widest">Complete Guide</span>
          </div>
          <p className="font-extrabold text-2xl text-primary mb-1">PrepFit</p>
          <h1 className="font-serif text-4xl font-bold text-sidebar-foreground leading-tight mb-3">
            User Guide
          </h1>
          <p className="text-sidebar-foreground/50 text-sm leading-relaxed max-w-md">
            Everything you need to know to get the most out of PrepFit — from generating your first AI meal plan to tracking your weight and water. Works on both iPhone and Android.
          </p>
        </div>
      </section>

      {/* Platform compatibility */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Platform Support</h2>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PLATFORMS.map((p) => (
            <div key={p.label} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{p.emoji}</span>
                <p className="font-bold text-foreground text-sm">{p.label}</p>
              </div>
              <ul className="space-y-1.5 mb-4">
                {p.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 size={11} className="text-primary mt-0.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
              <Link href={p.link}>
                <button className="text-xs font-bold text-primary hover:underline">{p.linkLabel}</button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Feature sections */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Feature Guide</h2>
          <div className="flex-1 h-px bg-border" />
        </div>
        <p className="text-muted-foreground text-sm mb-5">Tap any section to expand the full instructions.</p>
        <div className="space-y-3">
          {SECTIONS.map((section) => (
            <Section key={section.id} section={section} />
          ))}
        </div>
      </section>

      {/* Tips */}
      <section className="rounded-2xl border border-primary/15 bg-primary/5 p-6">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2 text-sm">
          💡 Pro Tips for Best Results
        </h2>
        <div className="space-y-3">
          {[
            { tip: "Log your weight every morning at the same time for the most accurate trend data." },
            { tip: "Generate a new meal plan each week to keep variety and prevent diet fatigue." },
            { tip: "Use the Photo Scanner after every meal out — it takes 15 seconds and keeps your calories on track." },
            { tip: "Drink a glass of water first thing in the morning and log it immediately to build the habit." },
            { tip: "Save multiple meal plans (e.g. 'High Protein', 'Low Carb', 'Bulk') and switch between them as your goals change." },
            { tip: "Check off grocery items as you shop — the list stays open when you lock your phone." },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 mt-0.5">{i + 1}</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Support */}
      <section className="rounded-2xl border border-border bg-card p-5 text-center">
        <p className="text-2xl mb-2">💪</p>
        <p className="font-semibold text-foreground text-sm mb-1">You're all set!</p>
        <p className="text-muted-foreground text-xs leading-relaxed max-w-sm mx-auto">
          PrepFit is built for gym-goers who want simple, effective meal prep without the guesswork. Start with the Meal Planner and build your routine from there.
        </p>
        <Link href="/">
          <button className="mt-4 px-5 py-2.5 rounded-xl gradient-emerald text-white text-sm font-bold shadow-lg">
            Go to Dashboard →
          </button>
        </Link>
      </section>

    </div>
  );
}
