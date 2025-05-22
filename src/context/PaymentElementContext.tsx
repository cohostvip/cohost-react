import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCohostCheckout } from './CohostCheckoutContext';
import { CreditCardInformation, Tokenizer } from '../lib/tokenizers/types';
import { authnetTokenizer } from '../lib/tokenizers/authnet';

export type PaymentElementProviderProps = {
    children: React.ReactNode;
};

export type PaymentElementContextType = {
    tokenizeCard: (cardInfo: CreditCardInformation) => Promise<any>;
};

const PaymentElementContext = createContext<PaymentElementContextType | null>(null);

const tokenizers: Record<string, Tokenizer> = {
    'authnet': authnetTokenizer
}



export const PaymentElementProvider: React.FC<PaymentElementProviderProps> = ({ children }) => {
    const { cartSession } = useCohostCheckout();

    const [paymentIntent, setPaymentIntent] = useState<any | null>(null);
    const [tokenizer, setTokenizer] = useState<Tokenizer | null>(null);



    const tokenizeCard = async (cardInfo: CreditCardInformation) => {
        if (!tokenizer) {
            throw new Error("Tokenizer not found");
        }

        const paymentIntent = cartSession?.meta?.paymentIntent;
        if (!paymentIntent) {
            throw new Error("Payment intent not found");
        }

        return await tokenizer.tokenize(cardInfo, paymentIntent);

    }

    useEffect(() => {
        if (!tokenizer) {
            return;
        }

        tokenizer.registerScripts();


    }, [tokenizer]);

    useEffect(() => {
        if (paymentIntent?.provider) {
            setTokenizer(tokenizers[paymentIntent.provider] || null);
        }
    }, [paymentIntent]);


    useEffect(() => {
        setPaymentIntent(cartSession?.meta?.paymentIntent || null);
    }, [cartSession]);

    return (
        <PaymentElementContext.Provider value={{
            tokenizeCard
        }}>
            {children}
        </PaymentElementContext.Provider>
    );
};

/**
 * Hook to access the current PaymentElementContext
 * Must be used inside a <PaymentElementProvider>
 */
export const usePaymentElement = (): PaymentElementContextType => {
    const ctx = useContext(PaymentElementContext);
    if (!ctx) throw new Error("usePaymentElement must be used within a PaymentElementProvider");
    return ctx;
};
