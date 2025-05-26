import { FC } from "react";
import { CohostStartCheckoutContext } from "../context/CohostStartCheckoutContext";
import { useCohostClient } from "../context/CohostContext";

export const CohostStartCheckoutProvider: FC<{
    contextId: string;
    children: React.ReactNode;
}> = ({ contextId, children }) => {
    const { client } = useCohostClient();

    const getCartSessionId = async () => {
        const params = new URLSearchParams(window.location.search);
        const tracking: Record<string, string> = {};
        const forward: Record<string, any> = {};

        for (const [key, value] of params.entries()) {
            if (key.startsWith("utm_") || key.startsWith("ctm_")) {
                tracking[key] = value;
            } else {
                forward[key] = value;
            }
        }

        const cart = await client.cart.start({
            contextId,
            sessionContext: {
                userAgent: navigator.userAgent,
                tracking,
                forward,
            }
        });

        return cart?.id ?? null;
    };

    return (
        <CohostStartCheckoutContext.Provider value={{ contextId, getCartSessionId }}>
            {children}
        </CohostStartCheckoutContext.Provider>
    );
};
