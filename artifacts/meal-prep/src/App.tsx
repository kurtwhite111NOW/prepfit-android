import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import Home from "@/pages/home";
import Planner from "@/pages/planner";
import Shopping from "@/pages/shopping";
import Meals from "@/pages/meals";
import Scan from "@/pages/scan";
import Weight from "@/pages/weight";
import Water from "@/pages/water";
import Plans from "@/pages/plans";
import PlanDetail from "@/pages/plan-detail";
import AndroidPage from "@/pages/android";
import IosPage from "@/pages/ios";
import GuidePage from "@/pages/guide";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const queryClient = new QueryClient();

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
