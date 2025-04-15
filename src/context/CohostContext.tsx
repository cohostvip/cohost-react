import React, { createContext, useContext } from 'react';
import { createCohostClient, type CohostClient } from '@cohostvip/cohost-node';

export interface CohostProviderProps {
    token: string;
    children: React.ReactNode;
}

const CohostContext = createContext<CohostClient | null>(null);

export const CohostProvider: React.FC<CohostProviderProps> = ({
    token,
    children,
}) => {
    const client = createCohostClient({ token }); // assumes a factory fn in cohost-node

    return (
        <CohostContext.Provider value={client}>
            {children}
        </CohostContext.Provider>
    );
};

export const useCohostClient = (): CohostClient => {
    const ctx = useContext(CohostContext);
    if (!ctx) throw new Error("useCohostClient must be used within a CohostProvider");
    return ctx;
};
