import React from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { Link } from "wouter";
import {
  useListMealPlans,
  getListMealPlansQueryKey,
  useGetShoppingList,
  getGetShoppingListQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingBasket,
  ChefHat,
  PackageOpen,
  CheckCircle2,
  Tag,
  Copy,
  Check,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, string> = {
  produce: "🥦",
  protein: "🥩",
  dairy: "🥛",
  grains: "🌾",
  pantry: "🫙",
  beverages: "🧃",
  "frozen foods": "❄️",
  nuts: "🥜",
  oils: "🫒",
  herbs: "🌿",
  legumes: "🫘",
  spices: "🧂",
};

function getCategoryIcon(cat: string) {
  const lower = cat.toLowerCase();
  for (const [key, emoji] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key)) return emoji;
  }
  return "🛒";
}

export default function Shopping() {
  usePageTitle("Smart Grocery List", "Smart grocery list from your meal plan. Organized by category with clean-brand suggestions for gym nutrition.");
  const { data: mealPlans, isLoading: isLoadingPlans } = useListMealPlans({
    query: { queryKey: getListMealPlansQueryKey() },
  });

  const latestPlan = mealPlans?.[0];

  const { data: shoppingList, isLoading: isLoadingList } = useGetShoppingList(
    latestPlan?.id || 0,
    {
      query: {
        enabled: !!latestPlan?.id,
        queryKey: getGetShoppingListQueryKey(latestPlan?.id || 0),
      },
    }
  );

  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({});
  const [copied, setCopied] = React.useState(false);

  const toggleItem = (name: string) => {
    setCheckedItems((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleCopyList = async () => {
    if (!shoppingList) return;
    const lines: string[] = [`🛒 ${shoppingList.mealPlanName} — Grocery List`, ""];
    shoppingList.categories.forEach((cat) => {
      lines.push(`${getCategoryIcon(cat.category)} ${cat.category}`);
      cat.items.forEach((item) => lines.push(`  • ${item.name} — ${item.quantity}`));
      lines.push("");
    });
    lines.push("Generated with Simple Meal Prep — Gym & Fitness 💪");
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLoading = isLoadingPlans || isLoadingList;

  const totalItems = shoppingList?.categories.reduce((s, c) => s + c.items.length, 0) ?? 0;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
          Smart Grocery List
        </p>
        <h1 className="font-serif text-4xl font-bold text-foreground leading-tight mb-2 flex items-center gap-3">
          Grocery List
          {isLoading && (
            <span className="flex items-center gap-1 pb-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary dot-blink inline-block"
                  style={{ animationDelay: `${i * 400}ms` }}
                />
              ))}
            </span>
          )}
        </h1>
        <p className="text-muted-foreground">
          Clean-brand picks, organized by group.
        </p>
      </section>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <div className="grid md:grid-cols-2 gap-4">
            <Skeleton className="h-52 w-full rounded-2xl" />
            <Skeleton className="h-52 w-full rounded-2xl" />
          </div>
        </div>
      ) : !latestPlan || !shoppingList ? (
        <div className="rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
            <PackageOpen size={26} />
          </div>
          <h3 className="font-semibold text-foreground text-lg mb-1.5">No grocery list yet</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
            Generate a meal plan first and your shopping list will be automatically built from it.
          </p>
          <Link href="/planner">
            <Button className="gap-2 font-semibold shadow-sm">
              <ChefHat size={16} /> Open Meal Planner
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Progress card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h3 className="font-semibold text-foreground">{shoppingList.mealPlanName}</h3>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {checkedCount} of {totalItems} items in cart
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyList}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                >
                  {copied
                    ? <Check size={13} className="text-primary" />
                    : <Copy size={13} />
                  }
                  {copied ? "Copied!" : "Copy list"}
                </button>
                {checkedCount === totalItems && totalItems > 0 ? (
                  <div className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/15 rounded-xl px-3.5 py-2 text-sm font-semibold">
                    <CheckCircle2 size={15} />
                    All done!
                  </div>
                ) : (
                  <div className="text-right">
                    <p className="font-bold text-foreground text-lg">{progress}%</p>
                    <p className="text-muted-foreground text-[10px] uppercase tracking-wider">complete</p>
                  </div>
                )}
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full gradient-emerald rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Categories grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {shoppingList.categories.map((category, idx) => {
              const catChecked = category.items.filter((i) => checkedItems[i.name]).length;
              return (
                <div key={idx} className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                  {/* Category header */}
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted/30">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl leading-none">{getCategoryIcon(category.category)}</span>
                      <h3 className="font-semibold text-foreground text-sm capitalize">
                        {category.category}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {catChecked > 0 && (
                        <span className="text-[10px] text-primary font-medium">
                          {catChecked}/{category.items.length}
                        </span>
                      )}
                      <span className="bg-muted border border-border text-muted-foreground px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide">
                        {category.items.length} items
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-border">
                    {category.items.map((item, itemIdx) => {
                      const checked = checkedItems[item.name] || false;
                      return (
                        <div
                          key={itemIdx}
                          className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors ${
                            checked ? "bg-primary/3" : "hover:bg-muted/30"
                          }`}
                          onClick={() => toggleItem(item.name)}
                        >
                          <div className="mt-0.5">
                            <Checkbox
                              checked={checked}
                              onCheckedChange={() => toggleItem(item.name)}
                              className={checked ? "data-[state=checked]:bg-primary data-[state=checked]:border-primary" : ""}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`text-sm font-medium transition-colors ${
                                  checked ? "line-through text-muted-foreground" : "text-foreground"
                                }`}
                              >
                                {item.name}
                              </span>
                              <span className="text-[11px] text-muted-foreground bg-muted border border-border rounded-md px-2 py-0.5 whitespace-nowrap shrink-0">
                                {item.quantity}
                              </span>
                            </div>
                            {(item.brandSuggestion || item.notes) && !checked && (
                              <div className="mt-1 space-y-0.5">
                                {item.brandSuggestion && (
                                  <div className="flex items-center gap-1.5 text-[11px] text-primary/80">
                                    <Tag size={10} />
                                    <span className="font-medium">{item.brandSuggestion}</span>
                                  </div>
                                )}
                                {item.notes && (
                                  <p className="text-[11px] text-muted-foreground">{item.notes}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
