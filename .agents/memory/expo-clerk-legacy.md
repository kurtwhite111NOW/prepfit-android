---
name: @clerk/expo v3 legacy sign-in/sign-up hooks
description: @clerk/expo v3 changed useSignIn/useSignUp to a signals API; use @clerk/expo/legacy for traditional destructuring.
---

# @clerk/expo v3 Legacy Sign-In/Sign-Up Hooks

**Rule:** Import `useSignIn` and `useSignUp` from `@clerk/expo/legacy`, not `@clerk/expo`, when you need traditional object destructuring (`{ signIn, setActive, isLoaded }`).

```tsx
// CORRECT
import { useSignIn } from "@clerk/expo/legacy";
const { signIn, setActive, isLoaded } = useSignIn();

// WRONG — v3 default returns SignInSignalValue (signals API)
import { useSignIn } from "@clerk/expo";
```

**Why:** `@clerk/expo` v3 introduced a signals-based API for `useSignIn`/`useSignUp`. The `/legacy` sub-path preserves the original hook interface.

**How to apply:** Any sign-in or sign-up screen in an Expo app using `@clerk/expo` ≥ v3 must use the `/legacy` import. `useAuth`, `ClerkProvider`, etc. stay on the main `@clerk/expo` path.
