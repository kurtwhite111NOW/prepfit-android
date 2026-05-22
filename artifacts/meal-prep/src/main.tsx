import { createRoot } from "react-dom/client";
import App from "./App";
import { queryClient } from "./lib/queryClient";
import "./index.css";

queryClient.prefetchQuery({
  queryKey: ["/api/meal-plans"],
  queryFn: () => fetch("/api/meal-plans").then((r) => r.json()),
  staleTime: 30_000,
});

createRoot(document.getElementById("root")!).render(<App />);
