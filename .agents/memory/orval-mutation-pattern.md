---
name: Orval-generated mutation hook call pattern
description: Orval mutations require { data: BodyType<T> } wrapper — flat body args cause type errors.
---

# Orval Mutation Hook Call Pattern

**Rule:** When calling Orval-generated `useMutation` hooks, always wrap the request body in `{ data: ... }`:

```tsx
// CORRECT
mutate({ data: { mealsPerDay: 3, dailyCalories: 2000 } });

// WRONG — flat body causes TS errors with Orval's BodyType<T>
mutate({ mealsPerDay: 3, dailyCalories: 2000 });
```

**Why:** Orval generates hooks where the first argument is `{ data: BodyType<RequestBody> }` — the `data` key wraps the request body. This matches Axios's request config shape.

**How to apply:** Any screen calling an Orval-generated mutation (e.g. `usePostMealPlans`, `usePostSavedMeals`, etc.) must use the `{ data: { ... } }` pattern.
