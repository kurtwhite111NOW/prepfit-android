import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { lazy, Suspense, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const Home = lazy(() => import("@/pages/home"));
const Planner = lazy(() => import("@/pages/planner"));
const Shopping = lazy(() => import("@/pages/shopping"));
const Meals = lazy(() => import("@/pages/meals"));
const Scan = lazy(() => import("@/pages/scan"));
const Weight = lazy(() => import("@/pages/weight"));
const Water = lazy(() => import("@/pages/water"));
const Plans = lazy(() => import("@/pages/plans"));
const PlanDetail = lazy(() => import("@/pages/plan-detail"));
const AndroidPage = lazy(() => import("@/pages/android"));
const IosPage = lazy(() => import("@/pages/ios"));
const GuidePage = lazy(() => import("@/pages/guide"));
const NotFound = lazy(() => import("@/pages/not-found"));

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
    },
  },
});

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function CheckoutResultHandler() {
  const { toast } = useToast();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkout = params.get("checkout");
    if (checkout === "success") {
      toast({
        title: "Welcome to PrepFit Pro!",
        description: "Your subscription is active. Enjoy unlimited AI meal planning!",
      });
      const url = new URL(window.location.href);
      url.searchParams.delete("checkout");
      window.history.replaceState({}, "", url.toString());
    } else if (checkout === "cancelled") {
      toast({
        title: "Checkout cancelled",
        description: "No worries — your trial is still active. Upgrade anytime.",
      });
      const url = new URL(window.location.href);
      url.searchParams.delete("checkout");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);
  return null;
}

function Router() {
  return (
    <Layout>
      <CheckoutResultHandler />
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/planner" component={Planner} />
          <Route path="/shopping" component={Shopping} />
          <Route path="/meals" component={Meals} />
          <Route path="/scan" component={Scan} />
          <Route path="/weight" component={Weight} />
          <Route path="/water" component={Water} />
          <Route path="/plans" component={Plans} />
          <Route path="/plans/:id" component={PlanDetail} />
          <Route path="/android" component={AndroidPage} />
          <Route path="/ios" component={IosPage} />
          <Route path="/guide" component={GuidePage} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
