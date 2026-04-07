import { useState } from "wouter";
import { Link } from "wouter";
import { useListMealPlans, getListMealPlansQueryKey, useGetShoppingList, getGetShoppingListQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, ChefHat, CheckCircle2, ChevronRight, PackageOpen } from "lucide-react";
import React from "react";

export default function Shopping() {
  const { data: mealPlans, isLoading: isLoadingPlans } = useListMealPlans({
    query: {
      queryKey: getListMealPlansQueryKey()
    }
  });

  const latestPlan = mealPlans?.[0];

  const { data: shoppingList, isLoading: isLoadingList } = useGetShoppingList(
    latestPlan?.id || 0,
    {
      query: {
        enabled: !!latestPlan?.id,
        queryKey: getGetShoppingListQueryKey(latestPlan?.id || 0)
      }
    }
  );

  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({});

  const toggleItem = (itemName: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const isLoading = isLoadingPlans || isLoadingList;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="space-y-2">
        <div className="flex items-center gap-3 text-primary">
          <ShoppingCart className="w-8 h-8" />
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground tracking-tight">
            Shopping List
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Everything you need for your active meal plan.
        </p>
      </section>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      ) : !latestPlan || !shoppingList ? (
        <Card className="border-dashed border-2 border-border bg-background shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-4">
              <PackageOpen size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">No active shopping list</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Generate a meal plan first to get your personalized shopping list.
            </p>
            <Link href="/planner">
              <Button className="gap-2 shadow-sm">
                <ChefHat size={18} /> Go to Meal Planner
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>For: {shoppingList.mealPlanName}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {Object.values(checkedItems).filter(Boolean).length} items checked
                </span>
              </CardTitle>
            </CardHeader>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {shoppingList.categories.map((category, idx) => (
              <Card key={idx} className="overflow-hidden">
                <div className="bg-secondary/50 px-4 py-3 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-foreground capitalize tracking-wide text-sm">{category.category}</h3>
                  <span className="bg-background text-muted-foreground px-2 py-0.5 rounded-full text-xs font-medium border border-border">
                    {category.items.length} items
                  </span>
                </div>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {category.items.map((item, itemIdx) => {
                      const isChecked = checkedItems[item.name] || false;
                      return (
                        <div 
                          key={itemIdx}
                          className={`flex items-start gap-3 p-4 transition-colors cursor-pointer hover:bg-secondary/20 ${isChecked ? 'bg-secondary/10' : ''}`}
                          onClick={() => toggleItem(item.name)}
                        >
                          <div className="mt-0.5">
                            <Checkbox 
                              checked={isChecked} 
                              onCheckedChange={() => toggleItem(item.name)} 
                              className={isChecked ? "data-[state=checked]:bg-primary data-[state=checked]:border-primary" : ""}
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className={`font-medium ${isChecked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {item.name}
                              </span>
                              <span className="text-sm font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
                                {item.quantity}
                              </span>
                            </div>
                            {(item.brandSuggestion || item.notes) && (
                              <div className="text-xs text-muted-foreground flex flex-col gap-0.5 mt-1">
                                {item.brandSuggestion && (
                                  <span className="flex items-center gap-1">
                                    <ChevronRight className="w-3 h-3" /> Brand: <span className="font-medium">{item.brandSuggestion}</span>
                                  </span>
                                )}
                                {item.notes && (
                                  <span className="flex items-center gap-1">
                                    <ChevronRight className="w-3 h-3" /> {item.notes}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
