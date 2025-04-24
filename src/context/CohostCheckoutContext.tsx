import React, { createContext, useContext, useEffect } from 'react';
import { useCohostClient } from './CohostContext';
import { CartSession, UpdatableCartSession } from '@cohostvip/cohost-node/types';

export type CohostCheckoutProviderProps = {
    cartSessionId: string;
    children: React.ReactNode;
};

export type CohostCheckoutContextType = {
    cartSessionId: string;
    cartSession: CartSession | null;
    updateItem: (offeringId: string, quantity: number) => Promise<void>;
    updateCartSession: (data: UpdatableCartSession) => Promise<void>;
};


export const CohostCheckoutContext = createContext<CohostCheckoutContextType | null>(null);

export const CohostCheckoutProvider: React.FC<CohostCheckoutProviderProps> = ({
    cartSessionId,
    children,
}) => {

    const { client } = useCohostClient();
    const [cartSession, setCartSession] = React.useState<CartSession | null>(null);

    const assertCartSession = () => {
        if (!cartSession) {
            console.error("CohostCheckoutProvider requires a cartSession");
            throw new Error("CohostCheckoutProvider requires a cartSession");
        }
    }

    const updateItem = async (offeringId: string, quantity: number) => {
        assertCartSession();

        try {
            const updatedCart = await client.cart.updateItem(cartSessionId, { offeringId, quantity });
            setCartSession(updatedCart);
        } catch (error) {
            console.error("Error updating cart item:", error);
        }
    }


    const updateCartSession = async (data: UpdatableCartSession) => {
        assertCartSession();

        try {
            const updatedCart = await client.cart.update(cartSessionId, data);
            setCartSession(updatedCart);
        } catch (error) {
            console.error("Error updating cart session:", error);
        }
    };


    useEffect(() => {
        if (!cartSessionId) {
            console.error("CohostCheckoutProvider requires a cartSessionId");
            return;
        }
        const fetchCartSession = async () => {
            try {
                const cart = await client.cart.get(cartSessionId);
                setCartSession(cart);
            } catch (error) {
                console.error("Error fetching cart session:", error);
            }
        };

        fetchCartSession();
    }, [cartSessionId]);

    return (
        <CohostCheckoutContext.Provider value={{
            cartSessionId,
            cartSession,
            updateItem,
            updateCartSession,
        }}>
            {children}
        </CohostCheckoutContext.Provider>
    );
};

/**
 * Hook to access the current CohostCheckoutContext
 * Must be used inside a <CohostCheckoutProvider>
 */
export const useCohostCheckout = (): CohostCheckoutContextType => {
    const ctx = useContext(CohostCheckoutContext);
    if (!ctx) throw new Error("useCohostCheckout must be used within a CohostCheckoutProvider");
    return ctx;
};
