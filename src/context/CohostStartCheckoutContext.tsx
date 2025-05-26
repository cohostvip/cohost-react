import { createContext } from "react";

export const CohostStartCheckoutContext = createContext<{
    contextId: string;
    getCartSessionId: () => Promise<string | null>;
} | undefined>(undefined);