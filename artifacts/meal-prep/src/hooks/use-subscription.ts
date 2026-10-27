import { createContext, useContext } from "react";

export type SubscriptionContextType = {
  isPaid: boolean;
  isChecking: boolean;
  markPaid: () => void;
};

export const SubscriptionContext = createContext<SubscriptionContextType>({
  isPaid: false,
  isChecking: false,
  markPaid: () => {},
});

export function useSubscription() {
  return useContext(SubscriptionContext);
}
