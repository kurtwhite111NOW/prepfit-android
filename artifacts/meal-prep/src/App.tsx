import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from "@clerk/react";
import { queryClient } from "@/lib/queryClient";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { lazy, Suspense, useEffect, useRef } from "react";
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
const PrivacyPage = lazy(() => import("@/pages/privacy"));
const NotFound = lazy(() => import("@/pages/not-found"));

// REQUIRED — copy verbatim
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

// REQUIRED — copy verbatim
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(24 95% 55%)",
    colorForeground: "#ffffff",
    colorMutedForeground: "#9ca3af",
    colorDanger: "#ef4444",
    colorBackground: "#111827",
    colorInput: "#1f2937",
    colorInputForeground: "#ffffff",
    colorNeutral: "#374151",
    fontFamily: "'Bricolage Grotesque', sans-serif",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-[#111827] border border-[#374151] rounded-2xl w-[440px] max-w-full overflow-hidden shadow-2xl",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-[#0f172a] !rounded-none",
    headerTitle: "text-white font-bold",
    headerSubtitle: "text-gray-400",
    socialButtonsBlockButtonText: "text-white font-semibold",
    formFieldLabel: "text-gray-300 font-medium",
    footerActionLink: "text-orange-400 hover:text-orange-300 font-semibold",
    footerActionText: "text-gray-400",
    dividerText: "text-gray-500",
    identityPreviewEditButton: "text-orange-400",
    formFieldSuccessText: "text-green-400",
    alertText: "text-white",
    logoBox: "flex justify-center mb-2",
    logoImage: "w-14 h-14",
    socialButtonsBlockButton: "bg-[#1f2937] border border-[#374151] hover:bg-[#2d3748] text-white",
    formButtonPrimary: "bg-orange-500 hover:bg-orange-600 text-white font-bold",
    formFieldInput: "bg-[#1f2937] border border-[#374151] text-white placeholder-gray-500 focus:border-orange-500",
    footerAction: "bg-[#0f172a]",
    dividerLine: "bg-[#374151]",
    alert: "bg-[#1f2937] border border-[#374151]",
    otpCodeFieldInput: "bg-[#1f2937] border border-[#374151] text-white",
    formFieldRow: "",
    main: "",
  },
};

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

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#0f172a] px-4 py-8">
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
      />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#0f172a] px-4 py-8">
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
      />
    </div>
  );
}

function SignInPrompt() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-3xl">
        💪
      </div>
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Sign in to continue</h2>
        <p className="text-muted-foreground max-w-sm">
          Create a free account or sign in to access your meal plans, workouts, and progress tracking.
        </p>
      </div>
      <div className="flex gap-3">
        <a
          href={`${basePath}/sign-in`}
          className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition-opacity"
        >
          Sign In
        </a>
        <a
          href={`${basePath}/sign-up`}
          className="px-6 py-2.5 rounded-xl border border-primary/30 text-primary font-bold text-sm hover:bg-primary/5 transition-colors"
        >
          Create Account
        </a>
      </div>
    </div>
  );
}

function ProtectedPage({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Show when="signed-in">{children}</Show>
      <Show when="signed-out"><SignInPrompt /></Show>
    </>
  );
}

function HomeRedirect() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Home />
    </Suspense>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function Router() {
  return (
    <Layout>
      <CheckoutResultHandler />
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={HomeRedirect} />
          <Route path="/planner">
            <ProtectedPage><Planner /></ProtectedPage>
          </Route>
          <Route path="/shopping">
            <ProtectedPage><Shopping /></ProtectedPage>
          </Route>
          <Route path="/meals">
            <ProtectedPage><Meals /></ProtectedPage>
          </Route>
          <Route path="/scan">
            <ProtectedPage><Scan /></ProtectedPage>
          </Route>
          <Route path="/weight">
            <ProtectedPage><Weight /></ProtectedPage>
          </Route>
          <Route path="/water">
            <ProtectedPage><Water /></ProtectedPage>
          </Route>
          <Route path="/plans">
            <ProtectedPage><Plans /></ProtectedPage>
          </Route>
          <Route path="/plans/:id">
            {() => (
              <ProtectedPage><PlanDetail /></ProtectedPage>
            )}
          </Route>
          <Route path="/android" component={AndroidPage} />
          <Route path="/ios" component={IosPage} />
          <Route path="/guide" component={GuidePage} />
          <Route path="/privacy" component={PrivacyPage} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Welcome back",
            subtitle: "Sign in to your PrepFit account",
          },
        },
        signUp: {
          start: {
            title: "Join PrepFit",
            subtitle: "Start your fitness meal prep journey",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Switch>
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            <Route component={Router} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
