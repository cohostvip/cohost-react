import * as React from 'react';
import { createContext, useContext, useEffect } from 'react';
import { useCohostClient } from './CohostContext';
import type { CartSession, UpdatableCartSession } from '@cohostvip/cohost-node';

export type CohostCheckoutProviderProps = {
    cartSessionId: string;
    children: React.ReactNode;
};

export type CohostCheckoutContextType = {
    cartSessionId: string;
    cartSession: CartSession | null;
    joinGroup: (groupId: string) => Promise<string | null>;
    updateItem: (offeringId: string, quantity: number, options?: any) => Promise<void>;
    updateCartSession: (data: Partial<UpdatableCartSession>) => Promise<void>;
    placeOrder: () => Promise<CartSession | undefined>;
    processPayment: (data: unknown) => Promise<unknown>;
    applyCoupon: (code: string) => Promise<void>;
    removeCoupon: (id: string) => Promise<void>;
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

    const applyCoupon = async (code: string): Promise<void> => {
        assertCartSession();

        try {
            const updatedCart = await client.cart.applyCoupon(cartSessionId, code);
            setCartSession(updatedCart);

        } catch (error) {
            console.error("Error applying coupon:", error);
            throw error;
        }
    }


    const removeCoupon = async (id: string): Promise<void> => {
        assertCartSession();

        try {
            const updatedCart = await client.cart.deleteCoupon(cartSessionId, id);
            setCartSession(updatedCart);

        } catch (error) {
            console.error("Error removing coupon:", error);
            throw error;
        }
    }

    const joinGroup = async (groupId: string): Promise<string | null> => {
        assertCartSession();

        try {
            const updatedCart = await client.cart.joinTableCommitment(cartSessionId, groupId);



            setCartSession(updatedCart);

            return updatedCart
                .items
                .find((item: any) => item.tableCommitmentId === groupId)?.id || null;
        } catch (error) {
            console.error("Error joining group:", error);
            return null;
        }
    }

    const updateItem = async (itemId: string, quantity: number, options?: any) => {
        assertCartSession();

        try {
            const updatedCart = await client.cart.updateItem(cartSessionId, { itemId, quantity, options });
            setCartSession(updatedCart);
        } catch (error) {
            console.error("Error updating cart item:", error);
        }
    }


    const updateCartSession = async (data: Partial<UpdatableCartSession>) => {
        assertCartSession();

        try {
            const updatedCart = await client.cart.update(cartSessionId, data);
            setCartSession(updatedCart);
        } catch (error) {
            console.error("Error updating cart session:", error);
        }
    };


    const placeOrder = async () => {
        assertCartSession();

        try {
            const res = await client.cart.placeOrder(cartSessionId, {});
            return res;
        } catch (error) {
            console.error("Error placing order:", error);
        }
    }


    const processPayment = async (data: unknown) => {
        assertCartSession();

        try {
            const res = await client.cart.processPayment(cartSessionId, data);
            return res;
        } catch (error) {
            console.error("Error processing payment:", error);
        }
    }


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

                // rethrow the error to be handled by the caller
                throw error;
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
            placeOrder,
            joinGroup,
            processPayment,
            applyCoupon,
            removeCoupon,
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
