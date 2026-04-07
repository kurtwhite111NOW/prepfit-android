import { Link } from "wouter";
import { useListMealPlans, getListMealPlansQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, CalendarDays, Plus, Utensils, Camera, Sparkles, ChefHat } from "lucide-react";

export default function Home() {
  const { data: mealPlans, isLoading } = useListMealPlans({
    query: {
      queryKey: getListMealPlansQueryKey()
    }
  });

  const latestPlan = mealPlans?.[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground tracking-tight">
          Good morning.
        </h1>
        <p className="text-muted-foreground text-lg">
          Ready to fuel your body today?
        </p>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/planner">
          <div className="group cursor-pointer bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-6 rounded-2xl transition-all hover:shadow-md hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-1">Generate Plan</h3>
            <p className="text-muted-foreground text-sm">Let AI craft your perfect week of meals</p>
          </div>
        </Link>
        
        <Link href="/scan">
          <div className="group cursor-pointer bg-gradient-to-br from-secondary/50 to-secondary border border-border p-6 rounded-2xl transition-all hover:shadow-md hover:-translate-y-1">
            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-foreground mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <Camera size={24} />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-1">Scan a Meal</h3>
            <p className="text-muted-foreground text-sm">Snap a photo to track what you're eating</p>
          </div>
        </Link>
      </section>

      {/* Current Plan Overview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-semibold">Active Plan</h2>
          <Link href="/planner">
            <Button variant="ghost" size="sm" className="text-primary gap-1">
              View all <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <Card className="border-none shadow-sm bg-card overflow-hidden">
            <CardHeader className="pb-4">
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Skeleton className="h-20 w-1/3 rounded-xl" />
                <Skeleton className="h-20 w-1/3 rounded-xl" />
                <Skeleton className="h-20 w-1/3 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        ) : latestPlan ? (
          <Card className="border-border shadow-sm bg-card overflow-hidden group">
            <div className="h-2 bg-primary w-full"></div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{latestPlan.name}</CardTitle>
                  <CardDescription className="mt-1">
                    Created {new Date(latestPlan.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  {latestPlan.dailyCalories} kcal / day
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-background border border-border rounded-xl p-3 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold text-primary">{latestPlan.mealsPerDay}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Meals/Day</span>
                </div>
                <div className="bg-background border border-border rounded-xl p-3 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold text-foreground">
                    {latestPlan.mealsPerDay * 7}
                  </span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Total Meals</span>
                </div>
                
                <div className="col-span-2 flex flex-col justify-center gap-2">
                  <Link href="/shopping" className="w-full">
                    <Button variant="outline" className="w-full justify-between group-hover:border-primary/50 transition-colors">
                      View Shopping List
                      <ShoppingCartIcon className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed border-2 border-border bg-background shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-4">
                <ChefHat size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">No active meal plan</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                You haven't generated a meal plan yet. Let our AI craft a personalized menu based on your goals.
              </p>
              <Link href="/planner">
                <Button className="gap-2 shadow-sm">
                  <Plus size={18} /> Create your first plan
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

function ShoppingCartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}
