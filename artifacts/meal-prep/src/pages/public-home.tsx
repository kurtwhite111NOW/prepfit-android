import { ArrowRight, CheckCircle2, Zap, Target, UtensilsCrossed, Calendar } from "lucide-react";
import { PublicLayout } from "@/components/public-layout";
import { usePageTitle } from "@/hooks/use-page-title";

export default function PublicHome() {
  usePageTitle("PrepFit — Meal Prep App for Gym & Fitness", "A meal prep app that builds a week of meals around your calorie and macro targets, generates your grocery list, and tracks your progress.");

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wide mb-8 border border-primary/20 shadow-sm">
            <Zap size={14} className="fill-primary" />
            <span>Meal Planning for Every Fitness Goal</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] mb-8 text-foreground">
            The Meal Prep App That Actually Hits Your Macros
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Generate weekly meal plans built around your calorie and protein targets. Get your grocery list, cook your food, and track your progress in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/sign-up" className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all font-extrabold text-lg shadow-xl shadow-primary/25 flex items-center justify-center gap-2 hover:scale-[1.02]">
              <span>Start Your Free Trial</span>
              <ArrowRight size={20} />
            </a>
            <a href="/meal-prep-app-guide" className="w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-all font-bold text-lg flex items-center justify-center gap-2">
              <span>Read the Guide</span>
            </a>
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground font-medium">No App Store required. Works on any device.</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card border-y border-border/40 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-foreground">Stop guessing. Start planning.</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
              Planning and tracking are two different problems. PrepFit handles both, so you know exactly what to cook and what you actually ate.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-background rounded-3xl p-8 border border-border/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <Target size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Macro-Pinned Plans</h3>
              <p className="text-muted-foreground font-medium leading-relaxed">
                Set your protein, fat, and carbohydrate targets. We build a weekly menu of scalable recipes that fit your exact numbers.
              </p>
            </div>
            
            <div className="bg-background rounded-3xl p-8 border border-border/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <Calendar size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Smart Grocery Lists</h3>
              <p className="text-muted-foreground font-medium leading-relaxed">
                No more mid-week supermarket runs. Your selected meals instantly generate an aisle-by-aisle shopping list.
              </p>
            </div>
            
            <div className="bg-background rounded-3xl p-8 border border-border/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                <UtensilsCrossed size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Track Your Intake</h3>
              <p className="text-muted-foreground font-medium leading-relaxed">
                Log the meals you prep, or scan unlabelled foods with your camera when you eat out. Keep yourself honest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-primary text-primary-foreground rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-3xl md:text-4xl font-extrabold mb-8 tracking-tight">Consistent prep drives consistent results.</h2>
            
            <div className="grid sm:grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
              <div className="flex gap-4">
                <CheckCircle2 size={24} className="shrink-0 text-primary-foreground/80" />
                <p className="font-semibold text-lg text-primary-foreground/90 leading-tight">Planning before you shop gives every meal a purpose and makes the week easier to follow.</p>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 size={24} className="shrink-0 text-primary-foreground/80" />
                <p className="font-semibold text-lg text-primary-foreground/90 leading-tight">No installation friction — start on your laptop, access your grocery list on your phone seamlessly.</p>
              </div>
            </div>
            
            <a href="/sign-up" className="inline-block mt-12 px-8 py-4 bg-background text-foreground rounded-full hover:bg-background/90 transition-colors font-bold text-lg shadow-lg cursor-pointer">
              Create Your Account
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
